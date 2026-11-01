// Vocabulaire Document.type — non confirmé par l'audit (jamais observé en
// production), défini en Phase 6 pour correspondre aux sous-onglets demandés.
export const TYPES_DOCUMENT = [
  { valeur: "bail", label: "Baux actifs" },
  { valeur: "quittance", label: "Quittances" },
  { valeur: "relance_ar", label: "Relances avec AR" },
  { valeur: "comptable", label: "Documents comptables" },
  { valeur: "facture", label: "Factures et charges" },
  { valeur: "assurance", label: "Assurances" },
  { valeur: "taxe_fonciere", label: "Taxes foncières" },
  { valeur: "autre", label: "Autres" },
] as const;

export type TypeDocument = (typeof TYPES_DOCUMENT)[number]["valeur"];

export function libelleTypeDocument(type: string): string {
  return TYPES_DOCUMENT.find((t) => t.valeur === type)?.label ?? type;
}

// Nature d'une charge (Document.chargeType) — axe de classification distinct
// du Document.type, utilisé pour filtrer l'onglet "Gestion des charges" et
// pour exclure assurance/taxe_fonciere de l'agrégat "charges variables"
// (déjà comptées via Bien.taxeFonciere/Bien.assurance, cf. lib/finances/data.ts).
export const TYPES_CHARGE = [
  { valeur: "assurance", label: "Assurance" },
  { valeur: "taxe_fonciere", label: "Taxe foncière" },
  { valeur: "entretien", label: "Entretien" },
  { valeur: "reparation", label: "Réparation" },
  { valeur: "autre", label: "Autre" },
] as const;

export type TypeCharge = (typeof TYPES_CHARGE)[number]["valeur"];

// Une charge est un Document (fusion Document/Charge, cf. schema.prisma) : sa
// nature (chargeType) détermine le Document.type sous lequel elle est classée
// pour la navigation par catégorie de l'onglet Documents & Factures.
export function typeDocumentDepuisCharge(chargeType: TypeCharge): TypeDocument {
  if (chargeType === "assurance") return "assurance";
  if (chargeType === "taxe_fonciere") return "taxe_fonciere";
  return "facture";
}
