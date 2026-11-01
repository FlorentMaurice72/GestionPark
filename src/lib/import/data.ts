import { prisma } from "@/lib/prisma";

export interface PresetOption {
  id: number;
  name: string;
  delimiter: string;
  columns: string[];
  dateColumn: string;
  descriptionColumn: string;
  amountColumn: string;
  hasHeaderRow: boolean;
}

export interface LocationOption {
  id: number;
  matchingInputs: string[];
  boxNumero: string;
  bienId: number;
  bienNom: string;
  locataireNom: string;
  locatairePrenom: string;
}

export interface ImportPageData {
  presets: PresetOption[];
  locations: LocationOption[];
}

// Toutes les Locations (pas seulement actives) : une transaction en retard
// peut légitimement concerner une Location déjà terminée.
export async function getImportPageData(userId: number): Promise<ImportPageData> {
  const [presets, locations] = await Promise.all([
    prisma.importPreset.findMany({ where: { utilisateurId: userId }, orderBy: { name: "asc" } }),
    prisma.location.findMany({
      where: { box: { bien: { utilisateurId: userId } } },
      include: { box: { include: { bien: true } }, locataire: true },
      orderBy: { id: "asc" },
    }),
  ]);

  return {
    presets: presets.map((p) => ({
      id: p.id,
      name: p.name,
      delimiter: p.delimiter,
      columns: p.columns,
      dateColumn: p.dateColumn,
      descriptionColumn: p.descriptionColumn,
      amountColumn: p.amountColumn,
      hasHeaderRow: p.hasHeaderRow,
    })),
    locations: locations.map((l) => ({
      id: l.id,
      matchingInputs: l.matchingInputs,
      boxNumero: l.box.numero,
      bienId: l.box.bienId,
      bienNom: l.box.bien.nom,
      locataireNom: l.locataire.nom,
      locatairePrenom: l.locataire.prenom,
    })),
  };
}
