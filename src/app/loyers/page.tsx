import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLoyersPageData } from "@/lib/loyers/data";
import type { StatutPaiement } from "@/lib/paiements";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { FiltresBar } from "./_components/FiltresBar";
import { IndicateursCards } from "./_components/IndicateursCards";
import { LoyersTable } from "./_components/LoyersTable";
import { RelancesGroupeesModal } from "./_components/RelancesGroupeesModal";

interface SearchParams {
  vue?: string;
  mois?: string;
  annee?: string;
  locataire?: string;
  box?: string;
  statut?: string;
}

const STATUTS_VALIDES: StatutPaiement[] = ["impaye", "impaye_partiel", "paye", "trop_percu"];

function parseId(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseStatut(value: string | undefined): StatutPaiement | null {
  if (!value) return null;
  return STATUTS_VALIDES.includes(value as StatutPaiement) ? (value as StatutPaiement) : null;
}

export default async function LoyersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = parseInt(session.user!.id!);

  const params = await searchParams;
  const today = new Date();

  const bienId = parseId(params.vue);
  const mois = (() => {
    const parsed = Number(params.mois);
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 12 ? parsed : today.getUTCMonth() + 1;
  })();
  const annee = (() => {
    const parsed = Number(params.annee);
    return Number.isInteger(parsed) && parsed >= 2000 ? parsed : today.getUTCFullYear();
  })();
  const locataireId = parseId(params.locataire);
  const boxId = parseId(params.box);
  const statut = parseStatut(params.statut);

  const data = await getLoyersPageData({ bienId, mois, annee, locataireId, boxId, statut }, userId);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNav />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Loyers &amp; Paiements</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/loyers/import"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Importer un relevé bancaire
          </Link>
          <DeconnexionButton />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        <FiltresBar
          biens={data.biens}
          locatairesDisponibles={data.locatairesDisponibles}
          boxesDisponibles={data.boxesDisponibles}
          anneesDisponibles={data.anneesDisponibles}
          bienId={bienId}
          mois={mois}
          annee={annee}
          locataireId={locataireId}
          boxId={boxId}
          statut={statut}
        />

        <IndicateursCards indicateurs={data.indicateurs} />

        <div className="flex justify-end">
          <RelancesGroupeesModal lignesImpayees={data.lignesImpayees} mois={mois} annee={annee} />
        </div>

        <LoyersTable lignes={data.lignes} afficherColonneBien={bienId === null} mois={mois} annee={annee} />
      </main>
    </div>
  );
}
