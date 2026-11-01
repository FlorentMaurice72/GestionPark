"use client";

import { useActionState, useState } from "react";
import { creerCharge, type ActionState } from "@/lib/finances/actions";
import { TYPES_CHARGE } from "@/lib/documents/types";
import type { OptionSimple } from "@/lib/finances/data";

const ETAT_INITIAL: ActionState = { success: false };

const champClasses =
  "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AjouterChargeModal({ biens }: { biens: OptionSimple[] }) {
  const [ouvert, setOuvert] = useState(false);
  const [etat, formAction, enCours] = useActionState(async (_prev: ActionState, formData: FormData) => {
    const resultat = await creerCharge(_prev, formData);
    if (resultat.success) setOuvert(false);
    return resultat;
  }, ETAT_INITIAL);

  if (biens.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
      >
        Ajouter une charge
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
              Nouvelle charge
            </h2>

            <form action={formAction} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Bien</label>
                <select name="bienId" required className={champClasses}>
                  {biens.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Type de charge</label>
                <select name="chargeType" required className={champClasses}>
                  {TYPES_CHARGE.map((t) => (
                    <option key={t.valeur} value={t.valeur}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Montant (€)</label>
                <input name="chargeMontant" type="number" step="0.01" min="0.01" required className={champClasses} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Date</label>
                <input
                  name="dateDocument"
                  type="date"
                  defaultValue={todayISO()}
                  required
                  className={champClasses}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Description (optionnel)</label>
                <input name="description" className={champClasses} />
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
                  {enCours ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
