"use client";

import { useState } from "react";
import { creerLocataire, type ActionState } from "@/lib/locataires/actions";
import type { BoxVacantOption } from "@/lib/locataires/data";

const champClasses =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-neutral-100";
const labelClasses = "mb-1 block text-xs font-medium text-neutral-500 uppercase tracking-wide";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

type TypeLocataire = "particulier" | "societe" | "association";

interface Champs {
  // Étape 1 — Bail
  typeBail: string;
  renouvellementAuto: boolean;
  // Étape 2 — Locataire
  typeLocataire: TypeLocataire;
  nom: string;
  prenom: string;
  societe: string;
  association: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  // Étape 3 — Location
  boxId: string;
  dateEntree: string;
  // Étape 4 — Loyer
  loyerActuel: string;
  depotGarantie: string;
  termeLoyerType: string;
  moyenPaiement: string;
  // Étape 5 — Automatisation
  avisLoyerAuto: boolean;
  quittanceAuto: boolean;
  relanceActive: boolean;
}

const INITIAL: Champs = {
  typeBail: "bail_box",
  renouvellementAuto: true,
  typeLocataire: "particulier",
  nom: "",
  prenom: "",
  societe: "",
  association: "",
  email: "",
  telephone: "",
  adresse: "",
  ville: "",
  codePostal: "",
  boxId: "",
  dateEntree: todayISO(),
  loyerActuel: "",
  depotGarantie: "",
  termeLoyerType: "a_echoir",
  moyenPaiement: "virement",
  avisLoyerAuto: true,
  quittanceAuto: true,
  relanceActive: true,
};

const ETAPES = ["Bail", "Locataire", "Location", "Loyer", "Automatisation"];

const TYPES_BAIL = [
  { id: "bail_box", label: "Box de stockage" },
  { id: "bail_garage", label: "Garage" },
  { id: "bail_commercial", label: "Commercial" },
  { id: "autre", label: "Autre" },
];

const MOYENS_PAIEMENT = [
  { id: "virement", label: "Virement bancaire" },
  { id: "prelevement", label: "Prélèvement automatique" },
  { id: "cheque", label: "Chèque" },
  { id: "especes", label: "Espèces" },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
        checked ? "bg-neutral-900 dark:bg-neutral-100" : "bg-neutral-300 dark:bg-neutral-600"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-neutral-900 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function NouveauLocataireWizard({ boxesVacants }: { boxesVacants: BoxVacantOption[] }) {
  const [etape, setEtape] = useState(0);
  const [champs, setChamps] = useState<Champs>(INITIAL);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  function maj<K extends keyof Champs>(champ: K, valeur: Champs[K]) {
    setChamps((prev) => ({ ...prev, [champ]: valeur }));
    setErreur(null);
  }

  function validerEtape(): boolean {
    if (etape === 1) {
      if (!champs.nom.trim()) { setErreur("Nom requis."); return false; }
      if (!champs.prenom.trim()) { setErreur("Prénom requis."); return false; }
    }
    if (etape === 2) {
      if (!champs.boxId) { setErreur("Sélectionnez un box."); return false; }
      if (!champs.dateEntree) { setErreur("Date d'entrée requise."); return false; }
    }
    if (etape === 3) {
      if (!champs.loyerActuel || Number(champs.loyerActuel) <= 0) { setErreur("Loyer invalide."); return false; }
      if (champs.depotGarantie === "" || Number(champs.depotGarantie) < 0) { setErreur("Dépôt de garantie invalide."); return false; }
    }
    return true;
  }

  function suivant() {
    if (!validerEtape()) return;
    setEtape((e) => e + 1);
  }

  function precedent() {
    setEtape((e) => e - 1);
    setErreur(null);
  }

  async function soumettre() {
    if (!validerEtape()) return;
    setEnCours(true);
    const fd = new FormData();
    fd.set("boxId", champs.boxId);
    fd.set("nom", champs.nom);
    fd.set("prenom", champs.prenom);
    fd.set("societe", champs.societe);
    fd.set("association", champs.association);
    fd.set("email", champs.email);
    fd.set("telephone", champs.telephone);
    fd.set("adresse", champs.adresse);
    fd.set("ville", champs.ville);
    fd.set("codePostal", champs.codePostal);
    fd.set("dateEntree", champs.dateEntree);
    fd.set("loyerActuel", champs.loyerActuel);
    fd.set("depotGarantie", champs.depotGarantie);
    fd.set("typeBail", champs.typeBail);
    fd.set("renouvellementAuto", String(champs.renouvellementAuto));
    fd.set("termeLoyerType", champs.termeLoyerType);
    fd.set("moyenPaiement", champs.moyenPaiement);
    fd.set("avisLoyerAuto", String(champs.avisLoyerAuto));
    fd.set("quittanceAuto", String(champs.quittanceAuto));
    fd.set("relanceActive", String(champs.relanceActive));

    const etat: ActionState = await creerLocataire({ success: false }, fd);
    if (!etat.success) {
      setErreur(etat.error ?? "Erreur inconnue.");
      setEnCours(false);
    }
  }

  const boxSelectionnee = boxesVacants.find((b) => String(b.id) === champs.boxId);

  return (
    <div className="flex flex-col gap-6">
      {/* Progression */}
      <div className="flex items-center gap-1 sm:gap-2">
        {ETAPES.map((titre, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i < etape
                  ? "bg-green-500 text-white"
                  : i === etape
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "bg-neutral-200 text-neutral-400 dark:bg-neutral-800"
              }`}
            >
              {i < etape ? "✓" : i + 1}
            </div>
            <span className={`hidden text-xs sm:block ${i === etape ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-400"}`}>
              {titre}
            </span>
          </div>
        ))}
      </div>

      {/* Contenu de l'étape */}
      <div className="min-h-[280px] rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">

        {/* Étape 1 — Bail */}
        {etape === 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Type de bail</h2>
            <div>
              <label className={labelClasses}>Nature du bail</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TYPES_BAIL.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => maj("typeBail", t.id)}
                    className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                      champs.typeBail === t.id
                        ? "border-neutral-900 dark:border-neutral-100"
                        : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Renouvellement automatique</p>
                <p className="text-xs text-neutral-500">Le bail se renouvelle automatiquement à l&apos;échéance</p>
              </div>
              <Toggle
                checked={champs.renouvellementAuto}
                onChange={(v) => maj("renouvellementAuto", v)}
                label="Renouvellement automatique"
              />
            </div>
          </div>
        )}

        {/* Étape 2 — Locataire */}
        {etape === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Informations locataire</h2>
            <div className="flex gap-2">
              {(["particulier", "societe", "association"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => maj("typeLocataire", t)}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    champs.typeLocataire === t
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  {t === "particulier" ? "Particulier" : t === "societe" ? "Société" : "Association"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Nom *</label>
                <input value={champs.nom} onChange={(e) => maj("nom", e.target.value)} className={champClasses} autoFocus />
              </div>
              <div>
                <label className={labelClasses}>Prénom *</label>
                <input value={champs.prenom} onChange={(e) => maj("prenom", e.target.value)} className={champClasses} />
              </div>
              {champs.typeLocataire === "societe" && (
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Société</label>
                  <input value={champs.societe} onChange={(e) => maj("societe", e.target.value)} className={champClasses} />
                </div>
              )}
              {champs.typeLocataire === "association" && (
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Association</label>
                  <input value={champs.association} onChange={(e) => maj("association", e.target.value)} className={champClasses} />
                </div>
              )}
              <div>
                <label className={labelClasses}>Email</label>
                <input type="email" value={champs.email} onChange={(e) => maj("email", e.target.value)} className={champClasses} />
              </div>
              <div>
                <label className={labelClasses}>Téléphone</label>
                <input value={champs.telephone} onChange={(e) => maj("telephone", e.target.value)} className={champClasses} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Adresse</label>
                <input value={champs.adresse} onChange={(e) => maj("adresse", e.target.value)} className={champClasses} />
              </div>
              <div>
                <label className={labelClasses}>Ville</label>
                <input value={champs.ville} onChange={(e) => maj("ville", e.target.value)} className={champClasses} />
              </div>
              <div>
                <label className={labelClasses}>Code postal</label>
                <input value={champs.codePostal} onChange={(e) => maj("codePostal", e.target.value)} className={champClasses} />
              </div>
            </div>
          </div>
        )}

        {/* Étape 3 — Location */}
        {etape === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Choix du box</h2>
            {boxesVacants.length === 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
                Aucun box vacant disponible. Ajoutez d&apos;abord un bien avec des boxes.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {boxesVacants.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => maj("boxId", String(b.id))}
                    className={`rounded-lg border-2 p-3 text-left text-sm font-medium transition-all ${
                      champs.boxId === String(b.id)
                        ? "border-neutral-900 dark:border-neutral-100"
                        : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
            <div className="max-w-xs">
              <label className={labelClasses}>Date d&apos;entrée *</label>
              <input
                type="date"
                value={champs.dateEntree}
                onChange={(e) => maj("dateEntree", e.target.value)}
                className={champClasses}
              />
            </div>
          </div>
        )}

        {/* Étape 4 — Loyer */}
        {etape === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Conditions financières</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Loyer mensuel (€) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={champs.loyerActuel}
                  onChange={(e) => maj("loyerActuel", e.target.value)}
                  className={champClasses}
                  autoFocus
                  placeholder="ex. 80"
                />
              </div>
              <div>
                <label className={labelClasses}>Dépôt de garantie (€) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={champs.depotGarantie}
                  onChange={(e) => maj("depotGarantie", e.target.value)}
                  className={champClasses}
                  placeholder="ex. 160"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Terme du loyer</label>
                <select value={champs.termeLoyerType} onChange={(e) => maj("termeLoyerType", e.target.value)} className={champClasses}>
                  <option value="a_echoir">À échoir (en début de mois)</option>
                  <option value="echu">Échu (en fin de mois)</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Moyen de paiement</label>
                <select value={champs.moyenPaiement} onChange={(e) => maj("moyenPaiement", e.target.value)} className={champClasses}>
                  {MOYENS_PAIEMENT.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Étape 5 — Automatisation */}
        {etape === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Automatisations</h2>
            <p className="text-sm text-neutral-500">Activez les actions automatiques pour ce locataire.</p>
            <div className="flex flex-col gap-3">
              {[
                { key: "avisLoyerAuto" as const, label: "Avis de loyer automatique", desc: "Envoie un avis de loyer chaque mois" },
                { key: "quittanceAuto" as const, label: "Quittance automatique", desc: "Génère une quittance à chaque paiement" },
                { key: "relanceActive" as const, label: "Relances automatiques", desc: "Relance automatiquement en cas d'impayé" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.label}</p>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                  <Toggle
                    checked={champs[item.key]}
                    onChange={(v) => maj(item.key, v)}
                    label={item.label}
                  />
                </div>
              ))}
            </div>

            {/* Récap final */}
            <div className="mt-2 rounded-lg border border-neutral-100 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950">
              <p className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">Récapitulatif</p>
              <ul className="space-y-1 text-neutral-500">
                <li><span className="font-medium">Locataire :</span> {champs.prenom} {champs.nom}</li>
                <li><span className="font-medium">Box :</span> {boxSelectionnee?.label ?? "—"}</li>
                <li><span className="font-medium">Entrée :</span> {champs.dateEntree}</li>
                <li><span className="font-medium">Loyer :</span> {champs.loyerActuel} €/mois — dépôt {champs.depotGarantie} €</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {erreur && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {erreur}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={precedent}
          className={`rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 ${
            etape === 0 ? "invisible" : ""
          }`}
        >
          ← Précédent
        </button>

        {etape < ETAPES.length - 1 ? (
          <button
            type="button"
            onClick={suivant}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Suivant →
          </button>
        ) : (
          <button
            type="button"
            onClick={soumettre}
            disabled={enCours}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {enCours ? "Création…" : "Créer le locataire →"}
          </button>
        )}
      </div>
    </div>
  );
}
