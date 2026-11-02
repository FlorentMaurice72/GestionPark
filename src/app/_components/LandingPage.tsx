import Link from "next/link";
import { PricingSection } from "./PricingSection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
        <span className="text-xl font-bold tracking-tight">GestionPark</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
          Spécialisé boxes de stockage
        </div>
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Gérez vos boxes de stockage.
          <br />
          En toute autonomie.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-neutral-500 dark:text-neutral-400">
          Suivi des locations, paiements, locataires et biens depuis un seul tableau de bord.
          Sans agence, sans Excel.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Créer mon compte gratuitement
          </Link>
          <a
            href="#fonctionnalites"
            className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Voir les fonctionnalités
          </a>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-neutral-400">
          <span>✓ Essai gratuit</span>
          <span>✓ Sans engagement</span>
          <span>✓ Multi-biens</span>
        </div>
      </section>

      {/* ── Problème / Solution ─────────────────────────────────────── */}
      <section className="bg-neutral-50 px-6 py-16 dark:bg-neutral-900">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              <span>✕</span> Le problème
            </div>
            <h2 className="mb-4 text-xl font-bold">Beaucoup de boxes = beaucoup de gestion.</h2>
            <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              {[
                "Suivre qui a payé, qui ne paie plus",
                "Relancer les impayés à la main chaque mois",
                "Retrouver quel box appartient à quel locataire",
                "Importer les relevés bancaires et les rapprocher",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 text-red-400">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
              <span>✓</span> La solution GestionPark
            </div>
            <h2 className="mb-4 text-xl font-bold">Centralisez et automatisez.</h2>
            <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              {[
                "Tableau de bord multi-biens en temps réel",
                "Import CSV bancaire avec matching automatique",
                "Relances configurables par locataire",
                "Documents centralisés : baux, quittances, charges",
                "Historique complet de chaque location",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Fonctionnalités ─────────────────────────────────────────── */}
      <section id="fonctionnalites" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Conçu pour les loueurs de boxes</h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Des outils adaptés à la gestion de multiples unités de stockage.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                icon: "⊞",
                titre: "Gestion Multi-Biens",
                desc: "Gérez plusieurs bâtiments avec leurs boxes depuis un seul compte. Vue globale du taux d'occupation et des revenus.",
              },
              {
                icon: "⟳",
                titre: "Import CSV Bancaire",
                desc: "Importez votre relevé Crédit Mutuel ou autre banque. GestionPark identifie automatiquement les loyers reçus.",
              },
              {
                icon: "◎",
                titre: "Suivi des Paiements",
                desc: "Visualisez en un coup d'œil qui a payé, qui est en retard, et quel montant est attendu ce mois-ci.",
              },
              {
                icon: "△",
                titre: "Locataires & Documents",
                desc: "Fiches locataires complètes avec historique, baux, quittances et pièces justificatives centralisés.",
              },
            ].map((f) => (
              <div
                key={f.titre}
                className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-lg dark:bg-neutral-800">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold">{f.titre}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ───────────────────────────────────────── */}
      <section className="bg-neutral-50 px-6 py-16 dark:bg-neutral-900">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Vos boxes se gèrent tout seuls</h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Démarrez en quelques minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { n: "1", titre: "Créez votre compte", desc: "Inscription en 2 minutes, aucune carte bancaire requise." },
              { n: "2", titre: "Ajoutez vos biens et boxes", desc: "Saisissez vos bâtiments, vos boxes et vos locataires." },
              { n: "3", titre: "Gérez depuis le tableau de bord", desc: "Importez vos relevés, suivez les paiements, relancez les impayés." },
            ].map((e) => (
              <div key={e.n} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
                  {e.n}
                </div>
                <h3 className="mb-2 font-semibold">{e.titre}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarifs ──────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── CTA final ───────────────────────────────────────────────── */}
      <section className="bg-neutral-900 px-6 py-16 text-center dark:bg-neutral-100">
        <h2 className="mb-3 text-3xl font-bold text-white dark:text-neutral-900">
          Prêt à automatiser la gestion de vos boxes ?
        </h2>
        <p className="mb-8 text-neutral-400 dark:text-neutral-600">
          Rejoignez les loueurs qui pilotent leur activité sans agence.
        </p>
        <Link
          href="/signup"
          className="rounded-md bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          Créer mon compte gratuitement →
        </Link>
      </section>
    </div>
  );
}
