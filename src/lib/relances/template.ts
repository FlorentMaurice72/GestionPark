import { NOMS_MOIS } from "@/lib/dates";

// Modèle unique, repris tel quel du CDC (pas de personnalisation en V1).
export const MODELE_RELANCE = `Bonjour {prenom} {nom},

Nous constatons que le loyer de votre box n°{numero_box} pour le mois de {mois} ({montant}€) n'a pas encore été réglé.

Merci de régulariser votre situation dans les meilleurs délais.

Cordialement`;

const formatteurMontantSansSymbole = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export interface ParametresRelance {
  nom: string;
  prenom: string;
  numeroBox: string;
  montant: number;
  mois: number;
  annee: number;
}

export function genererTexteRelance(params: ParametresRelance): string {
  const moisLabel = `${NOMS_MOIS[params.mois - 1].toLowerCase()} ${params.annee}`;

  return MODELE_RELANCE.replace(/{prenom}/g, params.prenom)
    .replace(/{nom}/g, params.nom)
    .replace(/{numero_box}/g, params.numeroBox)
    .replace(/{montant}/g, formatteurMontantSansSymbole.format(params.montant))
    .replace(/{mois}/g, moisLabel);
}

// Convention "-" = valeur vide (cf. GestionPark_Schema_Reel.md, Locataire).
export function estContactDisponible(valeur: string): boolean {
  return valeur.trim() !== "" && valeur.trim() !== "-";
}

export type Canal = "email" | "sms";

// SMS par défaut si les deux canaux sont disponibles (décision actée
// 30/07/2026, absence d'audit réel sur cette partie du produit).
export function canalParDefaut(emailDisponible: boolean, telephoneDisponible: boolean): Canal {
  if (telephoneDisponible) return "sms";
  if (emailDisponible) return "email";
  return "sms";
}
