import { CredentialsSignin } from "next-auth";
import { prisma } from "@/lib/prisma";

// Rate limiting sur /login basé sur la DB Postgres existante (pas de nouveau
// service type Redis, cohérent avec la philosophie du projet). La table est
// purgée au fil de l'eau (pas de CRON) à chaque tentative enregistrée.
const FENETRE_MS = 15 * 60 * 1000;
const SEUIL_ECHECS = 5;
const RETENTION_MS = 24 * 60 * 60 * 1000;

export class TropDeTentatives extends CredentialsSignin {
  code = "trop-de-tentatives";
}

const DEMO_EMAIL = "demo@gestionpark.fr";

export async function verifierRateLimit(email: string): Promise<void> {
  if (email === DEMO_EMAIL) return;
  const depuis = new Date(Date.now() - FENETRE_MS);
  const echecsRecents = await prisma.tentativeConnexion.count({
    where: { email, reussie: false, createdAt: { gte: depuis } },
  });

  if (echecsRecents >= SEUIL_ECHECS) {
    throw new TropDeTentatives();
  }
}

export async function enregistrerTentative(email: string, reussie: boolean): Promise<void> {
  await prisma.tentativeConnexion.create({ data: { email, reussie } });
  await prisma.tentativeConnexion.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } },
  });
}
