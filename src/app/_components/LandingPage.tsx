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
      <nav className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800 md:px-6">
        <div className="flex items-center gap-2">
          <LogoSVG size={30} />
          <span
            className="text-lg font-bold tracking-wide text-nuit dark:text-white"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            GESTIONPARK
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/tarifs"
            className="hidden text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 sm:block"
          >
            Tarifs
          </Link>
          <Link
            href="/demo"
            className="hidden text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 sm:block"
          >
            Démo
          </Link>
          <Link
            href="/login"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:opacity-90 md:px-4"
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
            href="/demo"
            className="flex items-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            <span style={{ color: "#0097A7" }}>▶</span> Essayer la démo →
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-neutral-400">
          <span>✓ Essai gratuit 14 jours</span>
          <span>✓ Sans engagement</span>
          <span>✓ Multi-biens</span>
          <span>✓ Support client disponible</span>
          <span>✓ Données hébergées en Europe</span>
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

      {/* ── Aperçu du tableau de bord ─────────────────────────────── */}
      <section className="py-6 pb-16 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
            Aperçu du tableau de bord
          </p>
          <div className="rounded-xl border border-neutral-200 shadow-2xl dark:border-neutral-700 overflow-hidden" style={{ background: "#f8fafc" }}>
            <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md bg-white border border-neutral-200 px-3 py-1 text-xs text-neutral-400 dark:bg-neutral-900 dark:border-neutral-700" style={{ minWidth: 200, maxWidth: 300 }}>
                <span style={{ color: "#0097A7" }}>🔒</span> gestionpark.fr/dashboard
              </div>
            </div>
            <div className="flex" style={{ minHeight: 320 }}>
              <div className="hidden sm:flex flex-col items-center gap-1 border-r border-neutral-200 bg-white px-3 py-4 dark:border-neutral-700 dark:bg-neutral-900" style={{ width: 56 }}>
                {[
                  { icon: "⊞", active: true },
                  { icon: "◈", active: false },
                  { icon: "◉", active: false },
                  { icon: "⊕", active: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm ${item.active ? "text-white" : "text-neutral-400"}`}
                    style={item.active ? { backgroundColor: "#0047AB" } : {}}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
              <div className="flex-1 overflow-hidden p-4 sm:p-5" style={{ background: "#f8fafc" }}>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Taux d'occupation", val: "88 %", sub: "14 / 16 boxes", color: "#0047AB" },
                    { label: "Loyers encaissés", val: "7 240 €", sub: "ce mois", color: "#0097A7" },
                    { label: "Impayés", val: "2", sub: "à relancer", color: "#EF4444" },
                    { label: "Locataires actifs", val: "14", sub: "en cours", color: "#0F2C59" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                      <p className="mb-1 text-[10px] text-neutral-400">{kpi.label}</p>
                      <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.val}</p>
                      <p className="text-[10px] text-neutral-400">{kpi.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <p className="mb-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Loyers encaissés — 12 derniers mois</p>
                  <div className="flex items-end gap-1 h-16">
                    {[65, 72, 68, 70, 75, 73, 80, 85, 83, 88, 90, 88].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i === 11 ? "#0047AB" : "#0097A7", opacity: i === 11 ? 1 : 0.6 }} />
                    ))}
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-neutral-300">
                    <span>Déc</span><span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span>
                    <span>Jun</span><span>Jul</span><span>Aoû</span><span>Sep</span><span>Oct</span><span className="font-bold" style={{ color: "#0047AB" }}>Nov</span>
                  </div>
                </div>
              </div>
            </div>
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
                titre: "Tableau de bord multi-biens",
                desc: "Vue globale en temps réel : taux d'occupation, loyers encaissés, impayés du mois et rentabilité par bâtiment sur 12 mois.",
              },
              {
                icon: "⟳",
                titre: "Import CSV bancaire",
                desc: "Collez votre relevé Crédit Mutuel, BNP, LCL ou Société Générale. GestionPark identifie automatiquement les loyers et les affecte au bon locataire.",
              },
              {
                icon: "◎",
                titre: "Suivi des paiements & impayés",
                desc: "Chaque mois, visualisez d'un coup d'œil qui a payé, qui est en retard. Relancez par email ou SMS directement depuis l'interface.",
              },
              {
                icon: "△",
                titre: "Locataires & documents",
                desc: "Fiches locataires avec historique complet, baux, pièces justificatives et quittances PDF générées automatiquement après chaque paiement.",
              },
              {
                icon: "✦",
                titre: "Révision de loyer (IRL / ICC)",
                desc: "GestionPark suit les dates de révision de chaque bail — IRL pour les logements, ICC pour les boxes commerciaux — et envoie un rappel automatique 30 jours avant l'échéance.",
              },
              {
                icon: "◑",
                titre: "Rentabilité & statistiques",
                desc: "Pour chaque bien : loyers mensuels, charges, résultat net, et évolution sur 12 mois. Des chiffres clairs pour prendre les bonnes décisions.",
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
              {
                q: "Y a-t-il une démo sans inscription ?",
                r: "Oui ! Vous pouvez accéder à un compte démo pré-rempli avec de vraies données fictives pour tester toutes les fonctionnalités. Cliquez sur \"Essayer la démo\" en haut de page.",
              },
              {
                q: "Puis-je annuler à tout moment ?",
                r: "Oui, sans frais ni préavis. Résiliez en un clic depuis votre espace facturation. Vos données restent accessibles 30 jours après la résiliation.",
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
