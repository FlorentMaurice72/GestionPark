"use client";

import { useActionState, useState } from "react";
import { anonymiserLocataire, type ActionState } from "@/lib/locataires/actions";

const ETAT_INITIAL: ActionState = { success: false };

export function AnonymiserSection({ id, nomComplet }: { id: number; nomComplet: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [etat, formAction, enCours] = useActionState(anonymiserLocataire, ETAT_INITIAL);

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        Anonymiser (RGPD)
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/10">
      <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Anonymiser {nomComplet}</h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-400">
        Action irréversible : nom, prénom et coordonnées seront définitivement effacés. L&apos;historique des
        locations et paiements reste conservé (obligation comptable). Les documents déjà associés (ex. bail) ne
        sont pas modifiés par cette action.
      </p>

      <form action={formAction} className="mt-4 space-y-2">
        <input type="hidden" name="id" value={id} />
        <label className="block text-xs font-medium text-red-700 dark:text-red-400">
          Tapez ANONYMISER pour confirmer
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
            {enCours ? "Anonymisation…" : "Anonymiser définitivement"}
          </button>
        </div>
      </form>
    </div>
  );
}
