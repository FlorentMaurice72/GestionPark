import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AppNavWrapper } from "@/components/AppNavWrapper";

export const metadata: Metadata = {
  title: "Guide de démarrage — GestionPark",
  description: "Démarrez avec GestionPark en 3 étapes simples.",
};

const ETAPES = [
  {
    numero: "1",
    couleur: "#0047AB",
    titre: "Ajoutez votre premier bien",
    description:
      "Renseignez le nom, l'adresse et les informations financières de votre entrepôt ou parc de boxes.",
    lien: "/biens/nouveau",
    action: "Ajouter un bien",
    details: [
      "Nom du bien (ex. : « Entrepôt Nord »)",
      "Adresse complète",
      "Nombre de boxes et superficie",
      "Charges annuelles : taxe foncière, assurance, emprunt",
    ],
  },
  {
    numero: "2",
    couleur: "#0097A7",
    titre: "Créez vos locataires",
    description:
      "Pour chaque locataire, saisissez ses coordonnées, le ou les boxes occupés et le loyer mensuel.",
    lien: "/locataires/nouveau",
    action: "Ajouter un locataire",
    details: [
      "Nom, prénom et email du locataire",
      "Box(es) occupé(s) — vous pouvez en sélectionner plusieurs",
      "Loyer mensuel et dépôt de garantie",
      "Date d'entrée et type de bail",
    ],
  },
  {
    numero: "3",
    couleur: "#20B2AA",
    titre: "Importez votre relevé bancaire",
    description:
      "Téléchargez votre relevé CSV depuis votre banque. GestionPark reconnaît automatiquement les paiements et détecte le mois concerné.",
    lien: "/loyers/import",
    action: "Importer un CSV",
    details: [
      "Téléchargez votre relevé au format CSV depuis votre espace bancaire",
      "Créez un préréglage pour votre banque (une seule fois)",
      "GestionPark détecte le mois automatiquement",
      "Vérifiez les paiements reconnus avant de confirmer",
    ],
  },
];

export default async function GuidePage() {
  const session = await auth();
  const connecte = !!session?.user?.id;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {connecte ? (
        <AppNavWrapper />
      ) : (
        <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <Link href="/" className="text-sm font-bold tracking-wide text-nuit dark:text-white">
            GESTIONPARK
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dk"
          >
            Se connecter
          </Link>
        </div>
      )}

      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-3xl"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Guide de démarrage
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Configurez GestionPark en <strong className="text-neutral-900 dark:text-neutral-100">3 étapes</strong> et commencez à gérer vos boxes en libre-service.
          </p>
        </div>

        {/* Vidéo démo */}
        <div className="mb-10 overflow-hidden rounded-xl shadow-xl">
          <iframe
            src="/videos/anim-onboarding.html"
            className="aspect-video w-full border-0"
            allow="autoplay"
            title="Démo GestionPark"
          />
        </div>
        <p className="mb-10 text-center text-xs text-neutral-400">
          La vidéo ne s&apos;affiche pas ?{" "}
          <a
            href="/videos/anim-onboarding.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            Ouvrir en plein écran
          </a>
        </p>

        {/* Étapes */}
        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Les 3 étapes essentielles
        </h2>
        <div className="mb-10 flex flex-col gap-5">
          {ETAPES.map((etape) => (
            <div
              key={etape.numero}
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-4 flex items-start gap-4">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: etape.couleur }}
                >
                  {etape.numero}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">
                    {etape.titre}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {etape.description}
                  </p>
                </div>
              </div>

              <ul className="mb-4 ml-13 space-y-1">
                {etape.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400 pl-13">
                    <span className="mt-0.5 flex-shrink-0 text-xs font-bold" style={{ color: etape.couleur }}>✓</span>
                    {d}
                  </li>
                ))}
              </ul>

              {connecte && (
                <div className="ml-13 pl-13">
                  <Link
                    href={etape.lien}
                    className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: etape.couleur }}
                  >
                    {etape.action} →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA si pas connecté */}
        {!connecte && (
          <div className="mb-10 rounded-xl border border-brand bg-blue-50 p-6 text-center dark:border-blue-900 dark:bg-blue-950">
            <p className="mb-4 text-sm font-medium text-blue-800 dark:text-blue-200">
              Prêt à démarrer ? Créez votre compte GestionPark — 14 jours d&apos;essai gratuit, sans CB.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#0047AB" }}
              >
                Créer un compte gratuit
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                Se connecter
              </Link>
            </div>
          </div>
        )}

        {/* Support */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Besoin d&apos;aide ? Ouvrez le chat depuis l&apos;application ou écrivez-nous à{" "}
            <a href="mailto:contact@gestionpark.fr" className="font-medium underline hover:text-neutral-900 dark:hover:text-neutral-100">
              contact@gestionpark.fr
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
