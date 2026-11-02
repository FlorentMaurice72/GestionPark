import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-10-28.endive",
});

export function subscriptionActive(admin: {
  subscriptionStatus: string;
  trialEndsAt: Date | null;
}): boolean {
  if (admin.subscriptionStatus === "active") return true;
  if (admin.subscriptionStatus === "trial" && admin.trialEndsAt) {
    return admin.trialEndsAt > new Date();
  }
  return false;
}

export function joursTrialRestants(trialEndsAt: Date | null): number {
  if (!trialEndsAt) return 0;
  const diff = trialEndsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
