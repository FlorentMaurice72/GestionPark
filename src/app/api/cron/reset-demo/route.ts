import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_EMAIL = "demo@gestionpark.fr";

const NOMS     = ["Martin","Dupont","Bernard","Thomas","Petit","Robert","Simon","Laurent"];
const PRENOMS  = ["Paul","Marie","Luc","Emma","Julien","Sophie","Pierre","Clara"];
const EMAILS   = [
  "paul.martin@example.com","marie.dupont@example.com","luc.bernard@example.com",
  "emma.thomas@example.com","julien.petit@example.com","sophie.robert@example.com",
  "pierre.simon@example.com","clara.laurent@example.com",
];
const ADRESSES = [
  "12 rue de la Paix","5 avenue Foch","8 rue du Général","3 place Bellecour",
  "22 rue Molière","14 cours Gambetta","7 impasse des Lilas","18 rue Victor Hugo",
];
const LOYERS = [120, 135, 150, 165, 140, 155, 130, 145];

function moisPrecedent(mois: number, annee: number, n: number): { mois: number; annee: number } {
  let m = mois - n;
  let a = annee;
  while (m <= 0) { m += 12; a--; }
  return { mois: m, annee: a };
}

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = await prisma.admin.findUnique({ where: { email: DEMO_EMAIL }, select: { id: true } });
  if (!admin) return Response.json({ ok: false, error: "demo account not found" });

  const userId = admin.id;

  // Purge dans l'ordre des dépendances
  await prisma.paiement.deleteMany({ where: { location: { box: { bien: { utilisateurId: userId } } } } });
  await prisma.location.deleteMany({ where: { box: { bien: { utilisateurId: userId } } } });
  await prisma.box.deleteMany({ where: { bien: { utilisateurId: userId } } });
  await prisma.locataire.deleteMany({ where: { utilisateurId: userId } });
  await prisma.bien.deleteMany({ where: { utilisateurId: userId } });

  // Re-seed
  const maintenant = new Date();
  const moisActuel = maintenant.getMonth() + 1;
  const anneeActuelle = maintenant.getFullYear();

  const bien = await prisma.bien.create({
    data: {
      nom: "Entrepôt Lyon Nord",
      typeBien: "entrepot",
      adresseComplete: "45 rue Garibaldi, 69003 Lyon",
      nombreBoxes: 10,
      taxeFonciere: 1200,
      assurance: 350,
      montantEmprunt: 150000,
      mensualiteEmprunt: 650,
      tauxEmprunt: 2.1,
      dateDebutEmprunt: new Date("2020-01-01"),
      dureeEmprunt: 240,
      valeurEstimee: 280000,
      statut: "actif",
      utilisateurId: userId,
    },
  });

  const boxIds: number[] = [];
  for (let i = 1; i <= 8; i++) {
    const box = await prisma.box.create({
      data: {
        numero: `B${String(i).padStart(2, "0")}`,
        superficie: 8 + i * 1.5,
        statut: "loué",
        bienId: bien.id,
      },
    });
    boxIds.push(box.id);
  }
  await prisma.box.create({ data: { numero: "B09", superficie: 12, statut: "disponible", bienId: bien.id } });
  await prisma.box.create({ data: { numero: "B10", superficie: 18, statut: "disponible", bienId: bien.id } });

  const locataireIds: number[] = [];
  for (let i = 0; i < 8; i++) {
    const loc = await prisma.locataire.create({
      data: {
        nom: NOMS[i],
        prenom: PRENOMS[i],
        email: EMAILS[i],
        telephone: `060${i + 1}345678`,
        adresse: ADRESSES[i],
        ville: "Lyon",
        codePostal: `6900${i + 1}`,
        statut: "actif",
        utilisateurId: userId,
      },
    });
    locataireIds.push(loc.id);
  }

  for (let i = 0; i < 8; i++) {
    const loyer = LOYERS[i];
    const dateEntree = new Date(maintenant);
    dateEntree.setFullYear(dateEntree.getFullYear() - 1);
    dateEntree.setMonth(dateEntree.getMonth() - i);

    const location = await prisma.location.create({
      data: {
        boxId: boxIds[i],
        locataireId: locataireIds[i],
        dateEntree,
        loyerActuel: loyer,
        depotGarantie: loyer,
        statut: "actif",
        dateRevisionIRL: new Date(new Date().setDate(new Date().getDate() + 45 + i * 7)),
      },
    });

    // Tous les mois depuis la date d'entrée jusqu'au mois en cours inclus.
    // i=6 : impayé les 2 derniers mois   i=7 : impayé le mois en cours seulement.
    let m = dateEntree.getUTCMonth() + 1;
    let a = dateEntree.getUTCFullYear();
    while (a < anneeActuelle || (a === anneeActuelle && m <= moisActuel)) {
      const isCurrent = m === moisActuel && a === anneeActuelle;
      const isPrevious = m === moisActuel - 1 && a === anneeActuelle || (moisActuel === 1 && m === 12 && a === anneeActuelle - 1);
      const skip = (i === 6 && (isCurrent || isPrevious)) || (i === 7 && isCurrent);
      if (!skip) {
        const monthsBack = (anneeActuelle - a) * 12 + (moisActuel - m);
        const datePaie = new Date(maintenant);
        datePaie.setMonth(datePaie.getMonth() - monthsBack);
        await prisma.paiement.create({
          data: {
            locationId: location.id,
            mois: m,
            annee: a,
            montant: loyer,
            datePaiement: datePaie,
            mode: "virement",
            source: "import_csv",
          },
        });
      }
      m++;
      if (m > 12) { m = 1; a++; }
    }
  }

  return Response.json({ ok: true, reset: true });
}
