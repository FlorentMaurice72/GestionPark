import { prisma } from "@/lib/prisma";
import { envoyerEmailRappelEssai } from "@/lib/email";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const maintenant = new Date();
  // Fenêtre J-3 : essai se terminant entre J+2 et J+3
  const dans2Jours = new Date(maintenant.getTime() + 2 * 86400000);
  const dans3Jours = new Date(maintenant.getTime() + 3 * 86400000);
  // Fenêtre J-1 : essai se terminant entre J+0 et J+1
  const dans1Jour = new Date(maintenant.getTime() + 1 * 86400000);

  const admins = await prisma.admin.findMany({
    where: {
      subscriptionStatus: { in: ["trial", "trialing"] },
      OR: [
        { trialEndsAt: { gte: dans2Jours, lte: dans3Jours } },
        { trialEndsAt: { gte: maintenant, lte: dans1Jour } },
      ],
    },
    select: { id: true, email: true, trialEndsAt: true },
  });

  let envoyes = 0;
  for (const admin of admins) {
    try {
      const joursRestants = Math.ceil(
        (new Date(admin.trialEndsAt!).getTime() - maintenant.getTime()) / 86400000,
      );
      await envoyerEmailRappelEssai(admin.email, { joursRestants });
      envoyes++;
    } catch {
      // non-bloquant : on continue les autres
    }
  }

  return Response.json({ ok: true, envoyes, total: admins.length });
}
