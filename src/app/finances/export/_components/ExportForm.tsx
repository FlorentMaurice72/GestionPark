"use client";

import { useState } from "react";

export function ExportForm() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [annee, setAnnee] = useState(currentYear);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        Export paiements — déclaration 2044
      </h2>
      <p className="mb-5 text-sm text-neutral-500">
        Exporte tous les paiements de l&apos;année sélectionnée au format CSV (compatible Excel). Utile pour votre
        déclaration 2044.
      </p>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="annee-export" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Année fiscale
          </label>
          <select
            id="annee-export"
            value={annee}
            onChange={(e) => setAnnee(parseInt(e.target.value))}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <a
          href={`/api/export/loyers?annee=${annee}`}
          download={`loyers_${annee}.csv`}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Télécharger le CSV {annee}
        </a>
      </div>

      <div className="mt-6 rounded-md border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Colonnes exportées</p>
        <p className="mt-1 text-xs text-neutral-500">
          Bien · Box · Locataire · Email · Mois · Année · Loyer mensuel · Montant reçu · Date de paiement · Mode de
          paiement
        </p>
      </div>
    </div>
  );
}
