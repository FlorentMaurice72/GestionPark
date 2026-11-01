"use client";

import type { LocationOption } from "@/lib/import/data";
import { formaterMontant } from "@/lib/format";
import type { ErreurFormatLigne, LigneImport } from "./types";

interface Props {
  lignes: LigneImport[];
  erreursFormat: ErreurFormatLigne[];
  locations: LocationOption[];
  erreurImport: string | null;
  enCours: boolean;
  onChangeAffectation: (ligneIndex: number, locationId: number | null) => void;
  onRetour: () => void;
  onConfirmer: () => void;
}

function labelLocation(location: LocationOption): string {
  return `${location.bienNom} · Box ${location.boxNumero} · ${location.locataireNom} ${location.locatairePrenom}`;
}

function formaterDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(date);
}

export function EtapeVerification({
  lignes,
  erreursFormat,
  locations,
  erreurImport,
  enCours,
  onChangeAffectation,
  onRetour,
  onConfirmer,
}: Props) {
  const locationsParId = new Map(locations.map((l) => [l.id, l]));

  const groupesAffectes = new Map<number, number[]>(); // locationId -> indices dans lignes
  const indicesNonAffectes: number[] = [];

  lignes.forEach((ligne, index) => {
    if (ligne.locationId !== null) {
      const liste = groupesAffectes.get(ligne.locationId) ?? [];
      liste.push(index);
      groupesAffectes.set(ligne.locationId, liste);
    } else {
      indicesNonAffectes.push(index);
    }
  });

  const nombreAffectes = lignes.filter((l) => l.locationId !== null).length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Paiements qui seront créés ({nombreAffectes})
        </h2>

        {groupesAffectes.size === 0 && (
          <p className="text-sm text-neutral-500">Aucune transaction affectée pour l&apos;instant.</p>
        )}

        <div className="space-y-4">
          {Array.from(groupesAffectes.entries()).map(([locationId, indices]) => {
            const location = locationsParId.get(locationId);
            const sousTotal = indices.reduce((acc, i) => acc + lignes[i].montant, 0);
            return (
              <div key={locationId} className="rounded-md border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-800/50">
                  <span>{location ? labelLocation(location) : `Location #${locationId}`}</span>
                  <span>{formaterMontant(sousTotal)}</span>
                </div>
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {indices.map((i) => (
                    <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span className="text-neutral-500">
                        {formaterDate(lignes[i].date)} · {lignes[i].libelle}
                      </span>
                      <span className="flex items-center gap-2">
                        {formaterMontant(lignes[i].montant)}
                        <button
                          type="button"
                          onClick={() => onChangeAffectation(i, null)}
                          className="text-xs text-neutral-400 hover:text-red-600"
                          title="Retirer de l'import"
                        >
                          ✕
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950/40">
        <h2 className="mb-4 text-sm font-semibold text-orange-900 dark:text-orange-200">
          Transactions non identifiées ({indicesNonAffectes.length})
        </h2>

        {indicesNonAffectes.length === 0 && (
          <p className="text-sm text-orange-800 dark:text-orange-300">Toutes les transactions ont été identifiées.</p>
        )}

        <ul className="space-y-2">
          {indicesNonAffectes.map((i) => (
            <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white px-3 py-2 text-sm dark:bg-neutral-900">
              <span>
                {formaterDate(lignes[i].date)} · {lignes[i].libelle} ·{" "}
                <span className="font-medium">{formaterMontant(lignes[i].montant)}</span>
                {lignes[i].raisonNonAffecte === "correspondances_multiples" && (
                  <span className="ml-2 text-xs text-orange-700 dark:text-orange-400">(plusieurs locations possibles)</span>
                )}
              </span>
              <select
                value=""
                onChange={(e) => onChangeAffectation(i, e.target.value ? Number(e.target.value) : null)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option value="">Affecter à…</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {labelLocation(location)}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </div>

      {erreursFormat.length > 0 && (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          {erreursFormat.length} ligne(s) ignorée(s) pour cause de date illisible : ligne(s){" "}
          {erreursFormat.map((e) => e.ligne).join(", ")}.
        </div>
      )}

      {erreurImport && <p className="text-sm text-red-600 dark:text-red-400">{erreurImport}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onRetour}
          className="rounded-md px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Retour
        </button>
        <button
          type="button"
          disabled={nombreAffectes === 0 || enCours}
          onClick={onConfirmer}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {enCours ? "Import en cours…" : `Confirmer l'import (${nombreAffectes})`}
        </button>
      </div>
    </div>
  );
}
