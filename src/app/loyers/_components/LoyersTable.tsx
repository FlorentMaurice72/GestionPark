import type { LigneLoyer } from "@/lib/loyers/data";
import { formaterMontant } from "@/lib/format";
import { StatutBadge, ImpayesCumulesBadge } from "./StatutBadge";
import { PaiementModal } from "./PaiementModal";
import { RelanceModal } from "./RelanceModal";

interface Props {
  lignes: LigneLoyer[];
  afficherColonneBien: boolean;
  mois: number;
  annee: number;
}

export function LoyersTable({ lignes, afficherColonneBien, mois, annee }: Props) {
  if (lignes.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
        Aucune location active pour cette sélection.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500 dark:border-neutral-800">
            {afficherColonneBien && <th className="px-4 py-3">Bien</th>}
            <th className="px-4 py-3">Box</th>
            <th className="px-4 py-3">Locataire</th>
            <th className="px-4 py-3">Loyer</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Montant reçu</th>
            <th className="px-4 py-3">Impayés cumulés</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr
              key={ligne.locationId}
              className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
            >
              {afficherColonneBien && <td className="px-4 py-3">{ligne.bienNom}</td>}
              <td className="px-4 py-3 font-medium">{ligne.boxNumero}</td>
              <td className="px-4 py-3">
                {ligne.locataireNom} {ligne.locatairePrenom}
              </td>
              <td className="px-4 py-3">{formaterMontant(ligne.loyerActuel)}</td>
              <td className="px-4 py-3">
                <StatutBadge statut={ligne.statut} />
              </td>
              <td className="px-4 py-3">{formaterMontant(ligne.montantRecu)}</td>
              <td className="px-4 py-3">
                <ImpayesCumulesBadge nombreMois={ligne.moisImpayesCumules} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <PaiementModal
                    locationId={ligne.locationId}
                    locataireLabel={`${ligne.locataireNom} ${ligne.locatairePrenom}`}
                    boxNumero={ligne.boxNumero}
                    mois={mois}
                    annee={annee}
                  />
                  {(ligne.statut === "impaye" || ligne.statut === "impaye_partiel") && (
                    <RelanceModal
                      locationId={ligne.locationId}
                      locataireNom={ligne.locataireNom}
                      locatairePrenom={ligne.locatairePrenom}
                      boxNumero={ligne.boxNumero}
                      loyerActuel={ligne.loyerActuel}
                      montantRecu={ligne.montantRecu}
                      mois={mois}
                      annee={annee}
                      email={ligne.locataireEmail}
                      telephone={ligne.locataireTelephone}
                    />
                  )}
                  {ligne.montantRecu > 0 && (
                    <a
                      href={`/api/quittance/${ligne.locationId}/${mois}/${annee}`}
                      download
                      className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      Quittance
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
