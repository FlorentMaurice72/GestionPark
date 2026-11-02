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
  if (!admin) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? process.env.NEXTAUTH_URL ?? "";

  // Réutilise le customer Stripe existant ou en crée un nouveau.
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
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/abonnement?success=1`,
    cancel_url: `${origin}/abonnement?canceled=1`,
    subscription_data: {
      metadata: { adminId: String(admin.id) },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
