import { prisma } from "@/lib/prisma";
import { envoyerEmailAvisLoyer } from "@/lib/email";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const moisActuel = now.getUTCMonth() + 1;
  const anneeActuelle = now.getUTCFullYear();
  const debutMois = new Date(Date.UTC(anneeActuelle, moisActuel - 1, 1));

  const moisProchain = moisActuel === 12 ? 1 : moisActuel + 1;
  const anneeProchain = moisActuel === 12 ? anneeActuelle + 1 : anneeActuelle;

  const locations = await prisma.location.findMany({
    where: {
      statut: "actif",
      avisLoyerAuto: true,
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

  const avisDejaEnvoyes = await prisma.relance.findMany({
    where: { canal: "avis_loyer", dateEnvoi: { gte: debutMois } },
    select: { locationId: true },
  });
  const locationIdsDejaEnvoyes = new Set(avisDejaEnvoyes.map((r) => r.locationId));

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

    if (locationIdsDejaEnvoyes.has(loc.id)) { skipped++; continue; }

    const montant = loc.loyerActuel.toNumber();
    const locataireNom = `${loc.locataire.prenom} ${loc.locataire.nom}`;
    const moisLabel = new Date(anneeProchain, moisProchain - 1).toLocaleString("fr-FR", { month: "long" });

    try {
      await envoyerEmailAvisLoyer(loc.locataire.email, {
        locataireNom,
        bienNom: loc.box.bien.nom,
        boxNumero: loc.box.numero,
        mois: moisProchain,
        annee: anneeProchain,
        montant,
        bailleurNom: admin.nomBailleur,
        bailleurEmail: admin.email,
      });
      await prisma.relance.create({
        data: {
          locationId: loc.id,
          dateEnvoi: new Date(),
          canal: "avis_loyer",
          contenuTexte: `Avis de loyer auto — ${moisLabel} ${anneeProchain}`,
        },
      });
      sent++;
    } catch {
      errors++;
    }
  }

  return Response.json({ sent, skipped, errors });
}
