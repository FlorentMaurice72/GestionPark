"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  locationId: number;
  locataireEmail: string;
  bailleurEmail: string;
  statutSignature: string | null;
  bailSigneUrl: string | null;
  bailBrouillonUrl: string;
}

export function BailSignatureSection({
  locationId,
  locataireEmail,
  bailleurEmail,
  statutSignature,
  bailSigneUrl,
  bailBrouillonUrl,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function handleDemarrer() {
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch(`/api/universign/demarrer/${locationId}`, { method: "POST" });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setErreur(data.error ?? "Erreur lors du démarrage de la signature.");
        return;
      }
      router.refresh();
    } catch {
      setErreur("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  // Bail signé
  if (statutSignature === "signe") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
          ✓ Bail signé électroniquement
        </span>
        {bailSigneUrl ? (
          <a
            href={bailSigneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            ↓ Télécharger le bail signé
          </a>
        ) : (
          <a
            href={bailBrouillonUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            ↓ Télécharger le bail
          </a>
        )}
      </div>
    );
  }

  // En attente de signature
  if (statutSignature === "en_attente") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            ⏳ En attente de signature
          </span>
          <a
            href={bailBrouillonUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            ↓ Brouillon (non signé)
          </a>
        </div>
        <p className="text-xs text-neutral-500">
          Liens de signature envoyés à <strong>{locataireEmail}</strong> et <strong>{bailleurEmail}</strong> par YouSign.
        </p>
      </div>
    );
  }

  // Expiré
  if (statutSignature === "expire") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
          ✕ Transaction expirée
        </span>
        <button
          onClick={handleDemarrer}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          {loading ? "Envoi en cours…" : "Renvoyer pour signature"}
        </button>
        {erreur && <p className="w-full text-xs text-red-600">{erreur}</p>}
      </div>
    );
  }

  // Pas encore de signature
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={bailBrouillonUrl}
        download
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        ↓ Télécharger le bail
      </a>
      <button
        onClick={handleDemarrer}
        disabled={loading}
        data-tour="faire-signer"
        className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        {loading ? "Envoi en cours…" : "✍ Faire signer électroniquement"}
      </button>
      {erreur && <p className="w-full text-xs text-red-600">{erreur}</p>}
    </div>
  );
}
