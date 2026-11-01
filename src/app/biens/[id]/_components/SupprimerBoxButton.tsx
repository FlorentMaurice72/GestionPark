"use client";

import { useActionState, useState } from "react";
import { supprimerBox, type ActionState } from "@/lib/biens/actions";

const ETAT_INITIAL: ActionState = { success: false };

export function SupprimerBoxButton({ boxId, numero }: { boxId: number; numero: string }) {
  const [confirmation, setConfirmation] = useState(false);
  const [etat, formAction, enCours] = useActionState(supprimerBox, ETAT_INITIAL);

  if (!confirmation) {
    return (
      <button
        type="button"
        onClick={() => setConfirmation(true)}
        className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Supprimer
      </button>
    );
  }

  return (
    <form action={formAction} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="boxId" value={boxId} />
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500">Supprimer {numero} ?</span>
        <button
          type="button"
          onClick={() => setConfirmation(false)}
          className="rounded-md px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-red-700 px-2 py-1 text-xs font-medium text-white hover:bg-red-800 disabled:opacity-50"
        >
          {enCours ? "Suppression…" : "Confirmer"}
        </button>
      </div>
      {etat.error && <p className="max-w-[16rem] text-right text-xs text-red-600 dark:text-red-400">{etat.error}</p>}
    </form>
  );
}
