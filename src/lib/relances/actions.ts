"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailRelance, EmailNonConfigure } from "@/lib/email";

export interface CreerRelanceState {
  success: boolean;
  emailEnvoye?: boolean;
  error?: string;
}

export async function creerRelance(
  _prevState: CreerRelanceState,
  formData: FormData,
): Promise<CreerRelanceState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

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

  const location = await prisma.location.findFirst({
    where: { id: locationId, box: { bien: { utilisateurId: userId } } },
    include: { locataire: { select: { email: true } } },
  });
  if (!location) {
    return { success: false, error: "Location introuvable." };
  }

  let emailEnvoye = false;
  if (canal === "email" && location.locataire.email) {
    try {
      await envoyerEmailRelance(location.locataire.email, contenuTexte.trim());
      emailEnvoye = true;
    } catch (err) {
      if (err instanceof EmailNonConfigure) {
        emailEnvoye = false;
      } else {
        return { success: false, error: "Erreur lors de l'envoi de l'email." };
      }
    }
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
  return { success: true, emailEnvoye };
}
