import { prisma } from "@/lib/prisma";
import {
  calculerMoisImpayesCumules,
  calculerStatutPaiement,
  cleMois,
  type StatutPaiement,
} from "@/lib/paiements";

export interface LigneLoyer {
  locationId: number;
  bienId: number;
  bienNom: string;
  boxId: number;
  boxNumero: string;
  locataireId: number;
  locataireNom: string;
  locatairePrenom: string;
  locataireEmail: string;
  locataireTelephone: string;
  loyerActuel: number;
  montantRecu: number;
  statut: StatutPaiement;
  moisImpayesCumules: number;
}

export interface Indicateurs {
  encaisse: number;
  attendu: number;
  tauxRecouvrement: number | null;
  nombreImpayes: number;
}

export interface OptionSimple {
  id: number;
  label: string;
}

export interface LoyersPageData {
  biens: OptionSimple[];
  locatairesDisponibles: OptionSimple[];
  boxesDisponibles: OptionSimple[];
  lignes: LigneLoyer[];
  // Toutes les lignes impayées du périmètre "Vue" (avant filtres niveau 2
  // locataire/box), pour la relance groupée — même périmètre que les
  // indicateurs, indépendant du tableau affiché à l'écran.
  lignesImpayees: LigneLoyer[];
  indicateurs: Indicateurs;
  anneesDisponibles: number[];
}

export interface LoyersFiltres {
  bienId: number | null;
  mois: number;
  annee: number;
  locataireId: number | null;
  boxId: number | null;
  statut: StatutPaiement | null;
}

export async function getLoyersPageData(filtres: LoyersFiltres): Promise<LoyersPageData> {
  const [biens, locationsActives, bornesAnnees] = await Promise.all([
    prisma.bien.findMany({
      where: { statut: "actif" },
      select: { id: true, nom: true },
      orderBy: { nom: "asc" },
    }),
    prisma.location.findMany({
      where: {
        statut: "actif",
        ...(filtres.bienId ? { box: { bienId: filtres.bienId } } : {}),
      },
      include: {
        box: { include: { bien: true } },
        locataire: true,
      },
    }),
    prisma.location.aggregate({ _min: { dateEntree: true } }),
  ]);

  const locationIds = locationsActives.map((l) => l.id);

  const [paiementsDuMois, paiementsHistoriques] = await Promise.all([
    locationIds.length
      ? prisma.paiement.groupBy({
          by: ["locationId"],
          where: { locationId: { in: locationIds }, mois: filtres.mois, annee: filtres.annee },
          _sum: { montant: true },
        })
      : Promise.resolve([]),
    locationIds.length
      ? prisma.paiement.groupBy({
          by: ["locationId", "mois", "annee"],
          where: { locationId: { in: locationIds } },
          _sum: { montant: true },
        })
      : Promise.resolve([]),
  ]);

  const sommeDuMoisParLocation = new Map<number, number>();
  for (const p of paiementsDuMois) {
    sommeDuMoisParLocation.set(p.locationId, p._sum.montant?.toNumber() ?? 0);
  }

  const historiqueParLocation = new Map<number, Map<string, number>>();
  for (const p of paiementsHistoriques) {
    if (!historiqueParLocation.has(p.locationId)) {
      historiqueParLocation.set(p.locationId, new Map());
    }
    historiqueParLocation.get(p.locationId)!.set(cleMois(p.annee, p.mois), p._sum.montant?.toNumber() ?? 0);
  }

  const today = new Date();

  const toutesLesLignes: LigneLoyer[] = locationsActives.map((location) => {
    const loyerActuel = location.loyerActuel.toNumber();
    const montantRecu = sommeDuMoisParLocation.get(location.id) ?? 0;

    return {
      locationId: location.id,
      bienId: location.box.bienId,
      bienNom: location.box.bien.nom,
      boxId: location.box.id,
      boxNumero: location.box.numero,
      locataireId: location.locataire.id,
      locataireNom: location.locataire.nom,
      locatairePrenom: location.locataire.prenom,
      locataireEmail: location.locataire.email,
      locataireTelephone: location.locataire.telephone,
      loyerActuel,
      montantRecu,
      statut: calculerStatutPaiement(montantRecu, loyerActuel),
      moisImpayesCumules: calculerMoisImpayesCumules(
        location.dateEntree,
        loyerActuel,
        historiqueParLocation.get(location.id) ?? new Map(),
        today,
      ),
    };
  });

  // Indicateurs calculés sur le périmètre "Vue" (avant filtres niveau 2
  // locataire/box, qui n'affectent que l'affichage du tableau).
  const encaisse = toutesLesLignes.reduce((acc, l) => acc + l.montantRecu, 0);
  const attendu = toutesLesLignes.reduce((acc, l) => acc + l.loyerActuel, 0);
  const nombreImpayes = toutesLesLignes.filter(
    (l) => l.statut === "impaye" || l.statut === "impaye_partiel",
  ).length;

  const indicateurs: Indicateurs = {
    encaisse,
    attendu,
    tauxRecouvrement: attendu > 0 ? encaisse / attendu : null,
    nombreImpayes,
  };

  const locatairesDisponibles = uniqueOptions(
    toutesLesLignes.map((l) => ({ id: l.locataireId, label: `${l.locataireNom} ${l.locatairePrenom}` })),
  );
  const boxesDisponibles = uniqueOptions(
    toutesLesLignes.map((l) => ({ id: l.boxId, label: l.boxNumero })),
  );

  const lignes = toutesLesLignes.filter((l) => {
    if (filtres.locataireId && l.locataireId !== filtres.locataireId) return false;
    if (filtres.boxId && l.boxId !== filtres.boxId) return false;
    if (filtres.statut && l.statut !== filtres.statut) return false;
    return true;
  });

  // Toujours inclure l'année réellement affichée (filtres.annee), même hors
  // bornes connues : la navigation mois précédent/suivant peut y amener
  // (ex: avant la première Location jamais créée).
  const anneeMin = Math.min(
    bornesAnnees._min.dateEntree?.getUTCFullYear() ?? today.getUTCFullYear(),
    filtres.annee,
  );
  const anneeMax = Math.max(today.getUTCFullYear(), filtres.annee);
  const anneesDisponibles = [];
  for (let a = anneeMax; a >= anneeMin; a -= 1) {
    anneesDisponibles.push(a);
  }

  const lignesImpayees = toutesLesLignes
    .filter((l) => l.statut === "impaye" || l.statut === "impaye_partiel")
    .sort((a, b) => a.boxNumero.localeCompare(b.boxNumero, "fr", { numeric: true }));

  return {
    biens: biens.map((b) => ({ id: b.id, label: b.nom })),
    locatairesDisponibles,
    boxesDisponibles,
    lignes: lignes.sort((a, b) => a.boxNumero.localeCompare(b.boxNumero, "fr", { numeric: true })),
    lignesImpayees,
    indicateurs,
    anneesDisponibles,
  };
}

function uniqueOptions(options: OptionSimple[]): OptionSimple[] {
  const map = new Map<number, OptionSimple>();
  for (const o of options) {
    map.set(o.id, o);
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "fr"));
}
