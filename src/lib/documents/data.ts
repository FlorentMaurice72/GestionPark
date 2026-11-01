import { prisma } from "@/lib/prisma";

export interface OptionSimple {
  id: number;
  label: string;
}

export interface DocumentListItem {
  id: number;
  type: string;
  nomFichier: string;
  description: string | null;
  bienNom: string;
  locataireNom: string | null;
  dateDocument: Date;
  chargeMontant: number | null;
  contenuTexte: string | null;
  aUnFichierReel: boolean;
}

export interface DocumentsFiltres {
  categorie: string | null;
  bienId: number | null;
  locataireId: number | null;
  annee: number | null;
}

export interface DocumentsPageData {
  biens: OptionSimple[];
  locataires: OptionSimple[];
  locatairesActifs: OptionSimple[];
  documents: DocumentListItem[];
}

export async function getDocumentsPageData(filtres: DocumentsFiltres): Promise<DocumentsPageData> {
  const [documents, biens, locataires, locatairesActifs] = await Promise.all([
    prisma.document.findMany({
      where: {
        ...(filtres.categorie ? { type: filtres.categorie } : {}),
        ...(filtres.bienId ? { bienId: filtres.bienId } : {}),
        ...(filtres.locataireId ? { locataireId: filtres.locataireId } : {}),
        ...(filtres.annee
          ? {
              dateDocument: {
                gte: new Date(Date.UTC(filtres.annee, 0, 1)),
                lt: new Date(Date.UTC(filtres.annee + 1, 0, 1)),
              },
            }
          : {}),
      },
      include: { bien: true, locataire: true },
      orderBy: { dateDocument: "desc" },
    }),
    prisma.bien.findMany({ where: { statut: "actif" }, select: { id: true, nom: true }, orderBy: { nom: "asc" } }),
    prisma.locataire.findMany({ select: { id: true, nom: true, prenom: true }, orderBy: { nom: "asc" } }),
    prisma.locataire.findMany({
      where: { statut: "actif", locations: { some: { statut: "actif" } } },
      select: { id: true, nom: true, prenom: true },
      orderBy: { nom: "asc" },
    }),
  ]);

  return {
    biens: biens.map((b) => ({ id: b.id, label: b.nom })),
    locataires: locataires.map((l) => ({ id: l.id, label: `${l.nom} ${l.prenom}` })),
    locatairesActifs: locatairesActifs.map((l) => ({ id: l.id, label: `${l.nom} ${l.prenom}` })),
    documents: documents.map((d) => ({
      id: d.id,
      type: d.type,
      nomFichier: d.nomFichier,
      description: d.description,
      bienNom: d.bien.nom,
      locataireNom: d.locataire ? `${d.locataire.nom} ${d.locataire.prenom}` : null,
      dateDocument: d.dateDocument,
      chargeMontant: d.chargeMontant?.toNumber() ?? null,
      contenuTexte: d.contenuTexte,
      aUnFichierReel: d.fileId !== "-",
    })),
  };
}
