import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment gérer vos boxs de stockage sans Excel",
  description:
    "Excel est gratuit mais limité pour gérer des boxs de stockage. Découvrez pourquoi un logiciel dédié vous fait gagner du temps et évite les erreurs.",
};

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-8">
        <Link href="/blog" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour au blog
        </Link>
      </p>

      <p className="mb-3 text-xs text-neutral-400">15 octobre 2025 · 5 min de lecture</p>
      <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "var(--font-montserrat)" }}>
        Comment gérer vos boxs de stockage sans Excel
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-6">

        <p>
          Quand vous avez 2 ou 3 boxs à louer, Excel fait le job. Mais dès que vous passez à une dizaine de locations,
          les limites deviennent vite évidentes : formules cassées, doublons, oublis de relance, temps passé à
          reconcilier les virements… C'est précisément là qu'un logiciel dédié change la donne.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Les limites d'Excel pour la gestion locative</h2>

        <p>
          Excel est un outil généraliste. Il n'a pas été conçu pour gérer des contrats de location, des relances
          automatiques ou des quittances de loyer. Voici les problèmes les plus fréquents que rencontrent les
          propriétaires de boxs :
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Rapprochement bancaire manuel</strong> : chaque mois, vous comparez votre tableau avec vos relevés
            de compte un virement à la fois. Avec 20 locataires, ça prend facilement 1 heure.
          </li>
          <li>
            <strong>Relances oubliées</strong> : sans alerte automatique, il est facile d'oublier de relancer un
            locataire en retard. Quelques jours de retard deviennent des semaines.
          </li>
          <li>
            <strong>Quittances chronophages</strong> : générer une quittance PDF par locataire, par mois, dans Excel
            est laborieux. Certains propriétaires y passent une demi-journée chaque mois.
          </li>
          <li>
            <strong>Pas de vue multi-biens</strong> : si vous avez des boxs dans plusieurs entrepôts, Excel ne vous
            donne pas de vue consolidée.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Ce qu'un logiciel dédié change concrètement</h2>

        <p>
          Un logiciel comme GestionPark est conçu pour répondre exactement à ces problèmes. Voici ce que ça change
          au quotidien :
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Import CSV en 30 secondes</strong> : vous exportez votre relevé bancaire depuis votre banque,
            vous le glissez dans le logiciel, et les paiements sont rapprochés automatiquement.
          </li>
          <li>
            <strong>Relances automatiques</strong> : le logiciel envoie un email de relance aux locataires en retard
            le 5 du mois, sans intervention de votre part.
          </li>
          <li>
            <strong>Quittances PDF en 1 clic</strong> : toutes les quittances du mois sont générées et envoyées
            automatiquement aux locataires qui ont payé.
          </li>
          <li>
            <strong>Tableau de bord multi-biens</strong> : vous voyez d'un coup d'œil le taux d'occupation,
            les impayés et les paiements reçus sur l'ensemble de votre parc.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Combien de temps gagne-t-on vraiment ?</h2>

        <p>
          Nos utilisateurs nous rapportent en moyenne <strong>2 à 3 heures économisées par mois</strong> pour 15 à
          20 locations. Sur un an, c'est plus d'une journée de travail épargnée — pour un abonnement qui coûte
          moins de 10€ par mois.
        </p>

        <p>
          Mais au-delà du temps, c'est surtout la <strong>tranquillité d'esprit</strong> qui revient dans les
          retours : ne plus craindre d'avoir oublié une relance, ne plus chercher dans son historique bancaire si
          Monsieur X a bien payé.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">La migration depuis Excel</h2>

        <p>
          La transition est plus simple qu'on ne le croit. GestionPark permet d'importer vos données existantes
          et de continuer depuis où vous en êtes. Pas besoin de tout ressaisir.
        </p>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 font-semibold text-neutral-900 dark:text-neutral-100">
            Essayez GestionPark gratuitement pendant 14 jours
          </p>
          <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            Aucune carte bancaire requise. Accès complet à toutes les fonctionnalités pendant 14 jours.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          >
            Créer un compte gratuit →
          </Link>
        </div>

      </div>
    </div>
  );
}
