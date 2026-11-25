"use client";

import { useState } from "react";
import Link from "next/link";

type Connection = {
  id: number;
  institutionName: string;
  institutionLogo: string | null;
  statut: string;
  lastSyncAt: string | null;
  accountCount: number;
};

type Transaction = {
  id: number;
  date: string;
  montant: number;
  libelle: string;
  mois: number;
  annee: number;
};

type Location = {
  id: number;
  boxNumero: string;
  locataireNom: string;
  loyerActuel: number;
};

type Bank = { id: string; name: string; logo: string };

const MOIS_FR = [
  "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatMontant(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

// ── Rapprochement row ──────────────────────────────────────────────────────

function RapprochementRow({
  tx,
  locations,
  onDone,
}: {
  tx: Transaction;
  locations: Location[];
  onDone: (id: number) => void;
}) {
  const [locationId, setLocationId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Suggest locations with loyer close to transaction amount
  const suggestions = locations.filter(
    (l) => Math.abs(l.loyerActuel - tx.montant) <= 10,
  );

  async function rapprocher() {
    if (!locationId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/banque/rapprochement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: tx.id, locationId: parseInt(locationId) }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Erreur"); return; }
      onDone(tx.id);
    } catch {
      setErr("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  async function ignorer() {
    setLoading(true);
    try {
      await fetch("/api/banque/rapprochement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: tx.id, action: "ignore" }),
      });
      onDone(tx.id);
    } catch {
      setErr("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr className="border-t border-neutral-100">
      <td className="py-3 pl-4 pr-3 text-sm text-neutral-500 whitespace-nowrap">{formatDate(tx.date)}</td>
      <td className="py-3 px-3 text-sm font-semibold text-green-700 whitespace-nowrap">+{formatMontant(tx.montant)}</td>
      <td className="py-3 px-3 text-sm text-neutral-700 max-w-xs truncate">{tx.libelle}</td>
      <td className="py-3 px-3 text-sm text-neutral-500 whitespace-nowrap">
        {tx.mois > 0 ? `${MOIS_FR[tx.mois]} ${tx.annee}` : "—"}
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <option value="">Choisir un locataire…</option>
            {suggestions.length > 0 && (
              <optgroup label="Suggestions (loyer proche)">
                {suggestions.map((l) => (
                  <option key={l.id} value={l.id}>
                    Box {l.boxNumero} · {l.locataireNom} ({formatMontant(l.loyerActuel)})
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Toutes les locations actives">
              {locations
                .filter((l) => !suggestions.includes(l))
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    Box {l.boxNumero} · {l.locataireNom} ({formatMontant(l.loyerActuel)})
                  </option>
                ))}
            </optgroup>
          </select>
          <button
            onClick={rapprocher}
            disabled={!locationId || loading}
            className="rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-40 hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {loading ? "…" : "Valider"}
          </button>
          <button
            onClick={ignorer}
            disabled={loading}
            className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
          >
            Ignorer
          </button>
        </div>
        {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
      </td>
    </tr>
  );
}

// ── Connect bank modal ─────────────────────────────────────────────────────

function ConnectModal({ onClose }: { onClose: () => void }) {
  const [banks, setBanks] = useState<Bank[] | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadBanks() {
    setLoading(true);
    try {
      const res = await fetch("/api/banque/institutions");
      if (!res.ok) throw new Error();
      setBanks(await res.json());
    } catch {
      setErr("Impossible de charger la liste des banques.");
    } finally {
      setLoading(false);
    }
  }

  async function connect() {
    if (!selected) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/banque/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionId: selected }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Erreur"); return; }
      window.location.href = data.link;
    } catch {
      setErr("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = (banks ?? []).filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Connecter ma banque</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">✕</button>
        </div>

        <div className="p-5">
          {!banks && !loading && (
            <>
              <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                Connectez votre compte bancaire en lecture seule via Open Banking (norme PSD2).
                Vos identifiants bancaires ne transitent jamais par GestionPark.
              </p>
              <ul className="mb-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Lecture seule — aucun virement possible</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Connexion sécurisée via GoCardless (agréé ACPR)</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> 90 jours d'historique synchronisé automatiquement</li>
              </ul>
              <button
                onClick={loadBanks}
                className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
              >
                Choisir ma banque →
              </button>
            </>
          )}

          {loading && !banks && (
            <p className="py-8 text-center text-sm text-neutral-500">Chargement…</p>
          )}

          {banks && (
            <>
              <input
                type="text"
                placeholder="Rechercher une banque…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-3 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                autoFocus
              />
              <div className="max-h-60 overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-700">
                {filtered.length === 0 ? (
                  <p className="p-4 text-center text-sm text-neutral-400">Aucune banque trouvée</p>
                ) : (
                  filtered.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelected(b.id)}
                      className={`flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-2.5 text-left text-sm transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800 ${
                        selected === b.id ? "bg-neutral-100 font-medium dark:bg-neutral-800" : ""
                      }`}
                    >
                      {b.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.logo} alt="" className="h-6 w-6 rounded object-contain" />
                      )}
                      {b.name}
                      {selected === b.id && <span className="ml-auto text-green-500">✓</span>}
                    </button>
                  ))
                )}
              </div>
              <button
                onClick={connect}
                disabled={!selected || loading}
                className="mt-4 w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
              >
                {loading ? "Redirection…" : "Connecter cette banque →"}
              </button>
            </>
          )}

          {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function BanqueClient({
  connections,
  transactions,
  locations,
  estPro,
  messageInit,
}: {
  connections: Connection[];
  transactions: Transaction[];
  locations: Location[];
  estPro: boolean;
  messageInit: string | null;
}) {
  const [showModal, setShowModal] = useState(false);
  const [txList, setTxList] = useState(transactions);
  const [syncLoading, setSyncLoading] = useState<number | null>(null);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [conns, setConns] = useState(connections);

  function removeTx(id: number) {
    setTxList((prev) => prev.filter((t) => t.id !== id));
  }

  async function syncConnection(connectionId: number) {
    setSyncLoading(connectionId);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/banque/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg(`Synchronisation terminée : ${data.nouvelles} nouvelle(s) transaction(s).`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setSyncMsg(data.error ?? "Erreur lors de la synchronisation.");
      }
    } catch {
      setSyncMsg("Erreur réseau.");
    } finally {
      setSyncLoading(null);
    }
  }

  async function deleteConnection(connectionId: number) {
    if (!confirm("Supprimer cette connexion bancaire ? Les transactions importées seront effacées.")) return;
    setDeleting(connectionId);
    try {
      await fetch(`/api/banque/${connectionId}`, { method: "DELETE" });
      setConns((prev) => prev.filter((c) => c.id !== connectionId));
    } finally {
      setDeleting(null);
    }
  }

  if (!estPro) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl dark:bg-neutral-800">
          🏦
        </div>
        <h1 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Connexion bancaire
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          La connexion bancaire Open Banking est disponible avec le plan Pro.
          Synchronisez vos relevés en temps réel et rapprochez automatiquement les virements reçus.
        </p>
        <Link
          href="/abonnement?plan=pro"
          className="inline-block rounded-md px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: "#0047AB" }}
        >
          Passer au Pro →
        </Link>
        <p className="mt-3 text-xs text-neutral-400">14 jours gratuits · Sans engagement</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Link href="/loyers" className="text-sm text-neutral-400 hover:text-neutral-600">
              Gestion locative
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Connexion bancaire</span>
          </div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Connexion bancaire</h1>
          <p className="text-sm text-neutral-500">Open Banking PSD2 · Synchronisation automatique</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
        >
          + Ajouter une banque
        </button>
      </div>

      {/* Message banner */}
      {messageInit === "ok" && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          ✓ Banque connectée avec succès ! Lancez une synchronisation pour importer vos transactions.
        </div>
      )}
      {messageInit && messageInit !== "ok" && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          Erreur lors de la connexion ({messageInit}). Veuillez réessayer.
        </div>
      )}
      {syncMsg && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {syncMsg}
        </div>
      )}

      {/* Connections list */}
      {conns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <div className="mb-3 text-3xl">🏦</div>
          <p className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Aucune banque connectée</p>
          <p className="mb-4 text-sm text-neutral-500">
            Connectez votre compte bancaire pour importer automatiquement vos virements de loyer.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Connecter une banque
          </button>
        </div>
      ) : (
        <div className="mb-6 space-y-3">
          {conns.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                {c.institutionLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.institutionLogo} alt="" className="h-8 w-8 rounded object-contain" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-100 text-sm dark:bg-neutral-800">🏦</div>
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {c.institutionName}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {c.statut === "linked"
                      ? `${c.accountCount} compte${c.accountCount > 1 ? "s" : ""} · Dernière synchro : ${c.lastSyncAt ? formatDate(c.lastSyncAt.slice(0, 10)) : "jamais"}`
                      : c.statut === "pending"
                      ? "En attente de connexion"
                      : "Connexion expirée"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.statut === "linked" && (
                  <button
                    onClick={() => syncConnection(c.id)}
                    disabled={syncLoading === c.id}
                    className="rounded border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    {syncLoading === c.id ? "Synchro…" : "Synchroniser"}
                  </button>
                )}
                <button
                  onClick={() => deleteConnection(c.id)}
                  disabled={deleting === c.id}
                  className="rounded border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === c.id ? "…" : "Déconnecter"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions to rapproche */}
      {txList.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
          <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Transactions à rapprocher
              <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                {txList.length}
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Associez chaque virement reçu à la location correspondante pour enregistrer le paiement.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="py-2.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Date</th>
                  <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Montant</th>
                  <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Libellé</th>
                  <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Période</th>
                  <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Associer à</th>
                </tr>
              </thead>
              <tbody>
                {txList.map((tx) => (
                  <RapprochementRow
                    key={tx.id}
                    tx={tx}
                    locations={locations}
                    onDone={removeTx}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {conns.length > 0 && txList.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-2xl mb-2">✓</p>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">Tout est à jour</p>
          <p className="text-sm text-neutral-500 mt-1">Aucune transaction en attente de rapprochement.</p>
        </div>
      )}

      {showModal && <ConnectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
