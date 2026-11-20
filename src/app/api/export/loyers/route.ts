import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MODE_LABELS: Record<string, string> = {
  virement: "Virement bancaire",
  especes: "Espèces",
  cheque: "Chèque",
  prelevement: "Prélèvement",
  autre: "Autre",
};

function csvCell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const url = new URL(req.url);
  const anneeParam = url.searchParams.get("annee");
  const bienIdParam = url.searchParams.get("bienId");
  const annee = anneeParam ? parseInt(anneeParam) : new Date().getFullYear();
  const bienIdFilter = bienIdParam ? parseInt(bienIdParam) : null;

  if (isNaN(annee) || annee < 2000 || annee > 2100) {
    return NextResponse.json({ error: "Année invalide" }, { status: 400 });
  }

  const yearStart = new Date(annee, 0, 1);
  const yearEnd = new Date(annee, 11, 31, 23, 59, 59);
  const now = new Date();
  const currentMonth = now.getFullYear() === annee ? now.getMonth() + 1 : 12;

  const locations = await prisma.location.findMany({
    where: {
      box: {
        bien: { utilisateurId: userId },
        ...(bienIdFilter ? { bienId: bienIdFilter } : {}),
      },
      dateEntree: { lte: yearEnd },
      OR: [
        { dateFin: null },
        { dateFin: { gte: yearStart } },
      ],
    },
    include: {
      locataire: { select: { nom: true, prenom: true, email: true } },
      box: { include: { bien: { select: { nom: true } } } },
      paiements: {
        where: { annee },
        select: { mois: true, montant: true, datePaiement: true, mode: true },
      },
    },
    orderBy: [
      { box: { bien: { nom: "asc" } } },
      { box: { numero: "asc" } },
    ],
  });

  const headerCols = [
    "Bien",
    "Box",
    "Locataire",
    "Email",
    "Mois",
    "Année",
    "Loyer mensuel (€)",
    "Montant reçu (€)",
    "Solde (€)",
    "Statut",
    "Date de paiement",
    "Mode de paiement",
  ];

  const rows: string[] = [];
  let sumDu = 0;
  let sumRecu = 0;

  for (const loc of locations) {
    const dateEntree = new Date(loc.dateEntree);
    const dateFin = loc.dateFin ? new Date(loc.dateFin) : null;

    const firstMonth =
      dateEntree.getFullYear() === annee ? dateEntree.getMonth() + 1 : 1;
    const rawLastMonth = dateFin
      ? dateFin.getFullYear() === annee
        ? dateFin.getMonth() + 1
        : currentMonth
      : currentMonth;
    const lastMonth = Math.min(rawLastMonth, currentMonth);

    const paiementByMois = new Map(loc.paiements.map((p) => [p.mois, p]));
    const loyerActuel = loc.loyerActuel.toNumber();
    const locataireLabel = `${loc.locataire.prenom} ${loc.locataire.nom}`;

    for (let mois = firstMonth; mois <= lastMonth; mois++) {
      const paiement = paiementByMois.get(mois);
      const montantRecu = paiement ? paiement.montant.toNumber() : 0;
      const solde = loyerActuel - montantRecu;

      let statut: string;
      if (montantRecu >= loyerActuel) {
        statut = "Payé";
      } else if (montantRecu > 0) {
        statut = "Partiel";
      } else {
        statut = "Impayé";
      }

      const moisLabel = new Date(annee, mois - 1).toLocaleString("fr-FR", {
        month: "long",
      });
      const moisCapitalized =
        moisLabel.charAt(0).toUpperCase() + moisLabel.slice(1);

      const datePaiementStr = paiement
        ? new Date(paiement.datePaiement).toLocaleDateString("fr-FR")
        : "";

      const modeLabel = paiement
        ? (MODE_LABELS[paiement.mode] ?? paiement.mode)
        : "";

      sumDu += loyerActuel;
      sumRecu += montantRecu;

      rows.push(
        [
          loc.box.bien.nom,
          loc.box.numero,
          locataireLabel,
          loc.locataire.email,
          moisCapitalized,
          String(annee),
          loyerActuel.toFixed(2).replace(".", ","),
          montantRecu.toFixed(2).replace(".", ","),
          solde.toFixed(2).replace(".", ","),
          statut,
          datePaiementStr,
          modeLabel,
        ]
          .map(csvCell)
          .join(";")
      );
    }
  }

  // Totals row
  rows.push("");
  rows.push(
    [
      "TOTAL",
      "",
      "",
      "",
      "",
      String(annee),
      sumDu.toFixed(2).replace(".", ","),
      sumRecu.toFixed(2).replace(".", ","),
      (sumDu - sumRecu).toFixed(2).replace(".", ","),
      "",
      "",
      "",
    ]
      .map(csvCell)
      .join(";")
  );

  const header = headerCols.map(csvCell).join(";");
  const csv = "﻿" + header + "\r\n" + rows.join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bilan_loyers_${annee}.csv"`,
    },
  });
}
