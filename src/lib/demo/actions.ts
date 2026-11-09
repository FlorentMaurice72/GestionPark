"use server";

import { signIn } from "@/lib/auth";

export async function connexionDemo(): Promise<void> {
  await signIn("credentials", {
    email: "demo@gestionpark.fr",
    password: process.env.DEMO_PASSWORD ?? "Demo2026!",
    redirectTo: "/",
  });
}
