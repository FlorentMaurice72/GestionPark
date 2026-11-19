"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

// Étapes du tour — identifiants stables
export type TourStep =
  | "nav-biens"        // Dashboard : pointer le lien "Mes biens" dans la nav
  | "btn-ajouter-bien" // /biens : pointer "+ Ajouter"
  | "form-nouveau-bien"// /biens/nouveau : pointer le formulaire
  | "btn-ajouter-box"  // /biens/[id] : pointer le bouton "Ajouter des boxs"
  | "btn-ajouter-loc"  // /locataires : pointer "+ Ajouter"
  | "done";            // Tour terminé

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
  try { localStorage.setItem(CLE, step); } catch {}
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

// Démarrer le tour (appeler depuis page.tsx quand isDemo || isNouveauCompte)
export function startTourIfNeeded(isDemo: boolean, isNouveauCompte: boolean) {
  if (typeof window === "undefined") return;
  const current = getTourStep();
  if (current) return; // Déjà en cours ou terminé
  if (isDemo || isNouveauCompte) {
    setTourStep("nav-biens");
  }
}

// Hook à appeler dans chaque page qui participe au tour
export function useTourStep(step: TourStep) {
  const pathname = usePathname();
  const router = useRouter();

  const advance = useCallback(() => {
    advanceTour();
    // Naviguer automatiquement vers la prochaine page si besoin
    const next = ORDRE[ORDRE.indexOf(step) + 1] as TourStep | undefined;
    if (next === "btn-ajouter-bien") router.push("/biens");
    if (next === "btn-ajouter-loc") router.push("/locataires");
  }, [step, router]);

  useEffect(() => {
    // Avancer automatiquement quand l'utilisateur navigue vers la bonne page
    const current = getTourStep();
    if (step === "btn-ajouter-bien" && current === "btn-ajouter-bien" && pathname === "/biens") return;
    if (step === "form-nouveau-bien" && current === "form-nouveau-bien" && pathname.startsWith("/biens/nouveau")) return;
    if (step === "btn-ajouter-box" && current === "btn-ajouter-box" && pathname.match(/^\/biens\/\d+$/)) return;
    if (step === "btn-ajouter-loc" && current === "btn-ajouter-loc" && pathname === "/locataires") return;
  }, [pathname, step]);

  return { advance };
}
