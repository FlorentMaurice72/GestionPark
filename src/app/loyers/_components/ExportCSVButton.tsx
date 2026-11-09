"use client";

interface Props {
  annee: number;
  bienId?: number | null;
}

export function ExportCSVButton({ annee, bienId }: Props) {
  function telecharger() {
    const params = new URLSearchParams({ annee: String(annee) });
    if (bienId) params.set("bienId", String(bienId));
    window.location.href = `/api/export/loyers?${params.toString()}`;
  }

  return (
    <button
      onClick={telecharger}
      title={`Exporter les loyers ${annee} en CSV`}
      className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span className="hidden sm:inline">Exporter CSV</span>
      <span className="sm:hidden">CSV</span>
    </button>
  );
}
