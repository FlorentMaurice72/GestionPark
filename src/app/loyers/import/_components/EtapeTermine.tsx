import Link from "next/link";

export interface ResultatImportAffichage {
  total: number;
  parBien: { label: string; count: number }[];
  nonIdentifies: number;
}

interface Props {
  resultat: ResultatImportAffichage;
  onNouvelImport: () => void;
}

export function EtapeTermine({ resultat, onNouvelImport }: Props) {
  const detailBiens = resultat.parBien.map((b) => `${b.label} : ${b.count}`).join(" / ");

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950/40">
      <p className="text-base font-medium text-green-900 dark:text-green-200">
        Import terminé : {resultat.total} paiement{resultat.total > 1 ? "s" : ""} traité{resultat.total > 1 ? "s" : ""}
        {detailBiens ? ` (${detailBiens})` : ""}.
      </p>
      {resultat.nonIdentifies > 0 && (
        <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
          {resultat.nonIdentifies} transaction{resultat.nonIdentifies > 1 ? "s" : ""} non identifiée
          {resultat.nonIdentifies > 1 ? "s" : ""}, laissée{resultat.nonIdentifies > 1 ? "s" : ""} de côté.
        </p>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={onNouvelImport}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Nouvel import
        </button>
        <Link
          href="/loyers"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Retour à Loyers &amp; Paiements
        </Link>
      </div>
    </div>
  );
}
