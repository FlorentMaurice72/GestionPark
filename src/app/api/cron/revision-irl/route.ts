import { prisma } from "@/lib/prisma";
import { envoyerEmailRevisionIRL } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const maintenant = new Date();
  const dans29Jours = new Date(maintenant.getTime() + 29 * 86400000);
  const dans31Jours = new Date(maintenant.getTime() + 31 * 86400000);

  const locations = await prisma.location.findMany({
    where: {
      statut: "actif",
      dateRevisionIRL: { gte: dans29Jours, lte: dans31Jours },
    },
    include: {
      locataire: { select: { nom: true, prenom: true, email: true } },
      box: {
        select: {
          numero: true,
          bien: { select: { nom: true, admin: { select: { nomBailleur: true } } } },
        },
      },
    },
  });

  let envoyes = 0;
  let erreurs = 0;

  for (const loc of locations) {
    if (!loc.locataire.email) continue;
    try {
      await envoyerEmailRevisionIRL(loc.locataire.email, {
        locataireNom: loc.locataire.nom,
        locatairePrenom: loc.locataire.prenom,
        bienNom: loc.box.bien.nom,
        boxNumero: loc.box.numero,
        dateRevision: loc.dateRevisionIRL!,
        loyerActuel: loc.loyerActuel.toNumber(),
        bailleurNom: loc.box.bien.admin.nomBailleur ?? null,
      });
      envoyes++;
    } catch {
      erreurs++;
    }
  }

  return Response.json({ ok: true, envoyes, erreurs });
}
