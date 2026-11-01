"use client";

import { useState } from "react";
import type { PointHistorique } from "@/lib/dashboard/calculs";
import { formaterMontant, formaterPourcentage } from "@/lib/format";

const MOIS_ABREGES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

const LARGEUR = 760;
const HAUTEUR = 280;
const MARGE = { haut: 16, bas: 32, gauche: 56, droite: 16 };
const LARGEUR_TRACE = LARGEUR - MARGE.gauche - MARGE.droite;
const HAUTEUR_TRACE = HAUTEUR - MARGE.haut - MARGE.bas;

function arrondirEchelle(valeurMax: number): number {
  if (valeurMax <= 0) return 100;
  const magnitude = Math.pow(10, Math.floor(Math.log10(valeurMax)));
  const normalise = valeurMax / magnitude;
  const palier = normalise <= 1 ? 1 : normalise <= 2 ? 2 : normalise <= 5 ? 5 : 10;
  return palier * magnitude;
}

function construireChemin(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

export function GraphiqueLoyers12Mois({ points, annee }: { points: PointHistorique[]; annee: number }) {
  const [survol, setSurvol] = useState<number | null>(null);

  const valeurMax = Math.max(1, ...points.map((p) => Math.max(p.encaisse, p.attendu)));
  const echelleMax = arrondirEchelle(valeurMax * 1.15);

  const x = (index: number) => MARGE.gauche + (LARGEUR_TRACE / (points.length - 1)) * index;
  const y = (valeur: number) => MARGE.haut + HAUTEUR_TRACE - (valeur / echelleMax) * HAUTEUR_TRACE;

  const pointsEncaisse = points.map((p, i) => ({ x: x(i), y: y(p.encaisse) }));
  const aireEncaisse = `${construireChemin(pointsEncaisse)} L ${x(points.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const paliers = [0, 0.25, 0.5, 0.75, 1].map((f) => f * echelleMax);
  const pointSurvol = survol !== null ? points[survol] : null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Loyers encaissés — {annee}
        </h3>
        <span className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
          <span className="h-2 w-2 rounded-full bg-[#2a78d6] dark:bg-[#3987e5]" />
          Loyers encaissés
        </span>
      </div>

      <div className="relative rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
        <svg
          viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
          className="w-full"
          role="img"
          aria-label="Loyers encaissés sur 12 mois"
        >
          {paliers.map((palier) => (
            <g key={palier}>
              <line
                x1={MARGE.gauche}
                x2={LARGEUR - MARGE.droite}
                y1={y(palier)}
                y2={y(palier)}
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeWidth={1}
              />
              <text
                x={MARGE.gauche - 8}
                y={y(palier)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-neutral-500 text-[10px]"
              >
                {Math.round(palier).toLocaleString("fr-FR")}
              </text>
            </g>
          ))}

          <path d={aireEncaisse} className="fill-[#2a78d6] dark:fill-[#3987e5]" opacity={0.1} />

          <path
            d={construireChemin(pointsEncaisse)}
            fill="none"
            className="stroke-[#2a78d6] dark:stroke-[#3987e5]"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {pointsEncaisse.map((p, i) => (
            <circle key={`e-${i}`} cx={p.x} cy={p.y} r={3} className="fill-[#2a78d6] dark:fill-[#3987e5]" />
          ))}

          {survol !== null && (
            <line
              x1={x(survol)}
              x2={x(survol)}
              y1={MARGE.haut}
              y2={HAUTEUR - MARGE.bas}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={1}
            />
          )}

          {points.map((p, i) => (
            <text
              key={p.mois}
              x={x(i)}
              y={HAUTEUR - MARGE.bas + 16}
              textAnchor="middle"
              className="fill-neutral-500 text-[10px]"
            >
              {MOIS_ABREGES[p.mois - 1]}
            </text>
          ))}

          {points.map((_, i) => (
            <rect
              key={`hit-${i}`}
              x={x(i) - LARGEUR_TRACE / points.length / 2}
              y={MARGE.haut}
              width={LARGEUR_TRACE / points.length}
              height={HAUTEUR_TRACE}
              fill="transparent"
              onMouseEnter={() => setSurvol(i)}
              onMouseLeave={() => setSurvol(null)}
            />
          ))}
        </svg>

        {pointSurvol && (
          <div
            className="pointer-events-none absolute top-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
            style={{ left: `${(x(survol!) / LARGEUR) * 100}%`, transform: "translateX(-50%)" }}
          >
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {MOIS_ABREGES[pointSurvol.mois - 1]} {annee}
            </p>
            <p className="text-[#2a78d6] dark:text-[#3987e5]">Encaissé {formaterMontant(pointSurvol.encaisse)}</p>
            <p className="text-neutral-600 dark:text-neutral-300">Attendu {formaterMontant(pointSurvol.attendu)}</p>
            <p className="text-neutral-600 dark:text-neutral-300">
              Recouvrement {formaterPourcentage(pointSurvol.tauxRecouvrement)}
            </p>
            <p className="text-neutral-600 dark:text-neutral-300">
              {pointSurvol.nombreImpayes} impayé{pointSurvol.nombreImpayes > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
