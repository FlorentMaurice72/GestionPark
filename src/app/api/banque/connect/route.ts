import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInstitutions, createRequisition } from "@/lib/nordigen";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);

  const body = (await req.json()) as { institutionId?: string };
  const { institutionId } = body;
  if (!institutionId) {
    return NextResponse.json({ error: "institutionId requis" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const redirectUrl = `${origin}/api/banque/callback`;
  const reference = `gestionpark-${userId}-${Date.now()}`;

  try {
    const institutions = await getInstitutions("FR");
    const institution = institutions.find((i) => i.id === institutionId);
    if (!institution) {
      return NextResponse.json({ error: "Banque introuvable" }, { status: 404 });
    }

    const requisition = await createRequisition({ institutionId, redirectUrl, reference });

    await prisma.bankConnection.create({
      data: {
        adminId: userId,
        institutionId,
        institutionName: institution.name,
        institutionLogo: institution.logo,
        requisitionId: requisition.id,
        statut: "pending",
      },
    });

    return NextResponse.json({ link: requisition.link });
  } catch (err) {
    console.error("[banque/connect]", err);
    return NextResponse.json({ error: "Erreur lors de la connexion bancaire" }, { status: 502 });
  }
}
