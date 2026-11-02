import Link from "next/link";
import type { Echeance, TypeEcheance } from "@/lib/echeancier/data";

const TYPE_CONFIG: Record<TypeEcheance, { label: string; couleur: string }> = {
  relance: { label: "Relance impayé", couleur: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  avis_loyer: { label: "Avis de loyer", couleur: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  fin_bail: { label: "Fin de bail", couleur: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

const formatterDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

function EcheanceCard({ e }: { e: Echeance }) {
  const config = TYPE_CONFIG[e.type];
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${config.couleur}`}>
            {config.label}
          </span>
          {e.priorite === "haute" && (
            <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              Urgent
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{e.titre}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{e.description}</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          {e.bienNom} · Box {e.boxNumero}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          {formatterDate.format(e.dateEcheance)}
        </span>
        <Link
          href={e.lien}
          className="rounded border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Voir →
        </Link>
      </div>
    </div>
  );
}

export function EcheancierSection({ titre, echeances }: { titre: string; echeances: Echeance[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {titre}
        <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          {echeances.length}
        </span>
      </h2>
      {echeances.map((e) => (
        <EcheanceCard key={e.id} e={e} />
      ))}
    </section>
  );
}
