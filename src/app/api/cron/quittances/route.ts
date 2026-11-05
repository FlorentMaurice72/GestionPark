import { prisma } from "@/lib/prisma";
import { envoyerEmailQuittance } from "@/lib/email";
import React from "react";
import { QuittanceDocument } from "@/lib/pdf/QuittanceDocument";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToBuffer } = require("@react-pdf/renderer") as { renderToBuffer: (el: unknown) => Promise<Buffer> };

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Quittances pour le mois précédent
  const moisPrecedent = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const mois = moisPrecedent.getUTCMonth() + 1;
  const annee = moisPrecedent.getUTCFullYear();

  // Toutes les locations actives avec un paiement pour le mois précédent
  const paiements = await prisma.paiement.findMany({
    where: { mois, annee },
    select: {
      locationId: true,
      montant: true,
      datePaiement: true,
    },
  });

  if (paiements.length === 0) {
    return Response.json({ sent: 0, skipped: 0, errors: 0, reason: "no payments found" });
  }

  const locationIds = [...new Set(paiements.map((p) => p.locationId))];

  const locations = await prisma.location.findMany({
    where: { id: { in: locationIds }, statut: "actif" },
    include: {
      locataire: true,
      box: { include: { bien: { include: { admin: { select: { email: true, nomBailleur: true, adresseBailleur: true, subscriptionStatus: true, trialEndsAt: true } } } } } },
    },
  });

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

    if (!loc.locataire.email) { skipped++; continue; }

    const locPaiements = paiements.filter((p) => p.locationId === loc.id);
    const montantRecu = locPaiements.reduce((s, p) => s + p.montant.toNumber(), 0);
    const datePaiementRaw = locPaiements[0]?.datePaiement;
    const dateEncaissement = datePaiementRaw
      ? new Date(datePaiementRaw).toLocaleDateString("fr-FR")
      : "—";

    try {
      const element = React.createElement(QuittanceDocument, {
        locataireNom: loc.locataire.nom,
        locatairePrenom: loc.locataire.prenom,
        locataireAdresse: loc.locataire.adresse,
        locataireVille: loc.locataire.ville,
        locataireCodePostal: loc.locataire.codePostal,
        bienNom: loc.box.bien.nom,
        boxNumero: loc.box.numero,
        mois,
        annee,
        loyerActuel: loc.loyerActuel.toNumber(),
        depotGarantie: loc.depotGarantie.toNumber(),
        montantRecu,
        dateEncaissement,
        bailleurEmail: admin.email,
        bailleurNom: admin.nomBailleur ?? null,
        bailleurAdresse: admin.adresseBailleur ?? null,
      });

      const pdfBuffer = await renderToBuffer(element);
      const filename = `quittance-${loc.locataire.nom.toLowerCase()}-${mois}-${annee}.pdf`;

      await envoyerEmailQuittance(loc.locataire.email, {
        locataireNom: `${loc.locataire.prenom} ${loc.locataire.nom}`,
        mois,
        annee,
        pdfBuffer,
        filename,
        bailleurNom: admin.nomBailleur,
        bailleurEmail: admin.email,
      });

      sent++;
    } catch {
      errors++;
    }
  }

  return Response.json({ sent, skipped, errors });
}
