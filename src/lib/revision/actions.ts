"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calculerRevision } from "./calculs";
import type { IndiceType } from "./indices";

export interface RevisionState {
  success: boolean;
  error?: string;
  applied?: number;
}

export async function appliquerRevision(locationId: number): Promise<RevisionState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const location = await prisma.location.findFirst({
    where: { id: locationId, statut: "actif", box: { bien: { utilisateurId: userId } } },
    select: { id: true, loyerActuel: true, indiceRevision: true, dateRevisionIRL: true },
  });

  if (!location) return { success: false, error: "Location introuvable." };
  if (!location.dateRevisionIRL) return { success: false, error: "Date de révision manquante." };
  if (!["IRL", "ICC"].includes(location.indiceRevision ?? "")) {
    return { success: false, error: "Loyer à taux fixe — pas de révision indiciaire." };
  }

  const calcul = calculerRevision(
    Number(location.loyerActuel),
    location.indiceRevision as IndiceType,
    new Date(location.dateRevisionIRL),
  );

  if (!calcul) return { success: false, error: "Indices non disponibles pour cette période." };

  const nouvelleDate = new Date(location.dateRevisionIRL);
  nouvelleDate.setFullYear(nouvelleDate.getFullYear() + 1);

  await prisma.location.update({
    where: { id: locationId },
    data: { loyerActuel: calcul.loyerRevise, dateRevisionIRL: nouvelleDate },
  });

  revalidatePath("/loyers/revision");
  revalidatePath("/loyers");
  revalidatePath("/alertes");
  revalidatePath("/");

  return { success: true };
}

export async function appliquerToutesRevisions(locationIds: number[]): Promise<RevisionState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };

  let applied = 0;
  for (const id of locationIds) {
    const r = await appliquerRevision(id);
    if (r.success) applied++;
  }

  return { success: true, applied };
}
