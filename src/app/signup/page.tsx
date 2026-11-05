import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

async function inscrire(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!email) redirect("/signup?error=email-requis");
  if (password.length < 8) redirect("/signup?error=mdp-trop-court");
  if (password !== confirmation) redirect("/signup?error=mdp-different");

  let existant;
  try {
    existant = await prisma.admin.findUnique({ where: { email } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    redirect(`/signup?error=db&detail=${encodeURIComponent(msg.slice(0, 200))}`);
  }
  if (existant) redirect("/signup?error=email-pris");

  try {
    const passwordHash = await hashPassword(password);
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await prisma.admin.create({ data: { email, passwordHash, trialEndsAt } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    redirect(`/signup?error=db&detail=${encodeURIComponent(msg.slice(0, 200))}`);
  }

  redirect("/login?inscription=1");
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; detail?: string }>;
}) {
  // detail déstructuré plus haut dans messages

  const { error, detail } = await searchParams;

  const messages: Record<string, string> = {
    "email-requis": "L'adresse email est requise.",
    "mdp-trop-court": "Le mot de passe doit contenir au moins 8 caractères.",
    "mdp-different": "Les mots de passe ne correspondent pas.",
    "email-pris": "Un compte existe déjà avec cet email.",
    "db": `Erreur base de données : ${detail ?? "inconnue"}`,
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          GestionPark — Créer un compte
        </h1>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          Gérez vos boxes en libre-service.
        </p>

        <form action={inscrire} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
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
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
            <p className="mt-1 text-xs text-neutral-400">8 caractères minimum</p>
          </div>

          <div>
            <label
              htmlFor="confirmation"
              className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmation"
              name="confirmation"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          {error && messages[error] && (
            <p className="text-sm text-red-600 dark:text-red-400">{messages[error]}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dk"
          >
            Créer mon compte
          </button>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="underline hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
