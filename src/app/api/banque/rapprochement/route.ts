import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);

  const body = (await req.json()) as {
    transactionId?: number;
    locationId?: number;
    action?: "ignore";
  };
  const { transactionId, locationId, action } = body;

  if (!transactionId) {
    return NextResponse.json({ error: "transactionId requis" }, { status: 400 });
  }

  const transaction = await prisma.bankTransaction.findFirst({
    where: { id: transactionId, adminId: userId, statut: "non_rapproche" },
  });

  if (!transaction) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
  }

  if (action === "ignore") {
    await prisma.bankTransaction.update({
      where: { id: transactionId },
      data: { statut: "ignore" },
    });
    return NextResponse.json({ ok: true });
  }

  if (!locationId) {
    return NextResponse.json({ error: "locationId requis" }, { status: 400 });
  }

  const location = await prisma.location.findFirst({
    where: {
      id: locationId,
      box: { bien: { utilisateurId: userId } },
      statut: "actif",
    },
  });

  if (!location) {
    return NextResponse.json({ error: "Location introuvable" }, { status: 404 });
  }

  const mois = transaction.mois ?? new Date(transaction.date).getUTCMonth() + 1;
  const annee = transaction.annee ?? new Date(transaction.date).getUTCFullYear();

  const existant = await prisma.paiement.findFirst({
    where: { locationId, mois, annee, source: "banque" },
  });

  if (existant) {
    return NextResponse.json(
      { error: "Un paiement bancaire existe déjà pour ce mois" },
      { status: 409 },
    );
  }

  await prisma.$transaction([
    prisma.paiement.create({
      data: {
        locationId,
        mois,
        annee,
        montant: transaction.montant,
        datePaiement: transaction.date,
        mode: "virement",
        source: "banque",
      },
    }),
    prisma.bankTransaction.update({
      where: { id: transactionId },
      data: { statut: "rapproche", locationId, mois, annee },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
