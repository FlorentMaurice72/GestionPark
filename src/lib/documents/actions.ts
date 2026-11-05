"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TYPES_DOCUMENT, type TypeDocument } from "./types";
import { genererLettreConge, genererLettreRelanceAR } from "./lettres";
import { supprimerFichier } from "@/lib/supabase-storage";

export interface ActionState {
  success: boolean;
  error?: string;
}

function estTypeDocument(valeur: unknown): valeur is TypeDocument {
  return typeof valeur === "string" && TYPES_DOCUMENT.some((t) => t.valeur === valeur);
}

export async function creerDocument(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const type = formData.get("type");
  const bienId = Number(formData.get("bienId"));
  const locataireIdBrut = String(formData.get("locataireId") ?? "").trim();
  const locataireId = locataireIdBrut ? Number(locataireIdBrut) : null;
  const nomFichier = String(formData.get("nomFichier") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const dateDocument = formData.get("dateDocument");

  if (!estTypeDocument(type)) return { success: false, error: "Type de document invalide." };
  if (!Number.isInteger(bienId) || bienId <= 0) return { success: false, error: "Bien invalide." };
  if (locataireId !== null && (!Number.isInteger(locataireId) || locataireId <= 0)) {
    return { success: false, error: "Locataire invalide." };
  }
  if (!nomFichier) return { success: false, error: "Nom du document requis." };
  if (typeof dateDocument !== "string" || !dateDocument) {
    return { success: false, error: "Date invalide." };
  }

  const bien = await prisma.bien.findUnique({ where: { id: bienId } });
  if (!bien) return { success: false, error: "Bien introuvable." };

  const fileIdBrut = String(formData.get("fileId") ?? "").trim();
  const fileId = fileIdBrut || "-";

  await prisma.document.create({
    data: {
      fileId,
      nomFichier,
      type,
      description,
      bienId,
      locataireId,
      dateDocument: new Date(dateDocument),
    },
  });

  revalidatePath("/finances");

  return { success: true };
}

export async function supprimerDocument(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { success: false, error: "Document invalide." };

  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) return { success: false, error: "Document introuvable." };

  await prisma.document.delete({ where: { id } });

  if (document.fileId !== "-") {
    try {
      await supprimerFichier(document.fileId);
    } catch {
      // suppression Supabase non bloquante : le document DB est déjà supprimé
    }
  }

  revalidatePath("/finances");

  return { success: true };
}

export async function genererRelanceAR(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const locataireId = Number(formData.get("locataireId"));
  if (!Number.isInteger(locataireId) || locataireId <= 0) {
    return { success: false, error: "Locataire invalide." };
  }

  const location = await prisma.location.findFirst({
    where: { locataireId, statut: "actif" },
    include: { box: { include: { bien: true } }, locataire: true },
  });
  if (!location) return { success: false, error: "Aucune location active pour ce locataire." };

  const today = new Date();
  const mois = today.getUTCMonth() + 1;
  const annee = today.getUTCFullYear();

  const sommeRecue = await prisma.paiement.aggregate({
    _sum: { montant: true },
    where: { locationId: location.id, mois, annee },
  });
  const montantDu = Math.max(location.loyerActuel.toNumber() - (sommeRecue._sum.montant?.toNumber() ?? 0), 0);

  const texte = genererLettreRelanceAR({
    nom: location.locataire.nom,
    prenom: location.locataire.prenom,
    adresse: location.locataire.adresse,
    ville: location.locataire.ville,
    codePostal: location.locataire.codePostal,
    numeroBox: location.box.numero,
    montant: montantDu,
    mois,
    annee,
  });

  await prisma.document.create({
    data: {
      fileId: "-",
      nomFichier: `Relance AR — ${location.locataire.nom} ${location.locataire.prenom}`,
      type: "relance_ar",
      bienId: location.box.bienId,
      locataireId: location.locataireId,
      contenuTexte: texte,
      dateDocument: today,
    },
  });

  revalidatePath("/finances");

  return { success: true };
}

export async function genererDemandeConge(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const locataireId = Number(formData.get("locataireId"));
  const dateFin = formData.get("dateFin");

  if (!Number.isInteger(locataireId) || locataireId <= 0) {
    return { success: false, error: "Locataire invalide." };
  }
  if (typeof dateFin !== "string" || !dateFin) {
    return { success: false, error: "Date de fin invalide." };
  }

  const location = await prisma.location.findFirst({
    where: { locataireId, statut: "actif" },
    include: { box: { include: { bien: true } }, locataire: true },
  });
  if (!location) return { success: false, error: "Aucune location active pour ce locataire." };

  const texte = genererLettreConge({
    nom: location.locataire.nom,
    prenom: location.locataire.prenom,
    adresse: location.locataire.adresse,
    ville: location.locataire.ville,
    codePostal: location.locataire.codePostal,
    numeroBox: location.box.numero,
    dateFin: new Date(dateFin),
  });

  await prisma.document.create({
    data: {
      fileId: "-",
      nomFichier: `Demande de congé — ${location.locataire.nom} ${location.locataire.prenom}`,
      type: "autre",
      bienId: location.box.bienId,
      locataireId: location.locataireId,
      contenuTexte: texte,
      dateDocument: new Date(),
    },
  });

  revalidatePath("/finances");

  return { success: true };
}
