import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

// Point d'entrée unique pour créer un admin : toujours via cette fonction
// (jamais d'INSERT direct en base), qu'elle soit appelée depuis une future
// page d'interface ou depuis le script CLI de bootstrap (scripts/create-admin.ts).
export async function createAdmin(email: string, password: string) {
  const passwordHash = await hashPassword(password);

  return prisma.admin.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
    },
  });
}
