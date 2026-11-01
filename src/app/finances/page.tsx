import { getFinancesPageData } from "@/lib/finances/data";
import { getDocumentsPageData } from "@/lib/documents/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { OngletsFinances } from "./_components/OngletsFinances";
import { AnalyseFinanciere } from "./_components/analyse/AnalyseFinanciere";
import { DocumentsFactures } from "./_components/documents/DocumentsFactures";

interface SearchParams {
  vue?: string;
  mois?: string;
  annee?: string;
  bien?: string;
  locataire?: string;
  categorie?: string;
}

function parseId(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function FinancesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const today = new Date();

  const vue = params.vue === "documents" ? "documents" : "analyse";
  const mois = (() => {
    const parsed = Number(params.mois);
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 12 ? parsed : today.getUTCMonth() + 1;
  })();
  const annee = (() => {
    const parsed = Number(params.annee);
    return Number.isInteger(parsed) && parsed >= 2000 ? parsed : today.getUTCFullYear();
  })();
  const bienId = parseId(params.bien);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNav />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Finances &amp; Documents</h1>
        <DeconnexionButton />
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        <OngletsFinances vue={vue} />

        {vue === "analyse" ? (
          <AnalyseFinancierePane mois={mois} annee={annee} bienId={bienId} />
        ) : (
          <DocumentsFacturesPane
            categorie={params.categorie ?? null}
            bienId={bienId}
            locataireId={parseId(params.locataire)}
            annee={params.annee ? annee : null}
            mois={mois}
            anneeCourante={annee}
          />
        )}
      </main>
    </div>
  );
}

async function AnalyseFinancierePane({ mois, annee, bienId }: { mois: number; annee: number; bienId: number | null }) {
  const data = await getFinancesPageData({ mois, annee, bienId });
  return <AnalyseFinanciere data={data} mois={mois} annee={annee} bienId={bienId} />;
}

async function DocumentsFacturesPane({
  categorie,
  bienId,
  locataireId,
  annee,
  mois,
  anneeCourante,
}: {
  categorie: string | null;
  bienId: number | null;
  locataireId: number | null;
  annee: number | null;
  mois: number;
  anneeCourante: number;
}) {
  const data = await getDocumentsPageData({ categorie, bienId, locataireId, annee });
  return (
    <DocumentsFactures
      data={data}
      categorie={categorie}
      bienId={bienId}
      locataireId={locataireId}
      annee={annee}
      mois={mois}
      anneeCourante={anneeCourante}
    />
  );
}
