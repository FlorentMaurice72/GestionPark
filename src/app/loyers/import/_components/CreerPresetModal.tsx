"use client";

import { useState, useActionState, useRef } from "react";
import { creerPreset, type CreerPresetState, type PresetCreated } from "@/lib/import/preset-actions";

const ETAT_INITIAL: CreerPresetState = { success: false };

interface Props {
  onCreated: (preset: PresetCreated) => void;
}

export function CreerPresetModal({ onCreated }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [delimiter, setDelimiter] = useState(";");
  const [hasHeaderRow, setHasHeaderRow] = useState(true);
  const [ligneSample, setLigneSample] = useState("");
  const [colonnes, setColonnes] = useState<string[]>([]);
  const [etape, setEtape] = useState<1 | 2>(1);
  const nameRef = useRef<HTMLInputElement>(null);
  const [nomPreset, setNomPreset] = useState("");

  const [etat, formAction, enCours] = useActionState(async (prev: CreerPresetState, fd: FormData) => {
    const result = await creerPreset(prev, fd);
    if (result.success && result.preset) {
      onCreated(result.preset);
      setOuvert(false);
      setEtape(1);
      setLigneSample("");
      setColonnes([]);
      setNomPreset("");
    }
    return result;
  }, ETAT_INITIAL);

  function detecterColonnes() {
    const parts = ligneSample.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ""));
    const valides = parts.filter(Boolean);
    setColonnes(valides);
    if (valides.length > 0) setEtape(2);
  }

  function fermer() {
    setOuvert(false);
    setEtape(1);
    setLigneSample("");
    setColonnes([]);
    setNomPreset("");
  }

  const CHAMPS = [
    { field: "dateColumn", label: "Colonne date" },
    { field: "descriptionColumn", label: "Colonne libellé" },
    { field: "amountColumn", label: "Colonne montant (entrée d'argent)" },
  ] as const;

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="text-xs font-medium text-neutral-600 underline hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        + Créer un préréglage
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={fermer}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Nouveau préréglage bancaire
            </h2>
            <p className="mb-4 text-xs text-neutral-500">
              Configurez une fois le format de votre banque.
            </p>

            {etape === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    Nom du préréglage
                  </label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={nomPreset}
                    onChange={(e) => setNomPreset(e.target.value)}
                    placeholder="ex. Crédit Mutuel"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Délimiteur</label>
                  <div className="flex gap-2">
                    {([";", ","] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDelimiter(d)}
                        className={`rounded-md border px-4 py-1.5 text-sm font-mono ${
                          delimiter === d
                            ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                            : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        {d === ";" ? "; (point-virgule)" : ", (virgule)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    Ligne d&apos;en-tête
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {([true, false] as const).map((v) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => setHasHeaderRow(v)}
                        className={`rounded-md border px-3 py-1.5 text-xs ${
                          hasHeaderRow === v
                            ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                            : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        {v ? "Oui (1re ligne = en-tête)" : "Non (données dès la 1re ligne)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    {hasHeaderRow
                      ? "Collez la ligne d'en-tête de votre CSV"
                      : "Collez la première ligne de données"}
                  </label>
                  <textarea
                    value={ligneSample}
                    onChange={(e) => setLigneSample(e.target.value)}
                    rows={2}
                    placeholder={
                      hasHeaderRow
                        ? "Date;Libellé;Débit;Crédit;Solde"
                        : "03/11/2026;VIR SEPA MARTIN;-;150,00;1234,56"
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={fermer}
                    className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={!ligneSample.trim() || !nomPreset.trim()}
                    onClick={detecterColonnes}
                    className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
                  >
                    Détecter les colonnes →
                  </button>
                </div>
              </div>
            )}

            {etape === 2 && (
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="delimiter" value={delimiter} />
                <input type="hidden" name="hasHeaderRow" value={String(hasHeaderRow)} />
                <input type="hidden" name="columns" value={colonnes.join("|||")} />
                <input type="hidden" name="name" value={nomPreset} />

                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
                  <p className="mb-1 text-xs font-medium text-neutral-500">Colonnes détectées</p>
                  <div className="flex flex-wrap gap-1">
                    {colonnes.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {CHAMPS.map(({ field, label }) => (
                  <div key={field}>
                    <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
                    <select
                      name={field}
                      required
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <option value="">— Choisir —</option>
                      {colonnes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {etat.error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEtape(1)}
                    className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    ← Retour
                  </button>
                  <button
                    type="submit"
                    disabled={enCours}
                    className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                  >
                    {enCours ? "Enregistrement…" : "Enregistrer le préréglage"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
