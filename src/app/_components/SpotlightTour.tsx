"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getTourStep,
  advanceTour,
  dismissTour,
  type TourStep,
} from "@/lib/tour/useTour";

interface StepConfig {
  selector: string;
  titre: string;
  desc: string;
  position?: "top" | "bottom" | "left" | "right";
  btnLabel?: string;
  onNext?: () => void;
}

const STEPS_PAR_ROUTE: Record<string, { step: TourStep; config: StepConfig }> = {
  "/": {
    step: "nav-biens",
    config: {
      selector: 'a[href="/biens"]',
      titre: "Créez votre premier bien",
      desc: "Commençons par déclarer votre entrepôt ou parking. Cliquez sur « Mes biens immobiliers ».",
      position: "bottom",
      btnLabel: "Aller aux biens →",
    },
  },
  "/biens": {
    step: "btn-ajouter-bien",
    config: {
      selector: 'a[href="/biens/nouveau"]',
      titre: "Ajoutez votre premier bien",
      desc: "Cliquez sur « + Ajouter » pour renseigner l'adresse et le type de votre bien.",
      position: "bottom",
      btnLabel: "Créer un bien →",
    },
  },
  "/biens/nouveau": {
    step: "form-nouveau-bien",
    config: {
      selector: "form",
      titre: "Remplissez les informations",
      desc: "Donnez un nom à votre bien et renseignez l'adresse. Vous ajouterez les boxs juste après.",
      position: "right",
      btnLabel: "J'ai compris",
    },
  },
  "/locataires": {
    step: "btn-ajouter-loc",
    config: {
      selector: 'a[href="/locataires/nouveau"]',
      titre: "Créez votre premier locataire",
      desc: "Dernière étape ! Renseignez les coordonnées de votre locataire et attribuez-lui un box.",
      position: "bottom",
      btnLabel: "Ajouter un locataire →",
    },
  },
};

// Config pour /biens/[id] (route dynamique)
const STEP_BIEN_ID: StepConfig = {
  selector: "[data-tour='ajouter-boxes']",
  titre: "Ajoutez les boxs",
  desc: "Votre bien est créé ! Ajoutez maintenant les boxs qui le composent : numéro, superficie et loyer.",
  position: "bottom",
  btnLabel: "Ajouter des boxs →",
};

function isBienIdRoute(pathname: string) {
  return /^\/biens\/\d+$/.test(pathname);
}

export function SpotlightTour() {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const hide = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.display = "none";
    if (tooltipRef.current) tooltipRef.current.style.display = "none";
  }, []);

  const show = useCallback((el: Element, config: StepConfig, onNext: () => void) => {
    const overlay = overlayRef.current;
    const tooltip = tooltipRef.current;
    if (!overlay || !tooltip) return;

    const rect = el.getBoundingClientRect();
    const pad = 6;

    // Mettre à jour le clip-path de l'overlay pour découper l'élément
    overlay.style.display = "block";
    overlay.style.setProperty(
      "--x", `${rect.left - pad}px`
    );
    overlay.style.setProperty("--y", `${rect.top - pad}px`);
    overlay.style.setProperty("--w", `${rect.width + pad * 2}px`);
    overlay.style.setProperty("--h", `${rect.height + pad * 2}px`);

    // Positionner la tooltip
    tooltip.style.display = "block";
    const pos = config.position ?? "bottom";
    const tooltipW = 300;
    const margin = 14;

    let top = 0, left = 0;
    if (pos === "bottom") {
      top = rect.bottom + window.scrollY + margin;
      left = rect.left + window.scrollX + rect.width / 2 - tooltipW / 2;
    } else if (pos === "top") {
      top = rect.top + window.scrollY - margin - 10;
      left = rect.left + window.scrollX + rect.width / 2 - tooltipW / 2;
      tooltip.style.transform = "translateY(-100%)";
    } else if (pos === "right") {
      top = rect.top + window.scrollY;
      left = rect.right + window.scrollX + margin;
    } else {
      top = rect.top + window.scrollY;
      left = rect.left + window.scrollX - tooltipW - margin;
    }

    // Rester dans la fenêtre
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.transform = pos === "top" ? "translateY(-100%)" : "";

    // Remplir le contenu
    const titleEl = tooltip.querySelector<HTMLElement>(".st-title");
    const descEl = tooltip.querySelector<HTMLElement>(".st-desc");
    const btnEl = tooltip.querySelector<HTMLButtonElement>(".st-btn");
    if (titleEl) titleEl.textContent = config.titre;
    if (descEl) descEl.textContent = config.desc;
    if (btnEl) {
      btnEl.textContent = config.btnLabel ?? "Suivant →";
      btnEl.onclick = onNext;
    }

    // Scroll vers l'élément si nécessaire
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Mettre à jour la position si scroll
    function onScroll() {
      const r = el.getBoundingClientRect();
      overlay!.style.setProperty("--x", `${r.left - pad}px`);
      overlay!.style.setProperty("--y", `${r.top - pad}px`);
    }
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
  }, []);

  useEffect(() => {
    const step = getTourStep();
    if (!step || step === "done") { hide(); return; }

    // Trouver la config pour la route actuelle
    let config: StepConfig | null = null;
    let tourStep: TourStep | null = null;

    if (isBienIdRoute(pathname) && step === "btn-ajouter-box") {
      config = STEP_BIEN_ID;
      tourStep = "btn-ajouter-box";
    } else {
      const entry = STEPS_PAR_ROUTE[pathname];
      if (entry && entry.step === step) {
        config = entry.config;
        tourStep = entry.step;
      }
    }

    if (!config || !tourStep) { hide(); return; }

    // Attendre que l'élément soit dans le DOM
    let attempts = 0;
    function tryShow() {
      if (!config) return;
      const el = document.querySelector(config.selector);
      if (el) {
        show(el, config, () => {
          advanceTour();
          hide();
          // Navigation automatique si nécessaire
          const next = getTourStep();
          if (next === "btn-ajouter-bien") router.push("/biens");
          if (next === "btn-ajouter-loc") router.push("/locataires");
        });
      } else if (attempts < 20) {
        attempts++;
        rafRef.current = window.setTimeout(tryShow, 150);
      }
    }

    rafRef.current = window.setTimeout(tryShow, 400);
    return () => {
      clearTimeout(rafRef.current);
      hide();
    };
  }, [pathname, hide, show, router]);

  return (
    <>
      {/* Overlay avec découpe */}
      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden="true"
      >
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                className="tour-hole"
                x="var(--x, 0)"
                y="var(--y, 0)"
                width="var(--w, 0)"
                height="var(--h, 0)"
                rx="8"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(10,20,50,0.65)"
            mask="url(#tour-mask)"
          />
        </svg>
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{ display: "none", width: 300, zIndex: 9999 }}
        className="fixed rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
        role="dialog"
        aria-live="polite"
      >
        {/* Bordure colorée en haut */}
        <div className="h-1 w-full rounded-t-2xl" style={{ background: "linear-gradient(90deg, #0047AB, #0097A7)" }} />

        <div className="p-5">
          {/* Barre de progression + dismiss */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1">
              {(["nav-biens","btn-ajouter-bien","form-nouveau-bien","btn-ajouter-box","btn-ajouter-loc"] as TourStep[]).map((s) => {
                const current = getTourStep();
                const steps: TourStep[] = ["nav-biens","btn-ajouter-bien","form-nouveau-bien","btn-ajouter-box","btn-ajouter-loc"];
                const isDone = steps.indexOf(s) < steps.indexOf(current as TourStep);
                const isActive = s === current;
                return (
                  <div
                    key={s}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: isActive ? 20 : 8,
                      backgroundColor: isActive ? "#0047AB" : isDone ? "#0097A7" : "#E2E8F0",
                    }}
                  />
                );
              })}
            </div>
            <button
              className="rounded-md p-1 text-xs text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
              onClick={() => { dismissTour(); hide(); }}
              aria-label="Quitter la visite guidée"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.207 4.207a1 1 0 0 0-1.414-1.414L8 5.586 5.207 2.793a1 1 0 0 0-1.414 1.414L6.586 7l-2.793 2.793a1 1 0 1 0 1.414 1.414L8 8.414l2.793 2.793a1 1 0 0 0 1.414-1.414L9.414 7l2.793-2.793Z" />
              </svg>
            </button>
          </div>

          <p className="st-title mb-1.5 font-semibold text-neutral-900 dark:text-neutral-100" />
          <p className="st-desc mb-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400" />

          <button
            className="st-btn w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          />
        </div>
      </div>
    </>
  );
}
