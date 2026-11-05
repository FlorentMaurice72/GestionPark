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

function Logo() {
  return (
    <Link href="/" className="mr-2 flex flex-shrink-0 items-center gap-2 py-3">
      <svg width="26" height="20" viewBox="0 0 80 60" aria-hidden="true">
        <polygon points="30,4 50,14 30,24 10,14" fill="#20B2AA" />
        <polygon points="10,14 30,24 30,42 10,32" fill="#0097A7" />
        <polygon points="30,24 50,14 50,32 30,42" fill="#0047AB" />
        <polygon points="50,18 62,24 50,30 38,24" fill="#20B2AA" />
        <polygon points="50,30 62,24 62,38 50,44" fill="#0047AB" />
        <circle cx="26" cy="40" r="8" fill="#0097A7" />
        <circle cx="26" cy="40" r="3.5" fill="white" />
        <rect x="32" y="37" width="17" height="5" rx="2" fill="#0097A7" />
      </svg>
      <span className="hidden text-sm font-bold tracking-wide text-nuit dark:text-white sm:block"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
        GESTIONPARK
      </span>
    </Link>
  );
}

export function AppNav({ nombreUrgentes = 0 }: { nombreUrgentes?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
      <Logo />
      {ONGLETS.map((onglet) => {
        const actif =
          onglet.href === "/"
            ? pathname === "/"
            : pathname === onglet.href || pathname.startsWith(`${onglet.href}/`);
        return (
          <Link
            key={onglet.href}
            href={onglet.href}
            className={`border-b-2 px-2 py-3 text-sm font-medium transition-colors ${
              actif
                ? "border-brand text-brand dark:border-canard dark:text-canard"
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
