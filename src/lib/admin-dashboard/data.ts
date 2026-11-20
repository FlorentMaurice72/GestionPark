import { prisma } from "@/lib/prisma";

const PRIX_ESSENTIEL = 9.9;
const PRIX_PRO = 24.9;

export interface RecentInscrit {
  id: number;
  email: string;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  trialEndsAt: Date | null;
  createdAt: Date;
}

export interface ExpirationProchaine {
  id: number;
  email: string;
  trialEndsAt: Date;
  joursRestants: number;
}

export interface JourInscription {
  date: string;
  count: number;
}

export interface AdminDashboardData {
  totalInscrits: number;
  payants: number;
  enEssai: number;
  resilies: number;
  enRetard: number;
  mrr: number;
  essentielCount: number;
  proCount: number;
  recentInscrits: RecentInscrit[];
  expirationsProchaines: ExpirationProchaine[];
  inscriptionsParJour: JourInscription[];
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 86400000);
  const il30Jours = new Date(now.getTime() - 30 * 86400000);

  const [
    totalInscrits,
    payants,
    enEssai,
    resilies,
    enRetard,
    plans,
    recentInscrits,
    expirationsProchaines,
    inscrits30Jours,
  ] = await Promise.all([
    prisma.admin.count(),
    prisma.admin.count({ where: { subscriptionStatus: "active" } }),
    prisma.admin.count({ where: { subscriptionStatus: { in: ["trialing", "trial"] } } }),
    prisma.admin.count({ where: { subscriptionStatus: "canceled" } }),
    prisma.admin.count({ where: { subscriptionStatus: "past_due" } }),
    prisma.admin.groupBy({
      by: ["subscriptionPlan"],
      where: { subscriptionStatus: "active" },
      _count: true,
    }),
    prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        email: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        trialEndsAt: true,
        createdAt: true,
      },
    }),
    prisma.admin.findMany({
      where: {
        subscriptionStatus: { in: ["trialing", "trial"] },
        trialEndsAt: { gte: now, lte: in7Days },
      },
      orderBy: { trialEndsAt: "asc" },
      select: { id: true, email: true, trialEndsAt: true },
    }),
    prisma.admin.findMany({
      where: { createdAt: { gte: il30Jours } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const essentielCount =
    plans.find((p) => p.subscriptionPlan === "essentiel")?._count ?? 0;
  const proCount =
    plans.find((p) => p.subscriptionPlan === "pro")?._count ?? 0;
  const mrr = essentielCount * PRIX_ESSENTIEL + proCount * PRIX_PRO;

  // Group signups by day
  const parJour = new Map<string, number>();
  for (const { createdAt } of inscrits30Jours) {
    const date = createdAt.toISOString().slice(0, 10);
    parJour.set(date, (parJour.get(date) ?? 0) + 1);
  }
  const inscriptionsParJour: JourInscription[] = Array.from(
    parJour.entries()
  ).map(([date, count]) => ({ date, count }));

  return {
    totalInscrits,
    payants,
    enEssai,
    resilies,
    enRetard,
    mrr,
    essentielCount,
    proCount,
    recentInscrits,
    expirationsProchaines: expirationsProchaines.map((e) => ({
      id: e.id,
      email: e.email,
      trialEndsAt: e.trialEndsAt!,
      joursRestants: Math.ceil(
        (e.trialEndsAt!.getTime() - now.getTime()) / 86400000
      ),
    })),
    inscriptionsParJour,
  };
}
