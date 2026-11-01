"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "/", label: "Dashboard" },
  { href: "/loyers", label: "Loyers & Paiements" },
  { href: "/biens", label: "Mes Biens" },
  { href: "/locataires", label: "Mes Locataires" },
  { href: "/finances", label: "Finances & Documents" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
      {ONGLETS.map((onglet) => {
        const actif = pathname === onglet.href || pathname.startsWith(`${onglet.href}/`);
        return (
          <Link
            key={onglet.href}
            href={onglet.href}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              actif
                ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            {onglet.label}
          </Link>
        );
      })}
    </nav>
  );
}
