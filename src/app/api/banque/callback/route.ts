import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequisition } from "@/lib/nordigen";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // Nordigen passes back "ref" query param matching the reference we gave
  // Format: gestionpark-{adminId}-{timestamp}
  const ref = searchParams.get("ref") ?? "";
  const parts = ref.split("-");
  const adminId = parts.length >= 2 ? parseInt(parts[1]) : NaN;

  if (isNaN(adminId)) {
    return NextResponse.redirect(new URL("/loyers/banque?erreur=callback", req.url));
  }

  try {
    const connection = await prisma.bankConnection.findFirst({
      where: { adminId, statut: "pending" },
      orderBy: { createdAt: "desc" },
    });

    if (!connection) {
      return NextResponse.redirect(new URL("/loyers/banque?erreur=introuvable", req.url));
    }

    const requisition = await getRequisition(connection.requisitionId);

    if (requisition.accounts && requisition.accounts.length > 0) {
      await prisma.bankConnection.update({
        where: { id: connection.id },
        data: { accountIds: requisition.accounts, statut: "linked" },
      });
    }

    return NextResponse.redirect(new URL("/loyers/banque?connexion=ok", req.url));
  } catch (err) {
    console.error("[banque/callback]", err);
    return NextResponse.redirect(new URL("/loyers/banque?erreur=sync", req.url));
  }
}
