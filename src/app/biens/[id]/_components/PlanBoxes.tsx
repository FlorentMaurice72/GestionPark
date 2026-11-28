"use client";

import { useState } from "react";
import type { BoxDetail } from "@/lib/biens/data";

interface Props {
  boxes: BoxDetail[];
  typeBien: string;
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

function IconGarage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function IconWarehouse() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  );
}

function getIcon(typeBien: string) {
  const t = typeBien.toLowerCase();
  if (t.includes("garage")) return <IconGarage />;
  if (t.includes("entrepôt") || t.includes("entrepot") || t.includes("entrepôts")) return <IconWarehouse />;
  if (t.includes("commercial") || t.includes("boutique") || t.includes("magasin")) return <IconStore />;
  return <IconBox />;
}

export function PlanBoxes({ boxes, typeBien }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (boxes.length === 0) return null;

  const loues = boxes.filter((b) => b.statut === "loué").length;
  const vacants = boxes.length - loues;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Plan d&apos;occupation
        </h2>
        <div className="flex gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-green-400 dark:bg-green-500" />
            {loues} loué{loues > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-300 dark:bg-red-500" />
            {vacants} vacant{vacants > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {boxes.map((box) => {
          const isLoue = box.statut === "loué";
          const isHovered = hovered === box.id;

          return (
            <div
              key={box.id}
              onMouseEnter={() => setHovered(box.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative flex h-[72px] w-[72px] cursor-default flex-col items-center justify-center gap-0.5 rounded-xl border-2 transition-transform hover:scale-105 ${
                isLoue
                  ? "border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950/50 dark:text-green-300"
                  : "border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-950/50 dark:text-red-300"
              }`}
            >
              <div className="h-7 w-7">{getIcon(typeBien)}</div>
              <span className="text-[10px] font-bold leading-none">{box.numero}</span>

              {/* Tooltip */}
              {isHovered && (
                <div className="pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-xl dark:bg-neutral-100 dark:text-neutral-900">
                  <div className="font-semibold">Box {box.numero}</div>
                  <div className="text-neutral-400 dark:text-neutral-500">{box.superficie} m²</div>
                  <div className={isLoue ? "text-green-400 dark:text-green-600" : "text-red-400 dark:text-red-500"}>
                    {isLoue ? (box.locataireActuel ?? "Loué") : "Vacant"}
                  </div>
                  {/* Arrow */}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
