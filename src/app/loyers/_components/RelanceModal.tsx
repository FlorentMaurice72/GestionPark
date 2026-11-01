"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { creerRelance, type CreerRelanceState } from "@/lib/relances/actions";
import { canalParDefaut, estContactDisponible, genererTexteRelance, type Canal } from "@/lib/relances/template";
import { formaterMontant } from "@/lib/format";

interface Props {
  locationId: number;
  locataireNom: string;
  locatairePrenom: string;
  boxNumero: string;
  loyerActuel: number;
  montantRecu: number;
  mois: number;
  annee: number;
  email: string;
  telephone: string;
}

const ETAT_INITIAL: CreerRelanceState = { success: false };

export function RelanceModal({
  locationId,
  locataireNom,
  locatairePrenom,
  boxNumero,
  loyerActuel,
  montantRecu,
  mois,
  annee,
  email,
  telephone,
}: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [copie, setCopie] = useState(false);

  const emailDisponible = estContactDisponible(email);
  const telephoneDisponible = estContactDisponible(telephone);
  const [canal, setCanal] = useState<Canal>(() => canalParDefaut(emailDisponible, telephoneDisponible));

  const montantDu = Math.max(loyerActuel - montantRecu, 0);
  const texte = useMemo(
    () =>
      genererTexteRelance({
        nom: locataireNom,
        prenom: locatairePrenom,
        numeroBox: boxNumero,
        montant: montantDu,
        mois,
        annee,
      }),
    [locataireNom, locatairePrenom, boxNumero, montantDu, mois, annee],
  );

  const [etat, formAction, enCours] = useActionState(async (_prev: CreerRelanceState, formData: FormData) => {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
    } catch {
      // Presse-papier indisponible (permissions navigateur) — on enregistre
      // quand même la relance, l'admin pourra copier le texte manuellement.
    }
    return creerRelance(_prev, formData);
  }, ETAT_INITIAL);

  function ouvrir() {
    setCopie(false);
    setOuvert(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Relancer
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOuvert(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Relancer {locataireNom} {locatairePrenom}
            </h2>
            <p className="mb-4 text-xs text-neutral-500">
              Box {boxNumero} · Loyer {formaterMontant(loyerActuel)} · Montant dû {formaterMontant(montantDu)}
            </p>

            <form action={formAction} className="space-y-3">
              <input type="hidden" name="locationId" value={locationId} />
              <input type="hidden" name="canal" value={canal} />
              <input type="hidden" name="contenuTexte" value={texte} />

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Canal</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!emailDisponible}
                    onClick={() => setCanal("email")}
                    className={`flex-1 rounded-md border px-2 py-1.5 text-sm ${
                      canal === "email"
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                        : "border-neutral-300 dark:border-neutral-700"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    disabled={!telephoneDisponible}
                    onClick={() => setCanal("sms")}
                    className={`flex-1 rounded-md border px-2 py-1.5 text-sm ${
                      canal === "sms"
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                        : "border-neutral-300 dark:border-neutral-700"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    SMS
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {canal === "email" ? email : telephone}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Texte généré</label>
                <textarea
                  readOnly
                  value={texte}
                  rows={7}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              {copie && <p className="text-sm text-green-600 dark:text-green-400">Texte copié et relance enregistrée.</p>}
              {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOuvert(false)}
                  className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={enCours}
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  {enCours ? "Copie…" : "Copier le texte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
