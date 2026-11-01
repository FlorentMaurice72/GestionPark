"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { genererNumeros } from "./numerotation";

export interface ActionState {
  success: boolean;
  error?: string;
}

interface ParametresBoxesForm {
  numeros: string[];
  superficie: number;
}

// Extrait et valide les champs communs de numérotation/superficie utilisés à
// la fois par la création d'un bien et par l'ajout de boxes à un bien existant.
function extraireParametresBoxes(formData: FormData): ParametresBoxesForm | { error: string } {
  const prefixe = String(formData.get("prefixeBox") ?? "").trim();
  const suffixe = String(formData.get("suffixeBox") ?? "").trim();
  const numeroDebut = Number(formData.get("numeroDebut"));
  const nombreBoxes = Number(formData.get("nombreBoxes"));
  const superficie = Number(formData.get("superficieBox"));

  if (!Number.isInteger(numeroDebut) || numeroDebut < 0) {
    return { error: "Numéro de départ invalide." };
  }
  if (!Number.isInteger(nombreBoxes) || nombreBoxes < 1) {
    return { error: "Nombre de boxes invalide." };
  }
  if (!Number.isFinite(superficie) || superficie <= 0) {
    return { error: "Superficie invalide." };
  }

  return { numeros: genererNumeros({ prefixe, numeroDebut, nombreBoxes, suffixe }), superficie };
}

// Optionnelle (absente de l'audit d'origine, ajoutée en Phase 6 pour les
// calculs de rentabilité) — champ vide autorisé, contrairement aux autres
// champs financiers du bien.
function extraireValeurEstimee(formData: FormData): number | null | { error: string } {
  const brut = String(formData.get("valeurEstimee") ?? "").trim();
  if (!brut) return null;
  const valeur = Number(brut);
  if (!Number.isFinite(valeur) || valeur <= 0) return { error: "Valeur estimée invalide." };
  return valeur;
}

async function verifierNumerosDisponibles(numeros: string[]): Promise<string | null> {
  const existants = await prisma.box.findMany({
    where: { numero: { in: numeros } },
    select: { numero: true },
  });
  if (existants.length > 0) {
    return `Numéro(s) de box déjà utilisé(s) : ${existants.map((b) => b.numero).join(", ")}.`;
  }
  const doublons = numeros.filter((n, i) => numeros.indexOf(n) !== i);
  if (doublons.length > 0) {
    return `Numéro(s) en double dans le lot : ${[...new Set(doublons)].join(", ")}.`;
  }
  return null;
}

export async function creerBien(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const nom = String(formData.get("nom") ?? "").trim();
  const typeBien = String(formData.get("typeBien") ?? "").trim();
  const adresseComplete = String(formData.get("adresseComplete") ?? "").trim();
  const taxeFonciere = Number(formData.get("taxeFonciere"));
  const assurance = Number(formData.get("assurance"));
  const montantEmprunt = Number(formData.get("montantEmprunt"));
  const mensualiteEmprunt = Number(formData.get("mensualiteEmprunt"));
  const tauxEmprunt = Number(formData.get("tauxEmprunt"));
  const dateDebutEmprunt = formData.get("dateDebutEmprunt");
  const dureeEmprunt = Number(formData.get("dureeEmprunt"));

  if (!nom) return { success: false, error: "Nom du bien requis." };
  if (!typeBien) return { success: false, error: "Type de bien requis." };
  if (!adresseComplete) return { success: false, error: "Adresse requise." };
  if (![taxeFonciere, assurance, montantEmprunt, mensualiteEmprunt, tauxEmprunt].every(Number.isFinite)) {
    return { success: false, error: "Champs financiers invalides." };
  }
  if (typeof dateDebutEmprunt !== "string" || !dateDebutEmprunt) {
    return { success: false, error: "Date de début d'emprunt invalide." };
  }
  if (!Number.isInteger(dureeEmprunt) || dureeEmprunt <= 0) {
    return { success: false, error: "Durée d'emprunt invalide." };
  }

  const valeurEstimee = extraireValeurEstimee(formData);
  if (valeurEstimee !== null && typeof valeurEstimee === "object") {
    return { success: false, error: valeurEstimee.error };
  }

  const parametresBoxes = extraireParametresBoxes(formData);
  if ("error" in parametresBoxes) {
    return { success: false, error: parametresBoxes.error };
  }

  const erreurNumeros = await verifierNumerosDisponibles(parametresBoxes.numeros);
  if (erreurNumeros) return { success: false, error: erreurNumeros };

  const bien = await prisma.$transaction(async (tx) => {
    const nouveauBien = await tx.bien.create({
      data: {
        nom,
        typeBien,
        adresseComplete,
        nombreBoxes: parametresBoxes.numeros.length,
        taxeFonciere,
        assurance,
        montantEmprunt,
        mensualiteEmprunt,
        tauxEmprunt,
        dateDebutEmprunt: new Date(dateDebutEmprunt),
        dureeEmprunt,
        valeurEstimee,
      },
    });

    await tx.box.createMany({
      data: parametresBoxes.numeros.map((numero) => ({
        bienId: nouveauBien.id,
        numero,
        superficie: parametresBoxes.superficie,
      })),
    });

    return nouveauBien;
  });

  revalidatePath("/biens");
  redirect(`/biens/${bien.id}`);
}

export async function ajouterBoxes(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const bienId = Number(formData.get("bienId"));
  if (!Number.isInteger(bienId) || bienId <= 0) {
    return { success: false, error: "Bien invalide." };
  }

  const parametresBoxes = extraireParametresBoxes(formData);
  if ("error" in parametresBoxes) {
    return { success: false, error: parametresBoxes.error };
  }

  const erreurNumeros = await verifierNumerosDisponibles(parametresBoxes.numeros);
  if (erreurNumeros) return { success: false, error: erreurNumeros };

  const bien = await prisma.bien.findUnique({ where: { id: bienId } });
  if (!bien) return { success: false, error: "Bien introuvable." };

  await prisma.$transaction(async (tx) => {
    await tx.box.createMany({
      data: parametresBoxes.numeros.map((numero) => ({
        bienId,
        numero,
        superficie: parametresBoxes.superficie,
      })),
    });
    await tx.bien.update({
      where: { id: bienId },
      data: { nombreBoxes: { increment: parametresBoxes.numeros.length } },
    });
  });

  revalidatePath(`/biens/${bienId}`);
  revalidatePath("/biens");

  return { success: true };
}

export async function modifierBien(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const nom = String(formData.get("nom") ?? "").trim();
  const typeBien = String(formData.get("typeBien") ?? "").trim();
  const adresseComplete = String(formData.get("adresseComplete") ?? "").trim();
  const taxeFonciere = Number(formData.get("taxeFonciere"));
  const assurance = Number(formData.get("assurance"));
  const montantEmprunt = Number(formData.get("montantEmprunt"));
  const mensualiteEmprunt = Number(formData.get("mensualiteEmprunt"));
  const tauxEmprunt = Number(formData.get("tauxEmprunt"));
  const dateDebutEmprunt = formData.get("dateDebutEmprunt");
  const dureeEmprunt = Number(formData.get("dureeEmprunt"));

  if (!Number.isInteger(id) || id <= 0) return { success: false, error: "Bien invalide." };
  if (!nom) return { success: false, error: "Nom du bien requis." };
  if (!typeBien) return { success: false, error: "Type de bien requis." };
  if (!adresseComplete) return { success: false, error: "Adresse requise." };
  if (![taxeFonciere, assurance, montantEmprunt, mensualiteEmprunt, tauxEmprunt].every(Number.isFinite)) {
    return { success: false, error: "Champs financiers invalides." };
  }
  if (typeof dateDebutEmprunt !== "string" || !dateDebutEmprunt) {
    return { success: false, error: "Date de début d'emprunt invalide." };
  }
  if (!Number.isInteger(dureeEmprunt) || dureeEmprunt <= 0) {
    return { success: false, error: "Durée d'emprunt invalide." };
  }

  const valeurEstimee = extraireValeurEstimee(formData);
  if (valeurEstimee !== null && typeof valeurEstimee === "object") {
    return { success: false, error: valeurEstimee.error };
  }

  const bien = await prisma.bien.findUnique({ where: { id } });
  if (!bien) return { success: false, error: "Bien introuvable." };

  await prisma.bien.update({
    where: { id },
    data: {
      nom,
      typeBien,
      adresseComplete,
      taxeFonciere,
      assurance,
      montantEmprunt,
      mensualiteEmprunt,
      tauxEmprunt,
      dateDebutEmprunt: new Date(dateDebutEmprunt),
      dureeEmprunt,
      valeurEstimee,
    },
  });

  revalidatePath(`/biens/${id}`);
  revalidatePath("/biens");
  redirect(`/biens/${id}`);
}

export async function supprimerBox(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const boxId = Number(formData.get("boxId"));
  if (!Number.isInteger(boxId) || boxId <= 0) {
    return { success: false, error: "Box invalide." };
  }

  const box = await prisma.box.findUnique({ where: { id: boxId } });
  if (!box) return { success: false, error: "Box introuvable." };

  if (box.statut !== "vacant") {
    return { success: false, error: "Ce box est actuellement loué, suppression impossible." };
  }

  const nombreLocations = await prisma.location.count({ where: { boxId } });
  if (nombreLocations > 0) {
    return {
      success: false,
      error: "Ce box a un historique de location et ne peut pas être supprimé (préserve l'historique financier).",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.box.delete({ where: { id: boxId } });
    await tx.bien.update({ where: { id: box.bienId }, data: { nombreBoxes: { decrement: 1 } } });
  });

  revalidatePath(`/biens/${box.bienId}`);
  revalidatePath("/biens");

  return { success: true };
}

export async function supprimerBien(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!Number.isInteger(id) || id <= 0) return { success: false, error: "Bien invalide." };
  if (confirmation.trim() !== "SUPPRIMER") {
    return { success: false, error: 'Veuillez saisir exactement "SUPPRIMER" pour confirmer.' };
  }

  const bien = await prisma.bien.findUnique({
    where: { id },
    include: {
      boxes: {
        include: { locations: { where: { statut: "actif" }, select: { locataireId: true } } },
      },
    },
  });
  if (!bien) return { success: false, error: "Bien introuvable." };

  const locataireIdsActifs = bien.boxes.flatMap((b) => b.locations.map((l) => l.locataireId));

  await prisma.$transaction(async (tx) => {
    if (locataireIdsActifs.length > 0) {
      await tx.locataire.updateMany({
        where: { id: { in: locataireIdsActifs } },
        data: { statut: "archivé", dateArchivage: new Date() },
      });
    }
    // Cascade en base (boxes, locations, paiements, relances, documents liés
    // au bien) — cf. journal de décisions Phase 5 (onDelete: Cascade).
    await tx.bien.delete({ where: { id } });
  });

  revalidatePath("/biens");
  revalidatePath("/locataires");
  redirect("/biens");
}
