import { prisma } from "@/lib/prisma";
import {
  calculerCashFlowMensuel,
  calculerEtatEmprunt,
  calculerRentabiliteBrute,
  calculerRentabiliteNette,
  calculerTauxOccupation,
  type EtatEmprunt,
  type IntervalleOccupation,
} from "./calculs";

export interface OptionSimple {
  id: number;
  label: string;
}

export interface IndicateursPeriode {
  revenus: number;
  charges: number;
  mensualites: number;
  resultatNet: number;
}

export interface DetailBienFinances {
  bienId: number;
  bienNom: string;
  montantEmprunt: number;
  tauxEmprunt: number;
  mensualiteEmprunt: number;
  dureeEmprunt: number;
  etatEmprunt: EtatEmprunt;
  revenusMensuel: number;
  revenusAnnuel: number;
  tauxOccupation: number | null;
  chargesFixesAnnuelles: number;
  chargesVariablesAnnuelles: number;
  valeurEstimee: number | null;
  rentabiliteBrute: number | null;
  rentabiliteNette: number | null;
  cashFlowMensuel: number;
}

export interface PointGraphique {
  mois: number;
  revenus: number;
  charges: number;
}

export interface LigneCharge {
  id: number;
  bienId: number;
  bienNom: string;
  type: string;
  chargeType: string | null;
  chargeMontant: number;
  dateDocument: Date;
  description: string | null;
}

export interface FinancesFiltres {
  mois: number;
  annee: number;
  bienId: number | null;
}

export interface FinancesPageData {
  biens: OptionSimple[];
  indicateursMois: IndicateursPeriode;
  indicateursAnnee: IndicateursPeriode;
  detailsBiens: DetailBienFinances[];
  graphique: PointGraphique[];
  charges: LigneCharge[];
  totalCharges: number;
}

// chargeType déjà représentés par les champs fixes de Bien (taxeFonciere,
// assurance) : exclus de l'agrégat "charges variables" et des indicateurs de
// rentabilité/cash-flow pour éviter un double comptage. Ils restent visibles
// tels quels dans le tableau de gestion des charges (simple filing).
const CHARGE_TYPES_DEJA_COMPTES_FIXES = new Set(["assurance", "taxe_fonciere"]);

function estChargeVariable(chargeType: string | null): boolean {
  return chargeType === null || !CHARGE_TYPES_DEJA_COMPTES_FIXES.has(chargeType);
}

export async function getFinancesPageData(filtres: FinancesFiltres): Promise<FinancesPageData> {
  const biensActifs = await prisma.bien.findMany({
    where: { statut: "actif", ...(filtres.bienId ? { id: filtres.bienId } : {}) },
    include: {
      boxes: {
        include: { locations: { select: { dateEntree: true, dateFin: true } } },
      },
    },
    orderBy: { nom: "asc" },
  });

  const toutesLesBiens = await prisma.bien.findMany({
    where: { statut: "actif" },
    select: { id: true, nom: true },
    orderBy: { nom: "asc" },
  });

  const bienIds = biensActifs.map((b) => b.id);

  const [paiementsMois, paiementsAnnee, documentsChargeAnnee, paiementsGraphique] = await Promise.all([
    prisma.paiement.aggregate({
      _sum: { montant: true },
      where: {
        mois: filtres.mois,
        annee: filtres.annee,
        location: { box: { bienId: { in: bienIds } } },
      },
    }),
    prisma.paiement.aggregate({
      _sum: { montant: true },
      where: { annee: filtres.annee, location: { box: { bienId: { in: bienIds } } } },
    }),
    prisma.document.findMany({
      where: {
        bienId: { in: bienIds },
        chargeMontant: { not: null },
        dateDocument: { gte: new Date(Date.UTC(filtres.annee, 0, 1)), lt: new Date(Date.UTC(filtres.annee + 1, 0, 1)) },
      },
      include: { bien: true },
      orderBy: { dateDocument: "desc" },
    }),
    prisma.paiement.groupBy({
      by: ["mois"],
      _sum: { montant: true },
      where: { annee: filtres.annee, location: { box: { bienId: { in: bienIds } } } },
    }),
  ]);

  const chargesVariablesDocs = documentsChargeAnnee.filter((d) => estChargeVariable(d.chargeType));

  const mensualiteTotale = biensActifs.reduce((acc, b) => acc + b.mensualiteEmprunt.toNumber(), 0);
  const chargesFixesTotalMensuel = biensActifs.reduce(
    (acc, b) => acc + (b.taxeFonciere.toNumber() + b.assurance.toNumber()) / 12,
    0,
  );
  const chargesVariablesMoisCourant = chargesVariablesDocs
    .filter((d) => d.dateDocument.getUTCFullYear() === filtres.annee && d.dateDocument.getUTCMonth() + 1 === filtres.mois)
    .reduce((acc, d) => acc + (d.chargeMontant?.toNumber() ?? 0), 0);
  const chargesVariablesAnneeTotal = chargesVariablesDocs.reduce((acc, d) => acc + (d.chargeMontant?.toNumber() ?? 0), 0);
  const chargesFixesAnneeTotal = biensActifs.reduce(
    (acc, b) => acc + b.taxeFonciere.toNumber() + b.assurance.toNumber(),
    0,
  );

  const revenusMois = paiementsMois._sum.montant?.toNumber() ?? 0;
  const revenusAnnee = paiementsAnnee._sum.montant?.toNumber() ?? 0;

  const indicateursMois: IndicateursPeriode = {
    revenus: revenusMois,
    charges: chargesFixesTotalMensuel + chargesVariablesMoisCourant,
    mensualites: mensualiteTotale,
    resultatNet: revenusMois - (chargesFixesTotalMensuel + chargesVariablesMoisCourant) - mensualiteTotale,
  };
  const indicateursAnnee: IndicateursPeriode = {
    revenus: revenusAnnee,
    charges: chargesFixesAnneeTotal + chargesVariablesAnneeTotal,
    mensualites: mensualiteTotale * 12,
    resultatNet: revenusAnnee - (chargesFixesAnneeTotal + chargesVariablesAnneeTotal) - mensualiteTotale * 12,
  };

  // Détail par bien
  const detailsBiens: DetailBienFinances[] = await Promise.all(
    biensActifs.map(async (bien) => {
      const [revenusMensuelAgg, revenusAnnuelAgg] = await Promise.all([
        prisma.paiement.aggregate({
          _sum: { montant: true },
          where: { mois: filtres.mois, annee: filtres.annee, location: { box: { bienId: bien.id } } },
        }),
        prisma.paiement.aggregate({
          _sum: { montant: true },
          where: { annee: filtres.annee, location: { box: { bienId: bien.id } } },
        }),
      ]);

      const intervallesParBox: IntervalleOccupation[][] = bien.boxes.map((box) =>
        box.locations.map((l) => ({ debut: l.dateEntree, fin: l.dateFin })),
      );

      const taxeFonciere = bien.taxeFonciere.toNumber();
      const assurance = bien.assurance.toNumber();
      const montantEmprunt = bien.montantEmprunt.toNumber();
      const tauxEmprunt = bien.tauxEmprunt.toNumber();
      const mensualiteEmprunt = bien.mensualiteEmprunt.toNumber();
      const dureeEmprunt = bien.dureeEmprunt;
      const valeurEstimee = bien.valeurEstimee?.toNumber() ?? null;

      const revenusAnnuel = revenusAnnuelAgg._sum.montant?.toNumber() ?? 0;
      const chargesFixesAnnuelles = taxeFonciere + assurance;
      const chargesVariablesAnnuelles = chargesVariablesDocs
        .filter((d) => d.bienId === bien.id)
        .reduce((acc, d) => acc + (d.chargeMontant?.toNumber() ?? 0), 0);
      const mensualitesAnnuelles = mensualiteEmprunt * 12;

      return {
        bienId: bien.id,
        bienNom: bien.nom,
        montantEmprunt,
        tauxEmprunt,
        mensualiteEmprunt,
        dureeEmprunt,
        etatEmprunt: calculerEtatEmprunt({
          montantEmprunt,
          tauxEmprunt,
          mensualiteEmprunt,
          dateDebutEmprunt: bien.dateDebutEmprunt,
          dureeEmprunt,
        }),
        revenusMensuel: revenusMensuelAgg._sum.montant?.toNumber() ?? 0,
        revenusAnnuel,
        tauxOccupation: calculerTauxOccupation(intervallesParBox, filtres.annee, bien.boxes.length),
        chargesFixesAnnuelles,
        chargesVariablesAnnuelles,
        valeurEstimee,
        rentabiliteBrute: calculerRentabiliteBrute(revenusAnnuel, valeurEstimee),
        rentabiliteNette: calculerRentabiliteNette(
          revenusAnnuel,
          chargesFixesAnnuelles + chargesVariablesAnnuelles,
          mensualitesAnnuelles,
          valeurEstimee,
        ),
        cashFlowMensuel: calculerCashFlowMensuel(
          revenusMensuelAgg._sum.montant?.toNumber() ?? 0,
          mensualiteEmprunt,
          (chargesFixesAnnuelles + chargesVariablesAnnuelles) / 12,
        ),
      };
    }),
  );

  // Graphique 12 mois : revenus réellement encaissés vs charges totales
  // (fixes mensualisées + variables du mois), sur l'année sélectionnée.
  const revenusParMois = new Map<number, number>();
  for (const p of paiementsGraphique) {
    revenusParMois.set(p.mois, p._sum.montant?.toNumber() ?? 0);
  }
  const chargesVariablesParMois = new Map<number, number>();
  for (const d of chargesVariablesDocs) {
    const mois = d.dateDocument.getUTCMonth() + 1;
    chargesVariablesParMois.set(mois, (chargesVariablesParMois.get(mois) ?? 0) + (d.chargeMontant?.toNumber() ?? 0));
  }
  const graphique: PointGraphique[] = Array.from({ length: 12 }, (_, i) => ({
    mois: i + 1,
    revenus: revenusParMois.get(i + 1) ?? 0,
    charges: chargesFixesTotalMensuel + (chargesVariablesParMois.get(i + 1) ?? 0),
  }));

  const charges: LigneCharge[] = documentsChargeAnnee.map((d) => ({
    id: d.id,
    bienId: d.bienId,
    bienNom: d.bien.nom,
    type: d.type,
    chargeType: d.chargeType,
    chargeMontant: d.chargeMontant?.toNumber() ?? 0,
    dateDocument: d.dateDocument,
    description: d.description,
  }));

  return {
    biens: toutesLesBiens.map((b) => ({ id: b.id, label: b.nom })),
    indicateursMois,
    indicateursAnnee,
    detailsBiens,
    graphique,
    charges,
    totalCharges: charges.reduce((acc, c) => acc + c.chargeMontant, 0),
  };
}
