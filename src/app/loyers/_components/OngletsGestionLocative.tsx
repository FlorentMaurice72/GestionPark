"use client";

import Link from "next/link";

export function OngletsGestionLocative({ ongletActif }: { ongletActif: "paiements" | "echeancier" }) {
  const baseClasse = "px-4 py-1.5 rounded-md text-sm font-medium transition-colors";
  const actifClasse = "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900";
  const inactifClasse = "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100";

  return (
    <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 w-fit dark:border-neutral-800 dark:bg-neutral-800/50">
      <Link
        href="/loyers"
        className={`${baseClasse} ${ongletActif === "paiements" ? actifClasse : inactifClasse}`}
      >
        Paiements
      </Link>
      <Link
        href="/loyers?onglet=echeancier"
        className={`${baseClasse} ${ongletActif === "echeancier" ? actifClasse : inactifClasse}`}
      >
        Échéancier
      </Link>
    </div>
  );
}
