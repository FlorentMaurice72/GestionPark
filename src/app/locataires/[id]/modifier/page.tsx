import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLocataireDetail } from "@/lib/locataires/data";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { ModifierLocataireForm } from "./_components/ModifierLocataireForm";

export default async function ModifierLocatairePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = parseInt(session.user!.id!);

  const { id } = await params;
  const locataireId = Number(id);
  if (!Number.isInteger(locataireId) || locataireId <= 0) notFound();

  const locataire = await getLocataireDetail(locataireId, userId);
  if (!locataire) notFound();

  const nomComplet = `${locataire.nom} ${locataire.prenom}`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <Link
            href={`/locataires/${locataire.id}`}
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            ← {nomComplet}
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Modifier le locataire</h1>
        </div>
        <DeconnexionButton />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-6">
        <ModifierLocataireForm locataire={locataire} />
      </main>
    </div>
  );
}
