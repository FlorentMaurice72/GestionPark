"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ONGLETS = [
  { id: "compte",      label: "Mon compte" },
  { id: "facturation", label: "Facturation" },
];

export function ProfilTabNav() {
  const params = useSearchParams();
  const actif = params.get("onglet") ?? "compte";

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-3xl px-6">
        <nav className="flex gap-1">
          {ONGLETS.map((o) => {
            const isActif = actif === o.id;
            return (
              <Link
                key={o.id}
                href={`/profil?onglet=${o.id}`}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActif
                    ? "border-brand text-brand dark:border-canard dark:text-canard"
                    : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {o.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
