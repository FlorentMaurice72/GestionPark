import Link from "next/link";
import type { Metadata } from "next";
import { PricingSection } from "@/app/_components/PricingSection";

export const metadata: Metadata = {
  title: "Tarifs — GestionPark",
  description:
    "Plans Essentiel (9,90 €/mois) et Pro (24,90 €/mois). 14 jours d'essai gratuit sans carte bancaire. Logiciel de gestion de boxs de stockage.",
};

function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-100 px-6 py-3">
      <Link href="/" className="flex items-center gap-2">
        <svg width="26" height="20" viewBox="0 0 80 60" aria-hidden="true">
          <polygon points="30,4 50,14 30,24 10,14" fill="#20B2AA" />
          <polygon points="10,14 30,24 30,42 10,32" fill="#0097A7" />
          <polygon points="30,24 50,14 50,32 30,42" fill="#0047AB" />
          <polygon points="50,18 62,24 50,30 38,24" fill="#20B2AA" />
          <polygon points="50,30 62,24 62,38 50,44" fill="#0047AB" />
          <circle cx="26" cy="40" r="8" fill="#0097A7" />
          <circle cx="26" cy="40" r="3.5" fill="white" />
          <rect x="32" y="37" width="17" height="5" rx="2" fill="#0097A7" />
        </svg>
        <span className="text-sm font-bold tracking-wide" style={{ color: "#0F2C59", fontFamily: "var(--font-montserrat, sans-serif)" }}>
          GESTIONPARK
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
          Se connecter
        </Link>
        <Link
          href="/signup"
          className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: "#0047AB" }}
        >
          Commencer
        </Link>
      </div>
    </nav>
  );
}

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Nav />
      <PricingSection />
      <div className="pb-16 text-center">
        <p className="text-sm text-neutral-400">
          Des questions ?{" "}
          <a href="mailto:contact@gestionpark.fr" className="underline hover:text-neutral-700">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}
