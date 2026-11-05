import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour
        </Link>
      </p>

      <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">Mentions légales</h1>
      <p className="mb-8 text-xs text-neutral-400">Dernière mise à jour : novembre 2025</p>

      <div className="space-y-8 text-sm text-neutral-700 dark:text-neutral-300">

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">1. Éditeur du site</h2>
          <p>
            <strong>Nom :</strong> Florent Maurice<br />
            <strong>Statut juridique :</strong> Entrepreneur individuel<br />
            <strong>SIRET :</strong> En cours d&apos;immatriculation<br />
            <strong>Email :</strong> contact@gestionpark.fr
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">2. Directeur de la publication</h2>
          <p>Florent Maurice, en qualité de responsable du service GestionPark.</p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">3. Hébergement</h2>
          <p>
            L&apos;application est hébergée par :<br />
            <strong>Vercel Inc.</strong> — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — <a href="https://vercel.com" className="underline">vercel.com</a><br /><br />
            La base de données est hébergée par :<br />
            <strong>Supabase Inc.</strong> — infrastructure PostgreSQL — <a href="https://supabase.com" className="underline">supabase.com</a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">4. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus du site (textes, graphismes, logo, code source) est protégé par le droit d&apos;auteur.
            Toute reproduction ou diffusion sans autorisation préalable est interdite.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">5. Données personnelles</h2>
          <p>
            Pour toute information sur le traitement de vos données personnelles, consultez notre{" "}
            <Link href="/confidentialite" className="underline hover:text-neutral-900 dark:hover:text-neutral-100">
              Politique de confidentialité
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">6. Cookies</h2>
          <p>
            Ce site utilise des cookies fonctionnels (support client via Crisp). Votre consentement est demandé
            lors de votre première visite. Vous pouvez le retirer à tout moment en vidant les données de votre
            navigateur pour ce site.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">7. Loi applicable</h2>
          <p>
            Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

      </div>
    </div>
  );
}
