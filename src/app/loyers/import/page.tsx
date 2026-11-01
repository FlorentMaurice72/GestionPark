import Link from "next/link";
import { getImportPageData } from "@/lib/import/data";
import { ImportWizard } from "./_components/ImportWizard";

export default async function ImportPage() {
  const data = await getImportPageData();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <Link href="/loyers" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
            ← Retour à Loyers &amp; Paiements
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Import d&apos;un relevé bancaire
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-6">
        <ImportWizard presets={data.presets} locations={data.locations} />
      </main>
    </div>
  );
}
