"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { OptionSimple } from "@/lib/loyers/data";
import type { StatutPaiement } from "@/lib/paiements";
import { NOMS_MOIS } from "@/lib/dates";

const OPTIONS_STATUT: { valeur: StatutPaiement; label: string }[] = [
  { valeur: "impaye", label: "Impayé" },
  { valeur: "impaye_partiel", label: "Impayé (partiel)" },
  { valeur: "paye", label: "Payé" },
  { valeur: "trop_percu", label: "Trop-perçu" },
];

interface Props {
  biens: OptionSimple[];
  locatairesDisponibles: OptionSimple[];
  boxesDisponibles: OptionSimple[];
  anneesDisponibles: number[];
  bienId: number | null;
  mois: number;
  annee: number;
  locataireId: number | null;
  boxId: number | null;
  statut: StatutPaiement | null;
}

export function FiltresBar({
  biens,
  locatairesDisponibles,
  boxesDisponibles,
  anneesDisponibles,
  bienId,
  mois,
  annee,
  locataireId,
  boxId,
  statut,
}: Props) {
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
        <label className="mb-1 block text-xs font-medium text-neutral-500">Vue</label>
        <select
          value={bienId ?? "all"}
          onChange={(e) => navigate({ vue: e.target.value === "all" ? null : e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Tous les biens</option>
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
          <select
            value={annee}
            onChange={(e) => navigate({ annee: e.target.value })}
            aria-label="Sélection rapide de l'année"
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
          >
            {anneesDisponibles.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Locataire</label>
        <select
          value={locataireId ?? "all"}
          onChange={(e) => navigate({ locataire: e.target.value === "all" ? null : e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Tous</option>
          {locatairesDisponibles.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Box</label>
        <select
          value={boxId ?? "all"}
          onChange={(e) => navigate({ box: e.target.value === "all" ? null : e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Tous</option>
          {boxesDisponibles.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Statut</label>
        <select
          value={statut ?? "all"}
          onChange={(e) => navigate({ statut: e.target.value === "all" ? null : e.target.value })}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Tous</option>
          {OPTIONS_STATUT.map((o) => (
            <option key={o.valeur} value={o.valeur}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
