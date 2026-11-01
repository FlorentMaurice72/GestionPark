"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { envoyerEmailResetMotDePasse, EmailNonConfigure } from "@/lib/email";

export interface ActionState {
  success: boolean;
  error?: string;
}

const DUREE_VALIDITE_MS = 60 * 60 * 1000;

async function origineRequete(): Promise<string> {
  const enTetes = await headers();
  const hote = enTetes.get("host");
  const protocole = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocole}://${hote}`;
}

// Message générique dans tous les cas (compte existant ou non) pour ne pas
// permettre l'énumération des emails admin.
export async function demanderResetMotDePasse(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { success: false, error: "Email requis." };

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (admin) {
    const token = randomBytes(32).toString("hex");
    await prisma.admin.update({
      where: { id: admin.id },
      data: { resetToken: token, resetTokenExpiresAt: new Date(Date.now() + DUREE_VALIDITE_MS) },
    });

    const origine = await origineRequete();
    try {
      await envoyerEmailResetMotDePasse(admin.email, `${origine}/login/reinitialiser?token=${token}`);
    } catch (error) {
      if (error instanceof EmailNonConfigure) {
        return { success: false, error: "L'envoi d'email n'est pas configuré. Contactez l'administrateur technique." };
      }
      throw error;
    }
  }

  return { success: true };
}

export async function reinitialiserMotDePasse(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const motDePasse = String(formData.get("motDePasse") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!token) return { success: false, error: "Lien invalide." };
  if (motDePasse.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (motDePasse !== confirmation) {
    return { success: false, error: "Les mots de passe ne correspondent pas." };
  }

  const admin = await prisma.admin.findUnique({ where: { resetToken: token } });
  if (!admin || !admin.resetTokenExpiresAt || admin.resetTokenExpiresAt < new Date()) {
    return { success: false, error: "Ce lien est invalide ou a expiré. Refaites une demande." };
  }

  const passwordHash = await hashPassword(motDePasse);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
  });

  redirect("/login?reset=1");
}
