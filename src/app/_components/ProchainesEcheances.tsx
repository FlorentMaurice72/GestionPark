import Link from "next/link";
import type { Echeance, TypeEcheance } from "@/lib/echeancier/data";

const TYPE_COULEUR: Record<TypeEcheance, string> = {
  relance: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  avis_loyer: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  fin_bail: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const TYPE_LABEL: Record<TypeEcheance, string> = {
  relance: "Relance",
  avis_loyer: "Avis loyer",
  fin_bail: "Fin bail",
};

const formatterDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

export function ProchainesEcheances({ echeances }: { echeances: Echeance[] }) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Prochaines échéances
        </h2>
        <Link
          href="/echeancier"
          className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          Voir tout →
        </Link>
      </div>

      {echeances.length === 0 ? (
        <p className="px-5 py-6 text-center text-xs text-neutral-400">
          Aucune échéance à venir
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {echeances.map((e) => (
            <li key={e.id} className="flex items-center gap-3 px-5 py-3">
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${TYPE_COULEUR[e.type]}`}>
                {TYPE_LABEL[e.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-neutral-800 dark:text-neutral-200">{e.locataireNom}</p>
                <p className="truncate text-xs text-neutral-400">{e.bienNom} · Box {e.boxNumero}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {e.priorite === "haute" && (
                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white">!</span>
                )}
                <span className="text-xs text-neutral-500">{formatterDate.format(e.dateEcheance)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
