import "dotenv/config";
import { defineConfig } from "prisma/config";

// Le CLI Prisma (migrate, db pull, ...) a besoin d'une connexion directe,
// non poolée : DIRECT_URL (pooler Supabase en session mode, port 5432).
// L'application, elle, se connecte via DATABASE_URL (pooler en transaction
// mode, port 6543) — voir src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
