import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour
        </Link>
      </p>

      <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">Mentions légales</h1>

      <div className="space-y-6 text-sm text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Éditeur du site</h2>
          <p>
            [À COMPLÉTER] — Nom / raison sociale : [À COMPLÉTER]
            <br />
            Adresse : [À COMPLÉTER]
            <br />
            SIRET (le cas échéant) : [À COMPLÉTER]
            <br />
            Email de contact : [À COMPLÉTER]
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Directeur de la publication</h2>
          <p>[À COMPLÉTER]</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Hébergement</h2>
          <p>
            Application hébergée par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            <br />
            Base de données hébergée par Supabase Inc. (infrastructure PostgreSQL).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Accès à l&apos;application</h2>
          <p>
            Cette application est un outil de gestion interne à usage professionnel, non accessible au public.
            L&apos;accès est réservé aux administrateurs disposant d&apos;un compte.
          </p>
        </section>
      </div>
    </div>
  );
}
