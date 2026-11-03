"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ONGLETS = [
  { valeur: "analyse", label: "Analyse financière" },
  { valeur: "documents", label: "Documents & Factures" },
];

export function OngletsFinances({ vue }: { vue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isExport = pathname === "/finances/export";

  function aller(valeur: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("vue", valeur);
    router.push(`/finances?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      {ONGLETS.map((onglet) => (
        <button
          key={onglet.valeur}
          type="button"
          onClick={() => aller(onglet.valeur)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            !isExport && vue === onglet.valeur
              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
              : "border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          }`}
        >
          {onglet.label}
        </button>
      ))}
      <Link
        href="/finances/export"
        className={`rounded-md px-3 py-1.5 text-sm font-medium ${
          isExport
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : "border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        }`}
      >
        Export CSV
      </Link>
    </div>
  );
}
