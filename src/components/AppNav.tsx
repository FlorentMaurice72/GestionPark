"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const ONGLETS = [
  { href: "/",           label: "Dashboard" },
  { href: "/alertes",    label: "Alertes" },
  { href: "/loyers",     label: "Gestion locative" },
  { href: "/biens",      label: "Mes biens immobiliers" },
  { href: "/locataires", label: "Mes locataires" },
  { href: "/finances",   label: "Finances & Documents" },
  { href: "/guide",      label: "Guide" },
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
      <span
        className="hidden text-sm font-bold tracking-wide text-nuit dark:text-white sm:block"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        GESTIONPARK
      </span>
    </Link>
  );
}

function initiales(email: string) {
  const parts = email.split("@")[0]?.split(/[.\-_]/) ?? [];
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

function MenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      <span className="w-5 text-center text-base">{icon}</span>
      {label}
    </Link>
  );
}

function UserMenu({
  userEmail,
  signOutForm,
}: {
  userEmail: string;
  signOutForm: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const ini = initiales(userEmail);

  return (
    <div ref={ref} className="relative ml-2 flex-shrink-0">
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-neutral-200 py-1 pl-1 pr-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: "#0047AB" }}
        >
          {ini}
        </span>
        <span className="hidden sm:block">Mon compte</span>
        <svg
          className={`h-3 w-3 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12" fill="currentColor"
        >
          <path d="M6 8L1 3h10L6 8z" />
        </svg>
      </button>

      {/* Panneau déroulant */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">

          {/* En-tête */}
          <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: "#0047AB" }}
            >
              {ini}
            </span>
            <span className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {userEmail}
            </span>
          </div>

          {/* Groupe 1 — compte */}
          <div className="py-1">
            <MenuItem href="/profil?onglet=compte"       icon="⚙️" label="Paramètres du compte" onClick={() => setOpen(false)} />
            <MenuItem href="/profil?onglet=compte"       icon="🏢" label="Ma structure"          onClick={() => setOpen(false)} />
            <MenuItem href="/profil?onglet=facturation"  icon="💳" label="Abonnement"            onClick={() => setOpen(false)} />
          </div>

          {/* Groupe 2 — aide */}
          <div className="border-t border-neutral-100 py-1 dark:border-neutral-800">
            <MenuItem href="#" icon="🌐" label="Communauté" onClick={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                if (typeof window !== "undefined" && (window as any).$crisp) {
                  (window as any).$crisp.push(["do", "chat:open"]);
                }
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <span className="w-5 text-center text-base">💬</span>
              Faire une remontée
            </button>
          </div>

          {/* Groupe 3 — déconnexion */}
          <div className="border-t border-neutral-100 py-1 dark:border-neutral-800">
            <div onClick={() => setOpen(false)}>
              {signOutForm}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppNav({
  nombreUrgentes = 0,
  userEmail = "",
  signOutForm,
}: {
  nombreUrgentes?: number;
  userEmail?: string;
  signOutForm?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
      <Logo />
      <div className="flex flex-1 items-center gap-1 overflow-x-auto">
        {ONGLETS.map((onglet) => {
          const actif =
            onglet.href === "/"
              ? pathname === "/"
              : pathname === onglet.href || pathname.startsWith(`${onglet.href}/`);
          return (
            <Link
              key={onglet.href}
              href={onglet.href}
              className={`flex-shrink-0 border-b-2 px-2 py-3 text-sm font-medium transition-colors ${
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
      </div>

      {signOutForm !== undefined && (
        <UserMenu userEmail={userEmail} signOutForm={signOutForm} />
      )}
    </nav>
  );
}
