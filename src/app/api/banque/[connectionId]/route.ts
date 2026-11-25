import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ connectionId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);
  const { connectionId: idStr } = await params;
  const connectionId = parseInt(idStr);

  if (isNaN(connectionId)) {
    return NextResponse.json({ error: "Paramètre invalide" }, { status: 400 });
  }

  const connection = await prisma.bankConnection.findFirst({
    where: { id: connectionId, adminId: userId },
  });

  if (!connection) {
    return NextResponse.json({ error: "Connexion introuvable" }, { status: 404 });
  }

  await prisma.bankConnection.delete({ where: { id: connectionId } });

  return NextResponse.json({ ok: true });
}
