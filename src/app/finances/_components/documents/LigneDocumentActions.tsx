"use client";

import { useActionState, useState } from "react";
import { supprimerDocument, type ActionState } from "@/lib/documents/actions";

const ETAT_INITIAL: ActionState = { success: false };

export function LigneDocumentActions({
  id,
  nomFichier,
  contenuTexte,
}: {
  id: number;
  nomFichier: string;
  contenuTexte: string | null;
}) {
  const [voirTexte, setVoirTexte] = useState(false);
  const [confirmationSuppression, setConfirmationSuppression] = useState(false);
  const [etat, formAction, enCours] = useActionState(supprimerDocument, ETAT_INITIAL);

  return (
    <div className="flex items-center justify-end gap-2">
      {contenuTexte ? (
        <button
          type="button"
          onClick={() => setVoirTexte(true)}
          className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Voir le texte
        </button>
      ) : (
        <span className="text-xs text-neutral-400">Aucun fichier</span>
      )}

      {confirmationSuppression ? (
        <form action={formAction} className="flex items-center gap-1">
          <input type="hidden" name="id" value={id} />
          <span className="text-xs text-neutral-500">Confirmer ?</span>
          <button
            type="button"
            onClick={() => setConfirmationSuppression(false)}
            className="rounded-md px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={enCours}
            className="rounded-md bg-red-700 px-2 py-1 text-xs font-medium text-white hover:bg-red-800 disabled:opacity-50"
          >
            {enCours ? "…" : "Confirmer"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmationSuppression(true)}
          className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Supprimer
        </button>
      )}
      {etat.error && <p className="text-xs text-red-600 dark:text-red-400">{etat.error}</p>}

      {voirTexte && contenuTexte && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setVoirTexte(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{nomFichier}</h2>
            <textarea
              readOnly
              value={contenuTexte}
              rows={14}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(contenuTexte);
                  } catch {
                    // presse-papier indisponible — le texte reste sélectionnable manuellement.
                  }
                }}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Copier le texte
              </button>
              <button
                type="button"
                onClick={() => setVoirTexte(false)}
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
