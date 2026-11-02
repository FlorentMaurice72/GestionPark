"use client";

import { useOptimistic, useTransition } from "react";
import { modifierAutomatisationsLocation } from "@/lib/locataires/actions";

interface AutomatisationState {
  renouvellementAuto: boolean;
  relanceActive: boolean;
  avisLoyerAuto: boolean;
  quittanceAuto: boolean;
}

interface Props extends AutomatisationState {
  locationId: number;
  locataireId: number;
}

const TOGGLES: { key: keyof AutomatisationState; label: string; desc: string }[] = [
  { key: "avisLoyerAuto",      label: "Avis de loyer",         desc: "Envoi automatique d'un avis chaque mois" },
  { key: "quittanceAuto",      label: "Quittance automatique", desc: "Génère une quittance à chaque paiement" },
  { key: "relanceActive",      label: "Relances impayés",      desc: "Relance automatique en cas d'impayé" },
  { key: "renouvellementAuto", label: "Renouvellement auto",   desc: "Le bail se renouvelle à l'échéance" },
];

export function AutomatisationToggles({ locationId, locataireId, ...initial }: Props) {
  const [isPending, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic<AutomatisationState>(initial);

  function toggle(key: keyof AutomatisationState) {
    const next = { ...state, [key]: !state[key] };
    startTransition(async () => {
      setOptimistic(next);
      const fd = new FormData();
      fd.set("locationId", String(locationId));
      fd.set("locataireId", String(locataireId));
      Object.entries(next).forEach(([k, v]) => fd.set(k, String(v)));
      await modifierAutomatisationsLocation({ success: false }, fd);
    });
  }

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        Automatisations
        {isPending && <span className="ml-2 text-xs font-normal text-neutral-400">Enregistrement…</span>}
      </h2>
      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {TOGGLES.map((item, i) => (
          <div
            key={item.key}
            className={`flex items-center justify-between px-4 py-3 ${
              i < TOGGLES.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.label}</p>
              <p className="text-xs text-neutral-500">{item.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state[item.key]}
              onClick={() => toggle(item.key)}
              disabled={isPending}
              className={`relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:opacity-60 focus:outline-none ${
                state[item.key]
                  ? "bg-neutral-900 dark:bg-neutral-100"
                  : "bg-neutral-300 dark:bg-neutral-600"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-neutral-900 ${
                  state[item.key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
