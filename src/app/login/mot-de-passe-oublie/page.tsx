import Link from "next/link";
import { DemandeResetForm } from "./_components/DemandeResetForm";

export default function MotDePasseOubliePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Mot de passe oublié
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          Entrez votre email admin, un lien de réinitialisation vous sera envoyé s&apos;il correspond à un compte.
        </p>

        <DemandeResetForm />

        <p className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-neutral-500 underline hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
