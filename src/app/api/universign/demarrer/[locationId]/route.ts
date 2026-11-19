import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import { BailDocument } from "@/lib/pdf/BailDocument";
import {
  creerDemandeSignature,
  ajouterDocument,
  ajouterSignataire,
  activerDemande,
} from "@/lib/yousign";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToBuffer } = require("@react-pdf/renderer") as { renderToBuffer: (el: unknown) => Promise<Buffer> };

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ locationId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);

  const { locationId: locationIdStr } = await params;
  const locationId = parseInt(locationIdStr);
  if (!locationId || isNaN(locationId)) {
    return NextResponse.json({ error: "Paramètre invalide" }, { status: 400 });
  }

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
  if (location.bailStatutSignature === "en_attente") {
    return NextResponse.json({ error: "Signature déjà en cours" }, { status: 409 });
  }

  if (!process.env.YOUSIGN_API_KEY) {
    return NextResponse.json({ error: "YouSign non configuré (clé API manquante)" }, { status: 503 });
  }

  try {
    // 1. Générer le PDF
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

    // 2. Créer la demande de signature YouSign
    const nomDemande = `Bail ${location.box.bien.nom} · Box ${location.box.numero} · ${location.locataire.nom} ${location.locataire.prenom}`;
    const requestId = await creerDemandeSignature(nomDemande);

    // 3. Uploader le PDF dans la demande
    const nomFichier = `bail-${location.locataire.nom.toLowerCase()}-box${location.box.numero}.pdf`;
    const documentId = await ajouterDocument(requestId, pdfBuffer, nomFichier);

    // 4. Ajouter les signataires avec leur champ de signature
    const nomsBailleur = (admin?.nomBailleur ?? "").split(" ");
    await ajouterSignataire(requestId, documentId, "bailleur", {
      prenom: nomsBailleur[0] ?? "Bailleur",
      nom: nomsBailleur.slice(1).join(" ") || ".",
      email: admin?.email ?? "",
    });
    await ajouterSignataire(requestId, documentId, "locataire", {
      prenom: location.locataire.prenom,
      nom: location.locataire.nom,
      email: location.locataire.email,
      telephone: location.locataire.telephone ?? undefined,
    });

    // 5. Activer la demande (YouSign envoie les emails)
    await activerDemande(requestId);

    // 6. Sauvegarder l'ID de la demande en base
    await prisma.location.update({
      where: { id: locationId },
      data: { bailTransactionId: requestId, bailStatutSignature: "en_attente" },
    });

    return NextResponse.json({ success: true, transactionId: requestId });
  } catch (err) {
    console.error("YouSign erreur:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur YouSign" },
      { status: 500 },
    );
  }
}
