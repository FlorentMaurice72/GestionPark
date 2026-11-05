"use client";

import { useState, useEffect } from "react";

export function DemoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <span>▶</span>
        Voir la démo (1 min)
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-9 right-0 text-sm font-medium text-white/70 hover:text-white"
            >
              ✕ Fermer
            </button>
            <iframe
              src="/videos/anim-marketing.html"
              className="aspect-video w-full rounded-xl border-0 shadow-2xl"
              allow="autoplay"
              title="Démo GestionPark"
            />
            <p className="mt-2 text-center text-xs text-white/40">
              L&apos;animation ne s&apos;affiche pas ?{" "}
              <a
                href="/videos/anim-marketing.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/70"
              >
                Ouvrir en plein écran
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
