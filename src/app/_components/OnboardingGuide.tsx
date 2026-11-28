"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  OnboardingRocket,
  OnboardingIconBien,
  OnboardingIconLocataire,
  OnboardingIconImport,
} from "@/components/MenuIcons";

interface Props {
  biensDone: boolean;
  locatairesDone: boolean;
  paiementDone: boolean;
}

const ETAPES: { icone: React.ReactNode; titre: string; desc: string; href: string; cta: string }[] = [
  {
    icone: <OnboardingIconBien className="h-4 w-4" />,
    titre: "Ajoutez votre premier bien",
    desc: "Renseignez l'adresse et les boxs qui le composent.",
    href: "/biens/nouveau",
    cta: "Ajouter un bien",
  },
  {
    icone: <OnboardingIconLocataire className="h-4 w-4" />,
    titre: "Créez votre premier locataire",
    desc: "Coordonnées, box attribué, loyer et date d'entrée.",
    href: "/locataires/nouveau",
    cta: "Ajouter un locataire",
  },
  {
    icone: <OnboardingIconImport className="h-4 w-4" />,
    titre: "Importez vos relevés bancaires",
    desc: "GestionPark rapproche automatiquement les paiements.",
    href: "/loyers/import",
    cta: "Importer un relevé",
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

  const pct = Math.round((completedCount / 3) * 100);

  return (
    <div
      className="rounded-xl border bg-white p-5 dark:bg-neutral-900"
      style={{ borderColor: "#0047AB22" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full overflow-hidden"
            style={{ backgroundColor: "#EFF6FF" }}
          >
            <OnboardingRocket className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Bienvenue sur GestionPark !
            </h2>
            <p className="text-xs text-neutral-500">
              {completedCount === 0
                ? "3 étapes pour démarrer"
                : `${completedCount} étape${completedCount > 1 ? "s" : ""} sur 3 complétée${completedCount > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 rounded-md px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Passer
        </button>
      </div>

      {/* Barre de progression */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex-1 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: "#0047AB" }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums" style={{ color: "#0047AB" }}>
          {pct}%
        </span>
      </div>

      {/* Étapes */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {ETAPES.map((e, i) => (
          <div
            key={i}
            className={`flex flex-1 flex-col rounded-xl border p-4 transition-all ${
              done[i]
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
                : i === completedCount
                ? "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/10"
                : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done[i]
                    ? "bg-green-500 text-white"
                    : i === completedCount
                    ? "text-white"
                    : "bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                }`}
                style={!done[i] && i === completedCount ? { backgroundColor: "#0047AB" } : {}}
              >
                {done[i] ? "✓" : e.icone}
              </span>
              <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 leading-tight">
                {e.titre}
              </p>
            </div>
            <p className="mb-3 flex-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {e.desc}
            </p>
            {done[i] ? (
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Terminé ✓</span>
            ) : (
              <Link
                href={e.href}
                className="rounded-lg px-3 py-2 text-center text-xs font-medium transition-opacity hover:opacity-90"
                style={
                  i === completedCount
                    ? { backgroundColor: "#0047AB", color: "#fff" }
                    : { backgroundColor: "#F1F5F9", color: "#64748B" }
                }
              >
                {e.cta} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
