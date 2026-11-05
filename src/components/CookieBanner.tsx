"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "gp-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      if (!val) setVisible(true);
    } catch {
      /* localStorage bloqué (mode privé) — ne pas afficher */
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    window.dispatchEvent(new CustomEvent("gp-cookie-consent", { detail: "accepted" }));
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white px-4 py-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm text-neutral-600 dark:text-neutral-400">
          Ce site utilise des cookies pour le support (Crisp) et l&apos;analyse du trafic.{" "}
          <Link href="/confidentialite" className="underline hover:text-neutral-900 dark:hover:text-neutral-100">
            En savoir plus
          </Link>
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            onClick={decline}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
