import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Import CSV bancaire : automatisez le rapprochement de vos loyers",
  description:
    "Vérifier chaque virement un à un prend un temps fou. Découvrez comment l'import CSV bancaire transforme cette tâche en 30 secondes.",
};

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-8">
        <Link href="/blog" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          ← Retour au blog
        </Link>
      </p>

      <p className="mb-3 text-xs text-neutral-400">28 octobre 2025 · 4 min de lecture</p>
      <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "var(--font-montserrat)" }}>
        Import CSV bancaire : automatisez le rapprochement de vos loyers
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-6">

        <p>
          Fin de mois. Vous ouvrez votre relevé bancaire, vous cherchez les virements de vos locataires, vous les
          cochez un par un dans votre tableau… 45 minutes plus tard, vous avez fini. Et vous recommencerez le mois
          prochain. Et celui d'après.
        </p>

        <p>
          Il existe une meilleure façon de faire.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Qu'est-ce que l'import CSV bancaire ?</h2>

        <p>
          Toutes les banques permettent d'exporter votre historique de transactions dans un fichier CSV (un fichier
          texte que vous pouvez ouvrir dans Excel ou importer dans un logiciel).
        </p>

        <p>
          GestionPark lit ce fichier et fait correspondre automatiquement chaque virement avec le locataire
          concerné, en se basant sur le libellé du virement, le montant et la date.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Comment ça marche en pratique ?</h2>

        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Exportez votre relevé</strong> : depuis l'interface web de votre banque, exportez les transactions
            du mois en format CSV. Cette option s'appelle généralement "Télécharger" ou "Exporter" dans la
            rubrique "Mes opérations".
          </li>
          <li>
            <strong>Glissez le fichier dans GestionPark</strong> : sur la page "Loyers → Import", déposez votre
            fichier CSV. Le logiciel l'analyse en quelques secondes.
          </li>
          <li>
            <strong>Validez les correspondances</strong> : GestionPark vous présente les virements détectés avec le
            locataire associé. Vous confirmez ou corrigez en un clic.
          </li>
          <li>
            <strong>C'est terminé</strong> : les paiements sont enregistrés, les quittances peuvent être générées,
            les relances sont désactivées pour les locataires qui ont payé.
          </li>
        </ol>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Quelles banques sont compatibles ?</h2>

        <p>
          Le format CSV est un standard universel. GestionPark est compatible avec les exports de toutes les
          banques françaises, notamment :
        </p>

        <ul className="list-disc pl-5 space-y-1">
          <li>BNP Paribas</li>
          <li>Société Générale</li>
          <li>Crédit Agricole</li>
          <li>LCL</li>
          <li>Boursorama</li>
          <li>La Banque Postale</li>
          <li>Qonto, Shine (néobanques professionnelles)</li>
        </ul>

        <p>
          Si votre banque n'est pas dans la liste ou si le format ne correspond pas, contactez-nous —
          nous ajoutons les nouveaux formats en priorité.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8">Et si un virement n'est pas reconnu ?</h2>

        <p>
          Certains locataires utilisent des libellés de virement inhabituels (leurs initiales, un surnom, le numéro
          du box…). Dans ce cas, GestionPark vous présente le virement comme "non rapproché" et vous pouvez
          l'associer manuellement au bon locataire. Cette correspondance est mémorisée pour les mois suivants.
        </p>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 font-semibold text-neutral-900 dark:text-neutral-100">
            Essayez l'import CSV gratuitement
          </p>
          <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            14 jours d'essai gratuit, sans carte bancaire. Importez votre premier relevé dès aujourd'hui.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: "#0047AB" }}
          >
            Commencer l&apos;essai gratuit →
          </Link>
        </div>

      </div>
    </div>
  );
}
