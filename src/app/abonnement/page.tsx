"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Plan = "essentiel" | "pro";
type Periode = "mensuel" | "annuel";

const PLANS = {
  essentiel: {
    nom: "Essentiel",
    prixMensuel: 9.9,
    prixAnnuel: 99,
    features: [
      "Jusqu'à 30 boxes",
      "Suivi des paiements",
      "Quittances automatiques",
      "Dossiers locataires",
      "Import CSV bancaire",
    ],
  },
  pro: {
    nom: "Pro",
    prixMensuel: 24.9,
    prixAnnuel: 249,
    features: [
      "Boxes illimités",
      "Connexion bancaire DSP2",
      "Rapprochement automatique",
      "Relances automatiques",
      "Statistiques avancées",
    ],
  },
};

export default function AbonnementPage() {
  const [plan, setPlan] = useState<Plan>("pro");
  const [periode, setPeriode] = useState<Periode>("annuel");
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") setMsg("Abonnement activé. Bienvenue !");
    if (params.get("canceled") === "1") setMsg("Paiement annulé.");
    const p = params.get("plan");
    if (p === "essentiel" || p === "pro") setPlan(p);
    const per = params.get("periode");
    if (per === "mensuel") setPeriode("mensuel");
  }, []);

  async function lancerCheckout() {
    setLoading("checkout");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, periode }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMsg(data.error ?? "Erreur lors de la création de la session.");
    } catch {
      setMsg("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(null);
    }
  }

  async function ouvrirPortail() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMsg(data.error ?? "Aucun abonnement actif.");
    } catch {
      setMsg("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(null);
    }
  }

  const infoPlan = PLANS[plan];
  const prix = periode === "annuel" ? infoPlan.prixAnnuel : infoPlan.prixMensuel;
  const economie = periode === "annuel"
    ? (infoPlan.prixMensuel * 12 - infoPlan.prixAnnuel).toFixed(0)
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="w-full max-w-2xl">
        <h1 className="mb-1 text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Choisissez votre formule
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          14 jours gratuits pour tout tester. Aucun prélèvement aujourd&apos;hui.
        </p>

        {msg && (
          <p className={`mb-6 rounded-md px-3 py-2 text-sm text-center ${
            msg.includes("activé")
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}>
            {msg}
          </p>
        )}

        {/* Toggle périodicité */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
            <button
              onClick={() => setPeriode("mensuel")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                periode === "mensuel"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setPeriode("annuel")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                periode === "annuel"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
              }`}
            >
              Annuel
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                periode === "annuel"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
              }`}>
                2 mois offerts
              </span>
            </button>
          </div>
        </div>

        {/* Cartes formules */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(Object.entries(PLANS) as [Plan, typeof PLANS[Plan]][]).map(([id, p]) => {
            const prixCarte = periode === "annuel" ? p.prixAnnuel : p.prixMensuel;
            const selected = plan === id;
            return (
              <button
                key={id}
                onClick={() => setPlan(id)}
                className={`rounded-xl border-2 p-6 text-left transition-all ${
                  selected
                    ? "border-neutral-900 dark:border-neutral-100"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{p.nom}</p>
                    <div className="mt-1">
                      <span className="text-2xl font-bold">{prixCarte.toFixed(0)} €</span>
                      <span className="text-sm text-neutral-500"> {periode === "annuel" ? "/ an" : "/ mois"}</span>
                    </div>
                    {periode === "annuel" && (
                      <p className="text-xs text-neutral-400">
                        soit {(p.prixAnnuel / 12).toFixed(2)} €/mois
                      </p>
                    )}
                  </div>
                  <div className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    selected
                      ? "border-neutral-900 bg-neutral-900 dark:border-neutral-100 dark:bg-neutral-100"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}>
                    {selected && (
                      <span className="text-xs text-white dark:text-neutral-900">✓</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <span className="mt-0.5 text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Récap + CTA */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {infoPlan.nom} · {periode === "annuel" ? "Annuel" : "Mensuel"}
            </span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">
              {prix.toFixed(0)} €{periode === "annuel" ? "/an" : "/mois"}
            </span>
          </div>
          {economie && (
            <p className="mb-4 text-sm text-green-600 dark:text-green-400">
              Vous économisez {economie} € par rapport au tarif mensuel.
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={lancerCheckout}
              disabled={!!loading}
              className="w-full rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
            >
              {loading === "checkout" ? "Redirection…" : "Commencer l'essai gratuit →"}
            </button>

            <button
              onClick={ouvrirPortail}
              disabled={!!loading}
              className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              {loading === "portal" ? "Redirection…" : "Gérer mon abonnement existant"}
            </button>
          </div>

          <div className="mt-4 space-y-1 text-xs text-neutral-400">
            <p>✓ 0 € prélevé aujourd&apos;hui — la carte sert à démarrer l&apos;abonnement après l&apos;essai.</p>
            <p>✓ Annulation en un clic avant la fin des 14 jours.</p>
            <p>✓ Rappel par email 3 jours avant le premier prélèvement.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-neutral-500 underline hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
