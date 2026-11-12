import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "CGU / CGV" };

export default function CguPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour
        </Link>
      </p>

      <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Conditions Générales d&apos;Utilisation et de Vente
      </h1>
      <p className="mb-8 text-xs text-neutral-400">En vigueur depuis le 1er novembre 2026</p>

      <div className="space-y-8 text-sm text-neutral-700 dark:text-neutral-300">

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation et de Vente (CGU/CGV) régissent l&apos;accès et
            l&apos;utilisation du service GestionPark (ci-après « le Service »), application SaaS de gestion locative
            de boxs de stockage, éditée par Florent Maurice (ci-après « l&apos;Éditeur »).
          </p>
          <p className="mt-2">
            L&apos;utilisation du Service implique l&apos;acceptation pleine et entière des présentes CGU/CGV.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">2. Description du service</h2>
          <p>
            GestionPark est une application accessible via navigateur web, conçue pour aider les propriétaires de boxs
            de stockage à gérer leurs locations, paiements, locataires et documents. Le Service comprend notamment :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Tableau de bord multi-biens en temps réel</li>
            <li>Import de relevés bancaires CSV et rapprochement automatique</li>
            <li>Suivi des loyers et alertes impayés</li>
            <li>Génération de quittances PDF</li>
            <li>Gestion des dossiers locataires et documents</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">3. Accès au service et inscription</h2>
          <p>
            L&apos;accès au Service est réservé aux professionnels et particuliers (propriétaires bailleurs) majeurs
            disposant de la capacité juridique. L&apos;utilisateur crée un compte personnel avec son adresse e-mail
            et un mot de passe. Il est responsable de la confidentialité de ses identifiants.
          </p>
          <p className="mt-2">
            Toute inscription donne accès à une période d&apos;essai gratuite de 14 jours, sans engagement, sans
            renseignement obligatoire de coordonnées bancaires.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">4. Plans tarifaires et abonnement</h2>
          <p className="mb-2">À l&apos;issue de la période d&apos;essai, deux formules sont proposées :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Essentiel :</strong> 9,90 € / mois (ou 99 € / an) — jusqu&apos;à 30 boxs.</li>
            <li><strong>Pro :</strong> 24,90 € / mois (ou 249 € / an) — boxs illimités + connexion bancaire DSP2.</li>
          </ul>
          <p className="mt-2">
            Les prix sont en euros TTC. L&apos;abonnement est prélevé automatiquement via Stripe à la date anniversaire.
            En cas de souscription annuelle, un prorata peut s&apos;appliquer si le plan est modifié en cours de période.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">5. Rétractation et résiliation</h2>
          <p>
            Conformément à l&apos;article L221-18 du Code de la consommation, l&apos;utilisateur dispose d&apos;un
            délai de 14 jours à compter de la souscription d&apos;un abonnement payant pour exercer son droit de
            rétractation, sauf si le Service a déjà été pleinement utilisé pendant cette période.
          </p>
          <p className="mt-2">
            La résiliation est possible à tout moment depuis l&apos;espace « Mon compte &gt; Facturation ».
            L&apos;abonnement reste actif jusqu&apos;à la fin de la période déjà payée. Aucun remboursement au prorata
            n&apos;est accordé après la date de renouvellement.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">6. Obligations de l&apos;utilisateur</h2>
          <p>L&apos;utilisateur s&apos;engage à :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Utiliser le Service uniquement à des fins légales et conformément à sa destination ;</li>
            <li>Ne pas tenter de porter atteinte à la sécurité ou à l&apos;intégrité du Service ;</li>
            <li>Respecter la réglementation applicable au traitement des données personnelles de ses locataires (RGPD) ;</li>
            <li>Ne pas céder ses identifiants à des tiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">7. Disponibilité et maintenance</h2>
          <p>
            L&apos;Éditeur s&apos;efforce de maintenir le Service accessible 24h/24, 7j/7. Des interruptions peuvent
            survenir pour maintenance, mises à jour ou incidents techniques. L&apos;Éditeur ne peut être tenu
            responsable d&apos;interruptions ponctuelles ni de pertes de données liées à une défaillance technique
            indépendante de sa volonté.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">8. Propriété intellectuelle</h2>
          <p>
            L&apos;Éditeur est titulaire de tous les droits de propriété intellectuelle relatifs au Service
            (code source, design, marque « GestionPark »). L&apos;abonnement confère à l&apos;utilisateur un droit
            d&apos;usage personnel, non exclusif et non cessible du Service, pour la durée de son abonnement.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">9. Limitation de responsabilité</h2>
          <p>
            GestionPark est un outil d&apos;aide à la gestion. L&apos;Éditeur ne peut être tenu responsable des
            décisions prises par l&apos;utilisateur sur la base des informations affichées. La responsabilité de
            l&apos;Éditeur est limitée au montant des abonnements payés par l&apos;utilisateur au cours des 12
            derniers mois.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">10. Données personnelles</h2>
          <p>
            L&apos;Éditeur traite les données personnelles conformément à sa{" "}
            <Link href="/confidentialite" className="underline hover:text-neutral-900 dark:hover:text-neutral-100">
              Politique de confidentialité
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">11. Modification des CGU</h2>
          <p>
            L&apos;Éditeur se réserve le droit de modifier les présentes CGU/CGV à tout moment. L&apos;utilisateur
            sera informé par e-mail de tout changement substantiel. L&apos;utilisation continue du Service après
            notification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">12. Loi applicable et juridiction</h2>
          <p>
            Les présentes CGU/CGV sont soumises au droit français. En cas de litige, et après tentative de
            résolution amiable, les tribunaux français seront seuls compétents.
          </p>
          <p className="mt-2">
            Pour tout litige de consommation, vous pouvez recourir à la médiation : Commission Européenne de
            règlement en ligne des litiges —{" "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline">
              ec.europa.eu/consumers/odr
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">Contact</h2>
          <p>Pour toute question relative aux présentes CGU/CGV : <strong>contact@gestionpark.fr</strong></p>
        </section>

      </div>
    </div>
  );
}
