import type { IndicateursPeriode } from "@/lib/finances/data";
import { formaterMontant } from "@/lib/format";

function Carte({ label, valeur, accent }: { label: string; valeur: number; accent?: "positif" | "negatif" }) {
  const classeValeur =
    accent === "positif"
      ? "text-green-700 dark:text-green-400"
      : accent === "negatif"
        ? "text-red-700 dark:text-red-400"
        : "text-neutral-900 dark:text-neutral-100";

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${classeValeur}`}>{formaterMontant(valeur)}</p>
    </div>
  );
}

function GroupeIndicateurs({ titre, indicateurs }: { titre: string; indicateurs: IndicateursPeriode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{titre}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Carte label="Revenus encaissés" valeur={indicateurs.revenus} />
        <Carte label="Charges" valeur={indicateurs.charges} />
        <Carte label="Mensualités emprunt" valeur={indicateurs.mensualites} />
        <Carte
          label="Résultat net"
          valeur={indicateurs.resultatNet}
          accent={indicateurs.resultatNet >= 0 ? "positif" : "negatif"}
        />
      </div>
    </div>
  );
}

export function IndicateursFinances({
  indicateursMois,
  indicateursAnnee,
}: {
  indicateursMois: IndicateursPeriode;
  indicateursAnnee: IndicateursPeriode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <GroupeIndicateurs titre="Ce mois-ci" indicateurs={indicateursMois} />
      <GroupeIndicateurs titre="Cette année" indicateurs={indicateursAnnee} />
    </div>
  );
}
