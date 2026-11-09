"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export type DemoLoginResult = { success: true } | { success: false; error: string };

export async function connexionDemo(): Promise<DemoLoginResult> {
  try {
    await signIn("credentials", {
      email: "demo@gestionpark.fr",
      password: process.env.DEMO_PASSWORD ?? "Demo2026!",
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { success: false, error: "demo_not_configured" };
    }
    return { success: false, error: "unknown" };
  }
}
