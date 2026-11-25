import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LandingPage } from "./_components/LandingPage";
import { getDashboardPageData } from "@/lib/dashboard/data";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { NotificationBell } from "@/components/NotificationBell";
import { formaterMontant, formaterPourcentage } from "@/lib/format";
import { KPICard } from "./_components/KPICard";
import { ImportTimeline } from "./_components/ImportTimeline";
import { ActionsUrgentes } from "./_components/ActionsUrgentes";
import { GraphiqueLoyers12Mois } from "./_components/GraphiqueLoyers12Mois";
import { GraphiqueTauxOccupation } from "./_components/GraphiqueTauxOccupation";
import { RentabiliteParBien } from "./_components/RentabiliteParBien";
import { AccesRapides } from "./_components/AccesRapides";
import { OnboardingGuide } from "./_components/OnboardingGuide";
import { ProchainesEcheances } from "./_components/ProchainesEcheances";
import { getEcheancierData } from "@/lib/echeancier/data";
import { DemoTour } from "./_components/DemoTour";
import { TourStarter } from "./_components/TourStarter";
import type { TourStep } from "@/lib/tour/useTour";
import { getNombreRevisionsDues } from "@/lib/revision/data";

const formatteurDate = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function capitaliser(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const abonnementActif = params?.abonnement === "actif";
  const session = await auth();
  if (!session) {
    return <LandingPage />;
  }

  const userId = parseInt(session.user!.id!);
  const isDemo = session.user?.email === "demo@gestionpark.fr";

  const [data, echeancierData, admin, nombreRevisionsDues] = await Promise.all([
    getDashboardPageData(userId),
    getEcheancierData(userId),
    prisma.admin.findUnique({
      where: { id: userId },
      select: { createdAt: true, onboardingStep: true },
    }),
    getNombreRevisionsDues(userId),
  ]);

  const compteAgeH = admin ? (Date.now() - admin.createdAt.getTime()) / 36e5 : 999;
  const isNouveauCompte = !isDemo && compteAgeH < 48 && data.kpiOccupation.boxesTotal === 0;
  // R6: server-persisted tour step for cross-device resume
  const serverStep = !isDemo
    ? ((admin?.onboardingStep as TourStep | null | undefined) ?? null)
    : null;

  const prochainesEcheances = [
    ...echeancierData.ceMoisCi,
    ...echeancierData.leMoisProchain,
  ].slice(0, 5);

  const messageImportRequis = `Import CSV nécessaire pour ce mois`;

  return (
    <div className="min-h-screen bg-neutral-50 pb-16 dark:bg-neutral-950 md:pb-0">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
          <p className="text-xs text-neutral-500">{capitaliser(formatteurDate.format(data.aujourdHui))}</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell notifications={data.notifications} />
          <div className="hidden md:block"><DeconnexionButton /></div>
        </div>
      </header>

      {abonnementActif && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3 dark:bg-green-950/30 dark:border-green-900">
          <p className="text-sm font-medium text-green-800 dark:text-green-300 text-center">
            🎉 Votre abonnement est activé — bienvenue dans GestionPark !
          </p>
        </div>
      )}
      <DemoTour isDemo={isDemo} isNouveauCompte={isNouveauCompte} />
      <TourStarter isDemo={isDemo} isNouveauCompte={isNouveauCompte} serverStep={serverStep} />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <OnboardingGuide
          biensDone={data.kpiOccupation.boxesTotal > 0}
          locatairesDone={data.kpiLocatairesActifs > 0}
          paiementDone={data.importFaitCeMois || (data.kpiLoyersEncaisses !== null && data.kpiLoyersEncaisses > 0)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Taux d'occupation"
            valeur={formaterPourcentage(data.kpiOccupation.tauxOccupation)}
            sousLabel={`${data.kpiOccupation.boxesLoues} / ${data.kpiOccupation.boxesTotal} boxs loués`}
            href="/biens"
            progress={data.kpiOccupation.tauxOccupation ?? 0}
          />

          <KPICard
            label="Loyers encaissés (mois)"
            valeur={data.kpiLoyersEncaisses !== null ? formaterMontant(data.kpiLoyersEncaisses) : "—"}
            href="/loyers"
            indisponible={
              data.kpiLoyersEncaisses === null
                ? { message: messageImportRequis, hrefAction: "/loyers/import", labelAction: "Importer le CSV" }
                : undefined
            }
          />

          <KPICard
            label="Impayés"
            valeur={data.kpiImpayes !== null ? String(data.kpiImpayes) : "—"}
            href="/loyers?statut=impaye"
            accent={data.kpiImpayes !== null && data.kpiImpayes > 0 ? "danger" : undefined}
            indisponible={
              data.kpiImpayes === null
                ? { message: messageImportRequis, hrefAction: "/loyers/import", labelAction: "Importer le CSV" }
                : undefined
            }
          />

          <KPICard
            label="Locataires actifs"
            valeur={String(data.kpiLocatairesActifs)}
            href="/locataires?statut=actif"
          />
        </div>

        <ImportTimeline dernierImport={data.dernierImport} mois={data.mois} />

        <ActionsUrgentes
          nombreImpayes={data.kpiImpayes ?? 0}
          nombreNonIdentifiees={data.nombreNonIdentifiees}
          nombreRevisionsDues={nombreRevisionsDues}
        />

        <ProchainesEcheances echeances={prochainesEcheances} />

        <GraphiqueLoyers12Mois points={data.historique} annee={data.annee} />

        <RentabiliteParBien biens={data.rentabiliteParBien} />

        <GraphiqueTauxOccupation
          points={data.historique}
          boxesTotal={data.kpiOccupation.boxesTotal}
          annee={data.annee}
        />

        <AccesRapides />
      </main>
    </div>
  );
}
