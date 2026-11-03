import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAlertesData } from "@/lib/alertes/data";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { AlertesTabs } from "./_components/AlertesTabs";
import { CreerRappelModal } from "./_components/CreerRappelModal";

export const dynamic = "force-dynamic";

export default async function AlertesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = parseInt(session.user.id);

  const { dues, aVenir, traitees } = await getAlertesData(userId);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNavWrapper />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Alertes et reports
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Vos rappels personnels et les tâches en attente.
            </p>
          </div>
          <CreerRappelModal />
        </div>
        <AlertesTabs dues={dues} aVenir={aVenir} traitees={traitees} />
      </main>
    </div>
  );
}
