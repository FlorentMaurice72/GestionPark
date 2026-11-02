"use client";

import { useState } from "react";
import type { PaiementMois } from "@/lib/locataires/data";

const MOIS_COURT = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const COULEURS: Record<PaiementMois["statut"], string> = {
  paye:    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  partiel: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  impaye:  "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  futur:   "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500",
};

const ICONES: Record<PaiementMois["statut"], string> = {
  paye: "✓", partiel: "◑", impaye: "✕", futur: "·",
};

interface Props {
  paiementsParMois: PaiementMois[];
  loyerActuel: number;
}

function formaterMontant(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function EtatLoyerMensuel({ paiementsParMois, loyerActuel }: Props) {
  const [moisActif, setMoisActif] = useState<string | null>(null);

  const total = paiementsParMois.length;
  const MAX_VISIBLE = 24;
  const [toutAfficher, setToutAfficher] = useState(false);
  const visible = toutAfficher ? paiementsParMois : paiementsParMois.slice(-MAX_VISIBLE);

  const actif = moisActif ? paiementsParMois.find((p) => `${p.annee}-${p.mois}` === moisActif) : null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">État des loyers</h2>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Payé</span>
          <span className="flex items-center gap-1"><span className="text-amber-600">◑</span> Partiel</span>
          <span className="flex items-center gap-1"><span className="text-red-500">✕</span> Impayé</span>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap gap-1.5">
          {visible.map((p) => {
            const key = `${p.annee}-${p.mois}`;
            const isActif = moisActif === key;
            return (
              <button
                key={key}
                onClick={() => setMoisActif(isActif ? null : key)}
                title={`${MOIS_COURT[p.mois - 1]} ${p.annee} — ${p.statut === "futur" ? "À venir" : formaterMontant(p.montant)}`}
                className={`flex flex-col items-center rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${COULEURS[p.statut]} ${isActif ? "ring-2 ring-offset-1 ring-neutral-900 dark:ring-neutral-100" : ""}`}
              >
                <span>{ICONES[p.statut]}</span>
                <span className="text-[10px] leading-tight">{MOIS_COURT[p.mois - 1]}</span>
                <span className="text-[10px] leading-tight">{p.annee}</span>
              </button>
            );
          })}
        </div>

        {total > MAX_VISIBLE && (
          <button
            onClick={() => setToutAfficher((v) => !v)}
            className="mt-2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            {toutAfficher ? "Afficher moins" : `Afficher les ${total - MAX_VISIBLE} mois précédents`}
          </button>
        )}

        {actif && (
          <div className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-950">
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {MOIS_COURT[actif.mois - 1]} {actif.annee}
            </p>
            {actif.statut === "futur" ? (
              <p className="text-neutral-500">Mois à venir — loyer prévu : {formaterMontant(loyerActuel)}</p>
            ) : (
              <>
                <p className="text-neutral-500">Encaissé : <span className="font-medium text-neutral-900 dark:text-neutral-100">{formaterMontant(actif.montant)}</span></p>
                {actif.statut === "partiel" && (
                  <p className="text-amber-600">Reste dû : {formaterMontant(loyerActuel - actif.montant)}</p>
                )}
                {actif.statut === "impaye" && (
                  <p className="text-red-600">Aucun paiement enregistré ce mois</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
