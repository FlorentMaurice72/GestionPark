"use client";

import { useActionState, useState, useCallback } from "react";
import { creerLocataire, type ActionState } from "@/lib/locataires/actions";
import type { BoxVacantOption } from "@/lib/locataires/data";

const ETAT_INITIAL: ActionState = { success: false };

const champClasses =
  "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

type TypeLocataire = "particulier" | "societe" | "association";

export function NouveauLocataireForm({ boxesVacants }: { boxesVacants: BoxVacantOption[] }) {
  const [etat, formAction, enCours] = useActionState(creerLocataire, ETAT_INITIAL);
  const [type, setType] = useState<TypeLocataire>("particulier");
  const [selectedBoxIds, setSelectedBoxIds] = useState<number[]>([]);

  const toggleBox = useCallback((id: number, checked: boolean) => {
    setSelectedBoxIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
  }, []);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <legend className="px-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Box{selectedBoxIds.length > 1 ? `es (${selectedBoxIds.length} sélectionnés)` : ""}
        </legend>
        {boxesVacants.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucun box vacant disponible actuellement.</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-neutral-500">
              Sélectionnez un ou plusieurs boxes à associer à ce locataire.
            </p>
            <div className="flex flex-col gap-1.5">
              {boxesVacants.map((b) => (
                <label
                  key={b.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-200 px-3 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                >
                  <input
                    type="checkbox"
                    name="boxId"
                    value={b.id}
                    onChange={(e) => toggleBox(b.id, e.target.checked)}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="text-sm">{b.label}</span>
                </label>
              ))}
            </div>
            {selectedBoxIds.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">Sélectionnez au moins un box.</p>
            )}
          </div>
        )}
      </fieldset>

      <fieldset className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <legend className="px-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Informations locataire
        </legend>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
          <div className="flex gap-2">
            {(["particulier", "societe", "association"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  type === t
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-neutral-300 dark:border-neutral-700"
                }`}
              >
                {t === "particulier" ? "Particulier" : t === "societe" ? "Société" : "Association"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Nom</label>
            <input name="nom" required className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Prénom</label>
            <input name="prenom" required className={champClasses} />
          </div>
          {type === "societe" && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Société</label>
              <input name="societe" className={champClasses} />
            </div>
          )}
          {type === "association" && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Association</label>
              <input name="association" className={champClasses} />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Email</label>
            <input name="email" type="email" className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Téléphone</label>
            <input name="telephone" className={champClasses} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-500">Adresse</label>
            <input name="adresse" className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Ville</label>
            <input name="ville" className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Code postal</label>
            <input name="codePostal" className={champClasses} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <legend className="px-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Location</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Date d&apos;entrée</label>
            <input name="dateEntree" type="date" defaultValue={todayISO()} required className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Loyer (€){selectedBoxIds.length > 1 ? " — par box" : ""}
            </label>
            <input name="loyerActuel" type="number" step="0.01" min="0.01" required className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Dépôt de garantie (€)</label>
            <input name="depotGarantie" type="number" step="0.01" min="0" required className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Date de révision (optionnel)</label>
            <input name="dateRevisionIRL" type="date" className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Indice de révision</label>
            <select name="indiceRevision" defaultValue="ICC" className={champClasses}>
              <option value="ICC">ICC — Boxes / commercial</option>
              <option value="IRL">IRL — Logement</option>
              <option value="fixe">Fixe — Sans révision</option>
            </select>
          </div>
        </div>
        {selectedBoxIds.length > 1 && (
          <p className="mt-2 text-xs text-neutral-500">
            Ce loyer sera appliqué à chacun des {selectedBoxIds.length} boxes sélectionnés. Modifiable individuellement sur la fiche locataire.
          </p>
        )}
      </fieldset>

      {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={enCours || boxesVacants.length === 0 || selectedBoxIds.length === 0}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dk disabled:opacity-50"
        >
          {enCours ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
