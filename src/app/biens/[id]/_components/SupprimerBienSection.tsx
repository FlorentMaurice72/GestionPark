"use client";

import { useActionState, useState } from "react";
import { supprimerBien, type ActionState } from "@/lib/biens/actions";

const ETAT_INITIAL: ActionState = { success: false };

export function SupprimerBienSection({ bienId, nom }: { bienId: number; nom: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [etat, formAction, enCours] = useActionState(supprimerBien, ETAT_INITIAL);

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        Supprimer ce bien
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/10">
      <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Supprimer « {nom} »</h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-400">
        Action irréversible : tous les boxes, locations, paiements, relances et documents liés à ce bien seront
        définitivement supprimés. Les locataires actuellement installés seront archivés.
      </p>
      <a
        href={`/biens/${bienId}/export`}
        className="mt-3 inline-block rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
      >
        Exporter l&apos;historique comptable (CSV) avant suppression
      </a>

      <form action={formAction} className="mt-4 space-y-2">
        <input type="hidden" name="id" value={bienId} />
        <label className="block text-xs font-medium text-red-700 dark:text-red-400">
          Tapez SUPPRIMER pour confirmer
        </label>
        <input
          name="confirmation"
          required
          className="w-full max-w-xs rounded-md border border-red-300 px-2 py-1.5 text-sm dark:border-red-800 dark:bg-neutral-900"
        />

        {etat.error && <p className="text-sm text-red-700 dark:text-red-400">{etat.error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setOuvert(false)}
            className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={enCours}
            className="rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
          >
            {enCours ? "Suppression…" : "Supprimer définitivement"}
          </button>
        </div>
      </form>
    </div>
  );
}
