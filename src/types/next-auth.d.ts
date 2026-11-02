import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    subscriptionStatus?: string;
    trialEndsAt?: string | null;
  }
  interface Session {
    user: {
      id: string;
      subscriptionStatus?: string;
      trialEndsAt?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    subscriptionStatus?: string;
    trialEndsAt?: string | null;
  }
}
