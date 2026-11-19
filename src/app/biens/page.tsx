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
    <div className="min-h-screen bg-neutral-50 pb-16 dark:bg-neutral-950 md:pb-0">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Mes biens immobiliers</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/biens/nouveau"
            data-tour="ajouter-bien"
            className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dk"
          >
            + Ajouter
          </Link>
          <div className="hidden md:block"><DeconnexionButton /></div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        {biens.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white px-8 py-14 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <svg
              className="mx-auto mb-5 h-16 w-16 opacity-25"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <rect x="4" y="28" width="56" height="30" rx="3" fill="#0047AB" />
              <rect x="4" y="28" width="56" height="6" rx="2" fill="#0097A7" />
              <rect x="12" y="10" width="40" height="20" rx="2" fill="#20B2AA" />
              <rect x="20" y="4" width="24" height="12" rx="2" fill="#0047AB" opacity="0.6" />
              <rect x="26" y="38" width="12" height="10" rx="1" fill="white" opacity="0.5" />
              <rect x="26" y="52" width="12" height="4" rx="1" fill="white" opacity="0.4" />
            </svg>
            <h2 className="mb-2 text-base font-semibold text-neutral-800 dark:text-neutral-200">
              Aucun bien enregistré
            </h2>
            <p className="mx-auto mb-6 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
              Ajoutez votre premier entrepôt ou parking pour commencer à gérer vos boxs et locataires.
            </p>
            <Link
              href="/biens/nouveau"
              className="inline-block rounded-md px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0047AB" }}
            >
              Ajouter mon premier bien →
            </Link>
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
