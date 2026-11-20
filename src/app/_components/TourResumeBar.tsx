"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTourStep, TOUR_STEPS, type TourStep } from "@/lib/tour/useTour";

const STEP_LABELS: Record<TourStep, string> = {
  "nav-biens":        "Créez votre premier bien",
  "btn-ajouter-bien": "Ajoutez votre premier bien",
  "form-nouveau-bien":"Remplissez les informations du bien",
  "btn-ajouter-box":  "Ajoutez les boxs",
  "btn-ajouter-loc":  "Ajoutez votre premier locataire",
  "btn-faire-signer": "Faites signer le bail",
  "btn-importer-csv": "Importez votre relevé bancaire",
  "done":             "",
};

// Best route to send the user to for each step
const RESUME_ROUTES: Record<TourStep, string> = {
  "nav-biens":        "/",
  "btn-ajouter-bien": "/biens",
  "form-nouveau-bien":"/biens/nouveau",
  "btn-ajouter-box":  "/biens",        // list → user opens their bien
  "btn-ajouter-loc":  "/locataires",
  "btn-faire-signer": "/locataires",   // list → user opens their locataire
  "btn-importer-csv": "/loyers/import",
  "done":             "/",
};

export function TourResumeBar() {
  const router = useRouter();
  const [step, setStep] = useState<TourStep | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const current = getTourStep();
    if (current && current !== "done") setStep(current);
  }, []);

  if (!step || step === "done" || dismissed) return null;

  const stepIndex = TOUR_STEPS.indexOf(step);
  const label = STEP_LABELS[step];

  function reprendre() {
    if (!step) return;
    router.push(RESUME_ROUTES[step]);
    // Let SpotlightTour pick up after navigation via gp-tour-ready
    setTimeout(() => window.dispatchEvent(new Event("gp-tour-ready")), 300);
    setDismissed(true);
  }

  return (
    <div
      className="flex items-center justify-between gap-3 border-b border-blue-200 bg-blue-50 px-4 py-2.5 text-sm dark:border-blue-900/40 dark:bg-blue-950/20"
      role="status"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex-shrink-0 text-base">🗺️</span>
        <span className="text-blue-800 dark:text-blue-300 truncate">
          <span className="font-semibold">Visite en cours</span>
          {label && <span className="hidden sm:inline text-blue-600 dark:text-blue-400"> — {label}</span>}
        </span>
        <span
          className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
          style={{ backgroundColor: "#0047AB" }}
        >
          {stepIndex + 1}/{TOUR_STEPS.length}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={reprendre}
          className="rounded-md px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0047AB" }}
        >
          Reprendre →
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="rounded p-1 text-blue-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40"
          aria-label="Fermer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M11.07 3.343a1 1 0 0 0-1.414-1.414L7 4.586 4.343 1.929a1 1 0 0 0-1.414 1.414L5.586 7 2.929 9.657a1 1 0 1 0 1.414 1.414L7 8.414l2.657 2.657a1 1 0 0 0 1.414-1.414L8.414 7l2.657-2.657Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
