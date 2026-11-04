import { prisma } from "@/lib/prisma";

export interface BienListItem {
  id: number;
  nom: string;
  typeBien: string;
  adresseComplete: string;
  nombreBoxesLoues: number;
  nombreBoxesVacants: number;
  nombreBoxesTotal: number;
}

export async function getBiensPageData(userId: number): Promise<BienListItem[]> {
  const biens = await prisma.bien.findMany({
    where: { statut: "actif", utilisateurId: userId },
    include: { boxes: { select: { statut: true } } },
    orderBy: { nom: "asc" },
  });

  return biens.map((bien) => {
    const nombreBoxesLoues = bien.boxes.filter((b) => b.statut === "loué").length;
    return {
      id: bien.id,
      nom: bien.nom,
      typeBien: bien.typeBien,
      adresseComplete: bien.adresseComplete,
      nombreBoxesLoues,
      nombreBoxesVacants: bien.boxes.length - nombreBoxesLoues,
      nombreBoxesTotal: bien.boxes.length,
    };
  });
}

export interface BoxDetail {
  id: number;
  numero: string;
  superficie: number;
  statut: string;
  locataireActuel: string | null;
}

export interface BienDetail {
  id: number;
  nom: string;
  typeBien: string;
  adresseComplete: string;
  taxeFonciere: number;
  assurance: number;
  montantEmprunt: number | null;
  mensualiteEmprunt: number | null;
  tauxEmprunt: number | null;
  dateDebutEmprunt: Date | null;
  dureeEmprunt: number | null;
  valeurEstimee: number | null;
  boxes: BoxDetail[];
}

export async function getBienDetail(id: number, userId: number): Promise<BienDetail | null> {
  const bien = await prisma.bien.findUnique({
    where: { id, utilisateurId: userId },
    include: {
      boxes: {
        include: {
          locations: {
            where: { statut: "actif" },
            include: { locataire: true },
            take: 1,
          },
        },
        orderBy: { numero: "asc" },
      },
    },
  });

  if (!bien) return null;

  return {
    id: bien.id,
    nom: bien.nom,
    typeBien: bien.typeBien,
    adresseComplete: bien.adresseComplete,
    taxeFonciere: bien.taxeFonciere.toNumber(),
    assurance: bien.assurance.toNumber(),
    montantEmprunt: bien.montantEmprunt?.toNumber() ?? null,
    mensualiteEmprunt: bien.mensualiteEmprunt?.toNumber() ?? null,
    tauxEmprunt: bien.tauxEmprunt?.toNumber() ?? null,
    dateDebutEmprunt: bien.dateDebutEmprunt ?? null,
    dureeEmprunt: bien.dureeEmprunt ?? null,
    valeurEstimee: bien.valeurEstimee?.toNumber() ?? null,
    boxes: bien.boxes
      .map((box) => ({
        id: box.id,
        numero: box.numero,
        superficie: box.superficie.toNumber(),
        statut: box.statut,
        locataireActuel: box.locations[0]
          ? `${box.locations[0].locataire.nom} ${box.locations[0].locataire.prenom}`
          : null,
      }))
      .sort((a, b) => a.numero.localeCompare(b.numero, "fr", { numeric: true })),
  };
}
