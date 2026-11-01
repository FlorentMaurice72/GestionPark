import Link from "next/link";
import { NOMS_MOIS } from "@/lib/dates";
import type { DernierImport } from "@/lib/dashboard/data";

function formaterDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}

export function ImportTimeline({ dernierImport, mois }: { dernierImport: DernierImport | null; mois: number }) {
  if (dernierImport) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-sm dark:border-green-900 dark:bg-green-900/10">
        <p className="text-green-800 dark:text-green-300">
          Dernier import : {formaterDate(dernierImport.date)} ({NOMS_MOIS[dernierImport.mois - 1]}{" "}
          {dernierImport.annee})
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-900/10">
      <p className="text-amber-800 dark:text-amber-300">
        ⚠ Aucun import effectué ce mois ({NOMS_MOIS[mois - 1]})
      </p>
      <Link
        href="/loyers/import"
        className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
      >
        Importer le CSV
      </Link>
    </div>
  );
}
