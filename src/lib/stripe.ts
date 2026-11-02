import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getInstance(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
    _stripe = new Stripe(key, { apiVersion: "2026-10-28.endive" });
  }
  return _stripe;
}

// Proxy transparent : stripe.xxx.yyy() fonctionne comme avant,
// mais l'instance n'est créée qu'au premier appel réel (pas au build).
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const instance = getInstance();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? (value as Function).bind(instance) : value;
  },
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
