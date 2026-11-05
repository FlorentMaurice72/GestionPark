"use client";

import { useActionState } from "react";
import { mettreAJourInfosBailleur, type InfosBailleurState } from "@/lib/profil/actions";

const ETAT_INITIAL: InfosBailleurState = { success: false };

export function ProfilInfosForm({
  nomBailleur,
  adresseBailleur,
}: {
  nomBailleur: string | null;
  adresseBailleur: string | null;
}) {
  const [etat, formAction, enCours] = useActionState(mettreAJourInfosBailleur, ETAT_INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Nom / Raison sociale du bailleur
        </label>
        <input
          type="text"
          name="nomBailleur"
          defaultValue={nomBailleur ?? ""}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          placeholder="Ex : Jean Dupont ou SCI Dupont"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Adresse postale du bailleur
        </label>
        <textarea
          name="adresseBailleur"
          defaultValue={adresseBailleur ?? ""}
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          placeholder={"Ex : 12 rue de la Paix\n75001 Paris"}
        />
      </div>

      {etat.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>
      )}
      {etat.success && (
        <p className="text-sm text-green-600 dark:text-green-400">Informations enregistrées.</p>
      )}

      <button
        type="submit"
        disabled={enCours}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dk disabled:opacity-50 dark:hover:bg-neutral-300"
      >
        {enCours ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
