import Papa from "papaparse";

// Parsing CSV piloté entièrement par l'ImportPreset — aucune connaissance
// d'une banque en particulier codée en dur ici.

export interface PresetCsv {
  delimiter: string;
  columns: string[];
  hasHeaderRow: boolean;
  dateColumn: string;
  descriptionColumn: string;
  amountColumn: string;
}

export interface TransactionBrute {
  ligne: number; // numéro de ligne dans le fichier (1-indexé), pour affichage
  date: Date;
  libelle: string;
  montant: number;
}

export interface ErreurLigne {
  ligne: number;
  raison: string;
}

export interface ResultatExtraction {
  transactions: TransactionBrute[];
  erreurs: ErreurLigne[];
}

export function parseMontantFR(brut: string): number | null {
  const nettoye = brut.trim().replace(/\s/g, "").replace(",", ".");
  if (nettoye === "") return null;
  const valeur = Number(nettoye);
  return Number.isFinite(valeur) ? valeur : null;
}

export function parseDateFR(brut: string): Date | null {
  const correspondance = brut.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!correspondance) return null;
  const [, jourStr, moisStr, anneeStr] = correspondance;
  const jour = Number(jourStr);
  const mois = Number(moisStr);
  const annee = Number(anneeStr);
  if (mois < 1 || mois > 12 || jour < 1 || jour > 31) return null;
  const date = new Date(Date.UTC(annee, mois - 1, jour));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function extraireTransactions(texteCsv: string, preset: PresetCsv): ResultatExtraction {
  const erreurs: ErreurLigne[] = [];
  const transactions: TransactionBrute[] = [];

  if (preset.hasHeaderRow) {
    const parseResult = Papa.parse<Record<string, string>>(texteCsv, {
      delimiter: preset.delimiter,
      header: true,
      skipEmptyLines: true,
    });

    const colonnes = parseResult.meta.fields ?? [];
    for (const nomColonne of [preset.dateColumn, preset.descriptionColumn, preset.amountColumn]) {
      if (!colonnes.includes(nomColonne)) {
        throw new Error(
          `Le fichier ne contient pas la colonne "${nomColonne}" attendue par le préréglage. Colonnes trouvées : ${colonnes.join(", ")}.`,
        );
      }
    }

    parseResult.data.forEach((ligne, i) => {
      const numeroLigne = i + 2; // +1 pour l'index 0, +1 pour la ligne d'en-tête
      traiterLigne(numeroLigne, ligne[preset.dateColumn], ligne[preset.descriptionColumn], ligne[preset.amountColumn], transactions, erreurs);
    });
  } else {
    const parseResult = Papa.parse<string[]>(texteCsv, {
      delimiter: preset.delimiter,
      header: false,
      skipEmptyLines: true,
    });

    const indexDate = preset.columns.indexOf(preset.dateColumn);
    const indexLibelle = preset.columns.indexOf(preset.descriptionColumn);
    const indexMontant = preset.columns.indexOf(preset.amountColumn);

    if (indexDate === -1 || indexLibelle === -1 || indexMontant === -1) {
      throw new Error("Le préréglage référence une colonne absente de sa propre liste de colonnes.");
    }

    parseResult.data.forEach((ligne, i) => {
      const numeroLigne = i + 1;
      traiterLigne(numeroLigne, ligne[indexDate], ligne[indexLibelle], ligne[indexMontant], transactions, erreurs);
    });
  }

  return { transactions, erreurs };
}

function traiterLigne(
  numeroLigne: number,
  dateBrute: string | undefined,
  libelleBrut: string | undefined,
  montantBrut: string | undefined,
  transactions: TransactionBrute[],
  erreurs: ErreurLigne[],
): void {
  const montant = parseMontantFR(montantBrut ?? "");
  // Montant vide/nul/négatif : débit ou ligne non pertinente, ignorée sans
  // erreur (comportement attendu, pas une anomalie).
  if (montant === null || montant <= 0) return;

  const date = parseDateFR(dateBrute ?? "");
  if (!date) {
    erreurs.push({ ligne: numeroLigne, raison: `Date illisible : "${dateBrute ?? ""}"` });
    return;
  }

  transactions.push({
    ligne: numeroLigne,
    date,
    libelle: (libelleBrut ?? "").trim(),
    montant,
  });
}
