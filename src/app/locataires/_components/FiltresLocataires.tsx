"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { OptionSimple } from "@/lib/locataires/data";

interface Props {
  biens: OptionSimple[];
  statut: string;
  bienId: number | null;
  recherche: string;
}

export function FiltresLocataires({ biens, statut, bienId, recherche }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
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
        <label className="mb-1 block text-xs font-medium text-neutral-500">Statut</label>
        <select
          value={statut}
          onChange={(e) => navigate({ statut: e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="actif">Actifs</option>
          <option value="archivé">Archivés</option>
          <option value="tous">Tous</option>
        </select>
      </div>

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
        <label className="mb-1 block text-xs font-medium text-neutral-500">Recherche (nom)</label>
        <input
          type="search"
          defaultValue={recherche}
          onChange={(e) => navigate({ q: e.target.value })}
          placeholder="Nom ou prénom…"
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>
    </div>
  );
}
