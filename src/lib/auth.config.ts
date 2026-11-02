import type { NextAuthConfig } from "next-auth";

// Config edge-compatible (sans import Prisma ni Node.js modules).
// Utilisée exclusivement par le middleware ; auth.ts étend cette config
// avec le provider Credentials qui a besoin de Prisma.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscriptionStatus = user.subscriptionStatus;
        token.trialEndsAt = user.trialEndsAt;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string | undefined;
        session.user.trialEndsAt = token.trialEndsAt as string | null | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
