"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export interface ActionState {
  success: boolean;
  error?: string;
}

// Convention "-" pour un champ optionnel laissé vide, cohérente avec le
// reste de l'app (cf. GestionPark_Schema_Reel.md, Locataire).
function valeurOuTiret(formData: FormData, champ: string): string {
  const valeur = String(formData.get(champ) ?? "").trim();
  return valeur || "-";
}

export async function creerLocataire(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const boxId = Number(formData.get("boxId"));
  const nom = String(formData.get("nom") ?? "").trim();
  const prenom = String(formData.get("prenom") ?? "").trim();
  const societe = String(formData.get("societe") ?? "").trim() || null;
  const association = String(formData.get("association") ?? "").trim() || null;
  const dateEntree = formData.get("dateEntree");
  const loyerActuel = Number(formData.get("loyerActuel"));
  const depotGarantie = Number(formData.get("depotGarantie"));

  if (!Number.isInteger(boxId) || boxId <= 0) return { success: false, error: "Box invalide." };
  if (!nom) return { success: false, error: "Nom requis." };
  if (!prenom) return { success: false, error: "Prénom requis." };
  if (typeof dateEntree !== "string" || !dateEntree) return { success: false, error: "Date d'entrée invalide." };
  if (!Number.isFinite(loyerActuel) || loyerActuel <= 0) return { success: false, error: "Loyer invalide." };
  if (!Number.isFinite(depotGarantie) || depotGarantie < 0) {
    return { success: false, error: "Dépôt de garantie invalide." };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const box = await prisma.box.findUnique({ where: { id: boxId }, include: { bien: { select: { utilisateurId: true } } } });
  if (!box || box.bien.utilisateurId !== userId) return { success: false, error: "Box introuvable." };
  if (box.statut !== "vacant") return { success: false, error: "Ce box n'est plus vacant." };

  const locataire = await prisma.$transaction(async (tx) => {
    const nouveauLocataire = await tx.locataire.create({
      data: {
        nom,
        prenom,
        societe,
        association,
        email: valeurOuTiret(formData, "email"),
        telephone: valeurOuTiret(formData, "telephone"),
        adresse: valeurOuTiret(formData, "adresse"),
        ville: valeurOuTiret(formData, "ville"),
        codePostal: valeurOuTiret(formData, "codePostal"),
        utilisateurId: userId,
      },
    });

    const bool = (key: string, def: boolean) => {
      const v = formData.get(key);
      if (v === null) return def;
      return v === "true" || v === "1";
    };

    await tx.location.create({
      data: {
        boxId,
        locataireId: nouveauLocataire.id,
        dateEntree: new Date(dateEntree),
        loyerActuel,
        depotGarantie,
        renouvellementAuto: bool("renouvellementAuto", true),
        typeBail: String(formData.get("typeBail") ?? "bail_box") || "bail_box",
        termeLoyerType: String(formData.get("termeLoyerType") ?? "a_echoir") || "a_echoir",
        moyenPaiement: String(formData.get("moyenPaiement") ?? "virement") || "virement",
        relanceActive: bool("relanceActive", true),
        avisLoyerAuto: bool("avisLoyerAuto", true),
        quittanceAuto: bool("quittanceAuto", true),
      },
    });

    await tx.box.update({ where: { id: boxId }, data: { statut: "loué" } });

    return nouveauLocataire;
  });

  revalidatePath("/locataires");
  revalidatePath("/loyers");
  revalidatePath("/biens");
  redirect(`/locataires/${locataire.id}`);
}

export async function modifierLocataire(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const nom = String(formData.get("nom") ?? "").trim();
  const prenom = String(formData.get("prenom") ?? "").trim();
  const societe = String(formData.get("societe") ?? "").trim() || null;
  const association = String(formData.get("association") ?? "").trim() || null;

  if (!Number.isInteger(id) || id <= 0) return { success: false, error: "Locataire invalide." };
  if (!nom) return { success: false, error: "Nom requis." };
  if (!prenom) return { success: false, error: "Prénom requis." };

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const locataire = await prisma.locataire.findUnique({ where: { id, utilisateurId: userId } });
  if (!locataire) return { success: false, error: "Locataire introuvable." };

  await prisma.locataire.update({
    where: { id },
    data: {
      nom,
      prenom,
      societe,
      association,
      email: valeurOuTiret(formData, "email"),
      telephone: valeurOuTiret(formData, "telephone"),
      adresse: valeurOuTiret(formData, "adresse"),
      ville: valeurOuTiret(formData, "ville"),
      codePostal: valeurOuTiret(formData, "codePostal"),
    },
  });

  revalidatePath(`/locataires/${id}`);
  revalidatePath("/locataires");
  redirect(`/locataires/${id}`);
}

export async function archiverLocataire(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { success: false, error: "Locataire invalide." };

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const locataire = await prisma.locataire.findUnique({
    where: { id, utilisateurId: userId },
    include: { locations: { where: { statut: "actif" } } },
  });
  if (!locataire) return { success: false, error: "Locataire introuvable." };
  if (locataire.statut === "archivé") return { success: false, error: "Ce locataire est déjà archivé." };

  await prisma.$transaction(async (tx) => {
    await tx.locataire.update({
      where: { id },
      data: { statut: "archivé", dateArchivage: new Date() },
    });

    const locationActive = locataire.locations[0];
    if (locationActive) {
      await tx.location.update({
        where: { id: locationActive.id },
        data: { statut: "terminé", dateFin: new Date() },
      });
      await tx.box.update({ where: { id: locationActive.boxId }, data: { statut: "vacant" } });
    }
  });

  revalidatePath(`/locataires/${id}`);
  revalidatePath("/locataires");
  revalidatePath("/loyers");
  revalidatePath("/biens");

  return { success: true };
}

// RGPD (Phase 8) : anonymisation manuelle d'un locataire archivé, à la
// demande de l'admin. N'efface jamais la ligne (Location.locataire est en
// Restrict) : Location/Paiement restent intacts pour l'historique comptable.
export async function anonymiserLocataire(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!Number.isInteger(id) || id <= 0) return { success: false, error: "Locataire invalide." };
  if (confirmation.trim() !== "ANONYMISER") {
    return { success: false, error: 'Veuillez saisir exactement "ANONYMISER" pour confirmer.' };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };
  const userId = parseInt(session.user.id);

  const locataire = await prisma.locataire.findUnique({ where: { id, utilisateurId: userId } });
  if (!locataire) return { success: false, error: "Locataire introuvable." };
  if (locataire.statut !== "archivé") {
    return { success: false, error: "Seul un locataire archivé peut être anonymisé." };
  }
  if (locataire.anonymise) return { success: false, error: "Ce locataire est déjà anonymisé." };

  await prisma.locataire.update({
    where: { id },
    data: {
      nom: "Anonymisé",
      prenom: "-",
      societe: null,
      association: null,
      email: "-",
      telephone: "-",
      adresse: "-",
      ville: "-",
      codePostal: "-",
      anonymise: true,
      anonymiseLe: new Date(),
    },
  });

  revalidatePath(`/locataires/${id}`);
  revalidatePath("/locataires");

  return { success: true };
}
