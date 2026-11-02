import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { verifierRateLimit, enregistrerTentative, TropDeTentatives } from "@/lib/login-rate-limit";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email;
          const password = credentials?.password;

          if (typeof email !== "string" || typeof password !== "string") return null;

          const emailNormalise = email.toLowerCase().trim();
          await verifierRateLimit(emailNormalise);

          const admin = await prisma.admin.findUnique({ where: { email: emailNormalise } });
          if (!admin) {
            await enregistrerTentative(emailNormalise, false);
            return null;
          }

          const isValid = await verifyPassword(password, admin.passwordHash);
          if (!isValid) {
            await enregistrerTentative(emailNormalise, false);
            return null;
          }

          await enregistrerTentative(emailNormalise, true);
          return { id: String(admin.id), email: admin.email };
        } catch (error) {
          if (error instanceof TropDeTentatives) throw error;
          console.error("[auth] Erreur inattendue dans authorize :", error);
          throw error;
        }
      },
    }),
  ],
});
