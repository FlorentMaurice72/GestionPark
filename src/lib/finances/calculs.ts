// Calculs financiers — fonctions pures, sans dépendance à Prisma.
// Cf. lib/paiements.ts pour la même logique appliquée aux paiements.

export interface Emprunt {
  montantEmprunt: number;
  tauxEmprunt: number; // taux annuel nominal, en %
  mensualiteEmprunt: number;
  dateDebutEmprunt: Date;
  dureeEmprunt: number; // en mois
}

export interface EtatEmprunt {
  moisEcoules: number;
  moisRestants: number;
  progression: number; // 0..1
  restantDu: number;
}

// Amortissement à mensualités constantes, taux mensuel = taux annuel nominal / 12
// (approximation standard — le CDC/l'audit ne précisent pas si `taux_emprunt`
// est un TAEG ou un taux nominal ; à ajuster si une source fait foi plus tard).
export function calculerEtatEmprunt(emprunt: Emprunt, today: Date = new Date()): EtatEmprunt {
  const moisEcoulesBruts = moisEntre(emprunt.dateDebutEmprunt, today);
  const moisEcoules = Math.min(Math.max(moisEcoulesBruts, 0), emprunt.dureeEmprunt);
  const moisRestants = emprunt.dureeEmprunt - moisEcoules;
  const progression = emprunt.dureeEmprunt > 0 ? moisEcoules / emprunt.dureeEmprunt : 0;

  const r = emprunt.tauxEmprunt / 100 / 12;
  let restantDu: number;
  if (r === 0) {
    restantDu = emprunt.montantEmprunt - emprunt.mensualiteEmprunt * moisEcoules;
  } else {
    const facteur = Math.pow(1 + r, moisEcoules);
    restantDu = emprunt.montantEmprunt * facteur - (emprunt.mensualiteEmprunt * (facteur - 1)) / r;
  }
  restantDu = Math.min(Math.max(restantDu, 0), emprunt.montantEmprunt);

  return { moisEcoules, moisRestants, progression, restantDu };
}

function moisEntre(debut: Date, fin: Date): number {
  return (
    (fin.getUTCFullYear() - debut.getUTCFullYear()) * 12 + (fin.getUTCMonth() - debut.getUTCMonth())
  );
}

export interface IntervalleOccupation {
  debut: Date;
  fin: Date | null;
}

// Taux d'occupation moyen d'un bien sur une année : moyenne, sur les 12 mois,
// de (boxes occupés ce mois / nombre de boxes total). Un box est "occupé" un
// mois donné si au moins une Location le couvre sur tout ou partie du mois.
export function calculerTauxOccupation(
  intervallesParBox: IntervalleOccupation[][],
  annee: number,
  nombreBoxes: number,
): number | null {
  if (nombreBoxes === 0) return null;

  let sommeTauxMensuel = 0;
  for (let mois = 0; mois < 12; mois += 1) {
    const debutMois = new Date(Date.UTC(annee, mois, 1));
    const finMois = new Date(Date.UTC(annee, mois + 1, 0));

    const boxesOccupes = intervallesParBox.filter((intervalles) =>
      intervalles.some((i) => i.debut <= finMois && (i.fin === null || i.fin >= debutMois)),
    ).length;

    sommeTauxMensuel += boxesOccupes / nombreBoxes;
  }

  return sommeTauxMensuel / 12;
}

export function calculerRentabiliteBrute(loyersAnnuels: number, valeurBien: number | null): number | null {
  if (valeurBien === null || valeurBien <= 0) return null;
  return (loyersAnnuels / valeurBien) * 100;
}

export function calculerRentabiliteNette(
  loyersAnnuels: number,
  chargesAnnuelles: number,
  mensualitesAnnuelles: number,
  valeurBien: number | null,
): number | null {
  if (valeurBien === null || valeurBien <= 0) return null;
  return ((loyersAnnuels - chargesAnnuelles - mensualitesAnnuelles) / valeurBien) * 100;
}

export function calculerCashFlowMensuel(
  loyersEncaissesMois: number,
  mensualiteEmprunt: number,
  chargesMensualisees: number,
): number {
  return loyersEncaissesMois - mensualiteEmprunt - chargesMensualisees;
}
