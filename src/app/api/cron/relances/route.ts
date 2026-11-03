import { prisma } from "@/lib/prisma";
import { envoyerEmailRelance } from "@/lib/email";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const mois = now.getUTCMonth() + 1;
  const annee = now.getUTCFullYear();
  const debutMois = new Date(Date.UTC(annee, mois - 1, 1));
  const moisLabel = now.toLocaleString("fr-FR", { month: "long" });

  const locations = await prisma.location.findMany({
    where: {
      statut: "actif",
      relanceActive: true,
    },
    include: {
      locataire: { select: { email: true, nom: true, prenom: true } },
      box: {
        select: {
          numero: true,
          bien: {
            select: {
              nom: true,
              admin: {
                select: { email: true, nomBailleur: true, subscriptionStatus: true, trialEndsAt: true },
              },
            },
          },
        },
      },
    },
  });

  const [paiementsCeMois, relancesCeMois] = await Promise.all([
    prisma.paiement.findMany({
      where: { mois, annee },
      select: { locationId: true },
    }),
    prisma.relance.findMany({
      where: { canal: "email", dateEnvoi: { gte: debutMois } },
      select: { locationId: true },
    }),
  ]);

  const locationIdsPayees = new Set(paiementsCeMois.map((p) => p.locationId));
  const locationIdsRelancees = new Set(relancesCeMois.map((r) => r.locationId));

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const loc of locations) {
    const admin = loc.box.bien.admin;
    const trialActif =
      admin.subscriptionStatus === "trialing" && admin.trialEndsAt
        ? new Date(admin.trialEndsAt) > now
        : false;
    const abonnementActif = admin.subscriptionStatus === "active" || trialActif;
    if (!abonnementActif) { skipped++; continue; }

    if (locationIdsPayees.has(loc.id) || locationIdsRelancees.has(loc.id)) {
      skipped++;
      continue;
    }

    const montant = loc.loyerActuel.toNumber();
    const prenom = loc.locataire.prenom;
    const nom = loc.locataire.nom;
    const bailleurNom = admin.nomBailleur ?? admin.email;
    const texte = `Relance de loyer\n\nBonjour ${prenom} ${nom},\n\nNous vous rappelons que votre loyer de ${montant}€ pour le mois de ${moisLabel} ${annee} n'a pas encore été réglé.\n\nMerci de procéder au paiement dans les meilleurs délais.\n\n${bailleurNom}`;

    try {
      await envoyerEmailRelance(loc.locataire.email, texte);
      await prisma.relance.create({
        data: { locationId: loc.id, dateEnvoi: new Date(), canal: "email", contenuTexte: texte },
      });
      sent++;
    } catch {
      errors++;
    }
  }

  return Response.json({ sent, skipped, errors });
}
