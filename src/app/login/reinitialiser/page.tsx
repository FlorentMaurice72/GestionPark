import Link from "next/link";
import { ReinitialiserForm } from "./_components/ReinitialiserForm";

export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Nouveau mot de passe
        </h1>

        {token ? (
          <ReinitialiserForm token={token} />
        ) : (
          <p className="text-sm text-red-600 dark:text-red-400">Lien invalide.</p>
        )}

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
