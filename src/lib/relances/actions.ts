"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface CreerRelanceState {
  success: boolean;
  error?: string;
}

export async function creerRelance(
  _prevState: CreerRelanceState,
  formData: FormData,
): Promise<CreerRelanceState> {
  const locationId = Number(formData.get("locationId"));
  const canal = formData.get("canal");
  const contenuTexte = formData.get("contenuTexte");

  if (!Number.isInteger(locationId) || locationId <= 0) {
    return { success: false, error: "Location invalide." };
  }
  if (canal !== "email" && canal !== "sms") {
    return { success: false, error: "Canal invalide." };
  }
  if (typeof contenuTexte !== "string" || !contenuTexte.trim()) {
    return { success: false, error: "Texte invalide." };
  }

  const location = await prisma.location.findUnique({ where: { id: locationId } });
  if (!location) {
    return { success: false, error: "Location introuvable." };
  }

  await prisma.relance.create({
    data: {
      locationId,
      dateEnvoi: new Date(),
      canal,
      contenuTexte: contenuTexte.trim(),
    },
  });

  revalidatePath("/loyers");

  return { success: true };
}
