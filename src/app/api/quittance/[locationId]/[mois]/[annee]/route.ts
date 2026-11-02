import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToBuffer } = require("@react-pdf/renderer") as { renderToBuffer: (el: unknown) => Promise<Buffer> };
import React from "react";
import { QuittanceDocument } from "@/lib/pdf/QuittanceDocument";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locationId: string; mois: string; annee: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { locationId: locationIdStr, mois: moisStr, annee: anneeStr } = await params;
  const locationId = parseInt(locationIdStr);
  const mois = parseInt(moisStr);
  const annee = parseInt(anneeStr);

  if (!locationId || !mois || !annee) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const userId = parseInt(session.user.id);

  const location = await prisma.location.findFirst({
    where: { id: locationId, box: { bien: { utilisateurId: userId } } },
    include: {
      locataire: true,
      box: { include: { bien: true } },
    },
  });

  if (!location) {
    return NextResponse.json({ error: "Location introuvable" }, { status: 404 });
  }

  const [admin, paiements] = await Promise.all([
    prisma.admin.findUnique({ where: { id: userId }, select: { email: true } }),
    prisma.paiement.findMany({
      where: { locationId, mois, annee },
      orderBy: { datePaiement: "desc" },
    }),
  ]);

  const montantRecu = paiements.reduce((s, p) => s + p.montant.toNumber(), 0);
  const datePaiement = paiements[0]?.datePaiement
    ? new Date(paiements[0].datePaiement).toLocaleDateString("fr-FR")
    : "—";

  const element = React.createElement(QuittanceDocument, {
    locataireNom: location.locataire.nom,
    locatairePrenom: location.locataire.prenom,
    locataireAdresse: location.locataire.adresse,
    locataireVille: location.locataire.ville,
    locataireCodePostal: location.locataire.codePostal,
    bienNom: location.box.bien.nom,
    boxNumero: location.box.numero,
    mois,
    annee,
    loyerActuel: location.loyerActuel.toNumber(),
    depotGarantie: location.depotGarantie.toNumber(),
    montantRecu,
    dateEncaissement: datePaiement,
    bailleurEmail: admin?.email ?? "",
  });

  const pdfBuffer = await renderToBuffer(element);

  const filename = `quittance-${location.locataire.nom.toLowerCase()}-${mois}-${annee}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
