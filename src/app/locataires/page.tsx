import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLocatairesPageData } from "@/lib/locataires/data";
import { AppNavWrapper } from "@/components/AppNavWrapper";
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
  const session = await auth();
  if (!session) redirect("/login");
  const userId = parseInt(session.user!.id!);

  const params = await searchParams;
  const statut = params.statut === "archivé" || params.statut === "tous" ? params.statut : "actif";
  const bienId = parseId(params.bien);
  const recherche = params.q?.trim() ?? "";

  const data = await getLocatairesPageData({ statut, bienId, recherche: recherche || null }, userId);

  return (
    <div className="min-h-screen bg-neutral-50 pb-16 dark:bg-neutral-950 md:pb-0">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Mes locataires</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/locataires/nouveau"
            className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dk"
          >
            + Ajouter
          </Link>
          <div className="hidden md:block"><DeconnexionButton /></div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <FiltresLocataires biens={data.biens} statut={statut} bienId={bienId} recherche={recherche} />

        {data.locataires.length === 0 && statut === "actif" && !bienId && !recherche ? (
          <div className="rounded-xl border border-neutral-200 bg-white px-8 py-14 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <svg
              className="mx-auto mb-5 h-16 w-16 opacity-25"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="32" cy="22" r="12" fill="#0047AB" />
              <circle cx="32" cy="22" r="5" fill="white" opacity="0.6" />
              <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="#0097A7" opacity="0.4" />
              <rect x="28" y="40" width="8" height="16" rx="2" fill="#0097A7" opacity="0.3" />
            </svg>
            <h2 className="mb-2 text-base font-semibold text-neutral-800 dark:text-neutral-200">
              Aucun locataire pour le moment
            </h2>
            <p className="mx-auto mb-6 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
              Créez votre premier locataire pour lui attribuer un box et générer son bail.
            </p>
            <Link
              href="/locataires/nouveau"
              className="inline-block rounded-md px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0047AB" }}
            >
              Ajouter mon premier locataire →
            </Link>
          </div>
        ) : (
          <LocatairesTable locataires={data.locataires} />
        )}
      </main>
    </div>
  );
}
