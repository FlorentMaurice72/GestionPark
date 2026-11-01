interface Props {
  message?: string;
}

export function EtapeTraitement({ message = "Analyse du fichier et rapprochement des locations en cours…" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-white p-16 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
