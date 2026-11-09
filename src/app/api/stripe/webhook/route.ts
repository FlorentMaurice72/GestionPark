import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Webhook Stripe — événements traités :
//   checkout.session.completed       → abonnement créé + crédit parrainage parrain
//   customer.subscription.updated    → changement de statut
//   customer.subscription.deleted    → résiliation

async function crediterParrain(filleulAdminId: number): Promise<void> {
  const filleul = await prisma.admin.findUnique({
    where: { id: filleulAdminId },
    select: { referredById: true },
  });
  if (!filleul?.referredById) return;

  const parrain = await prisma.admin.findUnique({
    where: { id: filleul.referredById },
    select: { stripeSubscriptionId: true, stripeCustomerId: true },
  });
  if (!parrain?.stripeSubscriptionId) return;

  // Crée un coupon 100 % pendant 1 mois et l'applique à l'abonnement du parrain.
  const coupon = await stripe.coupons.create({
    percent_off: 100,
    duration: "once",
    name: "1 mois offert — parrainage",
    max_redemptions: 1,
  });
  await stripe.subscriptions.update(parrain.stripeSubscriptionId, {
    discounts: [{ coupon: coupon.id }],
  });
}

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
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const adminId = sub.metadata?.adminId;
      if (!adminId) break;

      const plan = sub.metadata?.plan ?? "essentiel";
      const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
      const numericAdminId = parseInt(adminId);
      await prisma.admin.update({
        where: { id: numericAdminId },
        data: {
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status,
          subscriptionPlan: plan,
          subscriptionCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        },
      });
      // Crédite le parrain si le filleul vient de souscrire.
      await crediterParrain(numericAdminId).catch(() => {});
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const adminId = sub.metadata?.adminId;
      const plan = sub.metadata?.plan;
      const subPeriodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
      const periodEndDate = subPeriodEnd ? new Date(subPeriodEnd * 1000) : null;
      const updateData = {
        subscriptionStatus: sub.status,
        subscriptionCurrentPeriodEnd: periodEndDate,
        ...(plan ? { subscriptionPlan: plan } : {}),
      };
      if (!adminId) {
        const admin = await prisma.admin.findFirst({ where: { stripeSubscriptionId: sub.id } });
        if (!admin) break;
        await prisma.admin.update({ where: { id: admin.id }, data: updateData });
      } else {
        await prisma.admin.update({ where: { id: parseInt(adminId) }, data: updateData });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
