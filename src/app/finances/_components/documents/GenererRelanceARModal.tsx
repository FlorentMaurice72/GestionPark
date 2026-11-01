"use client";

import { useActionState, useState } from "react";
import { genererRelanceAR, type ActionState } from "@/lib/documents/actions";
import type { OptionSimple } from "@/lib/documents/data";

const ETAT_INITIAL: ActionState = { success: false };

export function GenererRelanceARModal({ locatairesActifs }: { locatairesActifs: OptionSimple[] }) {
  const [ouvert, setOuvert] = useState(false);
  const [etat, formAction, enCours] = useActionState(async (_prev: ActionState, formData: FormData) => {
    const resultat = await genererRelanceAR(_prev, formData);
    if (resultat.success) setOuvert(false);
    return resultat;
  }, ETAT_INITIAL);

  if (locatairesActifs.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Générer une relance avec AR
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOuvert(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Relance avec accusé de réception
            </h2>

            <form action={formAction} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Locataire</label>
                <select
                  name="locataireId"
                  required
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {locatairesActifs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-neutral-500">
                Le montant dû et le mois concerné sont calculés automatiquement à partir des paiements du mois en
                cours.
              </p>

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
                  {enCours ? "Génération…" : "Générer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
