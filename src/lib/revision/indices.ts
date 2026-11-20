// Indices de révision des loyers — source INSEE
// IRL : Indice de Référence des Loyers (série 001515333)
// ICC : Indice du Coût de la Construction (série 000008630)
// À mettre à jour chaque trimestre sur : https://www.insee.fr/fr/statistiques/series

export type Trimestre = 1 | 2 | 3 | 4;
export type IndiceType = "IRL" | "ICC";

export interface PointIndice {
  annee: number;
  trimestre: Trimestre;
  valeur: number;
}

export const INDICES_IRL: PointIndice[] = [
  { annee: 2022, trimestre: 1, valeur: 133.93 },
  { annee: 2022, trimestre: 2, valeur: 135.84 },
  { annee: 2022, trimestre: 3, valeur: 136.27 },
  { annee: 2022, trimestre: 4, valeur: 137.26 },
  { annee: 2023, trimestre: 1, valeur: 138.61 },
  { annee: 2023, trimestre: 2, valeur: 140.59 },
  { annee: 2023, trimestre: 3, valeur: 141.03 },
  { annee: 2023, trimestre: 4, valeur: 142.06 },
  { annee: 2024, trimestre: 1, valeur: 143.46 },
  { annee: 2024, trimestre: 2, valeur: 145.17 },
  { annee: 2024, trimestre: 3, valeur: 144.51 },
  { annee: 2024, trimestre: 4, valeur: 144.64 },
  { annee: 2025, trimestre: 1, valeur: 145.47 },
  { annee: 2025, trimestre: 2, valeur: 146.68 },
  { annee: 2025, trimestre: 3, valeur: 145.77 },
  { annee: 2025, trimestre: 4, valeur: 145.78 },
  { annee: 2026, trimestre: 1, valeur: 146.60 },
  { annee: 2026, trimestre: 2, valeur: 148.37 },
  { annee: 2026, trimestre: 3, valeur: 148.06 },
];

export const INDICES_ICC: PointIndice[] = [
  { annee: 2022, trimestre: 1, valeur: 1948 },
  { annee: 2022, trimestre: 2, valeur: 1966 },
  { annee: 2022, trimestre: 3, valeur: 2037 },
  { annee: 2022, trimestre: 4, valeur: 2052 },
  { annee: 2023, trimestre: 1, valeur: 2077 },
  { annee: 2023, trimestre: 2, valeur: 2123 },
  { annee: 2023, trimestre: 3, valeur: 2106 },
  { annee: 2023, trimestre: 4, valeur: 2162 },
  { annee: 2024, trimestre: 1, valeur: 2227 },
  { annee: 2024, trimestre: 2, valeur: 2205 },
  { annee: 2024, trimestre: 3, valeur: 2143 },
  { annee: 2024, trimestre: 4, valeur: 2108 },
  { annee: 2025, trimestre: 1, valeur: 2146 },
  { annee: 2025, trimestre: 2, valeur: 2086 },
  { annee: 2025, trimestre: 3, valeur: 2056 },
  { annee: 2025, trimestre: 4, valeur: 2058 },
  { annee: 2026, trimestre: 1, valeur: 2084 },
  { annee: 2026, trimestre: 2, valeur: 2103 },
];

function trimestreDuMois(mois: number): Trimestre {
  return Math.ceil(mois / 3) as Trimestre;
}

// Returns the latest published index on or before the given date
export function getIndiceAvantDate(type: IndiceType, date: Date): PointIndice | null {
  const table = type === "IRL" ? INDICES_IRL : INDICES_ICC;
  const annee = date.getFullYear();
  const trimestre = trimestreDuMois(date.getMonth() + 1);

  for (let i = table.length - 1; i >= 0; i--) {
    const p = table[i];
    if (p.annee < annee || (p.annee === annee && p.trimestre <= trimestre)) {
      return p;
    }
  }
  return null;
}

export function getDernierIndice(type: IndiceType): PointIndice | null {
  const table = type === "IRL" ? INDICES_IRL : INDICES_ICC;
  return table[table.length - 1] ?? null;
}

export function labelTrimestre(point: PointIndice): string {
  return `T${point.trimestre} ${point.annee}`;
}
