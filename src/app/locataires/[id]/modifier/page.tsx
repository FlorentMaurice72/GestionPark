import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocataireDetail } from "@/lib/locataires/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { ModifierLocataireForm } from "./_components/ModifierLocataireForm";

export default async function ModifierLocatairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locataireId = Number(id);
  if (!Number.isInteger(locataireId) || locataireId <= 0) notFound();

  const locataire = await getLocataireDetail(locataireId);
  if (!locataire) notFound();

  const nomComplet = `${locataire.nom} ${locataire.prenom}`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNav />
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
