import type { FinancesPageData } from "@/lib/finances/data";
import { FiltresFinances } from "./FiltresFinances";
import { IndicateursFinances } from "./IndicateursFinances";
import { DetailBienCard } from "./DetailBienCard";
import { GraphiqueRevenusCharges } from "./GraphiqueRevenusCharges";
import { ChargesTable } from "./ChargesTable";
import { AjouterChargeModal } from "./AjouterChargeModal";

interface Props {
  data: FinancesPageData;
  mois: number;
  annee: number;
  bienId: number | null;
}

export function AnalyseFinanciere({ data, mois, annee, bienId }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <FiltresFinances biens={data.biens} bienId={bienId} mois={mois} annee={annee} />

      <IndicateursFinances indicateursMois={data.indicateursMois} indicateursAnnee={data.indicateursAnnee} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Détail par bien</h2>
        {data.detailsBiens.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucun bien actif.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.detailsBiens.map((detail) => (
              <DetailBienCard key={detail.bienId} detail={detail} />
            ))}
          </div>
        )}
      </div>

      <GraphiqueRevenusCharges points={data.graphique} annee={annee} />

      <div>
        <div className="mb-3 flex justify-end">
          <AjouterChargeModal biens={data.biens} />
        </div>
        <ChargesTable charges={data.charges} />
      </div>
    </div>
  );
}
