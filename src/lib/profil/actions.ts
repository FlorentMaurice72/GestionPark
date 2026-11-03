"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/password";

export interface InfosBailleurState {
  success: boolean;
  error?: string;
}

export async function mettreAJourInfosBailleur(
  _prev: InfosBailleurState,
  formData: FormData,
): Promise<InfosBailleurState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié" };

  const nomBailleur = (formData.get("nomBailleur") as string | null)?.trim() ?? "";
  const adresseBailleur = (formData.get("adresseBailleur") as string | null)?.trim() ?? "";

  if (!nomBailleur) return { success: false, error: "Le nom est requis" };

  await prisma.admin.update({
    where: { id: parseInt(session.user.id) },
    data: {
      nomBailleur: nomBailleur || null,
      adresseBailleur: adresseBailleur || null,
    },
  });

  revalidatePath("/profil");
  return { success: true };
}

export interface ChangerMdpState {
  success: boolean;
  error?: string;
}

export async function changerMotDePasse(
  _prev: ChangerMdpState,
  formData: FormData,
): Promise<ChangerMdpState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié" };

  const motDePasseActuel = formData.get("motDePasseActuel") as string | null;
  const nouveauMotDePasse = formData.get("nouveauMotDePasse") as string | null;
  const confirmation = formData.get("confirmation") as string | null;

  if (!motDePasseActuel || !nouveauMotDePasse || !confirmation) {
    return { success: false, error: "Tous les champs sont requis" };
  }
  if (nouveauMotDePasse !== confirmation) {
    return { success: false, error: "Les mots de passe ne correspondent pas" };
  }
  if (nouveauMotDePasse.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  const admin = await prisma.admin.findUnique({ where: { id: parseInt(session.user.id) } });
  if (!admin) return { success: false, error: "Compte introuvable" };

  const valide = await verifyPassword(motDePasseActuel, admin.passwordHash);
  if (!valide) return { success: false, error: "Mot de passe actuel incorrect" };

  const nouveauHash = await hashPassword(nouveauMotDePasse);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: nouveauHash },
  });

  return { success: true };
}
