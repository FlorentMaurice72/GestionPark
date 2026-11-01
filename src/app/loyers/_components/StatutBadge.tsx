import type { StatutPaiement } from "@/lib/paiements";

const STYLES: Record<StatutPaiement, { label: string; classes: string }> = {
  impaye: {
    label: "Impayé",
    classes: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  impaye_partiel: {
    label: "Impayé (partiel)",
    classes: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  paye: {
    label: "Payé",
    classes: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  trop_percu: {
    label: "Trop-perçu",
    classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
};

export function StatutBadge({ statut }: { statut: StatutPaiement }) {
  const { label, classes } = STYLES[statut];
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

export function ImpayesCumulesBadge({ nombreMois }: { nombreMois: number }) {
  if (nombreMois <= 1) return null;

  return (
    <span className="inline-flex rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
      {nombreMois} mois impayés
    </span>
  );
}
