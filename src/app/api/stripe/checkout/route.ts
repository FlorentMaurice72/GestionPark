import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

const PRICE_IDS: Record<string, string | undefined> = {
  "essentiel-mensuel": process.env.STRIPE_PRICE_ID_ESSENTIEL_MONTHLY,
  "essentiel-annuel":  process.env.STRIPE_PRICE_ID_ESSENTIEL_ANNUAL,
  "pro-mensuel":       process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
  "pro-annuel":        process.env.STRIPE_PRICE_ID_PRO_ANNUAL,
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const plan: string = body.plan ?? "pro";
  const periode: string = body.periode ?? "annuel";
  const priceId = PRICE_IDS[`${plan}-${periode}`];
  if (!priceId) {
    return NextResponse.json({ error: "Formule inconnue ou prix non configuré" }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(session.user.id) },
  });
  if (!admin) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? process.env.NEXTAUTH_URL ?? "";

  let customerId = admin.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: admin.email,
      metadata: { adminId: String(admin.id) },
    });
    customerId = customer.id;
    await prisma.admin.update({
      where: { id: admin.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/abonnement?success=1`,
    cancel_url: `${origin}/abonnement?canceled=1&plan=${plan}&periode=${periode}`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { adminId: String(admin.id), plan, periode },
    },
    payment_method_collection: "always",
  });

  return NextResponse.json({ url: checkoutSession.url });
}
