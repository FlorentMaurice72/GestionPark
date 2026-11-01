import Link from "next/link";
import { getLocatairesPageData } from "@/lib/locataires/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { FiltresLocataires } from "./_components/FiltresLocataires";
import { LocatairesTable } from "./_components/LocatairesTable";

interface SearchParams {
  statut?: string;
  bien?: string;
  q?: string;
}

function parseId(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function LocatairesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const statut = params.statut === "archivé" || params.statut === "tous" ? params.statut : "actif";
  const bienId = parseId(params.bien);
  const recherche = params.q?.trim() ?? "";

  const data = await getLocatairesPageData({ statut, bienId, recherche: recherche || null });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNav />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Mes Locataires</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/locataires/nouveau"
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Ajouter un locataire
          </Link>
          <DeconnexionButton />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        <FiltresLocataires biens={data.biens} statut={statut} bienId={bienId} recherche={recherche} />
        <LocatairesTable locataires={data.locataires} />
      </main>
    </div>
  );
}
