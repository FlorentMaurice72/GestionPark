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

const TABS_BOTTOM = [
  { href: "/",           label: "Accueil" },
  { href: "/loyers",     label: "Loyers" },
  { href: "/biens",      label: "Biens" },
  { href: "/locataires", label: "Locataires" },
];

const PLUS_ITEMS = [
  { href: "/alertes",  label: "🔔 Alertes" },
  { href: "/finances", label: "📊 Finances" },
  { href: "/guide",    label: "📖 Guide" },
  { href: "/profil",   label: "⚙️ Mon compte" },
];

// ── SVG icons ────────────────────────────────────────────────────────────────

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconMoney({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function IconPeople({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

// ── Shared Logo ───────────────────────────────────────────────────────────────

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

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
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

          <div className="py-1">
            <MenuItem href="/profil?onglet=compte"       icon="⚙️" label="Paramètres du compte" onClick={() => setOpen(false)} />
            <MenuItem href="/profil?onglet=compte"       icon="🏢" label="Ma structure"          onClick={() => setOpen(false)} />
            <MenuItem href="/profil?onglet=facturation"  icon="💳" label="Abonnement"            onClick={() => setOpen(false)} />
          </div>

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

// ── Mobile "Plus" drawer ──────────────────────────────────────────────────────

function MobilePlusDrawer({
  open,
  onClose,
  signOutForm,
}: {
  open: boolean;
  onClose: () => void;
  signOutForm?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed bottom-16 left-0 right-0 z-50 rounded-t-2xl border-t border-neutral-200 bg-white pb-safe dark:border-neutral-700 dark:bg-neutral-900 md:hidden">
        <div className="flex flex-col py-2">
          {PLUS_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center px-5 py-3.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              {item.label}
            </Link>
          ))}
          <div className="mx-5 mt-1 border-t border-neutral-100 pt-1 dark:border-neutral-800">
            <div onClick={onClose}>{signOutForm}</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AppNav({
  nombreUrgentes = 0,
  nombreImpayesMois = 0,
  userEmail = "",
  signOutForm,
}: {
  nombreUrgentes?: number;
  nombreImpayesMois?: number;
  userEmail?: string;
  signOutForm?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [plusOpen, setPlusOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const plusIsActive = PLUS_ITEMS.some((item) => isActive(item.href));

  return (
    <>
      {/* ── Desktop top nav ── */}
      <nav className="flex items-center gap-1 border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
        <Logo />
        <div className="hidden flex-1 items-center gap-1 overflow-x-auto md:flex">
          {ONGLETS.map((onglet) => {
            const actif = isActive(onglet.href);
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
                {onglet.href === "/loyers" && nombreImpayesMois > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                    {nombreImpayesMois > 99 ? "99+" : nombreImpayesMois}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User menu — visible on all screen sizes */}
        {signOutForm !== undefined && (
          <UserMenu userEmail={userEmail} signOutForm={signOutForm} />
        )}
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {TABS_BOTTOM.map((tab) => {
          const actif = isActive(tab.href);
          const Icon =
            tab.href === "/" ? IconHome :
            tab.href === "/loyers" ? IconMoney :
            tab.href === "/biens" ? IconBuilding :
            IconPeople;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                actif
                  ? "text-brand dark:text-canard"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
              {tab.href === "/loyers" && nombreImpayesMois > 0 && (
                <span className="absolute right-[calc(50%-16px)] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                  {nombreImpayesMois > 9 ? "9+" : nombreImpayesMois}
                </span>
              )}
            </Link>
          );
        })}

        {/* Plus button */}
        <button
          onClick={() => setPlusOpen((v) => !v)}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
            plusIsActive || plusOpen
              ? "text-brand dark:text-canard"
              : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          }`}
        >
          <IconGrid className="h-5 w-5" />
          Plus
          {nombreUrgentes > 0 && (
            <span className="absolute right-[calc(10%-8px)] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
              {nombreUrgentes > 9 ? "9+" : nombreUrgentes}
            </span>
          )}
        </button>
      </nav>

      {/* Plus drawer */}
      <MobilePlusDrawer
        open={plusOpen}
        onClose={() => setPlusOpen(false)}
        signOutForm={signOutForm}
      />

      {/* Spacer so page content isn't hidden behind fixed bottom nav on mobile */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
