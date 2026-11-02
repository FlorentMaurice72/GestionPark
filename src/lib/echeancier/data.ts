import { prisma } from "@/lib/prisma";

export type TypeEcheance = "avis_loyer" | "relance" | "fin_bail";
export type PrioriteEcheance = "haute" | "normale";

export interface Echeance {
  id: string;
  type: TypeEcheance;
  dateEcheance: Date;
  titre: string;
  description: string;
  lien: string;
  priorite: PrioriteEcheance;
  locationId: number;
  locataireNom: string;
  bienNom: string;
  boxNumero: string;
}

export interface EcheancierData {
  ceMoisCi: Echeance[];
  leMoisProchain: Echeance[];
  plusTard: Echeance[];
  total: number;
}

export async function getEcheancierData(userId: number): Promise<EcheancierData> {
  const aujourdHui = new Date();
  const mois = aujourdHui.getUTCMonth() + 1;
  const annee = aujourdHui.getUTCFullYear();

  const [locations, paiementsCeMois] = await Promise.all([
    prisma.location.findMany({
      where: { statut: "actif", box: { bien: { utilisateurId: userId } } },
      include: {
        locataire: { select: { id: true, nom: true, prenom: true } },
        box: { select: { numero: true, bien: { select: { nom: true } } } },
      },
    }),
    prisma.paiement.findMany({
      where: {
        mois,
        annee,
        location: { box: { bien: { utilisateurId: userId } } },
      },
      select: { locationId: true },
    }),
  ]);

  const locationIdsPayees = new Set(paiementsCeMois.map((p) => p.locationId));

  const premierMoisProchain = new Date(Date.UTC(annee, mois, 1));
  const moisProchain = mois === 12 ? 1 : mois + 1;
  const anneeProchain = mois === 12 ? annee + 1 : annee;
  const dans90Jours = new Date(Date.UTC(annee, mois - 1, aujourdHui.getUTCDate() + 90));

  const toutes: Echeance[] = [];

  for (const loc of locations) {
    const loyer = loc.loyerActuel.toNumber();
    const locNom = `${loc.locataire.prenom} ${loc.locataire.nom}`;
    const bienNom = loc.box.bien.nom;
    const boxNumero = loc.box.numero;

    if (!locationIdsPayees.has(loc.id)) {
      toutes.push({
        id: `relance-${loc.id}`,
        type: "relance",
        dateEcheance: new Date(Date.UTC(annee, mois - 1, 5)),
        titre: `Relance impayé — ${locNom}`,
        description: `Loyer de ${loyer}€ non réglé pour ${mois}/${annee}`,
        lien: "/loyers?statut=impaye",
        priorite: "haute",
        locationId: loc.id,
        locataireNom: locNom,
        bienNom,
        boxNumero,
      });
    }

    if (loc.avisLoyerAuto) {
      toutes.push({
        id: `avis-${loc.id}`,
        type: "avis_loyer",
        dateEcheance: premierMoisProchain,
        titre: `Avis de loyer — ${locNom}`,
        description: `Avis pour ${moisProchain}/${anneeProchain} — ${loyer}€`,
        lien: "/loyers",
        priorite: "normale",
        locationId: loc.id,
        locataireNom: locNom,
        bienNom,
        boxNumero,
      });
    }

    if (loc.dateFin) {
      const dateFin = loc.dateFin;
      const msRestants = dateFin.getTime() - aujourdHui.getTime();
      const joursRestants = msRestants / (1000 * 60 * 60 * 24);
      if (joursRestants >= 0 && joursRestants <= 90) {
        toutes.push({
          id: `fin-bail-${loc.id}`,
          type: "fin_bail",
          dateEcheance: dateFin,
          titre: `Fin de bail — ${locNom}`,
          description: `Bail se termine le ${dateFin.toLocaleDateString("fr-FR")}`,
          lien: `/locataires/${loc.locataire.id}`,
          priorite: joursRestants < 30 ? "haute" : "normale",
          locationId: loc.id,
          locataireNom: locNom,
          bienNom,
          boxNumero,
        });
      }
    }
  }

  toutes.sort((a, b) => a.dateEcheance.getTime() - b.dateEcheance.getTime());

  const ceMoisCi = toutes.filter(
    (e) =>
      e.dateEcheance.getUTCMonth() + 1 === mois &&
      e.dateEcheance.getUTCFullYear() === annee
  );
  const leMoisProchain = toutes.filter(
    (e) =>
      e.dateEcheance.getUTCMonth() + 1 === moisProchain &&
      e.dateEcheance.getUTCFullYear() === anneeProchain
  );
  const plusTard = toutes.filter(
    (e) =>
      e.dateEcheance <= dans90Jours &&
      !(
        (e.dateEcheance.getUTCMonth() + 1 === mois && e.dateEcheance.getUTCFullYear() === annee) ||
        (e.dateEcheance.getUTCMonth() + 1 === moisProchain && e.dateEcheance.getUTCFullYear() === anneeProchain)
      )
  );

  return {
    ceMoisCi,
    leMoisProchain,
    plusTard,
    total: ceMoisCi.length + leMoisProchain.length + plusTard.length,
  };
}
