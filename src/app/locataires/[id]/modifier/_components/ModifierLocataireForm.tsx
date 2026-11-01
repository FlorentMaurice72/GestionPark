"use client";

import { useActionState, useState } from "react";
import { modifierLocataire, type ActionState } from "@/lib/locataires/actions";
import type { LocataireDetail } from "@/lib/locataires/data";

const ETAT_INITIAL: ActionState = { success: false };

const champClasses =
  "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800";

function sansTiret(valeur: string): string {
  return valeur === "-" ? "" : valeur;
}

export function ModifierLocataireForm({ locataire }: { locataire: LocataireDetail }) {
  const [etat, formAction, enCours] = useActionState(modifierLocataire, ETAT_INITIAL);
  const [afficherSociete, setAfficherSociete] = useState(Boolean(locataire.societe));
  const [afficherAssociation, setAfficherAssociation] = useState(Boolean(locataire.association));

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={locataire.id} />

      <fieldset className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <legend className="px-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Informations locataire
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Nom</label>
            <input name="nom" defaultValue={locataire.nom} required className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Prénom</label>
            <input name="prenom" defaultValue={locataire.prenom} required className={champClasses} />
          </div>

          <div className="flex gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={afficherSociete}
                onChange={(e) => setAfficherSociete(e.target.checked)}
              />
              Société
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={afficherAssociation}
                onChange={(e) => setAfficherAssociation(e.target.checked)}
              />
              Association
            </label>
          </div>

          {afficherSociete && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Société</label>
              <input name="societe" defaultValue={locataire.societe ?? ""} className={champClasses} />
            </div>
          )}
          {afficherAssociation && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Association</label>
              <input name="association" defaultValue={locataire.association ?? ""} className={champClasses} />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Email</label>
            <input name="email" type="email" defaultValue={sansTiret(locataire.email)} className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Téléphone</label>
            <input name="telephone" defaultValue={sansTiret(locataire.telephone)} className={champClasses} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-500">Adresse</label>
            <input name="adresse" defaultValue={sansTiret(locataire.adresse)} className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Ville</label>
            <input name="ville" defaultValue={sansTiret(locataire.ville)} className={champClasses} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Code postal</label>
            <input name="codePostal" defaultValue={sansTiret(locataire.codePostal)} className={champClasses} />
          </div>
        </div>
      </fieldset>

      {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {enCours ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
