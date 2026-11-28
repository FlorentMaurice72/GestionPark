import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locationId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { locationId: locationIdStr } = await params;
  const locationId = parseInt(locationIdStr);
  if (!locationId || isNaN(locationId)) {
    return NextResponse.json({ error: "Paramètre invalide" }, { status: 400 });
  }

  const userId = parseInt(session.user.id);

  const [location, admin] = await Promise.all([
    prisma.location.findFirst({
      where: { id: locationId, box: { bien: { utilisateurId: userId } } },
      include: {
        locataire: true,
        box: { include: { bien: { select: { nom: true, adresseComplete: true } } } },
      },
    }),
    prisma.admin.findUnique({
      where: { id: userId },
      select: { email: true, nomBailleur: true, adresseBailleur: true },
    }),
  ]);

  if (!location) {
    return NextResponse.json({ error: "Location introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    bailleurNom: admin?.nomBailleur ?? admin?.email ?? "",
    bailleurAdresse: admin?.adresseBailleur ?? null,
    bailleurEmail: admin?.email ?? "",
    locataireNom: location.locataire.nom,
    locatairePrenom: location.locataire.prenom,
    locataireSociete: location.locataire.societe,
    locataireAdresse: location.locataire.adresse,
    locataireVille: location.locataire.ville,
    locataireCodePostal: location.locataire.codePostal,
    bienNom: location.box.bien.nom,
    bienAdresse: location.box.bien.adresseComplete,
    boxNumero: location.box.numero,
    boxSuperficie: location.box.superficie.toNumber(),
    typeBail: location.typeBail,
    dateEntree: location.dateEntree,
    loyerActuel: location.loyerActuel.toNumber(),
    termeLoyerType: location.termeLoyerType,
    moyenPaiement: location.moyenPaiement,
    depotGarantie: location.depotGarantie.toNumber(),
    renouvellementAuto: location.renouvellementAuto,
    indiceRevision: location.indiceRevision,
    dateRevisionIRL: location.dateRevisionIRL,
  });
}
