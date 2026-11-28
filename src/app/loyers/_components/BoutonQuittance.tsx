"use client";

import React, { useState } from "react";
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

    // Open the tab synchronously within the user gesture — popup blockers only
    // allow window.open() in direct response to a click, before any await.
    const win = window.open("about:blank", "_blank");

    try {
      // 1. Fetch quittance data from the API (pure JSON, no PDF server-side)
      const res = await fetch(`/api/quittance/${locationId}/${mois}/${annee}`);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }
      const data = await res.json();

      // 2. Load react-pdf and QuittanceDocument lazily in the browser
      const [{ pdf }, { QuittanceDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/QuittanceDocument"),
      ]);

      // 3. Generate PDF blob client-side (full browser React — no internals issues)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(React.createElement(QuittanceDocument, data) as any).toBlob();

      // 4. Navigate the already-open tab to the blob URL
      const url = URL.createObjectURL(blob);
      if (win && !win.closed) {
        win.location.href = url;
      } else {
        // Fallback: trigger a download if the tab was closed or blocked
        const a = document.createElement("a");
        a.href = url;
        a.download = `quittance-${mois}-${annee}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (err) {
      if (win && !win.closed) win.close();
      console.error("[quittance]", err);
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
