"use client";
import { useActionState } from "react";
import { envoyerAvisLoyer, type EnvoyerAvisState } from "@/lib/loyers/avis-actions";

const INIT: EnvoyerAvisState = { success: false };

export function BoutonAvisLoyer({
  locationId,
  mois,
  annee,
}: {
  locationId: number;
  mois: number;
  annee: number;
}) {
  const [etat, formAction, enCours] = useActionState(envoyerAvisLoyer, INIT);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="locationId" value={locationId} />
      <input type="hidden" name="mois" value={mois} />
      <input type="hidden" name="annee" value={annee} />
      <button
        type="submit"
        disabled={enCours || etat.success}
        className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        title="Envoyer l'avis de loyer par email"
      >
        {etat.success ? "✓ Envoyé" : enCours ? "…" : "Avis loyer"}
      </button>
      {etat.error && <span className="ml-1 text-xs text-red-600">{etat.error}</span>}
    </form>
  );
}
