import type { LigneLoyer } from "@/lib/loyers/data";
import { formaterMontant } from "@/lib/format";
import { StatutBadge, ImpayesCumulesBadge } from "./StatutBadge";
import { PaiementModal } from "./PaiementModal";
import { RelanceModal } from "./RelanceModal";
import { BoutonAvisLoyer } from "./BoutonAvisLoyer";
import { BoutonQuittance } from "./BoutonQuittance";

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
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {lignes.map((ligne) => (
          <div
            key={ligne.locationId}
            className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {ligne.locataireNom} {ligne.locatairePrenom}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {afficherColonneBien && ligne.bienNom ? `${ligne.bienNom} · ` : ""}Box {ligne.boxNumero}
                </p>
              </div>
              <StatutBadge statut={ligne.statut} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-neutral-400">Loyer</span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">{formaterMontant(ligne.loyerActuel)}</p>
              </div>
              <div>
                <span className="text-neutral-400">Reçu</span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">{formaterMontant(ligne.montantRecu)}</p>
              </div>
            </div>

            {ligne.moisImpayesCumules > 0 && (
              <div className="mt-2">
                <ImpayesCumulesBadge nombreMois={ligne.moisImpayesCumules} />
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
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
              <BoutonAvisLoyer locationId={ligne.locationId} mois={mois} annee={annee} />
              {ligne.montantRecu > 0 && (
                <BoutonQuittance locationId={ligne.locationId} mois={mois} annee={annee} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:block">
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
                    <BoutonAvisLoyer locationId={ligne.locationId} mois={mois} annee={annee} />
                    {ligne.montantRecu > 0 && (
                      <BoutonQuittance locationId={ligne.locationId} mois={mois} annee={annee} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
