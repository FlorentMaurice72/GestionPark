"use client";

import { useActionState, useState } from "react";
import { archiverLocataire, type ActionState } from "@/lib/locataires/actions";

const ETAT_INITIAL: ActionState = { success: false };

export function ArchiverButton({ id, nomComplet }: { id: number; nomComplet: string }) {
  const [confirmation, setConfirmation] = useState(false);
  const [etat, formAction, enCours] = useActionState(archiverLocataire, ETAT_INITIAL);

  if (!confirmation) {
    return (
      <button
        type="button"
        onClick={() => setConfirmation(true)}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Archiver
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <p className="max-w-xs text-right text-xs text-neutral-500">
        Archiver {nomComplet} ? Sa location active sera terminée et son box repassera vacant.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirmation(false)}
          className="rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {enCours ? "Archivage…" : "Confirmer"}
        </button>
      </div>
      {etat.error && <p className="text-xs text-red-600 dark:text-red-400">{etat.error}</p>}
    </form>
  );
}
