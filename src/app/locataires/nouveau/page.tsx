import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBoxesVacantsDisponibles } from "@/lib/locataires/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { NouveauLocataireForm } from "./_components/NouveauLocataireForm";

export default async function NouveauLocatairePage() {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = parseInt(session.user!.id!);

  const boxesVacants = await getBoxesVacantsDisponibles(userId);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNav />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <Link
            href="/locataires"
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            ← Mes Locataires
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Ajouter un locataire</h1>
        </div>
        <DeconnexionButton />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-6">
        <NouveauLocataireForm boxesVacants={boxesVacants} />
      </main>
    </div>
  );
}
