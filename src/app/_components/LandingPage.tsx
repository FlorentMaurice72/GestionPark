import Link from "next/link";
import { PricingSection } from "./PricingSection";

function LogoSVG({ size = 28 }: { size?: number }) {
  const h = Math.round(size * 0.75);
  return (
    <svg width={size} height={h} viewBox="0 0 80 60" aria-hidden="true">
      <polygon points="30,4 50,14 30,24 10,14" fill="#20B2AA" />
      <polygon points="10,14 30,24 30,42 10,32" fill="#0097A7" />
      <polygon points="30,24 50,14 50,32 30,42" fill="#0047AB" />
      <polygon points="50,18 62,24 50,30 38,24" fill="#20B2AA" />
      <polygon points="50,30 62,24 62,38 50,44" fill="#0047AB" />
      <circle cx="26" cy="40" r="8" fill="#0097A7" />
      <circle cx="26" cy="40" r="3.5" fill="white" />
      <rect x="32" y="37" width="17" height="5" rx="2" fill="#0097A7" />
      <rect x="42" y="42" width="3.5" height="3.5" fill="#0097A7" />
      <rect x="47" y="42" width="3.5" height="3.5" fill="#0097A7" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between border-b border-neutral-100 px-6 py-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <LogoSVG size={30} />
          <span
            className="text-lg font-bold tracking-wide text-nuit dark:text-white"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            GESTIONPARK
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/tarifs"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Tarifs
          </Link>
          <Link
            href="/login"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
             style={{ borderColor: "#0097A7", color: "#0097A7", backgroundColor: "#f0fbfc" }}>
          <LogoSVG size={16} />
          Spécialisé boxs de stockage
        </div>
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Gérez vos boxs de stockage.
          <br />
          <span style={{ color: "#0047AB" }}>En toute autonomie.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-neutral-500 dark:text-neutral-400">
          Suivi des locations, paiements, locataires et biens depuis un seul tableau de bord.
          Sans agence, sans Excel.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-md px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          >
            Créer mon compte gratuitement
          </Link>
          <Link
            href="/videos/anim-marketing.html"
            target="_blank"
            className="flex items-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            <span style={{ color: "#0097A7" }}>▶</span> Voir la démo (1 min)
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-neutral-400">
          <span>✓ Essai gratuit</span>
          <span>✓ Sans engagement</span>
          <span>✓ Multi-biens</span>
          <span>✓ +50 utilisateurs satisfaits</span>
          <span>✓ Support client disponible</span>
          <span>✓ Depuis 2024</span>
        </div>
      </section>

      {/* ── Problème / Solution ─────────────────────────────────────── */}
      <section className="bg-neutral-50 px-6 py-16 dark:bg-neutral-900">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              <span>✕</span> Le problème
            </div>
            <h2 className="mb-4 text-xl font-bold">Beaucoup de boxs = beaucoup de gestion.</h2>
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

          <div className="rounded-xl border bg-white p-8 dark:bg-neutral-800"
               style={{ borderColor: "#0097A7" }}>
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
            <h2 className="mb-3 text-3xl font-bold">Conçu pour les loueurs de boxs</h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Des outils adaptés à la gestion de multiples unités de stockage.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                icon: "⊞",
                titre: "Gestion Multi-Biens",
                desc: "Gérez plusieurs bâtiments avec leurs boxs depuis un seul compte. Vue globale du taux d'occupation et des revenus.",
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
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-lg text-white"
                  style={{ backgroundColor: "#0097A7" }}
                >
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
            <h2 className="mb-3 text-3xl font-bold">Vos boxs se gèrent tout seuls</h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Démarrez en quelques minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { n: "1", titre: "Créez votre compte", desc: "Inscription en 2 minutes, aucune carte bancaire requise." },
              { n: "2", titre: "Ajoutez vos biens et boxs", desc: "Saisissez vos bâtiments, vos boxs et vos locataires." },
              { n: "3", titre: "Gérez depuis le tableau de bord", desc: "Importez vos relevés, suivez les paiements, relancez les impayés." },
            ].map((e) => (
              <div key={e.n} className="text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: "#0047AB" }}
                >
                  {e.n}
                </div>
                <h3 className="mb-2 font-semibold">{e.titre}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ─────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Ils gèrent leurs boxs avec GestionPark</h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Des propriétaires qui ont dit adieu aux tableaux Excel.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                ini: "JP", couleur: "#0047AB",
                nom: "Jean-Pierre M.", detail: "24 boxs · Lyon",
                avis: "J'avais un Excel avec 24 locataires et je passais 2h par mois à faire mes relances. Avec GestionPark, l'import Crédit Mutuel et les relances automatiques tournent tout seuls. Je n'y touche plus.",
                depuis: "Utilisateur depuis mars 2024",
              },
              {
                ini: "SD", couleur: "#0097A7",
                nom: "Sophie D.", detail: "18 boxs · Bordeaux",
                avis: "Ce qui m'a convaincue, c'est l'import CSV de ma banque. En 5 minutes GestionPark identifie les paiements et génère les quittances. Avant je faisais ça à la main chaque 1er du mois.",
                depuis: "Utilisatrice depuis juin 2024",
              },
              {
                ini: "MT", couleur: "#0F2C59",
                nom: "Marc T.", detail: "67 boxs · 3 bâtiments · Nantes",
                avis: "Je gère 3 entrepôts dans deux villes différentes. La vue multi-biens me donne le taux d'occupation et les loyers attendus par bâtiment en temps réel. C'est exactement ce qu'il me fallait.",
                depuis: "Utilisateur depuis septembre 2024",
              },
              {
                ini: "NL", couleur: "#20B2AA",
                nom: "Nathalie L.", detail: "12 boxs · Toulouse",
                avis: "J'ai testé deux autres logiciels avant GestionPark. Ils sont pensés pour l'immobilier classique, pas pour des boxs. GestionPark est le seul qui comprend vraiment ce métier.",
                depuis: "Utilisatrice depuis novembre 2024",
              },
            ].map((t) => (
              <div key={t.nom} className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                {/* Étoiles */}
                <div className="flex gap-0.5 text-sm" style={{ color: "#F59E0B" }}>
                  {"★★★★★"}
                </div>
                {/* Texte */}
                <p className="flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  &ldquo;{t.avis}&rdquo;
                </p>
                {/* Auteur */}
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: t.couleur }}
                  >
                    {t.ini}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t.nom}</p>
                    <p className="text-xs text-neutral-400">{t.detail}</p>
                  </div>
                  <span className="ml-auto text-xs text-neutral-300 dark:text-neutral-600">{t.depuis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarifs ──────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Questions fréquentes</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Tout ce que vous voulez savoir avant de démarrer.</p>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Est-ce vraiment gratuit au départ ?",
                r: "Oui, 14 jours d'essai complet sans carte bancaire. Aucun prélèvement pendant la période d'essai. Un email de rappel est envoyé 3 jours avant la fin.",
              },
              {
                q: "Combien de boxs puis-je gérer ?",
                r: "Le plan Essentiel (9,90 €/mois) gère jusqu'à 30 boxs. Le plan Pro (24,90 €/mois) est illimité, avec connexion bancaire DSP2 et relances automatiques.",
              },
              {
                q: "Mon relevé bancaire est-il compatible ?",
                r: "Oui. GestionPark accepte les exports CSV de toutes les banques françaises : Crédit Mutuel, CIC, BNP Paribas, LCL, Société Générale, Boursorama et bien d'autres.",
              },
              {
                q: "Puis-je gérer plusieurs bâtiments ou sites ?",
                r: "Oui, le multi-biens est inclus dans les deux plans. Vous gérez autant de bâtiments que vous voulez depuis un seul compte avec une vue globale du taux d'occupation.",
              },
              {
                q: "Comment sont générées les quittances ?",
                r: "Après chaque paiement validé, GestionPark génère automatiquement une quittance PDF à votre nom de bailleur. Vous pouvez la télécharger et l'envoyer par email en un clic.",
              },
              {
                q: "Mes données sont-elles sécurisées ?",
                r: "Oui. Les données sont hébergées en Europe, transmises en HTTPS/TLS et sauvegardées quotidiennement. GestionPark ne revend jamais vos données.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-neutral-900 marker:content-none dark:text-neutral-100">
                  {faq.q}
                  <span className="flex-shrink-0 text-neutral-400 transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  {faq.r}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center" style={{ backgroundColor: "#0F2C59" }}>
        <div className="mx-auto mb-4 flex justify-center">
          <LogoSVG size={48} />
        </div>
        <h2 className="mb-3 text-3xl font-bold text-white">
          Prêt à automatiser la gestion de vos boxs ?
        </h2>
        <p className="mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
          Rejoignez les loueurs qui pilotent leur activité sans agence.
        </p>
        <Link
          href="/signup"
          className="rounded-md px-6 py-3 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: "#0097A7" }}
        >
          Créer mon compte gratuitement →
        </Link>
      </section>
    </div>
  );
}
