"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Composant client : appelle les API Stripe côté client après confirmation.
export default function AbonnementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") setMsg("Abonnement activé. Bienvenue !");
    if (params.get("canceled") === "1") setMsg("Paiement annulé.");
  }, []);

  async function lancerCheckout() {
    setLoading("checkout");
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { setMsg("Erreur lors de la création de la session."); setLoading(null); }
  }

  async function ouvrirPortail() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { setMsg("Aucun abonnement actif."); setLoading(null); }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Mon abonnement
        </h1>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          GestionPark — Accès complet · 19,90 €/mois
        </p>

        {msg && (
          <p className={`mb-4 rounded-md px-3 py-2 text-sm ${
            msg.includes("activé")
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}>
            {msg}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={lancerCheckout}
            disabled={!!loading}
            className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            {loading === "checkout" ? "Redirection…" : "S'abonner — 19,90 €/mois"}
          </button>

          <button
            onClick={ouvrirPortail}
            disabled={!!loading}
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {loading === "portal" ? "Redirection…" : "Gérer mon abonnement"}
          </button>
        </div>

        <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Link
            href="/"
            className="text-sm text-neutral-500 underline hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ← Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
