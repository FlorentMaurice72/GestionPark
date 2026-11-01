// Modèles de lettres — brouillons raisonnables faute de modèle réel fourni
// (contrairement au texte de relance simple de la Phase 4, aucun texte CDC
// n'existe pour ces deux lettres). À faire relire/ajuster par un juriste ou
// le propriétaire avant tout envoi réel — cf. journal de décisions Phase 6.
import { NOMS_MOIS } from "@/lib/dates";

const formatteurMontant = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export interface ParametresLettreRelanceAR {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  numeroBox: string;
  montant: number;
  mois: number;
  annee: number;
}

export function genererLettreRelanceAR(params: ParametresLettreRelanceAR, dateEnvoi: Date = new Date()): string {
  const moisLabel = `${NOMS_MOIS[params.mois - 1].toLowerCase()} ${params.annee}`;

  return `Le ${dateEnvoi.toLocaleDateString("fr-FR")}

Objet : Mise en demeure de payer — Lettre recommandée avec accusé de réception

${params.prenom} ${params.nom}
${params.adresse}
${params.codePostal} ${params.ville}

Madame, Monsieur,

Malgré nos précédentes relances, nous constatons que le loyer de votre box n°${params.numeroBox} reste impayé à ce jour, pour un montant de ${formatteurMontant.format(params.montant)}€ au titre du mois de ${moisLabel}.

Nous vous mettons en demeure de régulariser cette situation dans un délai de 8 jours à compter de la réception de la présente lettre.

À défaut de règlement dans ce délai, nous nous réservons le droit d'engager toute procédure utile au recouvrement de cette créance, sans préjudice des indemnités et intérêts de retard applicables.

Nous restons à votre disposition pour convenir d'un plan de règlement amiable.

Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`;
}

export interface ParametresLettreConge {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  numeroBox: string;
  dateFin: Date;
}

export function genererLettreConge(params: ParametresLettreConge, dateEnvoi: Date = new Date()): string {
  return `Le ${dateEnvoi.toLocaleDateString("fr-FR")}

Objet : Demande de congé — Fin de location du box n°${params.numeroBox}

${params.prenom} ${params.nom}
${params.adresse}
${params.codePostal} ${params.ville}

Madame, Monsieur,

Par la présente, nous vous informons de notre décision de mettre fin à la location du box n°${params.numeroBox} que vous occupez actuellement.

Cette fin de location prendra effet le ${params.dateFin.toLocaleDateString("fr-FR")}.

Nous vous remercions de bien vouloir libérer les lieux à cette date et de nous restituer les clés. Un état des lieux de sortie sera réalisé à cette occasion.

Nous restons à votre disposition pour toute question relative à cette procédure.

Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`;
}
