import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "5 erreurs courantes dans la gestion de boxs de stockage",
  description:
    "Oubli de caution, loyer mal indexé, absence de quittance… Ces erreurs classiques coûtent du temps et de l'argent. Comment les éviter dès le départ.",
};

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-8">
        <Link href="/blog" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour au blog
        </Link>
      </p>

      <p className="mb-3 text-xs text-neutral-400">3 novembre 2025 · 6 min de lecture</p>
      <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "var(--font-montserrat)" }}>
        5 erreurs courantes dans la gestion de boxs de stockage (et comment les éviter)
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-6">

        <p>
          Que vous soyez propriétaire depuis 6 mois ou 6 ans, certaines erreurs reviennent systématiquement.
          Elles sont souvent invisibles au début, mais elles finissent par coûter cher — en temps, en argent,
          ou en conflits avec les locataires.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">1. Ne pas encaisser de dépôt de garantie</h2>

        <p>
          Contrairement aux locations d'habitation, la location de box de stockage n'est pas encadrée par la loi
          de 1989. Ça signifie plus de liberté — mais aussi moins de protection par défaut.
        </p>

        <p>
          Certains propriétaires, pour simplifier l'entrée, renoncent au dépôt de garantie. C'est une erreur.
          En cas de dégâts ou de départ sans préavis, vous n'avez aucun recours immédiat.
        </p>

        <p>
          <strong>La bonne pratique</strong> : exiger systématiquement 1 mois de loyer en dépôt de garantie,
          à mentionner clairement dans le contrat. GestionPark vous rappelle le montant du dépôt dans la fiche
          de chaque locataire.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">2. Ne pas délivrer de quittance</h2>

        <p>
          Le locataire qui paie est en droit de demander une quittance. Beaucoup de propriétaires ne la
          fournissent pas — soit par manque de temps, soit parce qu'ils ne pensent pas que c'est obligatoire.
        </p>

        <p>
          En pratique, l'absence de quittance peut créer des litiges : le locataire prétend avoir payé, vous
          avez du mal à le prouver, ou inversement.
        </p>

        <p>
          <strong>La bonne pratique</strong> : envoyer une quittance PDF par email dès que le paiement est
          enregistré. GestionPark le fait automatiquement le 1er du mois.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">3. Oublier de relancer les impayés</h2>

        <p>
          Un locataire en retard, ça arrive. Le problème, c'est quand on ne s'en rend compte qu'au bout de
          2 mois parce qu'on n'a pas vérifié. À ce stade, la dette est plus difficile à récupérer et le
          locataire s'est installé dans le retard.
        </p>

        <p>
          <strong>La bonne pratique</strong> : relancer dès le 5 du mois si le paiement n'est pas arrivé.
          Un simple email suffit. GestionPark envoie cette relance automatiquement pour chaque location
          concernée.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">4. Ne pas mettre à jour les loyers</h2>

        <p>
          L'inflation existe. Un loyer figé depuis 3 ans représente une perte de rendement réelle. Et quand
          vous voulez finalement l'augmenter, vous vous retrouvez face à un locataire qui ne s'y attend pas
          et qui vit mal la hausse.
        </p>

        <p>
          <strong>La bonne pratique</strong> : prévoir dès le contrat une clause de révision annuelle indexée
          sur l'ILC (Indice des Loyers Commerciaux) ou sur un montant fixe. Communiquez la hausse 3 mois
          avant l'entrée en vigueur.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">5. Gérer de tête sans outil centralisé</h2>

        <p>
          Au-delà de 5 ou 6 locations, gérer de tête devient risqué. On oublie une date d'entrée, on confond
          deux locataires, on n'est plus sûr si Madame Y a bien payé ce mois-ci.
        </p>

        <p>
          Ce n'est pas une question de compétence — c'est une question de volume. L'esprit humain n'est pas
          fait pour tenir des tableaux de suivi fiables sur la durée.
        </p>

        <p>
          <strong>La bonne pratique</strong> : utiliser un logiciel dédié dès la 3ème location. L'investissement
          (moins de 10€/mois) est récupéré dès le premier mois d'impayé détecté à temps.
        </p>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 font-semibold text-neutral-900 dark:text-neutral-100">
            Évitez ces erreurs avec GestionPark
          </p>
          <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            Suivi des dépôts, quittances automatiques, relances au bon moment. 14 jours d'essai gratuit.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          >
            Essayer gratuitement →
          </Link>
        </div>

      </div>
    </div>
  );
}
