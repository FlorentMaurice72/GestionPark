"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export interface PresetCreated {
  id: number;
  name: string;
  delimiter: string;
  columns: string[];
  dateColumn: string;
  descriptionColumn: string;
  amountColumn: string;
  hasHeaderRow: boolean;
}

export interface CreerPresetState {
  success: boolean;
  error?: string;
  preset?: PresetCreated;
}

export async function creerPreset(
  _prev: CreerPresetState,
  formData: FormData,
): Promise<CreerPresetState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const name = String(formData.get("name") ?? "").trim();
  const delimiter = String(formData.get("delimiter") ?? ";");
  const hasHeaderRow = formData.get("hasHeaderRow") === "true";
  const columnsRaw = String(formData.get("columns") ?? "");
  const dateColumn = String(formData.get("dateColumn") ?? "").trim();
  const descriptionColumn = String(formData.get("descriptionColumn") ?? "").trim();
  const amountColumn = String(formData.get("amountColumn") ?? "").trim();

  if (!name) return { success: false, error: "Nom requis." };
  if (delimiter !== ";" && delimiter !== ",") return { success: false, error: "Délimiteur invalide." };
  if (!dateColumn || !descriptionColumn || !amountColumn) {
    return { success: false, error: "Les 3 colonnes (date, libellé, montant) sont requises." };
  }

  const columns = columnsRaw
    .split("|||")
    .map((c) => c.trim())
    .filter(Boolean);

  const preset = await prisma.importPreset.create({
    data: {
      name,
      delimiter,
      hasHeaderRow,
      columns,
      dateColumn,
      descriptionColumn,
      amountColumn,
      utilisateurId: userId,
    },
  });

  revalidatePath("/loyers/import");
  return {
    success: true,
    preset: {
      id: preset.id,
      name: preset.name,
      delimiter: preset.delimiter,
      columns: preset.columns,
      dateColumn: preset.dateColumn,
      descriptionColumn: preset.descriptionColumn,
      amountColumn: preset.amountColumn,
      hasHeaderRow: preset.hasHeaderRow,
    },
  };
}

export async function supprimerPreset(presetId: number): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const userId = parseInt(session.user.id);
  await prisma.importPreset.delete({
    where: { id: presetId, utilisateurId: userId },
  });
  revalidatePath("/loyers/import");
}
