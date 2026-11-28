"use client";

import React, { useState } from "react";

interface Props {
  locationId: number;
  locataireNom?: string;
  label?: string;
}

export function BoutonTelechargerBail({ locationId, locataireNom, label = "↓ Télécharger le bail" }: Props) {
  const [loading, setLoading] = useState(false);

  async function telecharger() {
    if (loading) return;
    setLoading(true);

    // Open tab synchronously within user gesture to avoid popup blockers
    const win = window.open("about:blank", "_blank");

    try {
      const res = await fetch(`/api/bail/${locationId}`);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }
      const data = await res.json();

      const [{ pdf }, { BailDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/BailDocument"),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(React.createElement(BailDocument, data) as any).toBlob();

      const nom = locataireNom ?? data.locataireNom ?? "locataire";
      const filename = `bail-${nom.toLowerCase()}-box${data.boxNumero}.pdf`;
      const url = URL.createObjectURL(blob);

      if (win && !win.closed) {
        win.location.href = url;
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (err) {
      if (win && !win.closed) win.close();
      console.error("[bail]", err);
      alert("Impossible de générer le bail. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={telecharger}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
    >
      {loading ? (
        <span className="flex items-center gap-1.5">
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Génération…
        </span>
      ) : (
        label
      )}
    </button>
  );
}
