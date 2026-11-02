"use client";

import { useState, useRef } from "react";
import { creerBien, type ActionState } from "@/lib/biens/actions";

const champClasses =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-neutral-100";

const labelClasses = "mb-1 block text-xs font-medium text-neutral-500 uppercase tracking-wide";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

type TypeBien = "boxes" | "garages" | "entrepot" | "autre";

const TYPES_BIEN: { id: TypeBien; label: string; desc: string; icon: string }[] = [
  { id: "boxes", label: "Boxes de stockage", desc: "Unités de self-stockage individuelles", icon: "⊞" },
  { id: "garages", label: "Garages", desc: "Garages individuels ou boxes voitures", icon: "⊡" },
  { id: "entrepot", label: "Entrepôt", desc: "Grand espace de stockage commercial", icon: "◫" },
  { id: "autre", label: "Autre", desc: "Tout autre type de bien locatif", icon: "◻" },
];

interface Champs {
  typeBien: TypeBien;
  nom: string;
  adresseComplete: string;
  taxeFonciere: string;
  assurance: string;
  montantEmprunt: string;
  mensualiteEmprunt: string;
  tauxEmprunt: string;
  dateDebutEmprunt: string;
  dureeEmprunt: string;
  valeurEstimee: string;
  prefixeBox: string;
  numeroDebut: string;
  nombreBoxes: string;
  suffixeBox: string;
  superficieBox: string;
}

const INITIAL: Champs = {
  typeBien: "boxes",
  nom: "",
  adresseComplete: "",
  taxeFonciere: "",
  assurance: "",
  montantEmprunt: "0",
  mensualiteEmprunt: "0",
  tauxEmprunt: "0",
  dateDebutEmprunt: today(),
  dureeEmprunt: "0",
  valeurEstimee: "",
  prefixeBox: "",
  numeroDebut: "1",
  nombreBoxes: "",
  suffixeBox: "",
  superficieBox: "",
};

const ETAPES = ["Type de bien", "Adresse", "Finances", "Boxes"];

export function NouveauBienWizard() {
  const [etape, setEtape] = useState(0);
  const [champs, setChamps] = useState<Champs>(INITIAL);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function maj(champ: keyof Champs, valeur: string) {
    setChamps((prev) => ({ ...prev, [champ]: valeur }));
    setErreur(null);
  }

  function validerEtape(): boolean {
    if (etape === 0 && !champs.nom.trim()) {
      setErreur("Nommez votre bien pour continuer.");
      return false;
    }
    if (etape === 1 && !champs.adresseComplete.trim()) {
      setErreur("L'adresse est requise.");
      return false;
    }
    if (etape === 2) {
      if (!champs.taxeFonciere || isNaN(Number(champs.taxeFonciere))) {
        setErreur("Taxe foncière invalide.");
        return false;
      }
      if (!champs.assurance || isNaN(Number(champs.assurance))) {
        setErreur("Assurance invalide.");
        return false;
      }
    }
    if (etape === 3) {
      if (!champs.nombreBoxes || Number(champs.nombreBoxes) < 1) {
        setErreur("Nombre de boxes requis.");
        return false;
      }
      if (!champs.superficieBox || Number(champs.superficieBox) <= 0) {
        setErreur("Superficie invalide.");
        return false;
      }
    }
    return true;
  }

  function suivant() {
    if (!validerEtape()) return;
    setEtape((e) => e + 1);
  }

  function precedent() {
    setEtape((e) => e - 1);
    setErreur(null);
  }

  async function soumettre() {
    if (!validerEtape()) return;
    setEnCours(true);
    const fd = new FormData();
    Object.entries(champs).forEach(([k, v]) => fd.append(k, v));
    const etat: ActionState = await creerBien({ success: false }, fd);
    if (!etat.success) {
      setErreur(etat.error ?? "Erreur inconnue.");
      setEnCours(false);
    }
  }

  const apercu = (() => {
    const n = Number(champs.nombreBoxes);
    const debut = Number(champs.numeroDebut);
    if (!n || n < 1) return null;
    const nums = [];
    for (let i = 0; i < Math.min(n, 4); i++) {
      nums.push(`${champs.prefixeBox}${debut + i}${champs.suffixeBox}`);
    }
    if (n > 4) nums.push("…");
    return nums.join(", ");
  })();

  return (
    <div className="flex flex-col gap-6">
      {/* Barre de progression */}
      <div className="flex items-center gap-2">
        {ETAPES.map((titre, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i < etape
                  ? "bg-green-500 text-white"
                  : i === etape
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "bg-neutral-200 text-neutral-400 dark:bg-neutral-800"
              }`}
            >
              {i < etape ? "✓" : i + 1}
            </div>
            <span
              className={`hidden text-xs sm:block ${
                i === etape ? "font-semibold text-neutral-900 dark:text-neutral-100" : "text-neutral-400"
              }`}
            >
              {titre}
            </span>
            {i < ETAPES.length - 1 && (
              <div className="absolute" />
            )}
          </div>
        ))}
      </div>

      {/* Contenu de l'étape */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        {etape === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Quel type de bien gérez-vous ?
              </p>
              <p className="text-sm text-neutral-500">Choisissez le type puis donnez un nom à votre bien.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TYPES_BIEN.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => maj("typeBien", t.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    champs.typeBien === t.id
                      ? "border-neutral-900 bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-800"
                      : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{t.label}</span>
                  <span className="text-xs text-neutral-400">{t.desc}</span>
                </button>
              ))}
            </div>
            <div>
              <label className={labelClasses}>Nom du bien</label>
              <input
                value={champs.nom}
                onChange={(e) => maj("nom", e.target.value)}
                placeholder="ex. Bâtiment A — Rue de la Paix"
                className={champClasses}
                autoFocus
              />
            </div>
          </div>
        )}

        {etape === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">Adresse du bien</p>
              <p className="text-sm text-neutral-500">Renseignez l'adresse complète du bâtiment.</p>
            </div>
            <div>
              <label className={labelClasses}>Adresse complète</label>
              <input
                value={champs.adresseComplete}
                onChange={(e) => maj("adresseComplete", e.target.value)}
                placeholder="12 rue de la Paix, 75001 Paris"
                className={champClasses}
                autoFocus
              />
            </div>
          </div>
        )}

        {etape === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">Données financières</p>
              <p className="text-sm text-neutral-500">
                Ces données alimentent les calculs de rentabilité. Mettez 0 si non applicable.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Taxe foncière annuelle (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={champs.taxeFonciere}
                  onChange={(e) => maj("taxeFonciere", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Assurance annuelle (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={champs.assurance}
                  onChange={(e) => maj("assurance", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Montant emprunt (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={champs.montantEmprunt}
                  onChange={(e) => maj("montantEmprunt", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Mensualité emprunt (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={champs.mensualiteEmprunt}
                  onChange={(e) => maj("mensualiteEmprunt", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Taux emprunt (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={champs.tauxEmprunt}
                  onChange={(e) => maj("tauxEmprunt", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Durée emprunt (mois)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={champs.dureeEmprunt}
                  onChange={(e) => maj("dureeEmprunt", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Date de début d'emprunt</label>
                <input
                  type="date"
                  value={champs.dateDebutEmprunt}
                  onChange={(e) => maj("dateDebutEmprunt", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Valeur estimée (€, optionnel)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={champs.valeurEstimee}
                  onChange={(e) => maj("valeurEstimee", e.target.value)}
                  placeholder="Laissez vide si inconnu"
                  className={champClasses}
                />
              </div>
            </div>
          </div>
        )}

        {etape === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Configuration des boxes
              </p>
              <p className="text-sm text-neutral-500">
                Les numéros sont générés automatiquement : préfixe + numéro + suffixe.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className={labelClasses}>Préfixe</label>
                <input
                  value={champs.prefixeBox}
                  onChange={(e) => maj("prefixeBox", e.target.value)}
                  placeholder="ex. A"
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>N° de départ</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={champs.numeroDebut}
                  onChange={(e) => maj("numeroDebut", e.target.value)}
                  className={champClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Nombre de boxes</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={champs.nombreBoxes}
                  onChange={(e) => maj("nombreBoxes", e.target.value)}
                  className={champClasses}
                  autoFocus
                />
              </div>
              <div>
                <label className={labelClasses}>Suffixe</label>
                <input
                  value={champs.suffixeBox}
                  onChange={(e) => maj("suffixeBox", e.target.value)}
                  placeholder="ex. B"
                  className={champClasses}
                />
              </div>
            </div>
            <div className="max-w-xs">
              <label className={labelClasses}>Superficie par box (m²)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={champs.superficieBox}
                onChange={(e) => maj("superficieBox", e.target.value)}
                className={champClasses}
              />
            </div>
            {apercu && (
              <div className="rounded-lg bg-neutral-50 px-4 py-3 text-sm dark:bg-neutral-800">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Aperçu numéros : </span>
                <span className="text-neutral-500">{apercu}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {erreur && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {erreur}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={precedent}
          className={`rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 ${
            etape === 0 ? "invisible" : ""
          }`}
        >
          ← Précédent
        </button>

        {etape < ETAPES.length - 1 ? (
          <button
            type="button"
            onClick={suivant}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Suivant →
          </button>
        ) : (
          <button
            type="button"
            onClick={soumettre}
            disabled={enCours}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {enCours ? "Création…" : "Créer le bien →"}
          </button>
        )}
      </div>

      <form ref={formRef} className="hidden" />
    </div>
  );
}
