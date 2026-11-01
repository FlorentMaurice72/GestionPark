import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLocataireDetail } from "@/lib/locataires/data";
import { AppNav } from "@/components/AppNav";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { formaterMontant } from "@/lib/format";
import { ArchiverButton } from "./_components/ArchiverButton";
import { AnonymiserSection } from "./_components/AnonymiserSection";

function formaterDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}

export default async function LocataireDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
      <AppNav />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <Link
            href="/locataires"
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            ← Mes Locataires
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{nomComplet}</h1>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              locataire.statut === "actif"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
            }`}
          >
            {locataire.statut === "actif" ? "Actif" : "Archivé"}
          </span>
          {locataire.anonymise && (
            <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
              Anonymisé
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!locataire.anonymise && (
            <Link
              href={`/locataires/${locataire.id}/modifier`}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Modifier
            </Link>
          )}
          {locataire.statut === "actif" && <ArchiverButton id={locataire.id} nomComplet={nomComplet} />}
          {locataire.statut === "archivé" && !locataire.anonymise && (
            <AnonymiserSection id={locataire.id} nomComplet={nomComplet} />
          )}
          <DeconnexionButton />
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-6">
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-3">
          {locataire.societe && <Info label="Société" valeur={locataire.societe} />}
          {locataire.association && <Info label="Association" valeur={locataire.association} />}
          <Info label="Email" valeur={locataire.email} />
          <Info label="Téléphone" valeur={locataire.telephone} />
          <Info label="Adresse" valeur={locataire.adresse} pleineLargeur />
          <Info label="Ville" valeur={locataire.ville} />
          <Info label="Code postal" valeur={locataire.codePostal} />
          {locataire.dateArchivage && <Info label="Archivé le" valeur={formaterDate(locataire.dateArchivage)} />}
          {locataire.anonymiseLe && <Info label="Anonymisé le" valeur={formaterDate(locataire.anonymiseLe)} />}
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-3">
          <Info label="Total encaissé (historique)" valeur={formaterMontant(locataire.totalEncaisseGlobal)} />
          {locataire.moisImpayesCumules !== null && (
            <Info label="Mois impayés cumulés" valeur={String(locataire.moisImpayesCumules)} />
          )}
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Historique des locations
          </h2>
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500 dark:border-neutral-800">
                  <th className="px-4 py-3">Bien / Box</th>
                  <th className="px-4 py-3">Période</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Loyer</th>
                  <th className="px-4 py-3">Total encaissé</th>
                </tr>
              </thead>
              <tbody>
                {locataire.locations.map((location) => (
                  <tr key={location.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                    <td className="px-4 py-3">
                      {location.bienNom} · {location.boxNumero}
                    </td>
                    <td className="px-4 py-3">
                      {formaterDate(location.dateEntree)} — {location.dateFin ? formaterDate(location.dateFin) : "en cours"}
                    </td>
                    <td className="px-4 py-3">{location.statut === "actif" ? "Active" : "Terminée"}</td>
                    <td className="px-4 py-3">{formaterMontant(location.loyerActuel)}</td>
                    <td className="px-4 py-3">{formaterMontant(location.totalEncaisse)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Documents</h2>
          {locataire.documents.length === 0 ? (
            <p className="text-sm text-neutral-500">Aucun document associé.</p>
          ) : (
            <ul className="space-y-1 rounded-lg border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
              {locataire.documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <span>
                    {doc.nomFichier} <span className="text-xs text-neutral-500">({doc.type})</span>
                  </span>
                  <span className="text-xs text-neutral-500">{formaterDate(doc.dateDocument)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
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
