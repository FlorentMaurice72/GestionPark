import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(session.user.id) },
  });
  if (!admin?.stripeCustomerId) {
    return NextResponse.json({ error: "Aucun abonnement actif" }, { status: 400 });
  }

  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? process.env.NEXTAUTH_URL ?? "";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: admin.stripeCustomerId,
    return_url: `${origin}/abonnement`,
  });

  return NextResponse.json({ url: portalSession.url });
}
