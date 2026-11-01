import Link from "next/link";

interface Props {
  nombreImpayes: number;
  nombreNonIdentifiees: number;
}

export function ActionsUrgentes({ nombreImpayes, nombreNonIdentifiees }: Props) {
  const actions = [
    nombreImpayes > 0
      ? {
          key: "impayes",
          texte: `${nombreImpayes} impayé${nombreImpayes > 1 ? "s" : ""} détecté${nombreImpayes > 1 ? "s" : ""}`,
          href: "/loyers?statut=impaye",
        }
      : null,
    nombreNonIdentifiees > 0
      ? {
          key: "non_identifiees",
          texte: `${nombreNonIdentifiees} paiement${nombreNonIdentifiees > 1 ? "s" : ""} nécessit${nombreNonIdentifiees > 1 ? "ent" : "e"} une attribution manuelle`,
          href: "/loyers/import",
        }
      : null,
  ].filter((a): a is { key: string; texte: string; href: string } => a !== null);

  if (actions.length === 0) {
    return (
      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Actions urgentes</h2>
        <p className="text-sm text-neutral-500">Rien à signaler.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Actions urgentes</h2>
      <ul className="flex flex-col gap-2">
        {actions.map((action) => (
          <li key={action.key}>
            <Link
              href={action.href}
              className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/10 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              {action.texte}
              <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
