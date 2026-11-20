import { prisma } from "@/lib/prisma";
import { calculerRevision } from "./calculs";
import type { IndiceType, PointIndice } from "./indices";

export interface LocationDueRevision {
  locationId: number;
  locataireId: number;
  locataireNom: string;
  locatairePrenom: string;
  bienNom: string;
  boxNumero: string;
  loyerActuel: number;
  dateRevision: Date;
  typeIndice: IndiceType;
  loyerRevise: number;
  variation: number;
  indiceNouveau: PointIndice;
  indiceAncien: PointIndice;
  enRetard: boolean;
}

export async function getLocationsDuesRevision(userId: number): Promise<LocationDueRevision[]> {
  const aujourd = new Date();
  aujourd.setHours(0, 0, 0, 0);
  const dansUnMois = new Date(aujourd.getTime() + 30 * 86400000);

  const locations = await prisma.location.findMany({
    where: {
      statut: "actif",
      indiceRevision: { in: ["IRL", "ICC"] },
      dateRevisionIRL: { not: null, lte: dansUnMois },
      box: { bien: { utilisateurId: userId } },
    },
    include: {
      locataire: { select: { id: true, nom: true, prenom: true } },
      box: { select: { numero: true, bien: { select: { nom: true } } } },
    },
    orderBy: { dateRevisionIRL: "asc" },
  });

  const result: LocationDueRevision[] = [];

  for (const loc of locations) {
    if (!loc.dateRevisionIRL) continue;
    const typeIndice = loc.indiceRevision as IndiceType;
    const calcul = calculerRevision(
      Number(loc.loyerActuel),
      typeIndice,
      new Date(loc.dateRevisionIRL),
    );
    if (!calcul) continue;

    result.push({
      locationId: loc.id,
      locataireId: loc.locataire.id,
      locataireNom: loc.locataire.nom,
      locatairePrenom: loc.locataire.prenom,
      bienNom: loc.box.bien.nom,
      boxNumero: loc.box.numero,
      loyerActuel: Number(loc.loyerActuel),
      dateRevision: new Date(loc.dateRevisionIRL),
      typeIndice,
      loyerRevise: calcul.loyerRevise,
      variation: calcul.variation,
      indiceNouveau: calcul.indiceNouveau,
      indiceAncien: calcul.indiceAncien,
      enRetard: new Date(loc.dateRevisionIRL) <= aujourd,
    });
  }

  return result;
}

export async function getNombreRevisionsDues(userId: number): Promise<number> {
  const aujourd = new Date();
  aujourd.setHours(0, 0, 0, 0);
  return prisma.location.count({
    where: {
      statut: "actif",
      indiceRevision: { in: ["IRL", "ICC"] },
      dateRevisionIRL: { not: null, lte: aujourd },
      box: { bien: { utilisateurId: userId } },
    },
  });
}
