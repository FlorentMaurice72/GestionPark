"use client";

import { useActionState, useState } from "react";
import { creerRappel, type AlerteState } from "@/lib/alertes/actions";

const ETAT_INITIAL: AlerteState = { success: false };

export function CreerRappelModal() {
  const [ouvert, setOuvert] = useState(false);
  const [etat, formAction, enCours] = useActionState(creerRappel, ETAT_INITIAL);

  if (etat.success && ouvert) {
    setOuvert(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        + Créer un rappel
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOuvert(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Nouveau rappel
            </h2>
            <form action={formAction} className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Titre *
                </label>
                <input
                  name="titre"
                  type="text"
                  required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Date *
                </label>
                <input
                  name="dateRappel"
                  type="date"
                  required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
              {etat.error && (
                <p className="text-xs text-red-600 dark:text-red-400">{etat.error}</p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOuvert(false)}
                  className="rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={enCours}
                  className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  {enCours ? "…" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
