"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { OptionSimple } from "@/lib/documents/data";

interface Props {
  biens: OptionSimple[];
  locataires: OptionSimple[];
  bienId: number | null;
  locataireId: number | null;
  annee: number | null;
}

export function FiltresDocuments({ biens, locataires, bienId, locataireId, annee }: Props) {
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

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Bien</label>
        <select
          value={bienId ?? "all"}
          onChange={(e) => navigate({ bien: e.target.value === "all" ? null : e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Tous</option>
          {biens.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Locataire</label>
        <select
          value={locataireId ?? "all"}
          onChange={(e) => navigate({ locataire: e.target.value === "all" ? null : e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Tous</option>
          {locataires.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Année</label>
        <input
          type="number"
          value={annee ?? ""}
          placeholder="Toutes"
          onChange={(e) => navigate({ annee: e.target.value || null })}
          className="w-24 rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>
    </div>
  );
}
