import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { genererUrlSignee } from "@/lib/supabase-storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Document invalide" }, { status: 400 });
  }

  const document = await prisma.document.findUnique({
    where: { id },
    include: { bien: true },
  });
  if (!document || document.bien.utilisateurId !== userId) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }
  if (document.fileId === "-") {
    return NextResponse.json({ error: "Aucun fichier attaché" }, { status: 404 });
  }

  const url = await genererUrlSignee(document.fileId, 3600);
  return NextResponse.redirect(url);
}
