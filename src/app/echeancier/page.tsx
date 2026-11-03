import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { getEcheancierData } from "@/lib/echeancier/data";
import { EcheancierSection } from "./_components/EcheancierSection";

export const dynamic = "force-dynamic";

export default async function EcheancierPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user!.id!);
  const data = await getEcheancierData(userId);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Échéancier</h1>
          <p className="text-xs text-neutral-500">Tâches à venir sur vos locations</p>
        </div>
        <DeconnexionButton />
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-6">
        {data.total === 0 && (
          <div className="rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Aucune échéance à venir</p>
            <p className="mt-1 text-xs text-neutral-400">
              Les relances impayées, avis de loyer et fins de bail apparaissent ici.
            </p>
          </div>
        )}

        {data.ceMoisCi.length > 0 && (
          <EcheancierSection titre="Ce mois-ci" echeances={data.ceMoisCi} />
        )}
        {data.leMoisProchain.length > 0 && (
          <EcheancierSection titre="Le mois prochain" echeances={data.leMoisProchain} />
        )}
        {data.plusTard.length > 0 && (
          <EcheancierSection titre="Plus tard" echeances={data.plusTard} />
        )}
      </main>
    </div>
  );
}
