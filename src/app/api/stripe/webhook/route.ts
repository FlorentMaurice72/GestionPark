import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Webhook Stripe — événements traités :
//   checkout.session.completed       → abonnement créé après paiement
//   customer.subscription.updated    → changement de statut
//   customer.subscription.deleted    → résiliation

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Signature manquante" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;
      const adminId = session.subscription_data?.metadata?.adminId
        ?? (session as { metadata?: Record<string, string> }).metadata?.adminId;
      if (!adminId) break;

      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      await prisma.admin.update({
        where: { id: parseInt(adminId) },
        data: {
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status,
          subscriptionCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const adminId = sub.metadata?.adminId;
      if (!adminId) {
        // Cherche par stripeSubscriptionId si pas de metadata
        const admin = await prisma.admin.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (!admin) break;
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            subscriptionStatus: sub.status,
            subscriptionCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
      } else {
        await prisma.admin.update({
          where: { id: parseInt(adminId) },
          data: {
            subscriptionStatus: sub.status,
            subscriptionCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
