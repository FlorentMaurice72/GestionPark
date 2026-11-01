import type { DetailBienFinances } from "@/lib/finances/data";
import { formaterMontant, formaterPourcentage } from "@/lib/format";

function formaterPourcentageDirect(valeur: number | null): string {
  if (valeur === null) return "—";
  return `${valeur.toFixed(1)} %`;
}

export function DetailBienCard({ detail }: { detail: DetailBienFinances }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{detail.bienNom}</h3>

      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-neutral-500">
          <span>
            Emprunt : {formaterMontant(detail.etatEmprunt.restantDu)} restant dû sur{" "}
            {formaterMontant(detail.montantEmprunt)}
          </span>
          <span>
            {detail.etatEmprunt.moisEcoules} / {detail.dureeEmprunt} mois
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div
            className="h-full bg-neutral-900 dark:bg-neutral-100"
            style={{ width: `${Math.min(detail.etatEmprunt.progression * 100, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Mensualité {formaterMontant(detail.mensualiteEmprunt)} · Taux {detail.tauxEmprunt} % ·{" "}
          {detail.etatEmprunt.moisRestants} mois restants
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Info label="Revenus (mois)" valeur={formaterMontant(detail.revenusMensuel)} />
        <Info label="Revenus (année)" valeur={formaterMontant(detail.revenusAnnuel)} />
        <Info label="Taux d'occupation" valeur={formaterPourcentage(detail.tauxOccupation)} />
        <Info label="Charges fixes annuelles" valeur={formaterMontant(detail.chargesFixesAnnuelles)} />
        <Info label="Charges variables (année)" valeur={formaterMontant(detail.chargesVariablesAnnuelles)} />
        <Info
          label="Cash-flow mensuel"
          valeur={formaterMontant(detail.cashFlowMensuel)}
          accent={detail.cashFlowMensuel >= 0 ? "positif" : "negatif"}
        />
        <Info label="Rentabilité brute" valeur={formaterPourcentageDirect(detail.rentabiliteBrute)} />
        <Info label="Rentabilité nette" valeur={formaterPourcentageDirect(detail.rentabiliteNette)} />
      </div>

      {detail.valeurEstimee === null && (
        <p className="mt-3 text-xs text-neutral-500">
          Rentabilité non calculable : aucune valeur estimée renseignée pour ce bien (modifiable depuis sa fiche).
        </p>
      )}
    </div>
  );
}

function Info({
  label,
  valeur,
  accent,
}: {
  label: string;
  valeur: string;
  accent?: "positif" | "negatif";
}) {
  const classeValeur =
    accent === "positif"
      ? "text-green-700 dark:text-green-400"
      : accent === "negatif"
        ? "text-red-700 dark:text-red-400"
        : "text-neutral-900 dark:text-neutral-100";

  return (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className={`font-medium ${classeValeur}`}>{valeur}</p>
    </div>
  );
}
