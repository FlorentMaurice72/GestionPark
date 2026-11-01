"use client";

import { useMemo, useState } from "react";
import type { LigneCharge } from "@/lib/finances/data";
import { TYPES_CHARGE, libelleTypeDocument } from "@/lib/documents/types";
import { formaterMontant } from "@/lib/format";

function formaterDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}

export function ChargesTable({ charges }: { charges: LigneCharge[] }) {
  const [filtreType, setFiltreType] = useState<string>("tous");

  const chargesFiltrees = useMemo(
    () => (filtreType === "tous" ? charges : charges.filter((c) => c.chargeType === filtreType)),
    [charges, filtreType],
  );
  const total = chargesFiltrees.reduce((acc, c) => acc + c.chargeMontant, 0);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Charges de l&apos;année</h3>
        <select
          value={filtreType}
          onChange={(e) => setFiltreType(e.target.value)}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="tous">Tous types</option>
          {TYPES_CHARGE.map((t) => (
            <option key={t.valeur} value={t.valeur}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {chargesFiltrees.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          Aucune charge pour cette sélection.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500 dark:border-neutral-800">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Bien</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Montant</th>
              </tr>
            </thead>
            <tbody>
              {chargesFiltrees.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                  <td className="px-4 py-3">{formaterDate(c.dateDocument)}</td>
                  <td className="px-4 py-3">{c.bienNom}</td>
                  <td className="px-4 py-3">{libelleTypeDocument(c.type)}</td>
                  <td className="px-4 py-3 text-neutral-500">{c.description ?? "—"}</td>
                  <td className="px-4 py-3">{formaterMontant(c.chargeMontant)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-neutral-200 font-medium dark:border-neutral-800">
                <td className="px-4 py-3" colSpan={4}>
                  Total
                </td>
                <td className="px-4 py-3">{formaterMontant(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
