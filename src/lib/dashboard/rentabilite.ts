import { prisma } from "@/lib/prisma";

export interface RentabiliteItem {
  id: number;
  nom: string;
  boxesLoues: number;
  boxesTotal: number;
  loyersMensuels: number;
  chargesMensuelles: number;
  resultatNet: number;
}

export async function getRentabiliteParBien(userId: number): Promise<RentabiliteItem[]> {
  const biens = await prisma.bien.findMany({
    where: { utilisateurId: userId, statut: "actif" },
    orderBy: { nom: "asc" },
    select: {
      id: true,
      nom: true,
      taxeFonciere: true,
      assurance: true,
      mensualiteEmprunt: true,
      boxes: {
        select: {
          statut: true,
          locations: {
            where: { statut: "actif" },
            select: { loyerActuel: true },
          },
        },
      },
    },
  });

  return biens.map((b) => {
    const boxesLoues = b.boxes.filter((bx) => bx.statut === "loué").length;
    const loyersMensuels = b.boxes
      .flatMap((bx) => bx.locations)
      .reduce((s, l) => s + l.loyerActuel.toNumber(), 0);
    const chargesMensuelles =
      b.taxeFonciere.toNumber() / 12 +
      b.assurance.toNumber() / 12 +
      (b.mensualiteEmprunt?.toNumber() ?? 0);
    return {
      id: b.id,
      nom: b.nom,
      boxesLoues,
      boxesTotal: b.boxes.length,
      loyersMensuels,
      chargesMensuelles,
      resultatNet: loyersMensuels - chargesMensuelles,
    };
  });
}
