"use client";

import { useEffect } from "react";
import { startTourIfNeeded } from "@/lib/tour/useTour";

interface Props {
  isDemo: boolean;
  isNouveauCompte: boolean;
}

// Only starts the spotlight tour if DemoTour was already dismissed (edge case:
// user cleared localStorage or first saw DemoTour before this feature shipped).
// For fresh sessions, DemoTour.fermer() calls startTourIfNeeded directly.
export function TourStarter({ isDemo, isNouveauCompte }: Props) {
  useEffect(() => {
    if (!isDemo && !isNouveauCompte) return;
    const demoCle = isDemo ? "demo-tour-vu" : "onboarding-tour-vu";
    // Demo uses sessionStorage (each new session shows DemoTour), real accounts use localStorage
    const storage = isDemo ? sessionStorage : localStorage;
    const demoDone = !!storage.getItem(demoCle);
    if (demoDone) {
      // DemoTour already dismissed this session → start spotlight now
      startTourIfNeeded(isDemo, isNouveauCompte);
    }
    // If DemoTour not dismissed yet, DemoTour.fermer() will call startTourIfNeeded
  }, [isDemo, isNouveauCompte]);

  return null;
}
