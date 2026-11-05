"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  biensDone: boolean;
  locatairesDone: boolean;
  paiementDone: boolean;
}

const ETAPES = [
  {
    titre: "Ajoutez votre premier bien",
    desc: "Renseignez l'adresse, le type (garage, box, entrepôt…) et les boxs qui le composent.",
    href: "/biens/nouveau",
    cta: "Ajouter un bien →",
  },
  {
    titre: "Créez votre premier locataire",
    desc: "Saisissez ses coordonnées, choisissez le box, définissez le loyer et la date d'entrée.",
    href: "/locataires/nouveau",
    cta: "Ajouter un locataire →",
  },
  {
    titre: "Importez vos relevés bancaires",
    desc: "Glissez votre CSV bancaire pour que GestionPark rapproche automatiquement les paiements reçus.",
    href: "/loyers/import",
    cta: "Importer un relevé →",
  },
];

export function OnboardingGuide({ biensDone, locatairesDone, paiementDone }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem("onboarding-dismissed") === "1") setDismissed(true);
    } catch {}
  }, []);

  const done = [biensDone, locatairesDone, paiementDone];
  const completedCount = done.filter(Boolean).length;
  const allDone = completedCount === 3;

  if (!mounted || dismissed || allDone) return null;

  function dismiss() {
    try { localStorage.setItem("onboarding-dismissed", "1"); } catch {}
    setDismissed(true);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Premiers pas</h2>
          <p className="text-xs text-neutral-500">{completedCount} sur 3 étapes complétées</p>
        </div>
        <button
          onClick={dismiss}
          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          Passer pour l&apos;instant
        </button>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / 3) * 100}%`, backgroundColor: "#0047AB" }}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {ETAPES.map((e, i) => (
          <div
            key={i}
            className={`flex flex-1 flex-col rounded-lg border p-4 ${
              done[i]
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
                : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done[i]
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                }`}
              >
                {done[i] ? "✓" : i + 1}
              </span>
              <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{e.titre}</p>
            </div>
            <p className="mb-3 flex-1 text-xs text-neutral-500 dark:text-neutral-400">{e.desc}</p>
            {done[i] ? (
              <span className="text-xs text-green-600 dark:text-green-400">Terminé ✓</span>
            ) : (
              <Link
                href={e.href}
                className="rounded-md px-3 py-2 text-center text-xs font-medium text-white hover:opacity-90"
                style={{ backgroundColor: "#0047AB" }}
              >
                {e.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
