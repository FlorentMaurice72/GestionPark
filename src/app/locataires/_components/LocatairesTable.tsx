import Link from "next/link";
import type { LocataireListItem } from "@/lib/locataires/data";
import { formaterMontant } from "@/lib/format";

export function LocatairesTable({ locataires }: { locataires: LocataireListItem[] }) {
  if (locataires.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
        Aucun locataire pour cette sélection.
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {locataires.map((l) => (
          <Link
            key={l.id}
            href={`/locataires/${l.id}`}
            className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {l.nom} {l.prenom}
                </p>
                {l.bienNom && (
                  <p className="mt-0.5 text-xs text-neutral-500">{l.bienNom} · {l.boxNumero}</p>
                )}
              </div>
              <span
                className={`mt-0.5 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  l.statut === "actif"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                }`}
              >
                {l.statut === "actif" ? "Actif" : "Archivé"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
              <span>{l.email !== "-" ? l.email : l.telephone !== "-" ? l.telephone : "—"}</span>
              {l.loyerActuel !== null && (
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {formaterMontant(l.loyerActuel)}/mois
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500 dark:border-neutral-800">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Bien / Box</th>
              <th className="px-4 py-3">Loyer</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Contact</th>
            </tr>
          </thead>
          <tbody>
            {locataires.map((l) => (
              <tr key={l.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                <td className="px-4 py-3">
                  <Link href={`/locataires/${l.id}`} className="font-medium hover:underline">
                    {l.nom} {l.prenom}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {l.bienNom ? `${l.bienNom} · ${l.boxNumero}` : "—"}
                </td>
                <td className="px-4 py-3">{l.loyerActuel !== null ? formaterMontant(l.loyerActuel) : "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      l.statut === "actif"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                    }`}
                  >
                    {l.statut === "actif" ? "Actif" : "Archivé"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {l.email !== "-" ? l.email : l.telephone !== "-" ? l.telephone : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
