// Calcul de l'état de paiement — fonctions pures, sans dépendance à Prisma.
//
// Rappel (audit réel) : il n'existe pas de champ etat_paiement stocké en
// base. L'état est toujours recalculé à la volée à partir de la somme des
// Paiement d'un mois donné, comparée à Location.loyer_actuel.

export type StatutPaiement = "impaye" | "impaye_partiel" | "paye" | "trop_percu";

export interface MoisAnnee {
  mois: number; // 1-12
  annee: number;
}

// Tolérance de comparaison : les montants transitent par Prisma.Decimal
// (Postgres NUMERIC, arithmétique exacte) puis sont convertis en `number`
// pour l'affichage/la comparaison. Cette tolérance absorbe l'imprécision de
// cette conversion flottante, pas une approximation métier.
const EPSILON = 0.005;

export function calculerStatutPaiement(sommeRecue: number, loyerActuel: number): StatutPaiement {
  if (sommeRecue <= EPSILON) return "impaye";
  if (sommeRecue < loyerActuel - EPSILON) return "impaye_partiel";
  if (sommeRecue <= loyerActuel + EPSILON) return "paye";
  return "trop_percu";
}

export function cleMois(annee: number, mois: number): string {
  return `${annee}-${mois}`;
}

// Liste les mois de [debut, finExclusive[, dans l'ordre chronologique.
export function genererMoisEntre(debut: MoisAnnee, finExclusive: MoisAnnee): MoisAnnee[] {
  const resultat: MoisAnnee[] = [];
  let mois = debut.mois;
  let annee = debut.annee;

  while (annee < finExclusive.annee || (annee === finExclusive.annee && mois < finExclusive.mois)) {
    resultat.push({ mois, annee });
    mois += 1;
    if (mois > 12) {
      mois = 1;
      annee += 1;
    }
  }

  return resultat;
}

// Nombre de mois passés (entre la date d'entrée de la Location active et le
// mois réel courant, exclu) où la somme reçue est strictement inférieure au
// loyer. Toujours relatif à "aujourd'hui", jamais à la période consultée à
// l'écran — décision actée le 28/07/2026 : c'est un indicateur de fiabilité
// du locataire, pas une vue liée à la navigation temporelle de la page.
// Ne considère que la Location active (pas l'historique d'éventuelles
// Location antérieures terminées du même locataire).
export function calculerMoisImpayesCumules(
  dateEntree: Date,
  loyerActuel: number,
  sommesParMois: Map<string, number>,
  today: Date = new Date(),
): number {
  const debut: MoisAnnee = { mois: dateEntree.getUTCMonth() + 1, annee: dateEntree.getUTCFullYear() };
  const finExclusive: MoisAnnee = { mois: today.getUTCMonth() + 1, annee: today.getUTCFullYear() };

  return genererMoisEntre(debut, finExclusive).filter(({ mois, annee }) => {
    const somme = sommesParMois.get(cleMois(annee, mois)) ?? 0;
    return somme < loyerActuel - EPSILON;
  }).length;
}
