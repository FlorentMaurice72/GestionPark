import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour
        </Link>
      </p>

      <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Politique de confidentialité
      </h1>
      <p className="mb-8 text-xs text-neutral-400">Dernière mise à jour : novembre 2026</p>

      <div className="space-y-8 text-sm text-neutral-700 dark:text-neutral-300">

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">1. Responsable du traitement</h2>
          <p>
            Florent Maurice — GestionPark<br />
            Email : contact@gestionpark.fr
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">2. Données collectées</h2>
          <p className="mb-2">GestionPark collecte les catégories de données suivantes :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Compte utilisateur :</strong> adresse e-mail, mot de passe chiffré (bcrypt), date d&apos;inscription.</li>
            <li><strong>Informations bailleur :</strong> nom / raison sociale, adresse postale (pour les quittances).</li>
            <li><strong>Données locataires :</strong> nom, prénom, adresse, coordonnées, saisies par l&apos;utilisateur.</li>
            <li><strong>Données locatives :</strong> baux, paiements, historiques de location.</li>
            <li><strong>Données de facturation :</strong> identifiant client Stripe, statut et plan d&apos;abonnement (aucune donnée bancaire stockée directement — Stripe est le seul dépositaire).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">3. Finalités et bases légales</h2>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="pb-2 text-left font-semibold text-neutral-900 dark:text-neutral-100">Finalité</th>
                <th className="pb-2 text-left font-semibold text-neutral-900 dark:text-neutral-100">Base légale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {[
                ["Fourniture du service (accès à l'application)", "Exécution du contrat"],
                ["Gestion des abonnements via Stripe", "Exécution du contrat"],
                ["Envoi d'e-mails transactionnels (réinitialisation mdp)", "Intérêt légitime"],
                ["Suivi des locations et génération de quittances", "Exécution du contrat"],
                ["Support client via Crisp (si consentement donné)", "Consentement"],
                ["Obligations comptables et fiscales", "Obligation légale"],
              ].map(([f, b]) => (
                <tr key={f}>
                  <td className="py-2 pr-4">{f}</td>
                  <td className="py-2 text-neutral-500">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">4. Durée de conservation</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Données de compte : durée de vie du compte, puis supprimées sur demande.</li>
            <li>Données locatives et comptables : 10 ans (obligation légale française).</li>
            <li>Données de support (Crisp) : selon la politique de Crisp (généralement 6 mois pour les conversations).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">5. Sous-traitants et transferts</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-2 text-left font-semibold text-neutral-900 dark:text-neutral-100">Prestataire</th>
                  <th className="pb-2 text-left font-semibold text-neutral-900 dark:text-neutral-100">Rôle</th>
                  <th className="pb-2 text-left font-semibold text-neutral-900 dark:text-neutral-100">Localisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {[
                  ["Vercel Inc.", "Hébergement application", "USA (DPA RGPD)"],
                  ["Supabase Inc.", "Base de données PostgreSQL", "USA (DPA RGPD)"],
                  ["Stripe Inc.", "Paiements en ligne", "USA (DPA RGPD)"],
                  ["Resend Inc.", "E-mails transactionnels", "USA (DPA RGPD)"],
                  ["Crisp IM SAS", "Support client (chat)", "France — si consentement"],
                ].map(([p, r, l]) => (
                  <tr key={p}>
                    <td className="py-2 pr-3 font-medium">{p}</td>
                    <td className="py-2 pr-3">{r}</td>
                    <td className="py-2 text-neutral-500">{l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-neutral-400">
            Les transferts hors UE sont encadrés par des clauses contractuelles types (CCT) conformes au RGPD.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">6. Cookies</h2>
          <p className="mb-2">
            Ce site dépose les cookies suivants, uniquement après votre consentement :
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Crisp</strong> — cookies de session pour le support client (chat en direct). Déposés seulement si vous acceptez les cookies.</li>
          </ul>
          <p className="mt-2">
            Un cookie technique <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">gp-cookie-consent</code> est
            enregistré dans votre navigateur pour mémoriser votre choix (aucune donnée personnelle, durée : 12 mois).
          </p>
          <p className="mt-2">
            Vous pouvez retirer votre consentement à tout moment en vidant les données du site dans les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">7. Vos droits</h2>
          <p className="mb-2">Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Accès à vos données personnelles</li>
            <li>Rectification des données inexactes</li>
            <li>Effacement (&laquo;&nbsp;droit à l&apos;oubli&nbsp;&raquo;)</li>
            <li>Limitation du traitement</li>
            <li>Portabilité des données</li>
            <li>Opposition au traitement</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez-nous à : <strong>contact@gestionpark.fr</strong><br />
            En cas de réclamation, vous pouvez saisir la{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline">
              CNIL
            </a>{" "}
            (Commission Nationale de l&apos;Informatique et des Libertés).
          </p>
        </section>

      </div>
    </div>
  );
}
