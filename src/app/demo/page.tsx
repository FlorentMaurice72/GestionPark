"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { connexionDemo } from "@/lib/demo/actions";

function LogoSVG({ size = 28 }: { size?: number }) {
  const h = Math.round(size * 0.75);
  return (
    <svg width={size} height={h} viewBox="0 0 80 60" aria-hidden="true">
      <polygon points="30,4 50,14 30,24 10,14" fill="#20B2AA" />
      <polygon points="10,14 30,24 30,42 10,32" fill="#0097A7" />
      <polygon points="30,24 50,14 50,32 30,42" fill="#0047AB" />
      <polygon points="50,18 62,24 50,30 38,24" fill="#20B2AA" />
      <polygon points="50,30 62,24 62,38 50,44" fill="#0047AB" />
      <circle cx="26" cy="40" r="8" fill="#0097A7" />
      <circle cx="26" cy="40" r="3.5" fill="white" />
      <rect x="32" y="37" width="17" height="5" rx="2" fill="#0097A7" />
    </svg>
  );
}

export default function DemoPage() {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      connexionDemo();
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="mb-8 flex items-center gap-3">
        <LogoSVG size={36} />
        <span
          className="text-xl font-bold tracking-wide"
          style={{ color: "#0F2C59", fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          GESTIONPARK
        </span>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm text-center dark:border-neutral-800 dark:bg-neutral-900">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EFF6FF" }}
        >
          <span className="text-2xl">🔑</span>
        </div>
        <h1 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Connexion au compte démo
        </h1>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          Vous allez accéder à un tableau de bord pré-rempli avec de vraies données fictives.
        </p>

        {pending ? (
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Connexion en cours…
          </div>
        ) : (
          <form action={connexionDemo}>
            <button
              type="submit"
              className="w-full rounded-md px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: "#0047AB" }}
            >
              Accéder à la démo →
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-neutral-400">
          Compte de démonstration — données fictives.
        </p>
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Vous voulez votre propre compte ?{" "}
        <Link href="/signup" className="underline hover:text-neutral-700">
          Créer un compte gratuit →
        </Link>
      </p>
    </div>
  );
}
