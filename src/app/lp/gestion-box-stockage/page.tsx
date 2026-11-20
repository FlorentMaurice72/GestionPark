import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Logiciel de gestion de box de stockage — GestionPark",
  description:
    "Gérez vos box de stockage en 5 minutes par mois. Loyers, quittances PDF, relances automatiques. À partir de 9,90 €/mois. Essai gratuit sans carte bancaire.",
  robots: { index: true, follow: true },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-[#0047AB]" aria-hidden>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  );
}

export default function LpGestionBoxStockage() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-lato)] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">

      {/* ── Header minimal ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-[family-name:var(--font-montserrat)] text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
            GestionPark
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#0047AB] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003d99]"
          >
            Essai gratuit →
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24">
        <p className="mb-4 inline-block rounded-full border border-[#0047AB]/20 bg-blue-50 px-4 py-1 text-sm font-medium text-[#0047AB] dark:bg-blue-950/30">
          Le seul logiciel pensé pour les bailleurs particuliers de box
        </p>
        <h1 className="font-[family-name:var(--font-montserrat)] mb-6 text-4xl font-black leading-tight tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
          Gérez vos box de stockage<br />
          <span className="text-[#0047AB]">en 5 minutes par mois</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Loyers automatiques, quittances PDF en 1 clic, relances par email — sans tableur Excel, sans oublis, sans stress. À partir de <strong>9,90 €/mois</strong>.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="w-full rounded-xl bg-[#0047AB] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#003d99] sm:w-auto"
          >
            Commencer l&apos;essai gratuit
          </Link>
          <p className="text-sm text-neutral-500">Sans carte bancaire · Sans engagement</p>
        </div>
      </section>

      {/* ── Réassurance ──────────────────────────────────────────────── */}
      <section className="border-y border-neutral-100 bg-neutral-50 py-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {[
            "✓ Essai gratuit 14 jours",
            "✓ Sans carte bancaire",
            "✓ Sans engagement",
            "✓ Données hébergées en France",
            "✓ RGPD",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      {/* ── Le problème ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-montserrat)] mb-4 text-center text-3xl font-black text-neutral-900 dark:text-neutral-100">
          Vous reconnaissez-vous ?
        </h2>
        <p className="mb-12 text-center text-neutral-500">La réalité des bailleurs de box qui gèrent ça en dehors de leur activité principale.</p>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: "📋",
              titre: "Le tableur qui devient ingérable",
              desc: "Un fichier Excel par bailleur, des onglets pour les paiements, des formules qui sautent… Chaque mois c'est une corvée.",
            },
            {
              icon: "🔔",
              titre: "Les relances oubliées",
              desc: "Un locataire en retard, et vous l'apprenez 3 mois après. Sans système de suivi, les impayés s'accumulent silencieusement.",
            },
            {
              icon: "📄",
              titre: "Les quittances à rédiger à la main",
              desc: "Envoyer une quittance de loyer prend 10 minutes si vous êtes organisé. Multiplié par 10 locataires, c'est une heure perdue.",
            },
          ].map((pb) => (
            <div key={pb.titre} className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-3 text-3xl">{pb.icon}</div>
              <h3 className="mb-2 font-[family-name:var(--font-montserrat)] font-bold text-neutral-900 dark:text-neutral-100">
                {pb.titre}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500">{pb.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── La solution ──────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 dark:bg-neutral-900">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-[family-name:var(--font-montserrat)] mb-4 text-center text-3xl font-black text-neutral-900 dark:text-neutral-100">
            GestionPark automatise tout ça
          </h2>
          <p className="mb-12 text-center text-neutral-500">Une application pensée pour les bailleurs qui ont quelques box à gérer, pas un centre de self-stockage de 300 unités.</p>
          <div className="space-y-8">
            {[
              {
                num: "01",
                titre: "Suivi des loyers en temps réel",
                desc: "Visualisez d'un coup d'œil qui a payé, qui est en retard, et quel est votre encaissement du mois. Enregistrez un paiement en 3 secondes.",
                items: ["Tableau de bord clair par bien", "Historique complet des paiements", "Alerte automatique en cas d'impayé"],
              },
              {
                num: "02",
                titre: "Relances automatiques par email",
                desc: "GestionPark envoie automatiquement une relance email à vos locataires en retard. Vous dormez, l'application travaille.",
                items: ["Email de relance personnalisé avec votre nom", "Envoi automatique chaque mois", "Historique de toutes les relances envoyées"],
              },
              {
                num: "03",
                titre: "Quittances et bail PDF en 1 clic",
                desc: "Générez une quittance de loyer ou un bail professionnel en un clic, prêt à envoyer par email. Plus jamais de modèle Word à bricoler.",
                items: ["Quittance conforme aux obligations légales", "Bail de location box inclus", "Export pour votre comptabilité"],
              },
            ].map((feat) => (
              <div key={feat.num} className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row">
                <div className="font-[family-name:var(--font-montserrat)] text-5xl font-black text-neutral-100 dark:text-neutral-800 sm:text-6xl">
                  {feat.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-montserrat)] mb-2 text-xl font-black text-neutral-900 dark:text-neutral-100">
                    {feat.titre}
                  </h3>
                  <p className="mb-4 text-neutral-500">{feat.desc}</p>
                  <ul className="space-y-1.5">
                    {feat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparaison concurrents ───────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-montserrat)] mb-4 text-center text-3xl font-black text-neutral-900 dark:text-neutral-100">
          Pas pour les grands centres. Pour vous.
        </h2>
        <p className="mb-10 text-center text-neutral-500">Les logiciels de self-stockage existants sont conçus pour des entreprises avec 100+ box. GestionPark est fait pour le bailleur particulier.</p>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900">
                <th className="px-4 py-4 text-left font-semibold text-neutral-500"></th>
                <th className="px-4 py-4 text-center font-semibold text-[#0047AB]">GestionPark</th>
                <th className="px-4 py-4 text-center font-semibold text-neutral-400">Logiciels pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {[
                ["Cible", "Bailleurs particuliers (1–50 box)", "Centres pro (100+ box)"],
                ["Prix", "À partir de 9,90 €/mois", "À partir de 139 €/mois"],
                ["Mise en route", "< 15 minutes", "Formation requise"],
                ["Quittances PDF", "✓ Inclus", "Option payante"],
                ["Relances auto", "✓ Inclus", "Module supplémentaire"],
                ["Contrat d'engagement", "Sans engagement", "12 mois minimum"],
              ].map(([label, gp, other]) => (
                <tr key={label} className="bg-white dark:bg-neutral-950">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300">{label}</td>
                  <td className="px-4 py-3 text-center text-[#0047AB] font-semibold">{gp}</td>
                  <td className="px-4 py-3 text-center text-neutral-400">{other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 dark:bg-neutral-900">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-[family-name:var(--font-montserrat)] mb-12 text-center text-3xl font-black text-neutral-900 dark:text-neutral-100">
            Un prix clair, sans surprise
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                plan: "Essentiel",
                prix: "9,90",
                desc: "Pour démarrer et gérer vos box sereinement",
                features: ["Biens, box et locataires illimités", "Suivi des loyers", "Quittances PDF", "Relances email automatiques", "Export comptable CSV"],
                cta: "Commencer gratuitement",
                accent: false,
              },
              {
                plan: "Pro",
                prix: "24,90",
                desc: "Pour les bailleurs avec plusieurs biens",
                features: ["Tout l'Essentiel", "Révision des loyers IRL/ICC", "Avis d'échéance automatique", "Statistiques avancées", "Support prioritaire"],
                cta: "Commencer gratuitement",
                accent: true,
              },
            ].map((p) => (
              <div
                key={p.plan}
                className={`rounded-2xl border p-8 ${p.accent ? "border-[#0047AB] bg-[#0047AB] text-white" : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"}`}
              >
                <p className={`mb-1 text-sm font-semibold ${p.accent ? "text-blue-200" : "text-neutral-500"}`}>{p.plan}</p>
                <p className={`font-[family-name:var(--font-montserrat)] mb-1 text-4xl font-black ${p.accent ? "text-white" : "text-neutral-900 dark:text-neutral-100"}`}>
                  {p.prix} €<span className="text-lg font-normal">/mois</span>
                </p>
                <p className={`mb-6 text-sm ${p.accent ? "text-blue-200" : "text-neutral-500"}`}>{p.desc}</p>
                <ul className="mb-8 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.accent ? "text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 shrink-0 ${p.accent ? "text-blue-200" : "text-[#0047AB]"}`} aria-hidden>
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block rounded-xl px-6 py-3 text-center text-sm font-bold transition ${p.accent ? "bg-white text-[#0047AB] hover:bg-blue-50" : "bg-[#0047AB] text-white hover:bg-[#003d99]"}`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-neutral-500">14 jours d&apos;essai gratuit sur les deux formules · Sans carte bancaire · Résiliable à tout moment</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-montserrat)] mb-10 text-center text-3xl font-black text-neutral-900 dark:text-neutral-100">
          Questions fréquentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "C'est fait pour quel type de bailleur ?",
              a: "GestionPark est conçu pour les particuliers et investisseurs qui possèdent entre 1 et 50 box de stockage dans une résidence, un parking ou un immeuble. Si vous gérez un centre de self-stockage avec 100+ unités, nos concurrents seront plus adaptés.",
            },
            {
              q: "Faut-il un engagement de durée ?",
              a: "Non. L'abonnement est mensuel et résiliable à tout moment depuis votre compte. Vous commencez par 14 jours d'essai gratuit sans carte bancaire.",
            },
            {
              q: "Mes données sont-elles sécurisées ?",
              a: "Oui. Vos données sont hébergées en France, chiffrées en transit (HTTPS) et au repos. GestionPark est conforme RGPD. Vous pouvez exporter et supprimer vos données à tout moment.",
            },
          ].map((item) => (
            <div key={item.q} className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="font-[family-name:var(--font-montserrat)] mb-2 font-bold text-neutral-900 dark:text-neutral-100">
                {item.q}
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section className="bg-[#0047AB] py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-montserrat)] mb-4 text-3xl font-black text-white sm:text-4xl">
            Prêt à passer à l&apos;automatique ?
          </h2>
          <p className="mb-8 text-blue-200">
            Rejoignez les bailleurs qui ont arrêté de gérer leurs box à la main.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-white px-8 py-4 text-base font-bold text-[#0047AB] shadow-lg transition hover:bg-blue-50"
          >
            Commencer l&apos;essai gratuit — sans carte bancaire
          </Link>
          <p className="mt-4 text-sm text-blue-300">14 jours gratuits · Sans engagement · Résiliable à tout moment</p>
        </div>
      </section>

    </div>
  );
}
