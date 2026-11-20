import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLocationsDuesRevision } from "@/lib/revision/data";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { RevisionTable } from "./_components/RevisionTable";

export const metadata = { title: "Révision des loyers" };

export default async function RevisionPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user!.id!);
  const locations = await getLocationsDuesRevision(userId);

  return (
    <div className="min-h-screen bg-neutral-50 pb-16 dark:bg-neutral-950 md:pb-0">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Révision des loyers
          </h1>
          <p className="text-xs text-neutral-500">
            Locations avec révision ICC ou IRL due ou à venir dans 30 jours
          </p>
        </div>
        <div className="hidden md:block">
          <DeconnexionButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <RevisionTable locations={locations} />
      </main>
    </div>
  );
}
