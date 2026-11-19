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
    const digest = (error as { digest?: string }).digest;

    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
      // Format Next.js : "NEXT_REDIRECT;replace;/url;303;"
      // Extraire la destination pour distinguer succès ("/") et erreur ("/api/auth/error?...")
      const parts = digest.split(";");
      const destination = parts.slice(2, -2).join(";");
      if (!destination.includes("/error")) {
        throw error; // redirect vers "/" → succès, laisser Next.js gérer
      }
      // redirect vers /api/auth/error → credentials refusés
      return { success: false, error: "demo_not_configured" };
    }

    if (error instanceof AuthError) {
      return { success: false, error: "demo_not_configured" };
    }
    return { success: false, error: "unknown" };
  }
}
