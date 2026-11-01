import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardPageData } from "@/lib/dashboard/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { NotificationBell } from "@/components/NotificationBell";
import { formaterMontant, formaterPourcentage } from "@/lib/format";
import { KPICard } from "./_components/KPICard";
import { ImportTimeline } from "./_components/ImportTimeline";
import { ActionsUrgentes } from "./_components/ActionsUrgentes";
import { GraphiqueLoyers12Mois } from "./_components/GraphiqueLoyers12Mois";
import { AccesRapides } from "./_components/AccesRapides";

const formatteurDate = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function capitaliser(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const data = await getDashboardPageData();

  const messageImportRequis = `Import CSV nécessaire pour ce mois`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNav />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
          <p className="text-xs text-neutral-500">{capitaliser(formatteurDate.format(data.aujourdHui))}</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell notifications={data.notifications} />
          <DeconnexionButton />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Taux d'occupation"
            valeur={formaterPourcentage(data.kpiOccupation.tauxOccupation)}
            sousLabel={`${data.kpiOccupation.boxesLoues} / ${data.kpiOccupation.boxesTotal} boxes loués`}
            href="/biens"
          />

          <KPICard
            label="Loyers encaissés"
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
        />

        <GraphiqueLoyers12Mois points={data.historique} annee={data.annee} />

        <AccesRapides />
      </main>
    </div>
  );
}
