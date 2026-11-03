import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const url = new URL(req.url);
  const anneeParam = url.searchParams.get("annee");
  const annee = anneeParam ? parseInt(anneeParam) : new Date().getFullYear();

  if (isNaN(annee) || annee < 2000 || annee > 2100) {
    return NextResponse.json({ error: "Année invalide" }, { status: 400 });
  }

  const paiements = await prisma.paiement.findMany({
    where: {
      annee,
      location: { box: { bien: { utilisateurId: userId } } },
    },
    include: {
      location: {
        include: {
          locataire: { select: { nom: true, prenom: true, email: true } },
          box: { include: { bien: { select: { nom: true } } } },
        },
      },
    },
    orderBy: { datePaiement: "asc" },
  });

  const header = "Bien;Box;Locataire;Email;Mois;Année;Loyer mensuel (€);Montant reçu (€);Date de paiement;Mode de paiement\r\n";

  const rows = paiements.map((p) => {
    const loc = p.location;
    const moisLabel = new Date(annee, p.mois - 1).toLocaleString("fr-FR", { month: "long" });
    const moisCapitalized = moisLabel.charAt(0).toUpperCase() + moisLabel.slice(1);
    const datePaiement = new Date(p.datePaiement).toLocaleDateString("fr-FR");
    const loyerActuel = loc.loyerActuel.toNumber().toFixed(2).replace(".", ",");
    const montant = p.montant.toNumber().toFixed(2).replace(".", ",");
    const locataireNom = `${loc.locataire.prenom} ${loc.locataire.nom}`;

    return [
      loc.box.bien.nom,
      loc.box.numero,
      locataireNom,
      loc.locataire.email,
      moisCapitalized,
      String(annee),
      loyerActuel,
      montant,
      datePaiement,
      p.mode,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(";");
  });

  const csv = "﻿" + header + rows.join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="loyers_${annee}.csv"`,
    },
  });
}
