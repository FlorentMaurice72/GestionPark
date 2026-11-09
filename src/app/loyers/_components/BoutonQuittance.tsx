"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";

interface Props {
  locationId: number;
  mois: number;
  annee: number;
}

export function BoutonQuittance({ locationId, mois, annee }: Props) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function telecharger() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/quittance/${locationId}/${mois}/${annee}`);
      if (!res.ok) throw new Error("Génération échouée");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quittance-${mois}-${annee}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      addToast("Impossible de générer la quittance.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={telecharger}
      disabled={loading}
      className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
    >
      {loading ? (
        <span className="flex items-center gap-1">
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          PDF…
        </span>
      ) : (
        "Quittance"
      )}
    </button>
  );
}
