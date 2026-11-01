"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { typeDocumentDepuisCharge, TYPES_CHARGE, type TypeCharge } from "@/lib/documents/types";

export interface ActionState {
  success: boolean;
  error?: string;
}

function estTypeCharge(valeur: unknown): valeur is TypeCharge {
  return typeof valeur === "string" && TYPES_CHARGE.some((t) => t.valeur === valeur);
}

export async function creerCharge(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const bienId = Number(formData.get("bienId"));
  const chargeType = formData.get("chargeType");
  const chargeMontant = Number(formData.get("chargeMontant"));
  const dateDocument = formData.get("dateDocument");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!Number.isInteger(bienId) || bienId <= 0) return { success: false, error: "Bien invalide." };
  if (!estTypeCharge(chargeType)) return { success: false, error: "Type de charge invalide." };
  if (!Number.isFinite(chargeMontant) || chargeMontant <= 0) {
    return { success: false, error: "Montant invalide." };
  }
  if (typeof dateDocument !== "string" || !dateDocument) {
    return { success: false, error: "Date invalide." };
  }

  const bien = await prisma.bien.findUnique({ where: { id: bienId } });
  if (!bien) return { success: false, error: "Bien introuvable." };

  await prisma.document.create({
    data: {
      fileId: "-",
      nomFichier: `Charge ${chargeType} — ${bien.nom}`,
      type: typeDocumentDepuisCharge(chargeType),
      description,
      bienId,
      chargeMontant,
      chargeType,
      dateDocument: new Date(dateDocument),
    },
  });

  revalidatePath("/finances");

  return { success: true };
}
