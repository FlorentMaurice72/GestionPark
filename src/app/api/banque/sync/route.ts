import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccountTransactions, extractTransactionId, extractLibelle } from "@/lib/nordigen";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);

  const body = (await req.json()) as { connectionId?: number };
  const { connectionId } = body;
  if (!connectionId) {
    return NextResponse.json({ error: "connectionId requis" }, { status: 400 });
  }

  const connection = await prisma.bankConnection.findFirst({
    where: { id: connectionId, adminId: userId, statut: "linked" },
  });

  if (!connection) {
    return NextResponse.json({ error: "Connexion introuvable" }, { status: 404 });
  }

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - 90);
  const dateFromStr = dateFrom.toISOString().slice(0, 10);

  let nouvelles = 0;
  let erreurs = 0;

  for (const accountId of connection.accountIds) {
    try {
      const { booked } = await getAccountTransactions(accountId, dateFromStr);

      for (const tx of booked) {
        const externalId = extractTransactionId(tx);
        const montantNum = parseFloat(tx.transactionAmount.amount);
        if (montantNum <= 0) continue;

        const libelle = extractLibelle(tx);
        const date = new Date(tx.bookingDate);
        const mois = date.getUTCMonth() + 1;
        const annee = date.getUTCFullYear();

        try {
          await prisma.bankTransaction.upsert({
            where: { connectionId_externalId: { connectionId: connection.id, externalId } },
            create: {
              connectionId: connection.id,
              adminId: userId,
              externalId,
              montant: montantNum,
              date,
              libelle,
              mois,
              annee,
              statut: "non_rapproche",
            },
            update: {},
          });
          nouvelles++;
        } catch {
          // duplicate — skip
        }
      }
    } catch (err) {
      console.error(`[banque/sync] account ${accountId}:`, err);
      erreurs++;
    }
  }

  await prisma.bankConnection.update({
    where: { id: connection.id },
    data: { lastSyncAt: new Date() },
  });

  return NextResponse.json({ nouvelles, erreurs });
}
