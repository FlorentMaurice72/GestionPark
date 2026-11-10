import { prisma } from "@/lib/prisma";

export interface AlerteItem {
  id: string;
  titre: string;
  description: string;
  dateEcheance: Date;
  statut: "due" | "a_venir" | "traitee";
  type: "rappel" | "impaye" | "fin_bail";
  lien?: string;
  rappelId?: number;
}

export async function getAlertesData(userId: number): Promise<{
  dues: AlerteItem[];
  aVenir: AlerteItem[];
  traitees: AlerteItem[];
}> {
  const aujourd = new Date();
  aujourd.setHours(0, 0, 0, 0);
  const mois = aujourd.getMonth() + 1;
  const annee = aujourd.getFullYear();

  const [rappels, locations, paiementsCeMois] = await Promise.all([
    prisma.rappel.findMany({
      where: { adminId: userId },
      orderBy: { dateRappel: "asc" },
    }),
    prisma.location.findMany({
      where: { statut: "actif", box: { bien: { utilisateurId: userId } } },
      include: {
        locataire: { select: { id: true, nom: true, prenom: true } },
        box: { select: { numero: true, bien: { select: { nom: true } } } },
      },
    }),
    prisma.paiement.findMany({
      where: { mois, annee, location: { box: { bien: { utilisateurId: userId } } } },
      select: { locationId: true },
    }),
  ]);

  const payes = new Set(paiementsCeMois.map((p) => p.locationId));
  const items: AlerteItem[] = [];

  for (const r of rappels) {
    const d = new Date(r.dateRappel);
    d.setHours(0, 0, 0, 0);
    items.push({
      id: `rappel-${r.id}`,
      titre: r.titre,
      description: r.description ?? "",
      dateEcheance: d,
      statut: r.traitee ? "traitee" : d <= aujourd ? "due" : "a_venir",
      type: "rappel",
      rappelId: r.id,
    });
  }

  for (const loc of locations) {
    if (!payes.has(loc.id)) {
      const nom = `${loc.locataire.prenom} ${loc.locataire.nom}`;
      const d = new Date(annee, mois - 1, 5);
      items.push({
        id: `system-relance-${loc.id}`,
        titre: `Loyer impayé — ${nom}`,
        description: `${loc.box.bien.nom} · Box ${loc.box.numero} · ${loc.loyerActuel}€`,
        dateEcheance: d,
        statut: d <= aujourd ? "due" : "a_venir",
        type: "impaye",
        lien: "/loyers?statut=impaye",
      });
    }

    if (loc.dateFin) {
      const fin = new Date(loc.dateFin);
      const jours = Math.ceil((fin.getTime() - aujourd.getTime()) / 86400000);
      if (jours >= 0 && jours <= 90) {
        const nom = `${loc.locataire.prenom} ${loc.locataire.nom}`;
        items.push({
          id: `system-bail-${loc.id}`,
          titre: `Fin de bail — ${nom}`,
          description: `${loc.box.bien.nom} · Box ${loc.box.numero} · ${fin.toLocaleDateString("fr-FR")}`,
          dateEcheance: fin,
          statut: fin <= aujourd ? "due" : "a_venir",
          type: "fin_bail",
          lien: `/locataires/${loc.locataire.id}`,
        });
      }
    }

    if (loc.dateRevisionIRL) {
      const rev = new Date(loc.dateRevisionIRL);
      const joursAvant = Math.ceil((rev.getTime() - aujourd.getTime()) / 86400000);
      if (joursAvant >= -30 && joursAvant <= 60) {
        const nom = `${loc.locataire.prenom} ${loc.locataire.nom}`;
        items.push({
          id: `system-irl-${loc.id}`,
          titre: `Révision ${loc.indiceRevision ?? "ICC"} — ${nom}`,
          description: `${loc.box.bien.nom} · Box ${loc.box.numero} · révision le ${rev.toLocaleDateString("fr-FR")}`,
          dateEcheance: rev,
          statut: rev <= aujourd ? "due" : "a_venir",
          type: "fin_bail",
          lien: `/locataires/${loc.locataire.id}`,
        });
      }
    }
  }

  return {
    dues: items
      .filter((i) => i.statut === "due")
      .sort((a, b) => a.dateEcheance.getTime() - b.dateEcheance.getTime()),
    aVenir: items
      .filter((i) => i.statut === "a_venir")
      .sort((a, b) => a.dateEcheance.getTime() - b.dateEcheance.getTime()),
    traitees: items
      .filter((i) => i.statut === "traitee")
      .sort((a, b) => b.dateEcheance.getTime() - a.dateEcheance.getTime()),
  };
}

export async function getNombreAlertesUrgentes(userId: number): Promise<number> {
  const aujourd = new Date();
  aujourd.setHours(0, 0, 0, 0);
  const mois = aujourd.getMonth() + 1;
  const annee = aujourd.getFullYear();

  const [rappelsDues, impayes, bailsProches] = await Promise.all([
    prisma.rappel.count({
      where: { adminId: userId, traitee: false, dateRappel: { lte: aujourd } },
    }),
    prisma.location.count({
      where: {
        statut: "actif",
        box: { bien: { utilisateurId: userId } },
        paiements: { none: { mois, annee } },
      },
    }),
    prisma.location.count({
      where: {
        statut: "actif",
        box: { bien: { utilisateurId: userId } },
        dateFin: { lte: new Date(aujourd.getTime() + 30 * 86400000) },
      },
    }),
  ]);

  return rappelsDues + impayes + bailsProches;
}
