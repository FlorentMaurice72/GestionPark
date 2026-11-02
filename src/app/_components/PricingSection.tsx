"use client";

import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    id: "essentiel",
    nom: "Essentiel",
    desc: "L'essentiel pour gérer vos boxes au quotidien.",
    prixMensuel: 9.9,
    prixAnnuel: 99,
    features: [
      "Jusqu'à 30 boxes",
      "Suivi des paiements",
      "Quittances automatiques",
      "Dossiers locataires",
      "Import CSV bancaire",
      "Support par email",
    ],
    recommande: false,
  },
  {
    id: "pro",
    nom: "Pro",
    desc: "La gestion complète avec automatisation et statistiques avancées.",
    prixMensuel: 24.9,
    prixAnnuel: 249,
    features: [
      "Boxes illimités",
      "Tout de l'Essentiel, plus :",
      "Connexion bancaire DSP2",
      "Rapprochement automatique",
      "Relances automatiques",
      "Statistiques avancées",
      "Support prioritaire",
    ],
    recommande: true,
  },
];

export function PricingSection() {
  const [annuel, setAnnuel] = useState(true);

  return (
    <section id="tarifs" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold">Choisissez votre formule</h2>
          <p className="mb-8 text-neutral-500 dark:text-neutral-400">
            14 jours gratuits pour tout tester. Aucun prélèvement aujourd&apos;hui.
          </p>

          {/* Toggle mensuel / annuel */}
          <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-900">
            <button
              onClick={() => setAnnuel(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !annuel
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnuel(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                annuel
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
              }`}
            >
              Annuel
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                2 mois offerts
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const prix = annuel ? plan.prixAnnuel : plan.prixMensuel;
            const economie = annuel
              ? (plan.prixMensuel * 12 - plan.prixAnnuel).toFixed(0)
              : null;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.recommande
                    ? "border-neutral-900 dark:border-neutral-100"
                    : "border-neutral-200 dark:border-neutral-700"
                }`}
              >
                {plan.recommande && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                      Recommandé
                    </span>
                  </div>
                )}

                <p className="mb-1 text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {plan.nom}
                </p>
                <div className="mb-1">
                  <span className="text-4xl font-bold">{prix.toFixed(0).replace(".", ",")} €</span>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {annuel ? " / an" : " / mois"}
                  </span>
                </div>
                {annuel && (
                  <p className="mb-1 text-sm text-neutral-400">
                    soit {(plan.prixAnnuel / 12).toFixed(2).replace(".", ",")} €/mois
                  </p>
                )}
                {economie && (
                  <p className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    {economie} € économisés / an
                  </p>
                )}
                <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">{plan.desc}</p>

                <ul className="mb-8 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0 text-green-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/signup?plan=${plan.id}&periode=${annuel ? "annuel" : "mensuel"}`}
                  className={`block w-full rounded-md px-4 py-3 text-center text-sm font-medium transition-colors ${
                    plan.recommande
                      ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                      : "border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  }`}
                >
                  Commencer gratuitement
                </Link>
                <p className="mt-2 text-center text-xs text-neutral-400">
                  14 jours gratuits · Sans engagement
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-400">
          Vous pourrez changer de formule pendant l&apos;essai.
        </p>
      </div>
    </section>
  );
}
