"use client";

import { useActionState } from "react";
import { changerMotDePasse, type ChangerMdpState } from "@/lib/profil/actions";

const ETAT_INITIAL: ChangerMdpState = { success: false };

export function ProfilMdpForm() {
  const [etat, formAction, enCours] = useActionState(changerMotDePasse, ETAT_INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Mot de passe actuel
        </label>
        <input
          type="password"
          name="motDePasseActuel"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Nouveau mot de passe
        </label>
        <input
          type="password"
          name="nouveauMotDePasse"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Confirmer le nouveau mot de passe
        </label>
        <input
          type="password"
          name="confirmation"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </div>

      {etat.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>
      )}
      {etat.success && (
        <p className="text-sm text-green-600 dark:text-green-400">Mot de passe mis à jour.</p>
      )}

      <button
        type="submit"
        disabled={enCours}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dk disabled:opacity-50 dark:hover:bg-neutral-300"
      >
        {enCours ? "Modification…" : "Modifier le mot de passe"}
      </button>
    </form>
  );
}
