"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function DemoModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <span aria-hidden="true">▶</span>
        Voir la démo (1 min)
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          aria-hidden="true"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Démo GestionPark"
            tabIndex={-1}
            className="relative w-full max-w-4xl outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute -top-9 right-0 min-h-[44px] min-w-[44px] text-sm font-medium text-white/70 hover:text-white"
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
