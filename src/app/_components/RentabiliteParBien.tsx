import Link from "next/link";
import type { RentabiliteItem } from "@/lib/dashboard/rentabilite";
import { formaterMontant } from "@/lib/format";

interface Props {
  biens: RentabiliteItem[];
}

function arrondir(n: number) {
  return Math.round(n);
}

export function RentabiliteParBien({ biens }: Props) {
  if (biens.length === 0) return null;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Rentabilité par bien
        </h2>
        <Link href="/biens" className="text-xs text-neutral-500 hover:underline dark:text-neutral-400">
          Gérer →
        </Link>
      </div>

      <div className="space-y-3">
        {biens.map((b) => {
          const taux = b.boxesTotal > 0 ? b.boxesLoues / b.boxesTotal : 0;
          const positif = b.resultatNet >= 0;

          return (
            <div key={b.id} className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-tight text-neutral-900 dark:text-neutral-100">
                  {b.nom}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    positif
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {positif ? "+" : ""}
                  {formaterMontant(arrondir(b.resultatNet))}/mois
                </span>
              </div>

              <div className="mb-2">
                <div className="mb-1 flex justify-between text-xs text-neutral-500">
                  <span>
                    {b.boxesLoues}/{b.boxesTotal} boxes
                  </span>
                  <span>{Math.round(taux * 100)} %</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${Math.round(taux * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-4 text-xs text-neutral-500">
                <span>
                  Loyers{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {formaterMontant(arrondir(b.loyersMensuels))}
                  </span>
                </span>
                <span>
                  Charges{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {formaterMontant(arrondir(b.chargesMensuelles))}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
