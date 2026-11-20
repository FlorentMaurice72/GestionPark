"use client";

import { useEffect } from "react";
import { startTourIfNeeded, getTourStep, setTourStep, type TourStep } from "@/lib/tour/useTour";

interface Props {
  isDemo: boolean;
  isNouveauCompte: boolean;
  // R6: server-persisted step for cross-device resume
  serverStep?: TourStep | null;
}

// Only starts the spotlight tour if DemoTour was already dismissed (edge case:
// user cleared localStorage or first saw DemoTour before this feature shipped).
// For fresh sessions, DemoTour.fermer() calls startTourIfNeeded directly.
export function TourStarter({ isDemo, isNouveauCompte, serverStep }: Props) {
  useEffect(() => {
    if (!isDemo && !isNouveauCompte) return;

    // R6: if localStorage is empty but server has an in-progress step, restore it
    if (!isDemo && serverStep && serverStep !== "done" && !getTourStep()) {
      setTourStep(serverStep);
      window.dispatchEvent(new Event("gp-tour-ready"));
      return;
    }

    const demoCle = isDemo ? "demo-tour-vu" : "onboarding-tour-vu";
    // Demo uses sessionStorage (each new session shows DemoTour), real accounts use localStorage
    const storage = isDemo ? sessionStorage : localStorage;
    const demoDone = !!storage.getItem(demoCle);
    if (demoDone) {
      // DemoTour already dismissed this session → start spotlight now
      startTourIfNeeded(isDemo, isNouveauCompte);
    }
    // If DemoTour not dismissed yet, DemoTour.fermer() will call startTourIfNeeded
  }, [isDemo, isNouveauCompte, serverStep]);

  return null;
}
