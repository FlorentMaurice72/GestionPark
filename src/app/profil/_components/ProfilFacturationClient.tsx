"use client";

import { useState } from "react";
import Link from "next/link";

export function ProfilFacturationClient({
  hasStripeCustomer,
}: {
  hasStripeCustomer: boolean;
}) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function ouvrirPortail() {
    setLoading("portal");
    setMsg(null);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { setMsg("Impossible d'ouvrir le portail de facturation."); setLoading(null); }
  }

  return (
    <div className="space-y-3">
      {msg && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {msg}
        </p>
      )}

      {hasStripeCustomer && (
        <button
          onClick={ouvrirPortail}
          disabled={!!loading}
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dk disabled:opacity-50"
        >
          {loading === "portal" ? "Redirection…" : "Gérer mon abonnement →"}
        </button>
      )}

      <Link
        href="/abonnement"
        className="block w-full rounded-md border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        {hasStripeCustomer ? "Changer de formule" : "Souscrire un abonnement →"}
      </Link>
    </div>
  );
}
