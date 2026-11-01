import Link from "next/link";

interface Props {
  label: string;
  valeur: string;
  sousLabel?: string;
  href: string;
  indisponible?: { message: string; hrefAction: string; labelAction: string };
}

export function KPICard({ label, valeur, sousLabel, href, indisponible }: Props) {
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

  return (
    <Link
      href={href}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
    >
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-neutral-900 dark:text-neutral-100">{valeur}</p>
      {sousLabel && <p className="mt-1 text-xs text-neutral-500">{sousLabel}</p>}
    </Link>
  );
}
