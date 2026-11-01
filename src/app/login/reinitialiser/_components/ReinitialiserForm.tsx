"use client";

import { useActionState } from "react";
import { reinitialiserMotDePasse, type ActionState } from "@/lib/reset-password/actions";

const ETAT_INITIAL: ActionState = { success: false };

export function ReinitialiserForm({ token }: { token: string }) {
  const [etat, formAction, enCours] = useActionState(reinitialiserMotDePasse, ETAT_INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="motDePasse" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Nouveau mot de passe
        </label>
        <input
          id="motDePasse"
          name="motDePasse"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>

      <div>
        <label htmlFor="confirmation" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmation"
          name="confirmation"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>

      {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

      <button
        type="submit"
        disabled={enCours}
        className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        {enCours ? "Enregistrement…" : "Réinitialiser"}
      </button>
    </form>
  );
}
