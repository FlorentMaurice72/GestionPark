import Link from "next/link";

interface Props {
  label: string;
  valeur: string;
  sousLabel?: string;
  href: string;
  progress?: number; // 0..1
  accent?: "danger" | "succes";
  indisponible?: { message: string; hrefAction: string; labelAction: string };
}

export function KPICard({ label, valeur, sousLabel, href, progress, accent, indisponible }: Props) {
  if (indisponible) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4 opacity-60 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-neutral-400 dark:text-neutral-600">—</p>
        <p className="mt-2 text-xs text-neutral-500">{indisponible.message}</p>
        <Link
          href={indisponible.hrefAction}
          className="mt-2 inline-block rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {indisponible.labelAction}
        </Link>
      </div>
    );
  }

  const valeurClasse =
    accent === "danger"
      ? "text-red-700 dark:text-red-400"
      : accent === "succes"
        ? "text-green-700 dark:text-green-400"
        : "text-neutral-900 dark:text-neutral-100";

  const barreClasse =
    progress !== undefined
      ? progress >= 0.9
        ? "bg-green-500"
        : progress >= 0.7
          ? "bg-blue-500"
          : progress >= 0.4
            ? "bg-amber-500"
            : "bg-red-500"
      : "bg-neutral-900 dark:bg-neutral-100";

  return (
    <Link
      href={href}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
    >
      <p className="text-xs text-neutral-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${valeurClasse}`}>{valeur}</p>
      {sousLabel && <p className="mt-1 text-xs text-neutral-500">{sousLabel}</p>}
      {progress !== undefined && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            className={`h-full rounded-full transition-all ${barreClasse}`}
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      )}
    </Link>
  );
}
