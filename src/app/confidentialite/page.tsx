import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour
        </Link>
      </p>

      <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Politique de confidentialité
      </h1>

      <div className="space-y-6 text-sm text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Responsable de traitement</h2>
          <p>
            [Florent Maurice] — Nom / raison sociale : [Florent Maurice SA]
            <br />
            Contact : [Florent Maurice
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Données traitées</h2>
          <p>
            Dans le cadre de la gestion locative de box de stockage, cette application traite des données
            concernant les locataires (nom, prénom, coordonnées, adresse) et leur relation contractuelle (bail,
            loyers, paiements, relances). Ces données sont saisies par l&apos;administrateur de l&apos;application,
            pas directement par les locataires.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Finalité et base légale</h2>
          <p>
            Ces données sont traitées pour l&apos;exécution des contrats de location (baux) et leur suivi
            administratif et comptable (loyers, relances, obligations comptables), sur la base de l&apos;exécution
            du contrat et de l&apos;intérêt légitime du bailleur.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Durée de conservation</h2>
          <p>
            À la fin d&apos;une location, le locataire est archivé (ses données sont conservées mais son dossier
            n&apos;apparaît plus comme actif). Les données comptables (paiements, historique de location) sont
            conservées conformément aux obligations légales de conservation des documents comptables (environ 10
            ans en France). L&apos;administrateur peut anonymiser manuellement le dossier d&apos;un locataire
            archivé (nom et coordonnées effacés) lorsque la conservation de son identité n&apos;est plus
            nécessaire ; cette anonymisation n&apos;est pas automatique.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Sous-traitants et hébergement
          </h2>
          <p>
            Les données sont hébergées et traitées par les prestataires suivants, dans le cadre de
            l&apos;hébergement technique de l&apos;application :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Vercel Inc. — hébergement de l&apos;application</li>
            <li>Supabase Inc. — hébergement de la base de données</li>
            <li>Resend — envoi des emails de réinitialisation de mot de passe (compte administrateur uniquement)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Vos droits</h2>
          <p>
            Conformément au RGPD, toute personne concernée dispose d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement et de limitation du traitement de ses données. Pour exercer ces droits, contactez :
            [Florent Maurice].
          </p>
        </section>
      </div>
    </div>
  );
}
