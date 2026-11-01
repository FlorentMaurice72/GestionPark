import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { TropDeTentatives } from "@/lib/login-rate-limit";

async function login(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof TropDeTentatives) {
      redirect("/login?error=trop-de-tentatives");
    }
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string; inscription?: string }>;
}) {
  const { error, reset, inscription } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          GestionPark — Connexion
        </h1>

        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          {inscription === "1" && !error && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Compte créé. Connectez-vous.
            </p>
          )}
          {reset === "1" && !error && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Mot de passe réinitialisé. Vous pouvez vous connecter.
            </p>
          )}
          {error === "trop-de-tentatives" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Trop de tentatives. Réessayez dans quelques minutes.
            </p>
          )}
          {error && error !== "trop-de-tentatives" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Email ou mot de passe incorrect.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Se connecter
          </button>

          <p className="text-center text-sm">
            <Link
              href="/login/mot-de-passe-oublie"
              className="text-neutral-500 underline hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Pas de compte ?{" "}
            <Link
              href="/signup"
              className="underline hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
