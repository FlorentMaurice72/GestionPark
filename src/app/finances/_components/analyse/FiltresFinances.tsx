"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NOMS_MOIS } from "@/lib/dates";
import type { OptionSimple } from "@/lib/finances/data";

interface Props {
  biens: OptionSimple[];
  bienId: number | null;
  mois: number;
  annee: number;
}

export function FiltresFinances({ biens, bienId, mois, annee }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function allerMoisPrecedent() {
    const [m, a] = mois === 1 ? [12, annee - 1] : [mois - 1, annee];
    navigate({ mois: String(m), annee: String(a) });
  }

  function allerMoisSuivant() {
    const [m, a] = mois === 12 ? [1, annee + 1] : [mois + 1, annee];
    navigate({ mois: String(m), annee: String(a) });
  }

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Bien</label>
        <select
          value={bienId ?? "all"}
          onChange={(e) => navigate({ bien: e.target.value === "all" ? null : e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Vue globale</option>
          {biens.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Période</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={allerMoisPrecedent}
            aria-label="Mois précédent"
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            ←
          </button>
          <span className="min-w-[9rem] text-center text-sm font-medium">
            {NOMS_MOIS[mois - 1]} {annee}
          </span>
          <button
            type="button"
            onClick={allerMoisSuivant}
            aria-label="Mois suivant"
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
