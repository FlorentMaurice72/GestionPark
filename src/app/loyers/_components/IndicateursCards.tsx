import type { Indicateurs } from "@/lib/loyers/data";
import { formaterMontant, formaterPourcentage } from "@/lib/format";

export function IndicateursCards({ indicateurs }: { indicateurs: Indicateurs }) {
  const cartes = [
    { label: "Encaissé", valeur: formaterMontant(indicateurs.encaisse) },
    { label: "Attendu", valeur: formaterMontant(indicateurs.attendu) },
    { label: "Taux de recouvrement", valeur: formaterPourcentage(indicateurs.tauxRecouvrement) },
    {
      label: "Impayés",
      valeur: String(indicateurs.nombreImpayes),
      accent: indicateurs.nombreImpayes > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cartes.map((carte) => (
        <div
          key={carte.label}
          className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p className="text-xs font-medium text-neutral-500">{carte.label}</p>
          <p
            className={`mt-1 text-2xl font-semibold ${
              carte.accent ? "text-red-600 dark:text-red-400" : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {carte.valeur}
          </p>
        </div>
      ))}
    </div>
  );
}
