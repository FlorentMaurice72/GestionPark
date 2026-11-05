import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";

export default async function GuidePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-950">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-100">Guide de démarrage</h1>
          <p className="text-xs text-neutral-400">Tutoriel complet — 4 min 30</p>
        </div>
        <DeconnexionButton />
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6">
        <div className="overflow-hidden rounded-xl shadow-2xl">
          <iframe
            src="/videos/anim-onboarding.html"
            className="aspect-video w-full border-0"
            allow="autoplay"
            title="Guide de démarrage GestionPark"
          />
        </div>
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          L&apos;animation ne s&apos;affiche pas ?{" "}
          <a
            href="/videos/anim-onboarding.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            Ouvrir en plein écran
          </a>
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Étapes 1–3</div>
            <div className="text-sm font-medium text-neutral-100">Configuration initiale</div>
            <div className="mt-1 text-xs text-neutral-500">Inscription, ajout d'un bien, configuration des boxs</div>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Étapes 4–6</div>
            <div className="text-sm font-medium text-neutral-100">Gestion au quotidien</div>
            <div className="mt-1 text-xs text-neutral-500">Locataires, tableau de bord, suivi des paiements</div>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Étapes 7–9</div>
            <div className="text-sm font-medium text-neutral-100">Documents & Profil</div>
            <div className="mt-1 text-xs text-neutral-500">Quittances, exports fiscaux, paramètres du compte</div>
          </div>
        </div>
      </main>
    </div>
  );
}
