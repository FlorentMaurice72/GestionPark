import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToBuffer } = require("@react-pdf/renderer") as { renderToBuffer: (el: unknown) => Promise<Buffer> };
import React from "react";
import { BailDocument } from "@/lib/pdf/BailDocument";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locationId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { locationId: locationIdStr } = await params;
  const locationId = parseInt(locationIdStr);
  if (!locationId || isNaN(locationId)) {
    return NextResponse.json({ error: "Paramètre invalide" }, { status: 400 });
  }

  const userId = parseInt(session.user.id);

  const [location, admin] = await Promise.all([
    prisma.location.findFirst({
      where: { id: locationId, box: { bien: { utilisateurId: userId } } },
      include: {
        locataire: true,
        box: { include: { bien: { select: { nom: true, adresseComplete: true } } } },
      },
    }),
    prisma.admin.findUnique({
      where: { id: userId },
      select: { email: true, nomBailleur: true, adresseBailleur: true },
    }),
  ]);

  if (!location) {
    return NextResponse.json({ error: "Location introuvable" }, { status: 404 });
  }

  const element = React.createElement(BailDocument, {
    bailleurNom: admin?.nomBailleur ?? admin?.email ?? "",
    bailleurAdresse: admin?.adresseBailleur ?? null,
    bailleurEmail: admin?.email ?? "",
    locataireNom: location.locataire.nom,
    locatairePrenom: location.locataire.prenom,
    locataireSociete: location.locataire.societe,
    locataireAdresse: location.locataire.adresse,
    locataireVille: location.locataire.ville,
    locataireCodePostal: location.locataire.codePostal,
    bienNom: location.box.bien.nom,
    bienAdresse: location.box.bien.adresseComplete,
    boxNumero: location.box.numero,
    boxSuperficie: location.box.superficie.toNumber(),
    typeBail: location.typeBail,
    dateEntree: location.dateEntree,
    loyerActuel: location.loyerActuel.toNumber(),
    termeLoyerType: location.termeLoyerType,
    moyenPaiement: location.moyenPaiement,
    depotGarantie: location.depotGarantie.toNumber(),
    renouvellementAuto: location.renouvellementAuto,
    indiceRevision: location.indiceRevision,
    dateRevisionIRL: location.dateRevisionIRL,
  });

  const pdfBuffer = await renderToBuffer(element);

  const nomFichier = `bail-${location.locataire.nom.toLowerCase()}-box${location.box.numero}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomFichier}"`,
    },
  });
}
