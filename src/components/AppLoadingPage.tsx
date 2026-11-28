export function AppLoadingPage({ message = "Chargement de vos données…" }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-8 w-8 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{message}</p>
      </div>
    </div>
  );
}
