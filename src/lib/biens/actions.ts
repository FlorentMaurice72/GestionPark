"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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
  const montantEmpruntRaw = String(formData.get("montantEmprunt") ?? "").trim();
  const mensualiteEmpruntRaw = String(formData.get("mensualiteEmprunt") ?? "").trim();
  const tauxEmpruntRaw = String(formData.get("tauxEmprunt") ?? "").trim();
  const dateDebutEmpruntRaw = String(formData.get("dateDebutEmprunt") ?? "").trim();
  const dureeEmpruntRaw = String(formData.get("dureeEmprunt") ?? "").trim();

  const dureeEmpruntUnite = String(formData.get("dureeEmpruntUnite") ?? "mois");
  const montantEmprunt = montantEmpruntRaw ? Number(montantEmpruntRaw) : null;
  const mensualiteEmprunt = mensualiteEmpruntRaw ? Number(mensualiteEmpruntRaw) : null;
  const tauxEmprunt = tauxEmpruntRaw ? Number(tauxEmpruntRaw) : null;
  const dateDebutEmprunt = dateDebutEmpruntRaw || null;
  const dureeEmprunt = dureeEmpruntRaw
    ? Math.round(Number(dureeEmpruntRaw) * (dureeEmpruntUnite === "annees" ? 12 : 1))
    : null;

  if (!nom) return { success: false, error: "Nom du bien requis." };
  if (!typeBien) return { success: false, error: "Type de bien requis." };
  if (!adresseComplete) return { success: false, error: "Adresse requise." };
  if (![taxeFonciere, assurance].every(Number.isFinite)) {
    return { success: false, error: "Champs financiers invalides." };
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

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const admin = await prisma.admin.findUnique({ where: { id: userId }, select: { subscriptionPlan: true } });
  if (admin?.subscriptionPlan === "essentiel") {
    const totalBoxes = await prisma.box.count({ where: { bien: { utilisateurId: userId } } });
    const newBoxCount = parametresBoxes.numeros.length;
    if (totalBoxes + newBoxCount > 30) {
      return { success: false, error: `Plan Essentiel limité à 30 boxes (vous en avez ${totalBoxes}, vous essayez d'en ajouter ${newBoxCount}). Passez au plan Pro pour des boxes illimitées.` };
    }
  }

  const bien = await prisma.$transaction(async (tx) => {
    const nouveauBien = await tx.bien.create({
      data: {
        nom,
        typeBien,
        adresseComplete,
        nombreBoxes: parametresBoxes.numeros.length,
        taxeFonciere,
        assurance,
        montantEmprunt: montantEmprunt ?? null,
        mensualiteEmprunt: mensualiteEmprunt ?? null,
        tauxEmprunt: tauxEmprunt ?? null,
        dateDebutEmprunt: dateDebutEmprunt ? new Date(dateDebutEmprunt) : null,
        dureeEmprunt: dureeEmprunt ?? null,
        valeurEstimee,
        utilisateurId: userId,
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

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const adminPlan = await prisma.admin.findUnique({ where: { id: userId }, select: { subscriptionPlan: true } });
  if (adminPlan?.subscriptionPlan === "essentiel") {
    const totalBoxes = await prisma.box.count({ where: { bien: { utilisateurId: userId } } });
    const newBoxCount = parametresBoxes.numeros.length;
    if (totalBoxes + newBoxCount > 30) {
      return { success: false, error: `Plan Essentiel limité à 30 boxes (vous en avez ${totalBoxes}, vous essayez d'en ajouter ${newBoxCount}). Passez au plan Pro pour des boxes illimitées.` };
    }
  }

  const bien = await prisma.bien.findUnique({ where: { id: bienId, utilisateurId: userId } });
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
  const montantEmpruntRaw2 = String(formData.get("montantEmprunt") ?? "").trim();
  const mensualiteEmpruntRaw2 = String(formData.get("mensualiteEmprunt") ?? "").trim();
  const tauxEmpruntRaw2 = String(formData.get("tauxEmprunt") ?? "").trim();
  const dateDebutEmpruntRaw2 = String(formData.get("dateDebutEmprunt") ?? "").trim();
  const dureeEmpruntRaw2 = String(formData.get("dureeEmprunt") ?? "").trim();

  const dureeEmpruntUnite2 = String(formData.get("dureeEmpruntUnite") ?? "mois");
  const montantEmprunt = montantEmpruntRaw2 ? Number(montantEmpruntRaw2) : null;
  const mensualiteEmprunt = mensualiteEmpruntRaw2 ? Number(mensualiteEmpruntRaw2) : null;
  const tauxEmprunt = tauxEmpruntRaw2 ? Number(tauxEmpruntRaw2) : null;
  const dateDebutEmprunt = dateDebutEmpruntRaw2 || null;
  const dureeEmprunt = dureeEmpruntRaw2
    ? Math.round(Number(dureeEmpruntRaw2) * (dureeEmpruntUnite2 === "annees" ? 12 : 1))
    : null;

  if (!Number.isInteger(id) || id <= 0) return { success: false, error: "Bien invalide." };
  if (!nom) return { success: false, error: "Nom du bien requis." };
  if (!typeBien) return { success: false, error: "Type de bien requis." };
  if (!adresseComplete) return { success: false, error: "Adresse requise." };
  if (![taxeFonciere, assurance].every(Number.isFinite)) {
    return { success: false, error: "Champs financiers invalides." };
  }

  const valeurEstimee = extraireValeurEstimee(formData);
  if (valeurEstimee !== null && typeof valeurEstimee === "object") {
    return { success: false, error: valeurEstimee.error };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const bien = await prisma.bien.findUnique({ where: { id, utilisateurId: userId } });
  if (!bien) return { success: false, error: "Bien introuvable." };

  await prisma.bien.update({
    where: { id },
    data: {
      nom,
      typeBien,
      adresseComplete,
      taxeFonciere,
      assurance,
      montantEmprunt: montantEmprunt ?? null,
      mensualiteEmprunt: mensualiteEmprunt ?? null,
      tauxEmprunt: tauxEmprunt ?? null,
      dateDebutEmprunt: dateDebutEmprunt ? new Date(dateDebutEmprunt) : null,
      dureeEmprunt: dureeEmprunt ?? null,
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

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const box = await prisma.box.findUnique({ where: { id: boxId }, include: { bien: { select: { utilisateurId: true } } } });
  if (!box || box.bien.utilisateurId !== userId) return { success: false, error: "Box introuvable." };

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

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const bien = await prisma.bien.findUnique({
    where: { id, utilisateurId: userId },
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
