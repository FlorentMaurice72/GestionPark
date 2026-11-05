"use client";

import { useState } from "react";
import type { PointHistorique } from "@/lib/dashboard/calculs";

const MOIS_ABREGES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

const LARGEUR = 760;
const HAUTEUR = 220;
const MARGE = { haut: 16, bas: 32, gauche: 40, droite: 16 };
const LARGEUR_TRACE = LARGEUR - MARGE.gauche - MARGE.droite;
const HAUTEUR_TRACE = HAUTEUR - MARGE.haut - MARGE.bas;
const LARGEUR_BARRE = (LARGEUR_TRACE / 12) * 0.6;

function couleurBarre(taux: number): string {
  if (taux >= 0.9) return "#22c55e"; // green-500
  if (taux >= 0.7) return "#3b82f6"; // blue-500
  if (taux >= 0.4) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

export function GraphiqueTauxOccupation({
  points,
  boxesTotal,
  annee,
}: {
  points: PointHistorique[];
  boxesTotal: number;
  annee: number;
}) {
  const [survol, setSurvol] = useState<number | null>(null);

  if (boxesTotal === 0) return null;

  const x = (index: number) =>
    MARGE.gauche + (LARGEUR_TRACE / 12) * index + (LARGEUR_TRACE / 12 - LARGEUR_BARRE) / 2;
  const hauteurBarre = (taux: number) => Math.max(taux * HAUTEUR_TRACE, 2);
  const yBarre = (taux: number) => MARGE.haut + HAUTEUR_TRACE - hauteurBarre(taux);

  const paliers = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Taux d'occupation mensuel — {annee}
        </h3>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-green-500" /> ≥ 90 %
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-blue-500" /> ≥ 70 %
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" /> ≥ 40 %
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-red-500" /> &lt; 40 %
          </span>
        </div>
      </div>

      <div className="relative rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
        <svg
          viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
          className="w-full"
          role="img"
          aria-label="Taux d'occupation par mois"
        >
          {paliers.map((p) => {
            const yp = MARGE.haut + HAUTEUR_TRACE - p * HAUTEUR_TRACE;
            return (
              <g key={p}>
                <line
                  x1={MARGE.gauche}
                  x2={LARGEUR - MARGE.droite}
                  y1={yp}
                  y2={yp}
                  className="stroke-neutral-200 dark:stroke-neutral-800"
                  strokeWidth={1}
                />
                <text
                  x={MARGE.gauche - 6}
                  y={yp}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-neutral-500 text-[9px]"
                >
                  {Math.round(p * 100)} %
                </text>
              </g>
            );
          })}

          {points.map((pt, i) => {
            const taux = pt.locationsActivesCount / boxesTotal;
            const hb = hauteurBarre(taux);
            const xb = x(i);
            const yb = yBarre(taux);
            const estSurvole = survol === i;
            return (
              <g key={pt.mois}>
                <rect
                  x={xb}
                  y={yb}
                  width={LARGEUR_BARRE}
                  height={hb}
                  fill={couleurBarre(taux)}
                  opacity={estSurvole ? 1 : 0.8}
                  rx={3}
                />
                <text
                  x={xb + LARGEUR_BARRE / 2}
                  y={HAUTEUR - MARGE.bas + 16}
                  textAnchor="middle"
                  className="fill-neutral-500 text-[10px]"
                >
                  {MOIS_ABREGES[pt.mois - 1]}
                </text>
                <rect
                  x={xb}
                  y={MARGE.haut}
                  width={LARGEUR_BARRE}
                  height={HAUTEUR_TRACE}
                  fill="transparent"
                  onMouseEnter={() => setSurvol(i)}
                  onMouseLeave={() => setSurvol(null)}
                />
              </g>
            );
          })}
        </svg>

        {survol !== null && (() => {
          const pt = points[survol];
          const taux = pt.locationsActivesCount / boxesTotal;
          return (
            <div
              className="pointer-events-none absolute top-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              style={{ left: `${((x(survol) + LARGEUR_BARRE / 2) / LARGEUR) * 100}%`, transform: "translateX(-50%)" }}
            >
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {MOIS_ABREGES[pt.mois - 1]} {annee}
              </p>
              <p className="text-neutral-700 dark:text-neutral-200">
                {pt.locationsActivesCount} / {boxesTotal} boxes loués
              </p>
              <p style={{ color: couleurBarre(taux) }} className="font-semibold">
                {Math.round(taux * 100)} % d&apos;occupation
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
