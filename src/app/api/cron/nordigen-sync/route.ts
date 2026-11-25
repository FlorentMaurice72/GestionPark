import { prisma } from "@/lib/prisma";
import { getAccountTransactions, extractTransactionId, extractLibelle } from "@/lib/nordigen";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const connections = await prisma.bankConnection.findMany({
    where: { statut: "linked" },
  });

  let totalNouvelles = 0;
  let totalErreurs = 0;

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - 7);
  const dateFromStr = dateFrom.toISOString().slice(0, 10);

  for (const connection of connections) {
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
                adminId: connection.adminId,
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
            totalNouvelles++;
          } catch {
            // duplicate — skip
          }
        }
      } catch (err) {
        console.error(`[cron/nordigen-sync] account ${accountId}:`, err);
        totalErreurs++;
      }
    }

    await prisma.bankConnection.update({
      where: { id: connection.id },
      data: { lastSyncAt: new Date() },
    });
  }

  return Response.json({ connections: connections.length, totalNouvelles, totalErreurs });
}
