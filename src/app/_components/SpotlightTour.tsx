"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getTourStep,
  advanceTour,
  dismissTour,
  TOUR_STEPS,
  TOUR_CONFIG,
} from "@/lib/tour/useTour";
import { saveOnboardingStep } from "@/lib/tour/actions";

// R7: STEPS_BY_PATH / BIENID_STEP / LOCATAIREID_STEP removed — now in TOUR_CONFIG

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

    // R7: Single lookup using centralized TOUR_CONFIG
    const stepCfg = TOUR_CONFIG.find((c) => {
      if (c.step !== currentStep) return false;
      return typeof c.path === "string"
        ? c.path === pathname
        : c.path.test(pathname);
    });

    if (!stepCfg) return;

    let cancelled = false;
    let activeObserver: MutationObserver | null = null;
    let activeTimer: ReturnType<typeof setTimeout> | null = null;

    const stepIndex = TOUR_STEPS.indexOf(currentStep);
    const total = TOUR_STEPS.length;

    async function run() {
      const { driver } = await import("driver.js");
      if (cancelled) return;

      // R8: MutationObserver-based element wait with 3s timeout
      const el = await new Promise<Element | null>((resolve) => {
        const immediate = document.querySelector(stepCfg!.selector);
        if (immediate) return resolve(immediate);

        activeTimer = setTimeout(() => {
          activeObserver?.disconnect();
          resolve(null);
        }, 3000);

        activeObserver = new MutationObserver(() => {
          const found = document.querySelector(stepCfg!.selector);
          if (found) {
            clearTimeout(activeTimer!);
            activeObserver?.disconnect();
            resolve(found);
          }
        });
        activeObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });

      if (!el || cancelled) {
        if (!cancelled) {
          advanceTour();
          window.dispatchEvent(new Event("gp-tour-ready"));
        }
        return;
      }

      driverRef.current?.destroy();

      // Build progress dots HTML
      const dotsHtml = TOUR_STEPS.map((_, i) => {
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
            // R6: persist to DB
            saveOnboardingStep("done").catch(() => {});
            d.destroy();
          };
          (popover as unknown as { wrapper: HTMLElement }).wrapper.appendChild(dismiss);
        },
      });

      d.highlight({
        element: stepCfg!.selector,
        popover: {
          title: stepCfg!.title,
          description: stepCfg!.desc,
          showButtons: ["next", "close"],
          nextBtnText: stepCfg!.nextLabel,
          onNextClick: () => {
            advanceTour();
            const nextStep = getTourStep();
            // R6: persist next step to DB (fire-and-forget)
            if (nextStep) saveOnboardingStep(nextStep).catch(() => {});
            d.destroy();
            // R7: autoNavigateTo from config instead of multi-if
            if (stepCfg!.autoNavigateTo) router.push(stepCfg!.autoNavigateTo);
            // btn-ajouter-box: user submits form → creerBien redirects to /biens/[id]
            // btn-faire-signer: user creates locataire → creerLocataire redirects to /locataires/[id]
          },
          onCloseClick: () => {
            dismissTour();
            // R6: persist to DB
            saveOnboardingStep("done").catch(() => {});
            d.destroy();
          },
        },
      });

      driverRef.current = d;
    }

    run();

    return () => {
      cancelled = true;
      if (activeTimer !== null) clearTimeout(activeTimer);
      activeObserver?.disconnect();
      driverRef.current?.destroy();
    };
  // tourRevision triggers a re-run when startTourIfNeeded() fires gp-tour-ready
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, tourRevision]);

  return null;
}
