// Calculs du Dashboard — fonctions pures, sans dépendance à Prisma.
import { calculerStatutPaiement, cleMois, genererMoisEntre } from "@/lib/paiements";

export interface LocationPourHistorique {
  id: number;
  dateEntree: Date;
  dateFin: Date | null;
  loyerActuel: number;
}

export interface PointHistorique {
  mois: number;
  annee: number;
  encaisse: number;
  attendu: number;
  tauxRecouvrement: number | null;
  nombreImpayes: number;
}

function finDeMois(annee: number, mois: number): Date {
  return new Date(Date.UTC(annee, mois, 0));
}

function debutDeMois(annee: number, mois: number): Date {
  return new Date(Date.UTC(annee, mois - 1, 1));
}

// Une Location est "active durant le mois" si son intervalle [dateEntree,
// dateFin] chevauche le mois — reconstitution historique précise (par
// opposition au statut "actif" today, cf. journal de décisions Phase 7),
// même principe que calculerTauxOccupation (lib/finances/calculs.ts).
function estActiveDurantLeMois(location: LocationPourHistorique, annee: number, mois: number): boolean {
  const debut = debutDeMois(annee, mois);
  const fin = finDeMois(annee, mois);
  return location.dateEntree <= fin && (location.dateFin === null || location.dateFin >= debut);
}

// Historique 12 mois (calendaire, janvier→décembre de `annee`) : pour chaque
// mois, loyers réellement encaissés (tous paiements enregistrés ce mois,
// indépendamment du statut actuel des locations), montant attendu et nombre
// d'impayés calculés sur les seules Locations actives ce mois-là. Utilise
// Location.loyerActuel (valeur courante, pas d'historique de loyer dans le
// schéma) — même simplification que calculerMoisImpayesCumules.
export function calculerHistorique12Mois(
  locations: LocationPourHistorique[],
  paiementsParLocationMois: Map<number, Map<string, number>>,
  encaisseParMois: Map<number, number>,
  annee: number,
): PointHistorique[] {
  const mois12 = genererMoisEntre({ mois: 1, annee }, { mois: 1, annee: annee + 1 });

  return mois12.map(({ mois }) => {
    const locationsActives = locations.filter((l) => estActiveDurantLeMois(l, annee, mois));

    const attendu = locationsActives.reduce((acc, l) => acc + l.loyerActuel, 0);
    const encaisse = encaisseParMois.get(mois) ?? 0;

    const nombreImpayes = locationsActives.filter((l) => {
      const sommesRecues = paiementsParLocationMois.get(l.id)?.get(cleMois(annee, mois)) ?? 0;
      const statut = calculerStatutPaiement(sommesRecues, l.loyerActuel);
      return statut === "impaye" || statut === "impaye_partiel";
    }).length;

    return {
      mois,
      annee,
      encaisse,
      attendu,
      tauxRecouvrement: attendu > 0 ? encaisse / attendu : null,
      nombreImpayes,
    };
  });
}
