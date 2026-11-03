import Link from "next/link";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { NouveauBienWizard } from "./_components/NouveauBienWizard";

export default function NouveauBienPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <Link href="/biens" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
            ← Mes Biens
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Ajouter un bien</h1>
        </div>
        <DeconnexionButton />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-6">
        <NouveauBienWizard />
      </main>
    </div>
  );
}
