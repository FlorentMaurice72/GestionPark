"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface AlerteState {
  success: boolean;
  error?: string;
}

export async function creerRappel(
  _prev: AlerteState,
  formData: FormData,
): Promise<AlerteState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const adminId = parseInt(session.user.id);
  const titre = formData.get("titre");
  const description = formData.get("description");
  const dateRappel = formData.get("dateRappel");
  if (typeof titre !== "string" || !titre.trim()) return { success: false, error: "Titre requis." };
  if (typeof dateRappel !== "string" || !dateRappel) return { success: false, error: "Date requise." };
  await prisma.rappel.create({
    data: {
      adminId,
      titre: titre.trim(),
      description:
        typeof description === "string" && description.trim() ? description.trim() : null,
      dateRappel: new Date(dateRappel),
    },
  });
  revalidatePath("/alertes");
  return { success: true };
}

export async function traiterRappel(id: number): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const adminId = parseInt(session.user.id);
  await prisma.rappel.updateMany({ where: { id, adminId }, data: { traitee: true } });
  revalidatePath("/alertes");
}

export async function supprimerRappel(id: number): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const adminId = parseInt(session.user.id);
  await prisma.rappel.deleteMany({ where: { id, adminId } });
  revalidatePath("/alertes");
}
