"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "/", label: "Dashboard" },
  { href: "/alertes", label: "Alertes" },
  { href: "/loyers", label: "Gestion locative" },
  { href: "/biens", label: "Mes biens immobiliers" },
  { href: "/locataires", label: "Mes locataires" },
  { href: "/finances", label: "Finances & Documents" },
  { href: "/guide", label: "Guide" },
  { href: "/profil", label: "Mon compte" },
];

export function AppNav({ nombreUrgentes = 0 }: { nombreUrgentes?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
      {ONGLETS.map((onglet) => {
        const actif =
          onglet.href === "/"
            ? pathname === "/"
            : pathname === onglet.href || pathname.startsWith(`${onglet.href}/`);
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
            {onglet.href === "/alertes" && nombreUrgentes > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {nombreUrgentes > 99 ? "99+" : nombreUrgentes}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
