import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { verifierRateLimit, enregistrerTentative, TropDeTentatives } from "@/lib/login-rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        // NextAuth avale toute erreur inattendue levée ici et la remplace par
        // un AuthError générique (cf. @auth/core/lib/actions/callback/index.js),
        // ce qui la rend indiscernable d'un simple mauvais mot de passe côté
        // /login. On logge explicitement avant de relancer, pour que la vraie
        // cause apparaisse dans les logs Vercel (Function Logs) même sans
        // activer le mode debug de NextAuth.
        try {
          const email = credentials?.email;
          const password = credentials?.password;

          if (typeof email !== "string" || typeof password !== "string") {
            return null;
          }

          const emailNormalise = email.toLowerCase().trim();

          await verifierRateLimit(emailNormalise);

          const admin = await prisma.admin.findUnique({
            where: { email: emailNormalise },
          });

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
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
