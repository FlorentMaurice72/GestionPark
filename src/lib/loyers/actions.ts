"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface CreerPaiementState {
  success: boolean;
  error?: string;
}

export async function creerPaiement(
  _prevState: CreerPaiementState,
  formData: FormData,
): Promise<CreerPaiementState> {
  const locationId = Number(formData.get("locationId"));
  const mois = Number(formData.get("mois"));
  const annee = Number(formData.get("annee"));
  const montant = Number(formData.get("montant"));
  const datePaiement = formData.get("datePaiement");
  const mode = formData.get("mode");

  if (!Number.isInteger(locationId) || locationId <= 0) {
    return { success: false, error: "Location invalide." };
  }
  if (!Number.isInteger(mois) || mois < 1 || mois > 12) {
    return { success: false, error: "Mois invalide." };
  }
  if (!Number.isInteger(annee) || annee < 2000) {
    return { success: false, error: "Année invalide." };
  }
  if (!Number.isFinite(montant) || montant <= 0) {
    return { success: false, error: "Montant invalide." };
  }
  if (typeof datePaiement !== "string" || !datePaiement) {
    return { success: false, error: "Date invalide." };
  }
  if (typeof mode !== "string" || !mode.trim()) {
    return { success: false, error: "Mode de paiement requis." };
  }

  const location = await prisma.location.findUnique({ where: { id: locationId } });
  if (!location) {
    return { success: false, error: "Location introuvable." };
  }

  await prisma.paiement.create({
    data: {
      locationId,
      mois,
      annee,
      montant,
      datePaiement: new Date(datePaiement),
      mode: mode.trim(),
    },
  });

  revalidatePath("/loyers");

  return { success: true };
}
