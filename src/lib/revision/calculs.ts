import { getIndiceAvantDate, type IndiceType, type PointIndice } from "./indices";

export interface ResultatRevision {
  loyerActuel: number;
  loyerRevise: number;
  variation: number; // en %
  indiceNouveau: PointIndice;
  indiceAncien: PointIndice;
}

// Révision annuelle : loyer_révisé = loyer × (index_T / index_T-1an)
// T = dernier indice publié avant la date de révision
// T-1an = même trimestre un an avant
export function calculerRevision(
  loyerActuel: number,
  typeIndice: IndiceType,
  dateRevision: Date,
): ResultatRevision | null {
  const indiceNouv = getIndiceAvantDate(typeIndice, dateRevision);
  if (!indiceNouv) return null;

  const dateRef = new Date(dateRevision);
  dateRef.setFullYear(dateRef.getFullYear() - 1);
  const indiceAnc = getIndiceAvantDate(typeIndice, dateRef);
  if (!indiceAnc) return null;

  // Avoid revision if indices are the same quarter (would give 0% change)
  if (indiceNouv.annee === indiceAnc.annee && indiceNouv.trimestre === indiceAnc.trimestre) {
    return null;
  }

  const ratio = indiceNouv.valeur / indiceAnc.valeur;
  const loyerRevise = Math.round(loyerActuel * ratio * 100) / 100;
  const variation = (ratio - 1) * 100;

  return {
    loyerActuel,
    loyerRevise,
    variation,
    indiceNouveau: indiceNouv,
    indiceAncien: indiceAnc,
  };
}
