import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import { BailDocument } from "@/lib/pdf/BailDocument";
import {
  uploadFichier,
  creerTransaction,
  ajouterChampSignature,
  ajouterParticipant,
  demarrerTransaction,
} from "@/lib/universign";

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

  if (!process.env.UNIVERSIGN_API_KEY) {
    return NextResponse.json({ error: "Universign non configuré (clé API manquante)" }, { status: 503 });
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

    // 2. Upload vers Universign
    const nomFichier = `bail-${location.locataire.nom.toLowerCase()}-box${location.box.numero}.pdf`;
    const fileId = await uploadFichier(pdfBuffer, nomFichier);

    // 3. Créer la transaction
    const nomTransaction = `Bail ${location.box.bien.nom} · Box ${location.box.numero} · ${location.locataire.nom} ${location.locataire.prenom}`;
    const { txId, docId } = await creerTransaction(nomTransaction, fileId);

    // 4. Champs de signature
    const champBailleurId = await ajouterChampSignature(txId, docId, "bailleur");
    const champLocataireId = await ajouterChampSignature(txId, docId, "locataire");

    // 5. Participants (bailleur en premier, locataire en second)
    const telephoneBailleur = "";
    const telephoneLocataire = location.locataire.telephone ?? "";

    await ajouterParticipant(txId, {
      prenom: admin?.nomBailleur?.split(" ")[0] ?? "Bailleur",
      nom: admin?.nomBailleur?.split(" ").slice(1).join(" ") ?? "",
      email: admin?.email ?? "",
      telephone: telephoneBailleur,
      fieldId: champBailleurId,
    });
    await ajouterParticipant(txId, {
      prenom: location.locataire.prenom,
      nom: location.locataire.nom,
      email: location.locataire.email,
      telephone: telephoneLocataire,
      fieldId: champLocataireId,
    });

    // 6. Démarrer (Universign envoie les emails)
    await demarrerTransaction(txId);

    // 7. Sauvegarder l'ID de transaction en base
    await prisma.location.update({
      where: { id: locationId },
      data: { bailTransactionId: txId, bailStatutSignature: "en_attente" },
    });

    return NextResponse.json({ success: true, transactionId: txId });
  } catch (err) {
    console.error("Universign erreur:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur Universign" },
      { status: 500 },
    );
  }
}
