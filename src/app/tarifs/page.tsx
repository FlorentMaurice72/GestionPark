import Link from "next/link";
import type { Metadata } from "next";
import { PricingSection } from "@/app/_components/PricingSection";

export const metadata: Metadata = {
  title: "Tarifs — GestionPark",
  description:
    "Plans Essentiel (9,90 €/mois) et Pro (24,90 €/mois). 14 jours d'essai gratuit sans carte bancaire. Logiciel de gestion de boxs de stockage.",
};

function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-100 px-6 py-3">
      <Link href="/" className="flex items-center gap-2">
        <svg width="26" height="20" viewBox="0 0 80 60" aria-hidden="true">
          <polygon points="30,4 50,14 30,24 10,14" fill="#20B2AA" />
          <polygon points="10,14 30,24 30,42 10,32" fill="#0097A7" />
          <polygon points="30,24 50,14 50,32 30,42" fill="#0047AB" />
          <polygon points="50,18 62,24 50,30 38,24" fill="#20B2AA" />
          <polygon points="50,30 62,24 62,38 50,44" fill="#0047AB" />
          <circle cx="26" cy="40" r="8" fill="#0097A7" />
          <circle cx="26" cy="40" r="3.5" fill="white" />
          <rect x="32" y="37" width="17" height="5" rx="2" fill="#0097A7" />
        </svg>
        <span className="text-sm font-bold tracking-wide" style={{ color: "#0F2C59", fontFamily: "var(--font-montserrat, sans-serif)" }}>
          GESTIONPARK
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
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
  );
}

type ValeurCellule = boolean | string;

const COMPARAISON: { categorie: string; items: { label: string; essentiel: ValeurCellule; pro: ValeurCellule }[] }[] = [
  {
    categorie: "Gestion des biens",
    items: [
      { label: "Nombre de boxes", essentiel: "Jusqu'à 30", pro: "Illimité" },
      { label: "Multi-biens / multi-bâtiments", essentiel: true, pro: true },
      { label: "Tableau de bord et KPIs", essentiel: true, pro: true },
      { label: "Rentabilité par bien (loyers/charges)", essentiel: true, pro: true },
    ],
  },
  {
    categorie: "Paiements et loyers",
    items: [
      { label: "Suivi des paiements mensuels", essentiel: true, pro: true },
      { label: "Import CSV bancaire (toutes banques FR)", essentiel: true, pro: true },
      { label: "Connexion bancaire DSP2 (automatique)", essentiel: false, pro: true },
      { label: "Rapprochement automatique", essentiel: false, pro: true },
      { label: "Détection des impayés", essentiel: true, pro: true },
      { label: "Relances par email/SMS", essentiel: true, pro: true },
      { label: "Relances automatiques programmées", essentiel: false, pro: true },
    ],
  },
  {
    categorie: "Locataires et documents",
    items: [
      { label: "Fiches locataires complètes", essentiel: true, pro: true },
      { label: "Quittances PDF automatiques", essentiel: true, pro: true },
      { label: "Envoi email des quittances", essentiel: true, pro: true },
      { label: "Révision IRL automatique", essentiel: true, pro: true },
      { label: "Historique complet des locations", essentiel: true, pro: true },
      { label: "Stockage de documents (baux, pièces)", essentiel: true, pro: true },
    ],
  },
  {
    categorie: "Statistiques et rapports",
    items: [
      { label: "Graphiques 12 mois (loyers, occupation)", essentiel: true, pro: true },
      { label: "Export CSV des données", essentiel: true, pro: true },
      { label: "Statistiques avancées et rapports", essentiel: false, pro: true },
    ],
  },
  {
    categorie: "Support",
    items: [
      { label: "Support par email", essentiel: true, pro: true },
      { label: "Support prioritaire", essentiel: false, pro: true },
      { label: "Onboarding personnalisé", essentiel: false, pro: true },
    ],
  },
];

const FAQ_TARIFS = [
  {
    q: "Est-ce que je paie si je ne suis pas satisfait ?",
    r: "Non. Les 14 jours d'essai sont 100 % gratuits, sans carte bancaire requise. Vous ne serez prélevé qu'à la fin de la période d'essai, si vous choisissez de continuer.",
  },
  {
    q: "Que se passe-t-il si je dépasse 30 boxes avec l'Essentiel ?",
    r: "Vous recevrez une notification et pourrez passer au Pro en un clic depuis votre espace. Vos données sont conservées et aucune migration n'est nécessaire.",
  },
  {
    q: "Puis-je changer de plan pendant l'essai ?",
    r: "Oui, à tout moment. Vous pouvez commencer avec l'Essentiel et passer au Pro si vous avez besoin des relances automatiques ou de la connexion bancaire DSP2.",
  },
  {
    q: "Comment fonctionne la facturation annuelle ?",
    r: "Vous payez une fois par an et économisez l'équivalent de 2 mois par rapport à la facturation mensuelle. La facture est générée automatiquement et envoyée par email.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    r: "Oui, sans frais ni préavis. Résiliez en un clic depuis votre espace facturation. Vos données restent accessibles 30 jours après la date de fin d'abonnement.",
  },
  {
    q: "La connexion bancaire DSP2 est-elle sécurisée ?",
    r: "Oui. La connexion DSP2 (disponible en Pro) utilise les APIs bancaires officielles, sans jamais stocker vos identifiants. Elle est réglementée par la Banque de France.",
  },
];

function Cellule({ valeur }: { valeur: ValeurCellule }) {
  if (typeof valeur === "string") {
    return <span className="text-sm font-medium text-neutral-700">{valeur}</span>;
  }
  if (valeur) {
    return <span className="text-green-500 text-base font-bold">✓</span>;
  }
  return <span className="text-neutral-300 text-sm">—</span>;
}

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Nav />

      {/* Hero */}
      <section className="px-6 py-14 text-center">
        <div
          className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{ borderColor: "#0097A7", color: "#0097A7", backgroundColor: "#f0fbfc" }}
        >
          14 jours d&apos;essai gratuit · Sans carte bancaire
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight" style={{ color: "#0F2C59" }}>
          Des tarifs simples, sans surprise
        </h1>
        <p className="mx-auto max-w-xl text-lg text-neutral-500">
          Un seul abonnement par compte, deux formules selon vos besoins. Changez de plan à tout moment.
        </p>
      </section>

      {/* Plans */}
      <PricingSection />

      {/* Trust signals */}
      <section className="border-y border-neutral-100 bg-neutral-50 px-6 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: "⟳",
              titre: "Sans engagement",
              desc: "Résiliez quand vous voulez, sans frais de résiliation ni préavis.",
            },
            {
              icon: "⬡",
              titre: "Données sécurisées",
              desc: "Hébergement Europe, HTTPS, sauvegarde quotidienne. Vos données vous appartiennent.",
            },
            {
              icon: "◎",
              titre: "Support réactif",
              desc: "Réponse sous 24h par email pour tous les plans. Prioritaire en Pro.",
            },
          ].map((item) => (
            <div key={item.titre} className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg text-white"
                style={{ backgroundColor: "#0097A7" }}
              >
                {item.icon}
              </div>
              <div>
                <p className="mb-1 font-semibold text-neutral-900">{item.titre}</p>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold" style={{ color: "#0F2C59" }}>
              Comparatif détaillé
            </h2>
            <p className="text-sm text-neutral-500">Tout ce qui est inclus dans chaque plan.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full min-w-[500px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="py-3 pl-5 pr-3 text-left font-semibold text-neutral-500 w-1/2">
                    Fonctionnalités
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-neutral-700 w-1/4">
                    Essentiel
                    <div className="text-xs font-normal text-neutral-400">9,90 €/mois</div>
                  </th>
                  <th className="py-3 px-4 text-center w-1/4" style={{ color: "#0047AB" }}>
                    <div className="font-semibold">Pro</div>
                    <div className="text-xs font-normal text-neutral-400">24,90 €/mois</div>
                    <div
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: "#0047AB" }}
                    >
                      Recommandé
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARAISON.map((groupe) => (
                  <>
                    <tr key={groupe.categorie} className="bg-neutral-50">
                      <td
                        colSpan={3}
                        className="py-2 pl-5 text-xs font-semibold uppercase tracking-wide text-neutral-400"
                      >
                        {groupe.categorie}
                      </td>
                    </tr>
                    {groupe.items.map((item, i) => (
                      <tr
                        key={item.label}
                        className={`border-t border-neutral-100 ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}
                      >
                        <td className="py-3 pl-5 pr-3 text-neutral-700">{item.label}</td>
                        <td className="py-3 px-4 text-center">
                          <Cellule valeur={item.essentiel} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Cellule valeur={item.pro} />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                  <td className="py-4 pl-5 text-sm font-semibold text-neutral-700">
                    Commencer gratuitement (14 jours)
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      href="/signup?plan=essentiel"
                      className="inline-block rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
                    >
                      Essayer
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      href="/signup?plan=pro"
                      className="inline-block rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      style={{ backgroundColor: "#0047AB" }}
                    >
                      Essayer
                    </Link>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold" style={{ color: "#0F2C59" }}>
              Questions sur les tarifs
            </h2>
            <p className="text-sm text-neutral-500">Les réponses aux questions les plus fréquentes.</p>
          </div>
          <div className="space-y-3">
            {FAQ_TARIFS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-neutral-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-neutral-900 marker:content-none">
                  {faq.q}
                  <span className="shrink-0 text-neutral-400 transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-500">
                  {faq.r}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-12 text-center">
        <p className="mb-4 text-neutral-500 text-sm">
          Des questions ?{" "}
          <a href="mailto:contact@gestionpark.fr" className="underline hover:text-neutral-700">
            Contactez-nous
          </a>{" "}
          — nous répondons sous 24h.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-md px-6 py-3 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: "#0047AB" }}
        >
          Créer mon compte gratuitement →
        </Link>
      </section>
    </div>
  );
}
