"use client";

import { useState } from "react";
import type { LigneLoyer } from "@/lib/loyers/data";
import { creerRelance } from "@/lib/relances/actions";
import { canalParDefaut, estContactDisponible, genererTexteRelance, type Canal } from "@/lib/relances/template";
import { formaterMontant } from "@/lib/format";
import { NOMS_MOIS } from "@/lib/dates";

interface Props {
  lignesImpayees: LigneLoyer[];
  mois: number;
  annee: number;
}

interface LigneAEnvoyer {
  ligne: LigneLoyer;
  canal: Canal;
  contact: string;
  texte: string;
}

function preparerLigne(ligne: LigneLoyer, mois: number, annee: number): LigneAEnvoyer {
  const emailDisponible = estContactDisponible(ligne.locataireEmail);
  const telephoneDisponible = estContactDisponible(ligne.locataireTelephone);
  const canal = canalParDefaut(emailDisponible, telephoneDisponible);
  const montantDu = Math.max(ligne.loyerActuel - ligne.montantRecu, 0);

  return {
    ligne,
    canal,
    contact: canal === "email" ? ligne.locataireEmail : ligne.locataireTelephone,
    texte: genererTexteRelance({
      nom: ligne.locataireNom,
      prenom: ligne.locatairePrenom,
      numeroBox: ligne.boxNumero,
      montant: montantDu,
      mois,
      annee,
    }),
  };
}

export function RelancesGroupeesModal({ lignesImpayees, mois, annee }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [copiees, setCopiees] = useState<Set<number>>(new Set());

  if (lignesImpayees.length === 0) return null;

  async function copier(item: LigneAEnvoyer) {
    try {
      await navigator.clipboard.writeText(item.texte);
    } catch {
      // Presse-papier indisponible — on enregistre quand même la relance.
    }

    const formData = new FormData();
    formData.set("locationId", String(item.ligne.locationId));
    formData.set("canal", item.canal);
    formData.set("contenuTexte", item.texte);

    const resultat = await creerRelance({ success: false }, formData);
    if (resultat.success) {
      setCopiees((prev) => new Set(prev).add(item.ligne.locationId));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Relancer tous les impayés ({lignesImpayees.length})
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOuvert(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Relances à envoyer — {NOMS_MOIS[mois - 1]} {annee}
            </h2>
            <p className="mb-4 text-xs text-neutral-500">
              Copiez le texte de chaque locataire et collez-le dans votre client SMS/email.
            </p>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {lignesImpayees.map((ligne) => {
                const item = preparerLigne(ligne, mois, annee);
                const estCopiee = copiees.has(ligne.locationId);

                return (
                  <div
                    key={ligne.locationId}
                    className="rounded-md border border-neutral-200 p-3 dark:border-neutral-800"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {ligne.locataireNom} {ligne.locatairePrenom} · Box {ligne.boxNumero}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {item.canal === "sms" ? "SMS" : "Email"} · {item.contact} · Dû{" "}
                          {formaterMontant(Math.max(ligne.loyerActuel - ligne.montantRecu, 0))}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copier(item)}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                          estCopiee
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
                        }`}
                      >
                        {estCopiee ? "Copié ✓" : "Copier le texte"}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={item.texte}
                      rows={5}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setOuvert(false)}
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
