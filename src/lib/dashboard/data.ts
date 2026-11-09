import { prisma } from "@/lib/prisma";
import { getBiensPageData } from "@/lib/biens/data";
import { getLoyersPageData } from "@/lib/loyers/data";
import { cleMois } from "@/lib/paiements";
import { calculerHistorique12Mois, type PointHistorique } from "./calculs";
import { getRentabiliteParBien, type RentabiliteItem } from "./rentabilite";

export interface KPIOccupation {
  tauxOccupation: number | null;
  boxesLoues: number;
  boxesTotal: number;
}

export interface DernierImport {
  date: Date;
  mois: number;
  annee: number;
}

export type PrioriteNotification = "haute" | "moyenne";

export interface Notification {
  type: "impayes" | "relances" | "non_identifiees";
  priorite: PrioriteNotification;
  message: string;
  lien: string;
}

export interface DashboardPageData {
  aujourdHui: Date;
  mois: number;
  annee: number;
  kpiOccupation: KPIOccupation;
  importFaitCeMois: boolean;
  kpiLoyersEncaisses: number | null;
  kpiImpayes: number | null;
  kpiLocatairesActifs: number;
  dernierImport: DernierImport | null;
  nombreNonIdentifiees: number;
  historique: PointHistorique[];
  notifications: Notification[];
  rentabiliteParBien: RentabiliteItem[];
}

export async function getDashboardPageData(userId: number): Promise<DashboardPageData> {
  const aujourdHui = new Date();
  const mois = aujourdHui.getUTCMonth() + 1;
  const annee = aujourdHui.getUTCFullYear();

  const [biens, loyersDuMois, kpiLocatairesActifs, dernierImportRow, nombreNonIdentifiees, toutesLesLocations, paiementsAnnee, rentabiliteParBien] =
    await Promise.all([
      getBiensPageData(userId),
      getLoyersPageData({ bienId: null, mois, annee, locataireId: null, boxId: null, statut: null }, userId),
      prisma.locataire.count({ where: { statut: "actif", utilisateurId: userId } }),
      prisma.paiement.findFirst({
        where: { mois, annee, source: "import_csv", location: { box: { bien: { utilisateurId: userId } } } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.transactionNonIdentifiee.count({ where: { utilisateurId: userId } }),
      prisma.location.findMany({
        where: { box: { bien: { utilisateurId: userId } } },
        select: { id: true, dateEntree: true, dateFin: true, loyerActuel: true },
      }),
      prisma.paiement.findMany({
        where: { annee, location: { box: { bien: { utilisateurId: userId } } } },
        select: { locationId: true, mois: true, montant: true },
      }),
      getRentabiliteParBien(userId),
    ]);

  const boxesLoues = biens.reduce((acc, b) => acc + b.nombreBoxesLoues, 0);
  const boxesTotal = biens.reduce((acc, b) => acc + b.nombreBoxesTotal, 0);
  const kpiOccupation: KPIOccupation = {
    tauxOccupation: boxesTotal > 0 ? boxesLoues / boxesTotal : null,
    boxesLoues,
    boxesTotal,
  };

  const importFaitCeMois = dernierImportRow !== null;
  const dernierImport: DernierImport | null = dernierImportRow
    ? { date: dernierImportRow.createdAt, mois, annee }
    : null;

  const paiementsParLocationMois = new Map<number, Map<string, number>>();
  const encaisseParMois = new Map<number, number>();
  for (const p of paiementsAnnee) {
    const montant = p.montant.toNumber();
    encaisseParMois.set(p.mois, (encaisseParMois.get(p.mois) ?? 0) + montant);

    if (!paiementsParLocationMois.has(p.locationId)) {
      paiementsParLocationMois.set(p.locationId, new Map());
    }
    const parMois = paiementsParLocationMois.get(p.locationId)!;
    const cle = cleMois(annee, p.mois);
    parMois.set(cle, (parMois.get(cle) ?? 0) + montant);
  }

  const historique = calculerHistorique12Mois(
    toutesLesLocations.map((l) => ({
      id: l.id,
      dateEntree: l.dateEntree,
      dateFin: l.dateFin,
      loyerActuel: l.loyerActuel.toNumber(),
    })),
    paiementsParLocationMois,
    encaisseParMois,
    annee,
  );

  const notifications: Notification[] = [];
  // Gardé cohérent avec les KPIs/Actions urgentes : sans import CSV ce mois,
  // les impayés ne sont pas fiables (des paiements bancaires peuvent
  // manquer), donc pas de notification "impayés"/"relances" tant que
  // `importFaitCeMois` est faux.
  if (importFaitCeMois && loyersDuMois.indicateurs.nombreImpayes > 0) {
    notifications.push({
      type: "impayes",
      priorite: "haute",
      message: `${loyersDuMois.indicateurs.nombreImpayes} impayé${loyersDuMois.indicateurs.nombreImpayes > 1 ? "s" : ""} détecté${loyersDuMois.indicateurs.nombreImpayes > 1 ? "s" : ""}`,
      lien: "/loyers?statut=impaye",
    });
    notifications.push({
      type: "relances",
      priorite: "haute",
      message: `${loyersDuMois.indicateurs.nombreImpayes} locataire${loyersDuMois.indicateurs.nombreImpayes > 1 ? "s" : ""} n'ayant pas payé ce mois — relance à effectuer`,
      lien: "/loyers?statut=impaye",
    });
  }
  if (nombreNonIdentifiees > 0) {
    notifications.push({
      type: "non_identifiees",
      priorite: "moyenne",
      message: `${nombreNonIdentifiees} paiement${nombreNonIdentifiees > 1 ? "s" : ""} nécessit${nombreNonIdentifiees > 1 ? "ent" : "e"} une attribution manuelle`,
      lien: "/loyers/import",
    });
  }

  return {
    aujourdHui,
    mois,
    annee,
    kpiOccupation,
    importFaitCeMois,
    kpiLoyersEncaisses: importFaitCeMois ? loyersDuMois.indicateurs.encaisse : null,
    kpiImpayes: importFaitCeMois ? loyersDuMois.indicateurs.nombreImpayes : null,
    kpiLocatairesActifs,
    dernierImport,
    nombreNonIdentifiees,
    historique,
    notifications,
    rentabiliteParBien,
  };
}
