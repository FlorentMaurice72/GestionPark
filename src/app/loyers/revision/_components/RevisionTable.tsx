"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { appliquerRevision, appliquerToutesRevisions } from "@/lib/revision/actions";
import { labelTrimestre } from "@/lib/revision/indices";
import type { LocationDueRevision } from "@/lib/revision/data";

interface Props {
  locations: LocationDueRevision[];
}

export function RevisionTable({ locations: initialLocations }: Props) {
  const [locations, setLocations] = useState(initialLocations);
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [appliedAll, setAppliedAll] = useState(false);

  const enRetard = locations.filter((l) => l.enRetard);
  const aVenir = locations.filter((l) => !l.enRetard);

  function handleAppliquer(locationId: number) {
    setLoadingId(locationId);
    startTransition(async () => {
      const r = await appliquerRevision(locationId);
      if (r.success) {
        setLocations((prev) => prev.filter((l) => l.locationId !== locationId));
      }
      setLoadingId(null);
    });
  }

  function handleTout() {
    const ids = enRetard.map((l) => l.locationId);
    if (ids.length === 0) return;
    startTransition(async () => {
      const r = await appliquerToutesRevisions(ids);
      if (r.success) {
        setLocations((prev) => prev.filter((l) => !l.enRetard));
        setAppliedAll(true);
      }
    });
  }

  if (locations.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
          Aucune révision en attente
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Toutes les locations sont à jour. Revenez dans 30 jours avant la prochaine échéance.
        </p>
        <Link
          href="/loyers"
          className="mt-4 inline-block text-sm font-medium"
          style={{ color: "#0047AB" }}
        >
          ← Retour aux loyers
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* En retard */}
      {enRetard.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">
              En retard · {enRetard.length} location{enRetard.length > 1 ? "s" : ""}
            </h2>
            {enRetard.length > 1 && (
              <button
                onClick={handleTout}
                disabled={pending}
                className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#0047AB" }}
              >
                {pending && !loadingId ? "Application…" : `Appliquer tout (${enRetard.length})`}
              </button>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border border-red-200 bg-white dark:border-red-900/40 dark:bg-neutral-900">
            <RevisionRows
              rows={enRetard}
              loadingId={loadingId}
              pending={pending}
              onAppliquer={handleAppliquer}
              variant="retard"
            />
          </div>
        </section>
      )}

      {/* À venir */}
      {aVenir.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
            Dans 30 jours · {aVenir.length} location{aVenir.length > 1 ? "s" : ""}
          </h2>
          <div className="overflow-hidden rounded-xl border border-amber-200 bg-white dark:border-amber-900/40 dark:bg-neutral-900">
            <RevisionRows
              rows={aVenir}
              loadingId={loadingId}
              pending={pending}
              onAppliquer={handleAppliquer}
              variant="avenir"
            />
          </div>
        </section>
      )}

      {appliedAll && (
        <p className="text-sm text-green-700 dark:text-green-400">
          ✓ Toutes les révisions en retard ont été appliquées.
        </p>
      )}
    </div>
  );
}

function RevisionRows({
  rows,
  loadingId,
  pending,
  onAppliquer,
  variant,
}: {
  rows: LocationDueRevision[];
  loadingId: number | null;
  pending: boolean;
  onAppliquer: (id: number) => void;
  variant: "retard" | "avenir";
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-neutral-100 dark:border-neutral-800">
          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Locataire · Bien</th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Loyer actuel</th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Nouveau loyer</th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Variation</th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Indice ({rows[0]?.typeIndice})</th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Date révision</th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((loc, i) => {
          const isLoading = loadingId === loc.locationId;
          const sign = loc.variation >= 0 ? "+" : "";
          return (
            <tr
              key={loc.locationId}
              className={`${i < rows.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""}`}
            >
              <td className="px-4 py-3">
                <Link
                  href={`/locataires/${loc.locataireId}`}
                  className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
                >
                  {loc.locatairePrenom} {loc.locataireNom}
                </Link>
                <div className="text-xs text-neutral-500">
                  {loc.bienNom} · Box {loc.boxNumero}
                </div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {loc.loyerActuel.toFixed(2)} €
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
                {loc.loyerRevise.toFixed(2)} €
              </td>
              <td
                className={`px-4 py-3 text-right tabular-nums text-xs font-medium ${
                  loc.variation >= 0
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {sign}{loc.variation.toFixed(2)} %
              </td>
              <td className="px-4 py-3 text-right text-xs text-neutral-500">
                <span title={`Réf : ${labelTrimestre(loc.indiceAncien)} = ${loc.indiceAncien.valeur}`}>
                  {labelTrimestre(loc.indiceNouveau)} = {loc.indiceNouveau.valeur}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-xs text-neutral-500">
                {loc.dateRevision.toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-3 text-right">
                {variant === "retard" ? (
                  <button
                    onClick={() => onAppliquer(loc.locationId)}
                    disabled={pending || isLoading}
                    className="rounded-md px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#0047AB" }}
                  >
                    {isLoading ? "…" : "Appliquer"}
                  </button>
                ) : (
                  <span className="text-xs text-neutral-400">Prévue</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
