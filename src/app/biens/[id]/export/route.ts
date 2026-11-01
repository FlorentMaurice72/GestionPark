import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Export comptable basique avant suppression d'un bien : une ligne par
// paiement historique, tous boxes/locations confondus. Volontairement simple
// (CSV brut) — pas de mise en forme Excel avancée demandée pour cette session.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return new Response("Non authentifié", { status: 401 });
  }

  const { id } = await params;
  const bienId = Number(id);
  if (!Number.isInteger(bienId) || bienId <= 0) {
    return new Response("Bien invalide", { status: 400 });
  }

  const bien = await prisma.bien.findUnique({
    where: { id: bienId },
    include: {
      boxes: {
        include: {
          locations: {
            include: { locataire: true, paiements: true },
          },
        },
      },
    },
  });

  if (!bien) {
    return new Response("Bien introuvable", { status: 404 });
  }

  const lignes = ["box;locataire;mois;annee;montant;date_paiement;mode;source"];
  for (const box of bien.boxes) {
    for (const location of box.locations) {
      for (const paiement of location.paiements) {
        const champs = [
          box.numero,
          `${location.locataire.nom} ${location.locataire.prenom}`,
          String(paiement.mois),
          String(paiement.annee),
          paiement.montant.toString(),
          paiement.datePaiement.toISOString().slice(0, 10),
          paiement.mode,
          paiement.source,
        ];
        lignes.push(champs.map((v) => `"${v.replace(/"/g, '""')}"`).join(";"));
      }
    }
  }

  const nomFichier = `export-${bien.nom.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`;

  return new Response(lignes.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nomFichier}"`,
    },
  });
}
