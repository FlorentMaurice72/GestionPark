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
    const demoDone = !!localStorage.getItem(demoCle);
    if (demoDone) {
      startTourIfNeeded(isDemo, isNouveauCompte);
    }
  }, [isDemo, isNouveauCompte]);

  return null;
}
