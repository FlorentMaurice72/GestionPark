"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { AlerteItem } from "@/lib/alertes/data";
import { traiterRappel, supprimerRappel } from "@/lib/alertes/actions";

type Onglet = "dues" | "a_venir" | "traitees";

function icone(type: AlerteItem["type"]) {
  if (type === "impaye") return "⚠️";
  if (type === "fin_bail") return "📅";
  return "🔔";
}

function LigneAlerte({ item }: { item: AlerteItem }) {
  const [, startTransition] = useTransition();

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex gap-3">
        <span className="mt-0.5 text-base">{icone(item.type)}</span>
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.titre}</p>
          {item.description && (
            <p className="mt-0.5 text-xs text-neutral-500">{item.description}</p>
          )}
          <p className="mt-1 text-xs text-neutral-400">
            {item.dateEcheance.toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {item.lien && (
          <Link
            href={item.lien}
            className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Accéder
          </Link>
        )}
        {item.rappelId !== undefined && item.statut !== "traitee" && (
          <button
            type="button"
            onClick={() =>
              startTransition(() => traiterRappel(item.rappelId!))
            }
            className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Traiter
          </button>
        )}
        {item.rappelId !== undefined && (
          <button
            type="button"
            onClick={() =>
              startTransition(() => supprimerRappel(item.rappelId!))
            }
            className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

export function AlertesTabs({
  dues,
  aVenir,
  traitees,
}: {
  dues: AlerteItem[];
  aVenir: AlerteItem[];
  traitees: AlerteItem[];
}) {
  const [onglet, setOnglet] = useState<Onglet>("dues");

  const tabs: { key: Onglet; label: string; items: AlerteItem[] }[] = [
    { key: "dues", label: "Dues", items: dues },
    { key: "a_venir", label: "À venir", items: aVenir },
    { key: "traitees", label: "Traitées", items: traitees },
  ];

  const current = tabs.find((t) => t.key === onglet)!;

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setOnglet(t.key)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              onglet === t.key
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            {t.label}
            {t.items.length > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  t.key === "dues"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                }`}
              >
                {t.items.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {current.items.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          Aucune alerte pour le moment.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {current.items.map((item) => (
            <LigneAlerte key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
