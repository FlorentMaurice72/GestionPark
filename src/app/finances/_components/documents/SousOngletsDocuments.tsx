"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TYPES_DOCUMENT } from "@/lib/documents/types";

export function SousOngletsDocuments({ categorie }: { categorie: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function aller(valeur: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (valeur) {
      params.set("categorie", valeur);
    } else {
      params.delete("categorie");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => aller(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          categorie === null
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : "border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        }`}
      >
        Tous
      </button>
      {TYPES_DOCUMENT.map((t) => (
        <button
          key={t.valeur}
          type="button"
          onClick={() => aller(t.valeur)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            categorie === t.valeur
              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
              : "border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
