"use client";

import { useActionState, useState } from "react";
import { creerPaiement, type CreerPaiementState } from "@/lib/loyers/actions";

interface Props {
  locationId: number;
  locataireLabel: string;
  boxNumero: string;
  mois: number;
  annee: number;
}

const ETAT_INITIAL: CreerPaiementState = { success: false };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PaiementModal({ locationId, locataireLabel, boxNumero, mois, annee }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [etat, formAction, enCours] = useActionState(async (_prev: CreerPaiementState, formData: FormData) => {
    const resultat = await creerPaiement(_prev, formData);
    if (resultat.success) {
      setOuvert(false);
    }
    return resultat;
  }, ETAT_INITIAL);

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Ajouter un paiement
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
            <h2 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Nouveau paiement
            </h2>
            <p className="mb-4 text-xs text-neutral-500">
              Box {boxNumero} · {locataireLabel}
            </p>

            <form action={formAction} className="space-y-3">
              <input type="hidden" name="locationId" value={locationId} />

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Mois</label>
                  <input
                    type="number"
                    name="mois"
                    min={1}
                    max={12}
                    defaultValue={mois}
                    required
                    className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Année</label>
                  <input
                    type="number"
                    name="annee"
                    defaultValue={annee}
                    required
                    className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Montant (€)</label>
                <input
                  type="number"
                  name="montant"
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Date de paiement</label>
                <input
                  type="date"
                  name="datePaiement"
                  defaultValue={todayISO()}
                  required
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Mode</label>
                <input
                  type="text"
                  name="mode"
                  placeholder="virement"
                  required
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
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
