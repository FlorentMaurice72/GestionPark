import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBiensPageData } from "@/lib/biens/data";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";

export default async function BiensPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = parseInt(session.user!.id!);

  const biens = await getBiensPageData(userId);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Mes biens immobiliers</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/biens/nouveau"
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Ajouter un bien
          </Link>
          <DeconnexionButton />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        {biens.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
            Aucun bien enregistré pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {biens.map((bien) => (
              <Link
                key={bien.id}
                href={`/biens/${bien.id}`}
                className="rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
              >
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{bien.nom}</h2>
                <p className="mt-1 text-xs text-neutral-500">{bien.adresseComplete}</p>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    {bien.nombreBoxesLoues} loués
                  </span>
                  <span className="rounded-full bg-neutral-200 px-2 py-0.5 font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                    {bien.nombreBoxesVacants} vacants
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
