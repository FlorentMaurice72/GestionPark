import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBienDetail } from "@/lib/biens/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { ModifierBienForm } from "./_components/ModifierBienForm";

export default async function ModifierBienPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = parseInt(session.user!.id!);

  const { id } = await params;
  const bienId = Number(id);
  if (!Number.isInteger(bienId) || bienId <= 0) notFound();

  const bien = await getBienDetail(bienId, userId);
  if (!bien) notFound();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNav />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <Link
            href={`/biens/${bien.id}`}
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            ← {bien.nom}
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Modifier le bien</h1>
        </div>
        <DeconnexionButton />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-6">
        <ModifierBienForm bien={bien} />
      </main>
    </div>
  );
}
