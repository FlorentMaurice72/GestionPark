import type { Etape } from "./types";

const ETAPES: { id: Etape; label: string }[] = [
  { id: "selection", label: "Sélection fichier" },
  { id: "traitement", label: "Traitement" },
  { id: "verification", label: "Vérification" },
  { id: "import", label: "Import" },
  { id: "termine", label: "Terminé" },
];

export function StepIndicator({ etapeActuelle }: { etapeActuelle: Etape }) {
  const indexActuel = ETAPES.findIndex((e) => e.id === etapeActuelle);

  return (
    <ol className="mb-6 flex flex-wrap items-center gap-2 text-sm">
      {ETAPES.map((etape, index) => {
        const estActuelle = index === indexActuel;
        const estPassee = index < indexActuel;
        return (
          <li key={etape.id} className="flex items-center gap-2">
            {index > 0 && <span className="text-neutral-300 dark:text-neutral-700">→</span>}
            <span
              className={
                estActuelle
                  ? "font-semibold text-neutral-900 dark:text-neutral-100"
                  : estPassee
                    ? "text-neutral-500"
                    : "text-neutral-300 dark:text-neutral-700"
              }
            >
              {index + 1}. {etape.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
