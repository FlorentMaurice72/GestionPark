import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Singleton pour éviter d'épuiser le pool de connexions au hot-reload en dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase exige SSL en production ; rejectUnauthorized: false évite
  // les erreurs de certificat intermédiaire sans compromettre le chiffrement.
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
