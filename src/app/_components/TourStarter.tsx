"use client";

import { useEffect } from "react";
import { startTourIfNeeded } from "@/lib/tour/useTour";

interface Props {
  isDemo: boolean;
  isNouveauCompte: boolean;
}

export function TourStarter({ isDemo, isNouveauCompte }: Props) {
  useEffect(() => {
    startTourIfNeeded(isDemo, isNouveauCompte);
  }, [isDemo, isNouveauCompte]);

  return null;
}
