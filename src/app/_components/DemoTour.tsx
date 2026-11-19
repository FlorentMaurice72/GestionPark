"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ETAPES = [
  {
    icone: "👋",
    titre: "Bienvenue sur GestionPark !",
    description:
      "Vous explorez un compte démo pré-rempli avec de vraies données fictives. En 5 étapes, nous allons vous montrer l'essentiel de l'application.",
    cta: "C'est parti →",
    couleur: "#0047AB",
  },
  {
    icone: "📊",
    titre: "Votre tableau de bord",
    description:
      "En un coup d'œil : taux d'occupation, loyers encaissés du mois, impayés et prochaines échéances. Tout ce dont vous avez besoin pour piloter vos boxs.",
    visuel: (
      <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Occupation", val: "86 %", color: "#0047AB" },
            { label: "Loyers (mois)", val: "920 €", color: "#0097A7" },
            { label: "Impayés", val: "1", color: "#E53E3E" },
            { label: "Locataires", val: "12", color: "#20B2AA" },
          ].map((k) => (
            <div key={k.label} className="rounded-lg bg-white p-3 shadow-sm dark:bg-neutral-900">
              <p className="text-xs text-neutral-500">{k.label}</p>
              <p className="text-lg font-bold" style={{ color: k.color }}>{k.val}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    cta: "Suivant →",
    couleur: "#0047AB",
  },
  {
    icone: "🏢",
    titre: "Biens & Boxs",
    description:
      "Organisez vos entrepôts et parkings par bien. Chaque bien contient ses boxs avec superficie, loyer et statut. Ajoutez ou archivez un box en quelques secondes.",
    visuel: (
      <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
        {[
          { nom: "Entrepôt Nord", boxs: 10, loues: 9 },
          { nom: "Centre-Ville", boxs: 6, loues: 5 },
        ].map((b) => (
          <div key={b.nom} className="mb-3 last:mb-0 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-neutral-900">
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{b.nom}</p>
              <p className="text-xs text-neutral-500">{b.boxs} boxs</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">{b.loues} loués</span>
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 font-medium text-neutral-600">{b.boxs - b.loues} vacant{b.boxs - b.loues > 1 ? "s" : ""}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    cta: "Suivant →",
    couleur: "#0097A7",
  },
  {
    icone: "👤",
    titre: "Locataires & contrats",
    description:
      "Retrouvez tous vos locataires, leur box, leur loyer et leur statut de paiement. Générez un bail en PDF et envoyez-le en signature électronique en un clic.",
    visuel: (
      <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800 space-y-2">
        {[
          { nom: "Martin Dupont", box: "Box 03 · Entrepôt Nord", loyer: "65 €/mois", statut: "Actif", ok: true },
          { nom: "Sophie Bernard", box: "Box 11 · Centre-Ville", loyer: "55 €/mois", statut: "Impayé", ok: false },
        ].map((l) => (
          <div key={l.nom} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-neutral-900">
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{l.nom}</p>
              <p className="text-xs text-neutral-500">{l.box} · {l.loyer}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {l.statut}
            </span>
          </div>
        ))}
      </div>
    ),
    cta: "Suivant →",
    couleur: "#0047AB",
  },
  {
    icone: "💶",
    titre: "Import CSV bancaire",
    description:
      "Glissez votre relevé bancaire au format CSV. GestionPark identifie automatiquement chaque virement et l'associe au bon locataire. Fini les vérifications manuelles.",
    visuel: (
      <div className="mt-4 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center dark:border-neutral-600 dark:bg-neutral-800">
        <div className="text-3xl mb-2">📂</div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Glissez votre CSV ici</p>
        <p className="mt-1 text-xs text-neutral-400">Formats supportés : Société Générale, BNP, Crédit Agricole, LCL…</p>
        <div className="mt-3 flex justify-center gap-2 text-xs">
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">✓ 11 virements identifiés</span>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">1 à vérifier</span>
        </div>
      </div>
    ),
    cta: "Suivant →",
    couleur: "#0097A7",
  },
  {
    icone: "✍️",
    titre: "Signature électronique",
    description:
      "Générez le bail de votre locataire et envoyez-le en signature électronique via YouSign. Bailleur et locataire signent depuis leur téléphone. Le PDF signé est archivé automatiquement.",
    visuel: (
      <div className="mt-4 flex flex-col gap-3">
        {[
          { label: "Génération du bail PDF", done: true },
          { label: "Envoi au locataire par email", done: true },
          { label: "Signature du locataire", done: true },
          { label: "Votre signature (bailleur)", done: false, active: true },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-3 rounded-lg px-4 py-3 ${s.active ? "border-2 bg-blue-50 dark:bg-blue-950/20" : "bg-neutral-50 dark:bg-neutral-800"} border border-neutral-200 dark:border-neutral-700`}
            style={s.active ? { borderColor: "#0047AB" } : {}}>
            <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.done ? "bg-green-500 text-white" : s.active ? "text-white" : "bg-neutral-300 text-neutral-500"}`}
              style={s.active ? { backgroundColor: "#0047AB" } : {}}>
              {s.done ? "✓" : "→"}
            </span>
            <span className={`text-sm ${s.active ? "font-semibold" : "text-neutral-600 dark:text-neutral-400"}`}
              style={s.active ? { color: "#0047AB" } : {}}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    ),
    cta: "Explorer la démo →",
    couleur: "#0047AB",
    derniere: true,
  },
];

interface Props {
  isDemo: boolean;
  isNouveauCompte?: boolean;
}

export function DemoTour({ isDemo, isNouveauCompte = false }: Props) {
  const [etape, setEtape] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cleStorage = isDemo ? "demo-tour-vu" : "onboarding-tour-vu";

  useEffect(() => {
    setMounted(true);
    if (!isDemo && !isNouveauCompte) return;
    try {
      if (!localStorage.getItem(cleStorage)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [isDemo, isNouveauCompte, cleStorage]);

  if (!mounted || !visible) return null;

  function fermer() {
    try { localStorage.setItem(cleStorage, "1"); } catch {}
    setVisible(false);
  }

  function suivant() {
    if (etape < ETAPES.length - 1) {
      setEtape((e) => e + 1);
    } else {
      fermer();
    }
  }

  const e = ETAPES[etape];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 44, 89, 0.7)", backdropFilter: "blur(4px)" }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        {/* Bouton fermer */}
        <button
          onClick={fermer}
          className="absolute right-4 top-4 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Passer la visite"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.207 4.207a1 1 0 0 0-1.414-1.414L8 5.586 5.207 2.793a1 1 0 0 0-1.414 1.414L6.586 7l-2.793 2.793a1 1 0 1 0 1.414 1.414L8 8.414l2.793 2.793a1 1 0 0 0 1.414-1.414L9.414 7l2.793-2.793Z" />
          </svg>
        </button>

        <div className="p-7">
          {/* Icône */}
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: `${e.couleur}18` }}
          >
            {e.icone}
          </div>

          {/* Titre + description */}
          <h2 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">{e.titre}</h2>
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{e.description}</p>

          {/* Visuel optionnel */}
          {"visuel" in e && e.visuel}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            {/* Points de progression */}
            <div className="flex gap-1.5">
              {ETAPES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setEtape(i)}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === etape ? 20 : 8,
                    backgroundColor: i === etape ? e.couleur : "#E2E8F0",
                  }}
                  aria-label={`Étape ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={suivant}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: e.couleur }}
            >
              {e.cta}
            </button>
          </div>

          {/* Lien passer */}
          {etape < ETAPES.length - 1 && (
            <p className="mt-3 text-center text-xs text-neutral-400">
              <button onClick={fermer} className="hover:text-neutral-600 underline">
                Passer la visite guidée
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
