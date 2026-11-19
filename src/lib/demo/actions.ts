"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export type DemoLoginResult = { success: true } | { success: false; error: string };

export async function connexionDemo(): Promise<DemoLoginResult> {
  try {
    // redirect: false pour intercepter le résultat avant de rediriger.
    // Avec redirect: true, NextAuth redirige aussi vers /api/auth/error en cas
    // d'échec, ce qui fait atterrir l'utilisateur sur une page d'erreur brute.
    const url = await signIn("credentials", {
      email: "demo@gestionpark.fr",
      password: process.env.DEMO_PASSWORD ?? "Demo2026!",
      redirect: false,
    });

    // Si l'URL contient "/error", les credentials n'ont pas été acceptés.
    if (typeof url === "string" && url.includes("/error")) {
      return { success: false, error: "demo_not_configured" };
    }

    // Connexion réussie : redirect() lève un NEXT_REDIRECT intercepté par Next.js.
    redirect("/");
  } catch (error) {
    // redirect() lui-même lève NEXT_REDIRECT — il faut le re-propager.
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { success: false, error: "demo_not_configured" };
    }
    return { success: false, error: "unknown" };
  }
}
