"use client";

import { useActionState } from "react";
import { demanderResetMotDePasse, type ActionState } from "@/lib/reset-password/actions";

const ETAT_INITIAL: ActionState = { success: false };

export function DemandeResetForm() {
  const [etat, formAction, enCours] = useActionState(demanderResetMotDePasse, ETAT_INITIAL);

  if (etat.success) {
    return (
      <p className="text-sm text-neutral-700 dark:text-neutral-300">
        Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être envoyé.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>

      {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

      <button
        type="submit"
        disabled={enCours}
        className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        {enCours ? "Envoi…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
