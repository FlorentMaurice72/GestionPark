"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export interface EntreeImport {
  locationId: number;
  montant: number;
  datePaiement: string; // ISO (YYYY-MM-DD)
}

export interface ImporterPaiementsInput {
  mois: number;
  annee: number;
  entrees: EntreeImport[];
}

export interface ImporterPaiementsResult {
  success: boolean;
  error?: string;
  count?: number;
}

export async function importerPaiements(input: ImporterPaiementsInput): Promise<ImporterPaiementsResult> {
  const { mois, annee, entrees } = input;

  if (!Number.isInteger(mois) || mois < 1 || mois > 12) {
    return { success: false, error: "Mois invalide." };
  }
  if (!Number.isInteger(annee) || annee < 2000) {
    return { success: false, error: "Année invalide." };
  }
  if (entrees.length === 0) {
    return { success: false, error: "Aucun paiement à importer." };
  }
  for (const entree of entrees) {
    if (!Number.isInteger(entree.locationId) || entree.locationId <= 0) {
      return { success: false, error: "Location invalide dans les entrées à importer." };
    }
    if (!Number.isFinite(entree.montant) || entree.montant <= 0) {
      return { success: false, error: "Montant invalide dans les entrées à importer." };
    }
    if (Number.isNaN(new Date(entree.datePaiement).getTime())) {
      return { success: false, error: "Date invalide dans les entrées à importer." };
    }
  }

  const locationIds = Array.from(new Set(entrees.map((e) => e.locationId)));

  // Ré-import du même mois : seuls les paiements précédemment importés
  // (source = "import_csv") pour les Locations à nouveau concernées sont
  // remplacés. Les saisies manuelles ne sont jamais touchées.
  await prisma.$transaction([
    prisma.paiement.deleteMany({
      where: {
        locationId: { in: locationIds },
        mois,
        annee,
        source: "import_csv",
      },
    }),
    prisma.paiement.createMany({
      data: entrees.map((entree) => ({
        locationId: entree.locationId,
        mois,
        annee,
        montant: entree.montant,
        datePaiement: new Date(entree.datePaiement),
        mode: "virement",
        source: "import_csv",
      })),
    }),
  ]);

  revalidatePath("/loyers");

  return { success: true, count: entrees.length };
}

export interface EntreeNonIdentifiee {
  libelle: string;
  montant: number;
  datePaiement: string; // ISO (YYYY-MM-DD)
}

// Persiste les transactions sans correspondance trouvée, pour que le
// Dashboard (Phase 7) puisse les signaler même après la fermeture du wizard
// — auparavant ce compte n'existait que dans l'état React éphémère de
// l'import. Ré-import du même mois : remplace entièrement les lignes non
// identifiées de ce mois (même principe que Paiement.source = "import_csv").
// Pas de résolution/assignation manuelle cette session, stockage brut
// uniquement (cf. journal de décisions Phase 7).
export async function enregistrerTransactionsNonIdentifiees(
  mois: number,
  annee: number,
  entrees: EntreeNonIdentifiee[],
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const userId = parseInt(session.user.id);

  await prisma.$transaction([
    prisma.transactionNonIdentifiee.deleteMany({ where: { mois, annee, utilisateurId: userId } }),
    ...(entrees.length > 0
      ? [
          prisma.transactionNonIdentifiee.createMany({
            data: entrees.map((entree) => ({
              libelle: entree.libelle,
              montant: entree.montant,
              datePaiement: new Date(entree.datePaiement),
              mois,
              annee,
              utilisateurId: userId,
            })),
          }),
        ]
      : []),
  ]);
}
