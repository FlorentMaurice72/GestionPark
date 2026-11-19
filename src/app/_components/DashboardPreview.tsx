"use client";

import { useState } from "react";

const ONGLETS = [
  { id: "dashboard", label: "Dashboard",   icon: "⊞" },
  { id: "locataires", label: "Locataires", icon: "◉" },
  { id: "loyers",     label: "Loyers",     icon: "€"  },
  { id: "biens",      label: "Biens",      icon: "◈" },
] as const;

type Onglet = (typeof ONGLETS)[number]["id"];

/* ── Données fictives réalistes ─────────────────────────────────── */
const LOCATAIRES = [
  { nom: "Martin Dupont",    box: "A3", bien: "Entrepôt Nord",  loyer: 65,  statut: "payé"    },
  { nom: "Sophie Bernard",   box: "B1", bien: "Centre-Ville",   loyer: 70,  statut: "payé"    },
  { nom: "Jean Moreau",      box: "A7", bien: "Entrepôt Nord",  loyer: 55,  statut: "payé"    },
  { nom: "Isabelle Roy",     box: "C2", bien: "Centre-Ville",   loyer: 80,  statut: "impayé"  },
  { nom: "Pierre Leclerc",   box: "A2", bien: "Entrepôt Nord",  loyer: 65,  statut: "payé"    },
  { nom: "Nathalie Blanc",   box: "B4", bien: "Centre-Ville",   loyer: 60,  statut: "impayé"  },
];

const LOYERS = [
  { locataire: "Martin Dupont",  box: "A3", montant: 65,  date: "02 nov.", statut: "payé"       },
  { locataire: "Sophie Bernard", box: "B1", montant: 70,  date: "03 nov.", statut: "payé"       },
  { locataire: "Jean Moreau",    box: "A7", montant: 55,  date: "05 nov.", statut: "payé"       },
  { locataire: "Pierre Leclerc", box: "A2", montant: 65,  date: "07 nov.", statut: "payé"       },
  { locataire: "Isabelle Roy",   box: "C2", montant: 80,  date: "—",      statut: "impayé"     },
  { locataire: "Nathalie Blanc", box: "B4", montant: 60,  date: "—",      statut: "impayé"     },
];

const BIENS = [
  { nom: "Entrepôt Nord",  adresse: "12 rue des Artisans, Rennes",    total: 10, loues: 9, loyer: 590 },
  { nom: "Centre-Ville",   adresse: "4 avenue Foch, Rennes",          total: 6,  loues: 5, loyer: 330 },
];

/* ── Graphique barres ───────────────────────────────────────────── */
const HISTORIQUE = [730, 760, 740, 780, 810, 790, 850, 870, 850, 890, 900, 920];
const MOIS_LABELS = ["Déc","Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov"];

/* ── Vues ───────────────────────────────────────────────────────── */
function VueDashboard() {
  const max = Math.max(...HISTORIQUE);
  return (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Taux d'occupation", val: "88 %",  sub: "14 / 16 boxs",   color: "#0047AB" },
          { label: "Loyers encaissés",  val: "920 €", sub: "ce mois · 12 payés", color: "#0097A7" },
          { label: "Impayés",           val: "2",     sub: "à relancer",      color: "#EF4444" },
          { label: "Locataires actifs", val: "14",    sub: "en cours",        color: "#0F2C59" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <p className="mb-1 text-[10px] text-neutral-400 leading-tight">{kpi.label}</p>
            <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.val}</p>
            <p className="text-[10px] text-neutral-400">{kpi.sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Loyers encaissés — 12 mois</p>
          <p className="text-xs font-bold" style={{ color: "#0047AB" }}>+10,9 %</p>
        </div>
        <div className="flex items-end gap-1 h-16 mt-3">
          {HISTORIQUE.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-opacity"
              style={{
                height: `${Math.round((h / max) * 100)}%`,
                backgroundColor: i === 11 ? "#0047AB" : "#0097A7",
                opacity: i === 11 ? 1 : 0.55 + (i / HISTORIQUE.length) * 0.3,
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-neutral-300">
          {MOIS_LABELS.map((m, i) => (
            <span key={i} className={i === 11 ? "font-bold" : ""} style={i === 11 ? { color: "#0047AB" } : {}}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function VueLocataires() {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">14 locataires actifs</p>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: "#0097A7" }}>+ Nouveau</span>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden dark:border-neutral-700 dark:bg-neutral-900">
        <div className="grid grid-cols-4 border-b border-neutral-100 px-3 py-2 text-[10px] font-semibold text-neutral-400 dark:border-neutral-700">
          <span>Locataire</span><span>Box · Bien</span><span>Loyer</span><span>Statut</span>
        </div>
        {LOCATAIRES.map((l) => (
          <div key={l.nom} className="grid grid-cols-4 border-b border-neutral-50 px-3 py-2 text-[10px] dark:border-neutral-800 last:border-0">
            <span className="font-medium text-neutral-800 truncate pr-1 dark:text-neutral-100">{l.nom}</span>
            <span className="text-neutral-500 truncate">{l.box} · {l.bien}</span>
            <span className="font-semibold" style={{ color: "#0047AB" }}>{l.loyer} €</span>
            <span>
              {l.statut === "payé"
                ? <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold text-green-600 dark:bg-green-950 dark:text-green-400">✓ Payé</span>
                : <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold text-red-500 dark:bg-red-950 dark:text-red-400">⚠ Impayé</span>
              }
            </span>
          </div>
        ))}
        <div className="px-3 py-2 text-center text-[9px] text-neutral-300">+8 autres locataires</div>
      </div>
    </div>
  );
}

function VueLoyers() {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Novembre 2025</p>
        <div className="flex gap-2 text-[10px]">
          <span className="rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-600 dark:bg-green-950 dark:text-green-400">12 payés</span>
          <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-500 dark:bg-red-950 dark:text-red-400">2 impayés</span>
        </div>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden dark:border-neutral-700 dark:bg-neutral-900">
        <div className="grid grid-cols-4 border-b border-neutral-100 px-3 py-2 text-[10px] font-semibold text-neutral-400 dark:border-neutral-700">
          <span className="col-span-2">Locataire · Box</span><span>Montant</span><span>Date</span>
        </div>
        {LOYERS.map((l) => (
          <div key={l.locataire} className="grid grid-cols-4 items-center border-b border-neutral-50 px-3 py-2 text-[10px] dark:border-neutral-800 last:border-0">
            <div className="col-span-2 flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${l.statut === "payé" ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-neutral-700 truncate dark:text-neutral-200">{l.locataire}</span>
              <span className="text-neutral-400">· {l.box}</span>
            </div>
            <span className="font-semibold" style={{ color: l.statut === "payé" ? "#0097A7" : "#EF4444" }}>{l.montant} €</span>
            <span className="text-neutral-400">{l.date}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-neutral-500">Total encaissé</span>
          <span className="text-sm font-bold" style={{ color: "#0047AB" }}>920 €</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div className="h-full rounded-full" style={{ width: "86%", background: "linear-gradient(to right, #0097A7, #0047AB)" }} />
        </div>
        <p className="mt-1 text-right text-[9px] text-neutral-400">86 % du prévisionnel (1 070 €)</p>
      </div>
    </div>
  );
}

function VueBiens() {
  return (
    <div className="p-4 sm:p-5 space-y-3">
      {BIENS.map((b) => {
        const taux = Math.round((b.loues / b.total) * 100);
        return (
          <div key={b.nom} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100">{b.nom}</p>
                <p className="text-[10px] text-neutral-400">{b.adresse}</p>
              </div>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: taux >= 85 ? "#0097A7" : "#F59E0B" }}>
                {taux} %
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Boxs total",  val: String(b.total) },
                { label: "Loués",       val: String(b.loues) },
                { label: "Loyers/mois", val: `${b.loyer} €`  },
              ].map((s) => (
                <div key={s.label} className="rounded bg-neutral-50 p-2 text-center dark:bg-neutral-800">
                  <p className="text-sm font-bold" style={{ color: "#0047AB" }}>{s.val}</p>
                  <p className="text-[9px] text-neutral-400">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div className="h-full rounded-full" style={{ width: `${taux}%`, background: "linear-gradient(to right, #0097A7, #0047AB)" }} />
            </div>
            <p className="mt-1 text-[9px] text-neutral-400">{b.loues}/{b.total} boxs occupés</p>
          </div>
        );
      })}
      <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-[10px] text-neutral-400">Total · 2 biens · 16 boxs · <strong style={{ color: "#0047AB" }}>920 €/mois</strong></p>
      </div>
    </div>
  );
}

/* ── SVG curseur main ───────────────────────────────────────────── */
function CurseurSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3l14 9-7 1-4 7L5 3z" />
    </svg>
  );
}

/* ── Composant principal ─────────────────────────────────────────── */
export function DashboardPreview() {
  const [ongletActif, setOngletActif] = useState<Onglet>("dashboard");
  const [hasInteracted, setHasInteracted] = useState(false);

  function handleClick(id: Onglet) {
    setOngletActif(id);
    if (!hasInteracted) setHasInteracted(true);
  }

  return (
    <div
      className="rounded-xl border border-neutral-200 shadow-2xl dark:border-neutral-700 overflow-hidden"
      style={{ background: "#f8fafc" }}
    >
      {/* Barre navigateur factice */}
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div
          className="mx-auto flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          style={{ minWidth: 180, maxWidth: 260 }}
        >
          <span style={{ color: "#0097A7" }}>🔒</span> gestion-park.fr
        </div>
        {/* Badge "Interactif" dans la barre du navigateur */}
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white flex-shrink-0"
          style={{ backgroundColor: "#0097A7" }}
        >
          <CurseurSVG />
          <span className="hidden sm:inline">Interactif</span>
        </div>
      </div>

      {/* Layout app */}
      <div className="relative flex" style={{ minHeight: 340 }}>

        {/* ── Tooltip "Explorez" (desktop uniquement, disparaît au premier clic) */}
        <div
          className="pointer-events-none absolute z-20 hidden sm:block"
          style={{ left: 60, top: 16, transition: "opacity 0.6s, transform 0.6s", opacity: hasInteracted ? 0 : 1, transform: hasInteracted ? "translateX(-6px)" : "translateX(0)" }}
          aria-hidden="true"
        >
          {/* Flèche pointant vers la gauche (sidebar) */}
          <div className="relative">
            <div
              className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold shadow-lg"
              style={{ backgroundColor: "#0047AB", color: "white", whiteSpace: "nowrap" }}
            >
              {/* Triangle gauche */}
              <span
                className="absolute"
                style={{ left: -7, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "7px solid #0047AB" }}
              />
              <CurseurSVG />
              Explorez les sections
            </div>
            {/* Indicateurs des 4 onglets */}
            <div className="mt-1.5 flex justify-center gap-1.5">
              {ONGLETS.map((o, i) => (
                <div
                  key={o.id}
                  className="rounded-full"
                  style={{ width: i === 0 ? 20 : 8, height: 4, backgroundColor: i === 0 ? "#0047AB" : "#93c5fd", transition: "width 0.3s" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="hidden sm:flex flex-col items-center gap-1 border-r border-neutral-200 bg-white px-2 py-4 dark:border-neutral-700 dark:bg-neutral-900"
          style={{ width: 52 }}
        >
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              onClick={() => handleClick(o.id)}
              title={o.label}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-all ${
                ongletActif === o.id ? "text-white shadow-sm scale-105" : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
              style={ongletActif === o.id ? { backgroundColor: "#0047AB" } : {}}
            >
              {/* Anneau pulsant avant la première interaction */}
              {!hasInteracted && ongletActif !== o.id && (
                <span
                  className="absolute inset-0 animate-ping rounded-lg"
                  style={{ backgroundColor: "#0047AB", opacity: 0.2 }}
                />
              )}
              {o.icon}
            </button>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-hidden" style={{ background: "#f8fafc" }}>
          {/* Onglets mobiles avec pulsing */}
          <div className="flex border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 sm:hidden">
            {ONGLETS.map((o) => (
              <button
                key={o.id}
                onClick={() => handleClick(o.id)}
                className={`relative flex-1 py-2 text-[11px] font-medium transition-colors ${
                  ongletActif === o.id ? "border-b-2 font-semibold" : "text-neutral-400"
                }`}
                style={ongletActif === o.id ? { borderColor: "#0047AB", color: "#0047AB" } : {}}
              >
                {!hasInteracted && ongletActif !== o.id && (
                  <span className="absolute inset-0 animate-pulse rounded" style={{ backgroundColor: "#0047AB", opacity: 0.06 }} />
                )}
                {o.label}
              </button>
            ))}
          </div>

          {/* En-tête de section */}
          <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
              {ONGLETS.find((o) => o.id === ongletActif)?.label}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full" style={{ backgroundColor: "#0047AB", opacity: 0.15 }} />
              <div className="h-5 w-5 rounded-full" style={{ backgroundColor: "#0047AB", opacity: 0.3 }} />
              <div className="h-5 w-5 rounded-full" style={{ backgroundColor: "#0047AB" }} />
            </div>
          </div>

          {/* Vues */}
          <div className="transition-all duration-200">
            {ongletActif === "dashboard"  && <VueDashboard />}
            {ongletActif === "locataires" && <VueLocataires />}
            {ongletActif === "loyers"     && <VueLoyers />}
            {ongletActif === "biens"      && <VueBiens />}
          </div>
        </div>
      </div>

      {/* Footer — se met à jour après interaction */}
      <div className="border-t border-neutral-200 bg-white px-4 py-2.5 dark:border-neutral-700 dark:bg-neutral-900">
        {hasInteracted ? (
          <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400">
            {ONGLETS.map((o) => (
              <button
                key={o.id}
                onClick={() => handleClick(o.id)}
                className={`rounded-full px-2 py-0.5 transition-all ${ongletActif === o.id ? "font-semibold text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                style={ongletActif === o.id ? { backgroundColor: "#0047AB" } : {}}
              >
                {o.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="animate-pulse text-center text-[10px] font-medium" style={{ color: "#0047AB" }}>
            ← Cliquez sur les icônes à gauche pour naviguer entre les sections
          </p>
        )}
      </div>
    </div>
  );
}
