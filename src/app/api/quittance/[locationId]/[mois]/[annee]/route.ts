import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locationId: string; mois: string; annee: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { locationId: locationIdStr, mois: moisStr, annee: anneeStr } = await params;
  const locationId = parseInt(locationIdStr);
  const mois = parseInt(moisStr);
  const annee = parseInt(anneeStr);

  if (!locationId || !mois || !annee) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const userId = parseInt(session.user.id);

  const location = await prisma.location.findFirst({
    where: { id: locationId, box: { bien: { utilisateurId: userId } } },
    include: {
      locataire: true,
      box: { include: { bien: true } },
    },
  });

  if (!location) {
    return NextResponse.json({ error: "Location introuvable" }, { status: 404 });
  }

  const [admin, paiements] = await Promise.all([
    prisma.admin.findUnique({ where: { id: userId }, select: { email: true, nomBailleur: true, adresseBailleur: true } }),
    prisma.paiement.findMany({
      where: { locationId, mois, annee },
      orderBy: { datePaiement: "desc" },
    }),
  ]);

  const montantRecu = paiements.reduce((s, p) => s + p.montant.toNumber(), 0);
  const datePaiement = paiements[0]?.datePaiement
    ? new Date(paiements[0].datePaiement).toLocaleDateString("fr-FR")
    : "—";

  return NextResponse.json({
    locataireNom: location.locataire.nom,
    locatairePrenom: location.locataire.prenom,
    locataireAdresse: location.locataire.adresse,
    locataireVille: location.locataire.ville,
    locataireCodePostal: location.locataire.codePostal,
    bienNom: location.box.bien.nom,
    boxNumero: location.box.numero,
    mois,
    annee,
    loyerActuel: location.loyerActuel.toNumber(),
    depotGarantie: location.depotGarantie.toNumber(),
    montantRecu,
    dateEncaissement: datePaiement,
    bailleurEmail: admin?.email ?? "",
    bailleurNom: admin?.nomBailleur ?? null,
    bailleurAdresse: admin?.adresseBailleur ?? null,
  });
}
