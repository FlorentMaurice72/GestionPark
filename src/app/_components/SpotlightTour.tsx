"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getTourStep, advanceTour, dismissTour, type TourStep } from "@/lib/tour/useTour";

type StepDef = {
  tourStep: TourStep;
  selector: string;
  title: string;
  desc: string;
  nextLabel: string;
};

const STEPS_BY_PATH: Record<string, StepDef> = {
  "/": {
    tourStep: "nav-biens",
    selector: "[data-tour='nav-biens']",
    title: "Créez votre premier bien",
    desc: "Commençons par déclarer votre entrepôt ou parking. Cliquez sur <strong>Mes biens immobiliers</strong> dans la barre de navigation.",
    nextLabel: "Aller aux biens →",
  },
  "/biens": {
    tourStep: "btn-ajouter-bien",
    selector: "[data-tour='ajouter-bien']",
    title: "Ajoutez votre premier bien",
    desc: "Cliquez sur <strong>+ Ajouter</strong> pour renseigner le nom, le type et l'adresse de votre bien.",
    nextLabel: "Créer un bien →",
  },
  "/biens/nouveau": {
    tourStep: "form-nouveau-bien",
    selector: "[data-tour='nouveau-bien-form']",
    title: "Remplissez les informations",
    desc: "Renseignez les informations de votre bien. Cliquez ensuite sur <strong>Créer le bien</strong> pour continuer — les boxs s'ajoutent à l'étape suivante.",
    nextLabel: "J'ai compris",
  },
  "/locataires": {
    tourStep: "btn-ajouter-loc",
    selector: "[data-tour='ajouter-locataire']",
    title: "Dernière étape : votre locataire",
    desc: "Renseignez les coordonnées de votre locataire et attribuez-lui un box. Le bail est généré automatiquement.",
    nextLabel: "C'est parti →",
  },
};

const BIENID_STEP: StepDef = {
  tourStep: "btn-ajouter-box",
  selector: "[data-tour='ajouter-boxes']",
  title: "Ajoutez les boxs",
  desc: "Votre bien est créé ! Ajoutez maintenant les boxs qui le composent : numéro, superficie et loyer mensuel.",
  nextLabel: "Ajouter des boxs →",
};

const ALL_STEPS: TourStep[] = [
  "nav-biens",
  "btn-ajouter-bien",
  "form-nouveau-bien",
  "btn-ajouter-box",
  "btn-ajouter-loc",
];

export function SpotlightTour() {
  const pathname = usePathname();
  const router = useRouter();
  const driverRef = useRef<{ destroy: () => void } | null>(null);
  const [tourRevision, setTourRevision] = useState(0);

  // Re-trigger when startTourIfNeeded() fires the custom event
  useEffect(() => {
    function onReady() {
      setTourRevision((r) => r + 1);
    }
    window.addEventListener("gp-tour-ready", onReady);
    return () => window.removeEventListener("gp-tour-ready", onReady);
  }, []);

  useEffect(() => {
    const currentStep = getTourStep();
    if (!currentStep || currentStep === "done") return;

    const isBienId = /^\/biens\/\d+$/.test(pathname);
    const stepDef = isBienId ? BIENID_STEP : STEPS_BY_PATH[pathname];

    if (!stepDef || stepDef.tourStep !== currentStep) return;

    let cancelled = false;
    const stepIndex = ALL_STEPS.indexOf(currentStep);
    const total = ALL_STEPS.length;

    async function run() {
      const { driver } = await import("driver.js");
      if (cancelled) return;

      driverRef.current?.destroy();

      // Build progress dots HTML
      const dotsHtml = ALL_STEPS.map((_, i) => {
        if (i === stepIndex) return `<div class="gp-dot gp-dot-active"></div>`;
        if (i < stepIndex) return `<div class="gp-dot gp-dot-done"></div>`;
        return `<div class="gp-dot"></div>`;
      }).join("");

      const d = driver({
        overlayColor: "rgba(10, 20, 50, 0.72)",
        animate: true,
        allowClose: false,
        allowKeyboardControl: false,
        disableActiveInteraction: false,
        popoverClass: "gp-tour-popover",
        onPopoverRender: (popover) => {
          // Progress bar above title
          const bar = document.createElement("div");
          bar.className = "gp-tour-bar";
          bar.innerHTML = `<div class="gp-dots">${dotsHtml}</div><span class="gp-step-count">${stepIndex + 1} / ${total}</span>`;
          (popover as unknown as { wrapper: HTMLElement }).wrapper.insertBefore(
            bar,
            (popover as unknown as { title: HTMLElement }).title,
          );

          // Dismiss link at the bottom
          const dismiss = document.createElement("button");
          dismiss.className = "gp-tour-skip";
          dismiss.textContent = "Passer la visite guidée";
          dismiss.onclick = () => {
            dismissTour();
            d.destroy();
          };
          (popover as unknown as { wrapper: HTMLElement }).wrapper.appendChild(dismiss);
        },
      });

      d.highlight({
        element: stepDef!.selector,
        popover: {
          title: stepDef!.title,
          description: stepDef!.desc,
          showButtons: ["next", "close"],
          nextBtnText: stepDef!.nextLabel,
          onNextClick: () => {
            advanceTour();
            d.destroy();
            const next = getTourStep();
            if (next === "btn-ajouter-bien") router.push("/biens");
            else if (next === "btn-ajouter-loc") router.push("/locataires");
            // btn-ajouter-box: user submits the form → creerBien redirects to /biens/[id]
          },
          onCloseClick: () => {
            dismissTour();
            d.destroy();
          },
        },
      });

      driverRef.current = d;
    }

    const timer = setTimeout(run, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      driverRef.current?.destroy();
    };
  // tourRevision triggers a re-run when startTourIfNeeded() fires gp-tour-ready
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, tourRevision]);

  return null;
}
