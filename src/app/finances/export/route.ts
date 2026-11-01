import { auth } from "@/lib/auth";
import { getFinancesPageData } from "@/lib/finances/data";
import { NOMS_MOIS } from "@/lib/dates";

// Export comptable mensuel, basique (CSV) — reprend les indicateurs de
// l'onglet Analyse financière. Pas de PDF/Excel cette session (aucune
// librairie de génération installée, cohérent avec le choix déjà fait pour
// l'export pré-suppression d'un bien, Phase 5).
export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Non authentifié", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const today = new Date();
  const mois = Number(searchParams.get("mois")) || today.getUTCMonth() + 1;
  const annee = Number(searchParams.get("annee")) || today.getUTCFullYear();
  const bienBrut = searchParams.get("bien");
  const bienId = bienBrut ? Number(bienBrut) : null;

  const data = await getFinancesPageData({ mois, annee, bienId });

  const lignes = [
    "indicateur;valeur",
    `periode;${NOMS_MOIS[mois - 1]} ${annee}`,
    `loyers_percus;${data.indicateursMois.revenus.toFixed(2)}`,
    `mensualites_emprunt;${data.indicateursMois.mensualites.toFixed(2)}`,
    `charges;${data.indicateursMois.charges.toFixed(2)}`,
    `solde_net;${data.indicateursMois.resultatNet.toFixed(2)}`,
  ];

  const nomFichier = `export-comptable-${annee}-${String(mois).padStart(2, "0")}.csv`;

  return new Response(lignes.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nomFichier}"`,
    },
  });
}
