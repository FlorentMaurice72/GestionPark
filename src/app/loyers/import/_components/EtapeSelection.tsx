"use client";

import { NOMS_MOIS } from "@/lib/dates";
import type { PresetOption } from "@/lib/import/data";

interface Props {
  presets: PresetOption[];
  mois: number;
  annee: number;
  presetId: number | null;
  fichier: File | null;
  erreur: string | null;
  onChangeMois: (mois: number) => void;
  onChangeAnnee: (annee: number) => void;
  onChangePreset: (presetId: number) => void;
  onChangeFichier: (fichier: File | null) => void;
  onValider: () => void;
}

export function EtapeSelection({
  presets,
  mois,
  annee,
  presetId,
  fichier,
  erreur,
  onChangeMois,
  onChangeAnnee,
  onChangePreset,
  onChangeFichier,
  onValider,
}: Props) {
  const pretAAnalyser = mois > 0 && annee > 0 && presetId !== null && fichier !== null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
        La vue sera forcée sur « Tous les biens » pendant l&apos;import : le relevé bancaire contient les
        paiements de tous les biens mélangés, pour un seul compte.
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Mois concerné
            </label>
            <select
              value={mois}
              onChange={(e) => onChangeMois(Number(e.target.value))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            >
              {NOMS_MOIS.map((nom, index) => (
                <option key={nom} value={index + 1}>
                  {nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Année
            </label>
            <input
              type="number"
              value={annee}
              onChange={(e) => onChangeAnnee(Number(e.target.value))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Préréglage bancaire
            </label>
            <select
              value={presetId ?? ""}
              onChange={(e) => onChangePreset(Number(e.target.value))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            >
              <option value="" disabled>
                Sélectionner un préréglage
              </option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            {presets.length === 0 && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Aucun préréglage bancaire en base — exécuter le script de seed avant de continuer.
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Fichier CSV
            </label>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => onChangeFichier(e.target.files?.[0] ?? null)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-2 file:py-1 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>

        {erreur && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{erreur}</p>}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={!pretAAnalyser}
            onClick={onValider}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Analyser le fichier
          </button>
        </div>
      </div>
    </div>
  );
}
