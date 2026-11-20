"use client";

export type TourStep =
  | "nav-biens"
  | "btn-ajouter-bien"
  | "form-nouveau-bien"
  | "btn-ajouter-box"
  | "btn-ajouter-loc"
  | "btn-faire-signer"
  | "btn-importer-csv"
  | "done";

// Steps visible in the tour (without "done") — single source of truth
export const TOUR_STEPS: TourStep[] = [
  "nav-biens",
  "btn-ajouter-bien",
  "form-nouveau-bien",
  "btn-ajouter-box",
  "btn-ajouter-loc",
  "btn-faire-signer",
  "btn-importer-csv",
];

// R7: Centralized tour config — single source of truth for SpotlightTour
export type TourConfig = {
  step: TourStep;
  path: string | RegExp;
  selector: string;
  title: string;
  desc: string;
  nextLabel: string;
  autoNavigateTo?: string;
};

export const TOUR_CONFIG: TourConfig[] = [
  {
    step: "nav-biens",
    path: "/",
    selector: "[data-tour='nav-biens']",
    title: "Créez votre premier bien",
    desc: "Commençons par déclarer votre entrepôt ou parking. Cliquez sur <strong>Mes biens immobiliers</strong> dans la barre de navigation.",
    nextLabel: "Aller aux biens →",
    autoNavigateTo: "/biens",
  },
  {
    step: "btn-ajouter-bien",
    path: "/biens",
    selector: "[data-tour='ajouter-bien']",
    title: "Ajoutez votre premier bien",
    desc: "Cliquez sur <strong>+ Ajouter</strong> pour renseigner le nom, le type et l'adresse de votre bien.",
    nextLabel: "Créer un bien →",
  },
  {
    step: "form-nouveau-bien",
    path: "/biens/nouveau",
    selector: "[data-tour='nouveau-bien-form']",
    title: "Remplissez les informations",
    desc: "Renseignez les informations de votre bien. Cliquez ensuite sur <strong>Créer le bien</strong> pour continuer — les boxs s'ajoutent à l'étape suivante.",
    nextLabel: "J'ai compris",
  },
  {
    step: "btn-ajouter-box",
    path: /^\/biens\/\d+$/,
    selector: "[data-tour='ajouter-boxes']",
    title: "Ajoutez les boxs",
    desc: "Votre bien est créé ! Ajoutez maintenant les boxs qui le composent : numéro, superficie et loyer mensuel.",
    nextLabel: "Ajouter des boxs →",
    autoNavigateTo: "/locataires",
  },
  {
    step: "btn-ajouter-loc",
    path: "/locataires",
    selector: "[data-tour='ajouter-locataire']",
    title: "Ajoutez votre premier locataire",
    desc: "Renseignez les coordonnées de votre locataire et attribuez-lui un box. Le bail est généré automatiquement.",
    nextLabel: "Créer le locataire →",
  },
  {
    step: "btn-faire-signer",
    path: /^\/locataires\/\d+$/,
    selector: "[data-tour='faire-signer']",
    title: "Faites signer le bail électroniquement",
    desc: "Votre locataire est créé ! Envoyez le bail en signature électronique via YouSign. Bailleur et locataire signent depuis leur téléphone.",
    nextLabel: "Découvrir l'import CSV →",
    autoNavigateTo: "/loyers/import",
  },
  {
    step: "btn-importer-csv",
    path: "/loyers/import",
    selector: "[data-tour='importer-csv']",
    title: "Importez votre relevé bancaire",
    desc: "Glissez votre fichier CSV bancaire ici. GestionPark reconnaît automatiquement chaque virement et l'associe au bon locataire.",
    nextLabel: "Terminer la visite ✓",
  },
];

const ORDRE: TourStep[] = [...TOUR_STEPS, "done"];

const CLE = "spotlight-tour-step";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function getTourStep(): TourStep | null {
  if (typeof window === "undefined") return null;
  try {
    return (localStorage.getItem(CLE) as TourStep) ?? null;
  } catch {
    return null;
  }
}

export function setTourStep(step: TourStep) {
  try {
    localStorage.setItem(CLE, step);
  } catch {}
}

export function advanceTour() {
  const current = getTourStep();
  if (!current) return;
  const idx = ORDRE.indexOf(current);
  if (idx < ORDRE.length - 1) {
    setTourStep(ORDRE[idx + 1]);
    window.plausible?.("tour_step", { props: { step: current } });
  }
}

export function dismissTour() {
  const current = getTourStep();
  setTourStep("done");
  window.plausible?.("tour_dismissed", { props: { at_step: current ?? "unknown" } });
}

export function startTourIfNeeded(isDemo: boolean, isNouveauCompte: boolean) {
  if (typeof window === "undefined") return;

  if (isDemo) {
    // Demo account is shared between visitors — always restart from the beginning
    setTourStep("nav-biens");
    window.dispatchEvent(new Event("gp-tour-ready"));
    return;
  }

  const current = getTourStep();
  if (current) return; // real account: don't restart once started/done

  if (isNouveauCompte) {
    setTourStep("nav-biens");
    window.dispatchEvent(new Event("gp-tour-ready"));
  }
}
