"use client";

import { useActionState, useState } from "react";
import { ajouterBoxes, type ActionState } from "@/lib/biens/actions";

const ETAT_INITIAL: ActionState = { success: false };

const champClasses =
  "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800";

export function AjouterBoxesModal({ bienId }: { bienId: number }) {
  const [ouvert, setOuvert] = useState(false);
  const [etat, formAction, enCours] = useActionState(async (_prev: ActionState, formData: FormData) => {
    const resultat = await ajouterBoxes(_prev, formData);
    if (resultat.success) setOuvert(false);
    return resultat;
  }, ETAT_INITIAL);

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Ajouter des boxes
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOuvert(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Ajouter des boxes
            </h2>
            <p className="mb-4 text-xs text-neutral-500">
              Numérotation séquentielle : préfixe + numéro + suffixe.
            </p>

            <form action={formAction} className="space-y-3">
              <input type="hidden" name="bienId" value={bienId} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Préfixe (optionnel)</label>
                  <input name="prefixeBox" className={champClasses} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Suffixe (optionnel)</label>
                  <input name="suffixeBox" className={champClasses} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Numéro de départ</label>
                  <input name="numeroDebut" type="number" step="1" min="0" defaultValue={1} required className={champClasses} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Nombre de boxes</label>
                  <input name="nombreBoxes" type="number" step="1" min="1" required className={champClasses} />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Superficie par box (m²)</label>
                  <input name="superficieBox" type="number" step="0.01" min="0.01" required className={champClasses} />
                </div>
              </div>

              {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

              <div className="flex justify-end gap-2 pt-2">
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
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  {enCours ? "Ajout…" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
