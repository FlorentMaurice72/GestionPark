"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { TourStep } from "./useTour";

export async function getOnboardingStep(): Promise<TourStep | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(session.user.id) },
    select: { onboardingStep: true },
  });
  return (admin?.onboardingStep as TourStep) ?? null;
}

export async function saveOnboardingStep(step: TourStep): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  if (session.user.email === "demo@gestionpark.fr") return;
  await prisma.admin.update({
    where: { id: parseInt(session.user.id) },
    data: { onboardingStep: step },
  });
}
