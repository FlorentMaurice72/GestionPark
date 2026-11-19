"use client";

export type TourStep =
  | "nav-biens"
  | "btn-ajouter-bien"
  | "form-nouveau-bien"
  | "btn-ajouter-box"
  | "btn-ajouter-loc"
  | "done";

const ORDRE: TourStep[] = [
  "nav-biens",
  "btn-ajouter-bien",
  "form-nouveau-bien",
  "btn-ajouter-box",
  "btn-ajouter-loc",
  "done",
];

const CLE = "spotlight-tour-step";

export function getTourStep(): TourStep | null {
  if (typeof window === "undefined") return null;
  try {
    return (localStorage.getItem(CLE) as TourStep) ?? null;
  } catch {
    return null;
  }
}

export function setTourStep(step: TourStep) {
  try {
    localStorage.setItem(CLE, step);
  } catch {}
}

export function advanceTour() {
  const current = getTourStep();
  if (!current) return;
  const idx = ORDRE.indexOf(current);
  if (idx < ORDRE.length - 1) {
    setTourStep(ORDRE[idx + 1]);
  }
}

export function dismissTour() {
  setTourStep("done");
}

export function startTourIfNeeded(isDemo: boolean, isNouveauCompte: boolean) {
  if (typeof window === "undefined") return;

  if (isDemo) {
    // Demo account is shared between visitors — always restart from the beginning
    setTourStep("nav-biens");
    window.dispatchEvent(new Event("gp-tour-ready"));
    return;
  }

  const current = getTourStep();
  if (current) return; // real account: don't restart once started/done

  if (isNouveauCompte) {
    setTourStep("nav-biens");
    window.dispatchEvent(new Event("gp-tour-ready"));
  }
}
