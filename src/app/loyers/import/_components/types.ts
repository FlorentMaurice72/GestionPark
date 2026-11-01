export type Etape = "selection" | "traitement" | "verification" | "import" | "termine";

export type RaisonNonAffecte = "aucune_correspondance" | "correspondances_multiples";

export interface LigneImport {
  ligne: number;
  date: Date;
  libelle: string;
  montant: number;
  locationId: number | null;
  raisonNonAffecte?: RaisonNonAffecte;
}

export interface ErreurFormatLigne {
  ligne: number;
  raison: string;
}
