import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLocataireDetail } from "@/lib/locataires/data";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { formaterMontant } from "@/lib/format";
import { ArchiverButton } from "./_components/ArchiverButton";
import { AnonymiserSection } from "./_components/AnonymiserSection";
import { EtatLoyerMensuel } from "./_components/EtatLoyerMensuel";
import { AutomatisationToggles } from "./_components/AutomatisationToggles";

const TERME_LABELS: Record<string, string> = {
  a_echoir: "À échoir (début de mois)",
  echu: "Échu (fin de mois)",
};

const TYPE_BAIL_LABELS: Record<string, string> = {
  bail_box: "Box de stockage",
  bail_garage: "Garage",
  bail_commercial: "Commercial",
  autre: "Autre",
};

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
      <AppNavWrapper />
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
        {/* Infos personnelles */}
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

        {/* Compte locataire — une section par location active */}
        {locataire.locations.filter((l) => l.statut === "actif").map((loc) => {
          const soldeLabel = loc.solde === 0 ? "À jour" : loc.solde > 0 ? `${formaterMontant(loc.solde)} dû` : `${formaterMontant(-loc.solde)} d'avance`;
          const soldeCouleur = loc.solde === 0
            ? "text-green-700 dark:text-green-300"
            : loc.solde > 0
            ? "text-red-600 dark:text-red-400"
            : "text-blue-600 dark:text-blue-400";

          return (
            <div key={loc.id} className="flex flex-col gap-4">
              {/* KPI solde */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KPITile
                  label="Solde locataire"
                  valeur={soldeLabel}
                  couleur={soldeCouleur}
                  sous={`${formaterMontant(loc.totalEncaisse)} encaissé / ${formaterMontant(loc.totalAttendu)} attendu`}
                />
                <KPITile
                  label="Loyer mensuel"
                  valeur={formaterMontant(loc.loyerActuel)}
                  sous={TERME_LABELS[loc.termeLoyerType] ?? loc.termeLoyerType}
                />
                <KPITile
                  label="Dépôt de garantie"
                  valeur={formaterMontant(loc.depotGarantie)}
                  sous={`= ${loc.depotGarantie > 0 ? Math.round(loc.depotGarantie / loc.loyerActuel * 10) / 10 : 0} mois de loyer`}
                />
                <KPITile
                  label="Type de bail"
                  valeur={TYPE_BAIL_LABELS[loc.typeBail ?? "bail_box"] ?? loc.typeBail ?? "—"}
                  sous={`${loc.bienNom} · Box ${loc.boxNumero}`}
                />
              </div>

              {/* Grille mensuelle */}
              <EtatLoyerMensuel paiementsParMois={loc.paiementsParMois} loyerActuel={loc.loyerActuel} />

              {/* Automatisations */}
              <AutomatisationToggles
                locationId={loc.id}
                locataireId={locataire.id}
                renouvellementAuto={loc.renouvellementAuto}
                relanceActive={loc.relanceActive}
                avisLoyerAuto={loc.avisLoyerAuto}
                quittanceAuto={loc.quittanceAuto}
              />
            </div>
          );
        })}

        {/* Historique des locations */}
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
                  <th className="px-4 py-3">Encaissé</th>
                  <th className="px-4 py-3">Solde</th>
                </tr>
              </thead>
              <tbody>
                {locataire.locations.map((location) => (
                  <tr key={location.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                    <td className="px-4 py-3">{location.bienNom} · {location.boxNumero}</td>
                    <td className="px-4 py-3">
                      {formaterDate(location.dateEntree)} — {location.dateFin ? formaterDate(location.dateFin) : "en cours"}
                    </td>
                    <td className="px-4 py-3">{location.statut === "actif" ? "Active" : "Terminée"}</td>
                    <td className="px-4 py-3">{formaterMontant(location.loyerActuel)}</td>
                    <td className="px-4 py-3">{formaterMontant(location.totalEncaisse)}</td>
                    <td className={`px-4 py-3 font-medium ${location.solde > 0 ? "text-red-600 dark:text-red-400" : location.solde < 0 ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"}`}>
                      {location.solde === 0 ? "À jour" : location.solde > 0 ? `+${formaterMontant(location.solde)}` : formaterMontant(location.solde)}
                    </td>
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

function KPITile({ label, valeur, sous, couleur }: { label: string; valeur: string; sous?: string; couleur?: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="mb-1 text-xs text-neutral-500">{label}</p>
      <p className={`text-lg font-bold ${couleur ?? "text-neutral-900 dark:text-neutral-100"}`}>{valeur}</p>
      {sous && <p className="mt-0.5 text-xs text-neutral-400">{sous}</p>}
    </div>
  );
}
