import Link from "next/link";

const LIENS = [
  { href: "/loyers", label: "Gestion locative" },
  { href: "/biens", label: "Mes biens immobiliers" },
  { href: "/locataires", label: "Mes locataires" },
  { href: "/finances", label: "Finances & Documents" },
];

export function AccesRapides() {
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Accès rapides</h2>
      <div className="flex flex-wrap gap-2">
        {LIENS.map((lien) => (
          <Link
            key={lien.href}
            href={lien.href}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {lien.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
