import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBienDetail } from "@/lib/biens/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { formaterMontant } from "@/lib/format";
import { AjouterBoxesModal } from "./_components/AjouterBoxesModal";
import { SupprimerBoxButton } from "./_components/SupprimerBoxButton";
import { SupprimerBienSection } from "./_components/SupprimerBienSection";

export default async function BienDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
          <Link href="/biens" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
            ← Mes Biens
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{bien.nom}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/biens/${bien.id}/modifier`}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Modifier le bien
          </Link>
          <DeconnexionButton />
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-6">
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-4">
          <Info label="Type" valeur={bien.typeBien} />
          <Info label="Adresse" valeur={bien.adresseComplete} pleineLargeur />
          <Info label="Taxe foncière" valeur={formaterMontant(bien.taxeFonciere)} />
          <Info label="Assurance" valeur={formaterMontant(bien.assurance)} />
          <Info label="Montant emprunt" valeur={formaterMontant(bien.montantEmprunt)} />
          <Info label="Mensualité emprunt" valeur={formaterMontant(bien.mensualiteEmprunt)} />
          <Info label="Taux emprunt" valeur={`${bien.tauxEmprunt} %`} />
          <Info label="Durée emprunt" valeur={`${bien.dureeEmprunt} mois`} />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Boxes ({bien.boxes.length})
          </h2>
          <AjouterBoxesModal bienId={bien.id} />
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500 dark:border-neutral-800">
                <th className="px-4 py-3">Numéro</th>
                <th className="px-4 py-3">Superficie</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Locataire</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bien.boxes.map((box) => (
                <tr key={box.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                  <td className="px-4 py-3 font-medium">{box.numero}</td>
                  <td className="px-4 py-3">{box.superficie} m²</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        box.statut === "loué"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                      }`}
                    >
                      {box.statut === "loué" ? "Loué" : "Vacant"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{box.locataireActuel ?? "—"}</td>
                  <td className="px-4 py-3">
                    {box.statut === "vacant" && <SupprimerBoxButton boxId={box.id} numero={box.numero} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SupprimerBienSection bienId={bien.id} nom={bien.nom} />
      </main>
    </div>
  );
}

function Info({ label, valeur, pleineLargeur }: { label: string; valeur: string; pleineLargeur?: boolean }) {
  return (
    <div className={pleineLargeur ? "sm:col-span-2" : undefined}>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-900 dark:text-neutral-100">{valeur}</p>
    </div>
  );
}
