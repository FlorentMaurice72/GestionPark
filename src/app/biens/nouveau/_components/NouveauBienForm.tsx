"use client";

import { useActionState } from "react";
import { creerBien, type ActionState } from "@/lib/biens/actions";

const ETAT_INITIAL: ActionState = { success: false };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function NouveauBienForm() {
  const [etat, formAction, enCours] = useActionState(creerBien, ETAT_INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <legend className="px-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Informations générales
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Champ label="Nom du bien">
            <input name="nom" required className={champClasses} />
          </Champ>
          <Champ label="Type de bien">
            <input name="typeBien" placeholder="boxes" required className={champClasses} />
          </Champ>
          <Champ label="Adresse complète" pleineLargeur>
            <input name="adresseComplete" required className={champClasses} />
          </Champ>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <legend className="px-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Finances</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Champ label="Taxe foncière (€)">
            <input name="taxeFonciere" type="number" step="0.01" min="0" required className={champClasses} />
          </Champ>
          <Champ label="Assurance (€)">
            <input name="assurance" type="number" step="0.01" min="0" required className={champClasses} />
          </Champ>
          <Champ label="Montant emprunt (€)">
            <input name="montantEmprunt" type="number" step="0.01" min="0" required className={champClasses} />
          </Champ>
          <Champ label="Mensualité emprunt (€)">
            <input name="mensualiteEmprunt" type="number" step="0.01" min="0" required className={champClasses} />
          </Champ>
          <Champ label="Taux emprunt (%)">
            <input name="tauxEmprunt" type="number" step="0.001" min="0" required className={champClasses} />
          </Champ>
          <Champ label="Durée emprunt (mois)">
            <input name="dureeEmprunt" type="number" step="1" min="1" required className={champClasses} />
          </Champ>
          <Champ label="Date de début d'emprunt">
            <input name="dateDebutEmprunt" type="date" defaultValue={todayISO()} required className={champClasses} />
          </Champ>
          <Champ label="Valeur estimée (€, optionnel)">
            <input name="valeurEstimee" type="number" step="0.01" min="0.01" className={champClasses} />
          </Champ>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          La valeur estimée sert uniquement au calcul de rentabilité (onglet Finances) — laissez vide si inconnue.
        </p>
      </fieldset>

      <fieldset className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <legend className="px-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Boxes initiaux
        </legend>
        <p className="mb-3 text-xs text-neutral-500">
          Numérotation séquentielle : préfixe + numéro + suffixe (ex. &quot;1&quot; à &quot;22&quot;, ou
          &quot;1B&quot; à &quot;12B&quot; avec suffixe &quot;B&quot;).
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Champ label="Préfixe (optionnel)">
            <input name="prefixeBox" className={champClasses} />
          </Champ>
          <Champ label="Numéro de départ">
            <input name="numeroDebut" type="number" step="1" min="0" defaultValue={1} required className={champClasses} />
          </Champ>
          <Champ label="Nombre de boxes">
            <input name="nombreBoxes" type="number" step="1" min="1" required className={champClasses} />
          </Champ>
          <Champ label="Suffixe (optionnel)">
            <input name="suffixeBox" className={champClasses} />
          </Champ>
          <Champ label="Superficie par box (m²)">
            <input name="superficieBox" type="number" step="0.01" min="0.01" required className={champClasses} />
          </Champ>
        </div>
      </fieldset>

      {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {enCours ? "Création…" : "Créer le bien"}
        </button>
      </div>
    </form>
  );
}

const champClasses =
  "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800";

function Champ({
  label,
  children,
  pleineLargeur,
}: {
  label: string;
  children: React.ReactNode;
  pleineLargeur?: boolean;
}) {
  return (
    <div className={pleineLargeur ? "sm:col-span-2" : undefined}>
      <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
      {children}
    </div>
  );
}
