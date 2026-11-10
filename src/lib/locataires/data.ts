import { prisma } from "@/lib/prisma";
import { calculerMoisImpayesCumules, cleMois } from "@/lib/paiements";

export interface OptionSimple {
  id: number;
  label: string;
}

export interface LocataireListItem {
  id: number;
  nom: string;
  prenom: string;
  statut: string;
  email: string;
  telephone: string;
  bienNom: string | null;
  boxNumero: string | null;
  loyerActuel: number | null;
  locationActive: boolean;
}

export interface LocatairesFiltres {
  statut: "actif" | "archivé" | "tous";
  bienId: number | null;
  recherche: string | null;
}

export interface LocatairesPageData {
  locataires: LocataireListItem[];
  biens: OptionSimple[];
}

export async function getLocatairesPageData(filtres: LocatairesFiltres, userId: number): Promise<LocatairesPageData> {
  const [locataires, biens] = await Promise.all([
    prisma.locataire.findMany({
      where: {
        utilisateurId: userId,
        ...(filtres.statut !== "tous" ? { statut: filtres.statut } : {}),
        ...(filtres.recherche
          ? {
              OR: [
                { nom: { contains: filtres.recherche, mode: "insensitive" } },
                { prenom: { contains: filtres.recherche, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(filtres.bienId ? { locations: { some: { box: { bienId: filtres.bienId } } } } : {}),
      },
      include: {
        locations: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { box: { include: { bien: true } } },
        },
      },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    }),
    prisma.bien.findMany({ where: { statut: "actif", utilisateurId: userId }, select: { id: true, nom: true }, orderBy: { nom: "asc" } }),
  ]);

  return {
    locataires: locataires.map((locataire) => {
      const derniereLocation = locataire.locations[0];
      return {
        id: locataire.id,
        nom: locataire.nom,
        prenom: locataire.prenom,
        statut: locataire.statut,
        email: locataire.email,
        telephone: locataire.telephone,
        bienNom: derniereLocation?.box.bien.nom ?? null,
        boxNumero: derniereLocation?.box.numero ?? null,
        loyerActuel: derniereLocation ? derniereLocation.loyerActuel.toNumber() : null,
        locationActive: derniereLocation?.statut === "actif",
      };
    }),
    biens: biens.map((b) => ({ id: b.id, label: b.nom })),
  };
}

export interface BoxVacantOption {
  id: number;
  label: string;
}

export async function getBoxesVacantsDisponibles(userId: number): Promise<BoxVacantOption[]> {
  const boxes = await prisma.box.findMany({
    where: { statut: "vacant", bien: { utilisateurId: userId } },
    include: { bien: true },
    orderBy: { numero: "asc" },
  });

  return boxes.map((box) => ({ id: box.id, label: `${box.numero} — ${box.bien.nom}` }));
}

export interface PaiementMois {
  mois: number;
  annee: number;
  montant: number;
  statut: "paye" | "partiel" | "impaye" | "futur";
}

export interface LocationHistorique {
  id: number;
  boxNumero: string;
  bienNom: string;
  dateEntree: Date;
  dateFin: Date | null;
  dateRevisionIRL: Date | null;
  indiceRevision: string;
  statut: string;
  loyerActuel: number;
  depotGarantie: number;
  termeLoyerType: string;
  typeBail: string;
  renouvellementAuto: boolean;
  relanceActive: boolean;
  avisLoyerAuto: boolean;
  quittanceAuto: boolean;
  totalEncaisse: number;
  totalAttendu: number;
  solde: number;
  paiementsParMois: PaiementMois[];
}

export interface DocumentItem {
  id: number;
  nomFichier: string;
  type: string;
  dateDocument: Date;
}

export interface LocataireDetail {
  id: number;
  nom: string;
  prenom: string;
  societe: string | null;
  association: string | null;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  statut: string;
  dateArchivage: Date | null;
  anonymise: boolean;
  anonymiseLe: Date | null;
  locations: LocationHistorique[];
  totalEncaisseGlobal: number;
  moisImpayesCumules: number | null;
  documents: DocumentItem[];
}

export async function getLocataireDetail(id: number, userId: number): Promise<LocataireDetail | null> {
  const locataire = await prisma.locataire.findUnique({
    where: { id, utilisateurId: userId },
    include: {
      locations: {
        orderBy: { createdAt: "desc" },
        include: { box: { include: { bien: true } }, paiements: true },
      },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!locataire) return null;

  const today = new Date();
  let moisImpayesCumules: number | null = null;
  let totalEncaisseGlobal = 0;

  const locations: LocationHistorique[] = locataire.locations.map((location) => {
    const loyer = location.loyerActuel.toNumber();
    const totalEncaisse = location.paiements.reduce((acc, p) => acc + p.montant.toNumber(), 0);
    totalEncaisseGlobal += totalEncaisse;

    const sommesParMois = new Map<string, number>();
    for (const p of location.paiements) {
      const cle = cleMois(p.annee, p.mois);
      sommesParMois.set(cle, (sommesParMois.get(cle) ?? 0) + p.montant.toNumber());
    }

    if (location.statut === "actif") {
      moisImpayesCumules = calculerMoisImpayesCumules(location.dateEntree, loyer, sommesParMois, today);
    }

    // Calcul de la grille mensuelle et du total attendu
    const fin = location.dateFin ?? today;
    const paiementsParMois: PaiementMois[] = [];
    let totalAttendu = 0;

    const debut = new Date(Date.UTC(location.dateEntree.getUTCFullYear(), location.dateEntree.getUTCMonth(), 1));
    const finMois = new Date(Date.UTC(fin.getUTCFullYear(), fin.getUTCMonth(), 1));
    const todayMois = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));

    for (let d = new Date(debut); d <= finMois; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) {
      const mois = d.getUTCMonth() + 1;
      const annee = d.getUTCFullYear();
      const estFutur = d > todayMois;
      const montant = sommesParMois.get(cleMois(annee, mois)) ?? 0;
      let statut: PaiementMois["statut"];
      if (estFutur) {
        statut = "futur";
      } else {
        totalAttendu += loyer;
        if (montant >= loyer) statut = "paye";
        else if (montant > 0) statut = "partiel";
        else statut = "impaye";
      }
      paiementsParMois.push({ mois, annee, montant, statut });
    }

    const solde = totalAttendu - totalEncaisse;

    return {
      id: location.id,
      boxNumero: location.box.numero,
      bienNom: location.box.bien.nom,
      dateEntree: location.dateEntree,
      dateFin: location.dateFin,
      dateRevisionIRL: location.dateRevisionIRL ?? null,
      indiceRevision: location.indiceRevision,
      statut: location.statut,
      loyerActuel: loyer,
      depotGarantie: location.depotGarantie.toNumber(),
      termeLoyerType: location.termeLoyerType,
      typeBail: location.typeBail,
      renouvellementAuto: location.renouvellementAuto,
      relanceActive: location.relanceActive,
      avisLoyerAuto: location.avisLoyerAuto,
      quittanceAuto: location.quittanceAuto,
      totalEncaisse,
      totalAttendu,
      solde,
      paiementsParMois,
    };
  });

  return {
    id: locataire.id,
    nom: locataire.nom,
    prenom: locataire.prenom,
    societe: locataire.societe,
    association: locataire.association,
    email: locataire.email,
    telephone: locataire.telephone,
    adresse: locataire.adresse,
    ville: locataire.ville,
    codePostal: locataire.codePostal,
    statut: locataire.statut,
    dateArchivage: locataire.dateArchivage,
    anonymise: locataire.anonymise,
    anonymiseLe: locataire.anonymiseLe,
    locations,
    totalEncaisseGlobal,
    moisImpayesCumules,
    documents: locataire.documents.map((d) => ({
      id: d.id,
      nomFichier: d.nomFichier,
      type: d.type,
      dateDocument: d.dateDocument,
    })),
  };
}
