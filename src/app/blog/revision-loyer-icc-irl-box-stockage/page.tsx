import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://gestionpark.fr";
const SLUG = "revision-loyer-icc-irl-box-stockage";

export const metadata: Metadata = {
  title: "Révision de loyer ICC/IRL pour les boxs de stockage : calcul et application",
  description:
    "Comment calculer et appliquer la révision de loyer ICC ou IRL pour vos boxs de stockage. Formule, indices INSEE, exemples chiffrés et automatisation.",
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/blog/${SLUG}`,
    title: "Révision de loyer ICC/IRL pour les boxs de stockage",
    description: "Formule de calcul, indices INSEE, exemples chiffrés et automatisation avec GestionPark.",
    siteName: "GestionPark",
    locale: "fr_FR",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "GestionPark" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Révision de loyer ICC/IRL pour les boxs de stockage",
    description: "Formule, indices INSEE et automatisation. Tout ce qu'il faut savoir.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const ARTICLE_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Révision de loyer ICC/IRL pour les boxs de stockage : calcul et application",
  description:
    "Comment calculer et appliquer la révision de loyer ICC ou IRL pour vos boxs de stockage. Formule, indices INSEE, exemples chiffrés et automatisation.",
  datePublished: "2025-11-15",
  dateModified: "2025-11-15",
  url: `${SITE_URL}/blog/${SLUG}`,
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${SLUG}` },
  author: { "@type": "Organization", name: "GestionPark", url: SITE_URL },
  publisher: { "@type": "Organization", name: "GestionPark", url: SITE_URL },
};

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <JsonLd data={ARTICLE_LD} />

      <p className="mb-8">
        <Link href="/blog" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour au blog
        </Link>
      </p>

      <p className="mb-3 text-xs text-neutral-400">15 novembre 2025 · 7 min de lecture</p>
      <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "var(--font-montserrat)" }}>
        Révision de loyer ICC/IRL pour les boxs de stockage : comment calculer et appliquer la revalorisation
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-6">

        <p>
          Vous louez des boxs de stockage et votre bail prévoit une clause de révision annuelle ? C&apos;est une
          bonne pratique — mais encore faut-il l&apos;appliquer correctement. Entre l&apos;IRL et l&apos;ICC, les indices
          trimestriels de l&apos;INSEE, et la formule de calcul, beaucoup de propriétaires passent à côté ou
          appliquent la mauvaise valeur. Voici tout ce qu&apos;il faut savoir.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">IRL ou ICC : quelle différence pour les boxs ?</h2>

        <p>
          Deux indices coexistent selon la nature du bail :
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>L&apos;IRL (Indice de Référence des Loyers)</strong> est prévu pour les locations d&apos;habitation
            et les logements meublés. Il est publié chaque trimestre par l&apos;INSEE.
          </li>
          <li>
            <strong>L&apos;ICC (Indice du Coût de la Construction)</strong> s&apos;applique aux baux commerciaux
            antérieurs à la loi Pinel de 2014. Il est lui aussi trimestriel.
          </li>
        </ul>

        <p>
          Pour les boxs de stockage loués à des particuliers, l&apos;IRL est le plus fréquent.
          Pour les baux commerciaux (entreprises, artisans), c&apos;est l&apos;ICC — ou l&apos;ILC (Indice des Loyers
          Commerciaux) pour les baux signés après 2014. Vérifiez toujours la clause de votre bail.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">La formule de calcul</h2>

        <p>La révision se calcule toujours de la même façon :</p>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-900">
          Loyer révisé = Loyer actuel × (Indice T / Indice T&#x2011;1&nbsp;an)
        </div>

        <p>
          Où <strong>T</strong> est le dernier trimestre connu à la date de révision,
          et <strong>T-1&nbsp;an</strong> est le même trimestre de l&apos;année précédente.
        </p>

        <p>
          Il est interdit d&apos;utiliser deux indices du même trimestre pour T et T-1 : on compare toujours
          un T3 avec le T3 de l&apos;année précédente, jamais un T3 avec un T2.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Exemple concret avec l&apos;IRL 2026</h2>

        <p>
          Disons que votre bail prévoit une révision IRL chaque 1er septembre. L&apos;indice IRL publié
          par l&apos;INSEE pour T3 2026 est <strong>148,06</strong>. L&apos;indice IRL de T3 2025 était <strong>144,41</strong>.
        </p>

        <p>Votre locataire paie actuellement <strong>120&nbsp;€/mois</strong>. Le nouveau loyer serait :</p>

        <div className="rounded-lg border border-blue-100 bg-blue-50 px-5 py-4 font-mono text-sm dark:border-blue-900/40 dark:bg-blue-900/10">
          120 × (148,06 / 144,41) = 120 × 1,0253 ≈ <strong>123,03&nbsp;€</strong>
        </div>

        <p>
          Soit une hausse de <strong>+2,53&nbsp;%</strong>, soit 3,03&nbsp;€ de plus par mois.
          Sur l&apos;année, c&apos;est 36&nbsp;€ supplémentaires que vous avez le droit de percevoir — et que vous
          perdez si vous n&apos;appliquez pas la révision.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Quand appliquer la révision ?</h2>

        <p>
          La révision s&apos;applique à la date anniversaire prévue dans le bail, généralement chaque année.
          Attention : elle n&apos;est pas automatique. Si vous n&apos;en faites pas la demande, vous ne pouvez
          pas rétroactivement récupérer les mois passés (sauf clause contraire dans le bail).
        </p>

        <p>
          Vous pouvez envoyer un courrier simple ou un email de notification au locataire, avec le
          calcul détaillé et la référence de l&apos;indice utilisé. Ce n&apos;est pas une obligation légale mais
          une bonne pratique qui évite les contestations.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Les erreurs classiques à éviter</h2>

        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Utiliser l&apos;indice du mauvais trimestre.</strong> L&apos;INSEE publie les indices avec
            environ 2 mois de décalage. En septembre 2026, le T3 2026 peut ne pas encore être disponible :
            utilisez toujours le dernier indice publié disponible à la date de révision.
          </li>
          <li>
            <strong>Comparer des trimestres différents.</strong> T3 2026 / T2 2025 est une erreur.
            Il faut comparer T3 2026 / T3 2025.
          </li>
          <li>
            <strong>Oublier la révision plusieurs années de suite.</strong> Si vous oubliez une année,
            vous ne pouvez pas doubler la hausse l&apos;année suivante. Chaque révision repart du loyer
            révisé de l&apos;année précédente.
          </li>
          <li>
            <strong>Ne pas prévoir la clause dans le bail.</strong> Sans clause de révision, vous ne
            pouvez pas augmenter le loyer unilatéralement.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Comment automatiser la révision avec GestionPark</h2>

        <p>
          Faire le calcul à la main pour 5, 10 ou 30 boxs chaque année, c&apos;est chronophage et source
          d&apos;erreurs. GestionPark intègre nativement la révision ICC et IRL :
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>
            Vous renseignez l&apos;indice (IRL ou ICC) et la date de révision dans la fiche de chaque location.
          </li>
          <li>
            L&apos;application vous alerte <strong>30 jours avant</strong> chaque échéance depuis le tableau de bord.
          </li>
          <li>
            Elle calcule automatiquement le nouveau loyer avec les indices INSEE les plus récents.
          </li>
          <li>
            En un clic, vous appliquez la révision : le loyer est mis à jour et la date d&apos;échéance
            est avancée d&apos;un an.
          </li>
        </ul>

        <p>
          Vous pouvez aussi appliquer toutes les révisions en retard en une seule action depuis la
          page dédiée, sans avoir à traiter chaque bail un par un.
        </p>

        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-6 py-5 dark:border-blue-900/40 dark:bg-blue-900/10">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Essayez GestionPark gratuitement
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            14 jours d&apos;essai complet, sans carte bancaire. Révisions ICC/IRL incluses dès le premier plan.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-md px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          >
            Créer mon compte →
          </Link>
        </div>

      </div>
    </div>
  );
}
