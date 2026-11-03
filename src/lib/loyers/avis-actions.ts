"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailAvisLoyer, EmailNonConfigure } from "@/lib/email";

export interface EnvoyerAvisState {
  success: boolean;
  error?: string;
  emailEnvoye?: boolean;
}

export async function envoyerAvisLoyer(
  _prev: EnvoyerAvisState,
  formData: FormData,
): Promise<EnvoyerAvisState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const locationId = Number(formData.get("locationId"));
  const mois = Number(formData.get("mois"));
  const annee = Number(formData.get("annee"));

  if (!locationId || !mois || !annee) return { success: false, error: "Paramètres invalides." };

  const location = await prisma.location.findFirst({
    where: { id: locationId, box: { bien: { utilisateurId: userId } } },
    include: {
      locataire: { select: { nom: true, prenom: true, email: true } },
      box: { select: { numero: true, bien: { select: { nom: true } } } },
    },
  });
  if (!location) return { success: false, error: "Location introuvable." };
  if (!location.locataire.email) return { success: false, error: "Le locataire n'a pas d'email." };

  const admin = await prisma.admin.findUnique({
    where: { id: userId },
    select: { email: true, nomBailleur: true },
  });

  try {
    await envoyerEmailAvisLoyer(location.locataire.email, {
      locataireNom: `${location.locataire.prenom} ${location.locataire.nom}`,
      bienNom: location.box.bien.nom,
      boxNumero: location.box.numero,
      mois,
      annee,
      montant: location.loyerActuel.toNumber(),
      bailleurNom: admin?.nomBailleur,
      bailleurEmail: admin?.email ?? "",
    });
    revalidatePath("/loyers");
    return { success: true, emailEnvoye: true };
  } catch (err) {
    if (err instanceof EmailNonConfigure) return { success: true, emailEnvoye: false };
    return { success: false, error: "Erreur lors de l'envoi." };
  }
}
