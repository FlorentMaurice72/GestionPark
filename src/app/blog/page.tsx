import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Conseils gestion de boxs de stockage",
  description:
    "Conseils pratiques, guides et astuces pour gérer vos boxs de stockage en libre-service : loyers, locataires, comptabilité simplifiée.",
};

const ARTICLES = [
  {
    slug: "gerer-ses-boxs-sans-excel",
    titre: "Comment gérer vos boxs de stockage sans Excel",
    extrait:
      "Excel, c'est gratuit — mais c'est aussi une source d'erreurs, de doublons et de nuits sans sommeil. Voici pourquoi un logiciel dédié change tout.",
    date: "15 octobre 2025",
    tempsLecture: "5 min",
  },
  {
    slug: "import-csv-bancaire-loyers",
    titre: "Import CSV bancaire : automatisez le rapprochement de vos loyers",
    extrait:
      "Vos locataires paient, mais vérifier chaque virement un à un prend un temps fou. Découvrez comment l'import CSV transforme cette tâche en 30 secondes.",
    date: "28 octobre 2025",
    tempsLecture: "4 min",
  },
  {
    slug: "5-erreurs-gestion-box-stockage",
    titre: "5 erreurs courantes dans la gestion de boxs de stockage (et comment les éviter)",
    extrait:
      "De l'oubli de caution au loyer mal indexé, ces erreurs classiques coûtent du temps et de l'argent aux propriétaires de boxs. Comment les éviter dès le départ ?",
    date: "3 novembre 2025",
    tempsLecture: "6 min",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-8">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour
        </Link>
      </p>

      <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "var(--font-montserrat)" }}>
        Blog GestionPark
      </h1>
      <p className="mb-10 text-neutral-500 dark:text-neutral-400">
        Conseils pratiques pour les propriétaires de boxs de stockage.
      </p>

      <div className="flex flex-col gap-8">
        {ARTICLES.map((a) => (
          <article key={a.slug} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="mb-2 text-xs text-neutral-400">{a.date} · {a.tempsLecture} de lecture</p>
            <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              <Link href={`/blog/${a.slug}`} className="hover:underline">
                {a.titre}
              </Link>
            </h2>
            <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">{a.extrait}</p>
            <Link
              href={`/blog/${a.slug}`}
              className="text-sm font-medium hover:underline"
              style={{ color: "#0047AB" }}
            >
              Lire l&apos;article →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
