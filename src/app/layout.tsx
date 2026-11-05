import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

import { Footer } from "@/components/Footer";
import { CrispChat } from "@/components/CrispChat";
import { CookieBanner } from "@/components/CookieBanner";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://gestionpark.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GestionPark — Logiciel de gestion de boxs de stockage",
    template: "%s | GestionPark",
  },
  description:
    "GestionPark simplifie la gestion locative de vos boxs de stockage : suivi des paiements, import CSV bancaire, relances automatiques, quittances PDF et tableau de bord multi-biens.",
  keywords: [
    "gestion box stockage",
    "logiciel box location",
    "gestion locative box",
    "logiciel garde-meuble",
    "suivi loyers box",
    "import csv bancaire",
    "quittance box stockage",
  ],
  authors: [{ name: "GestionPark" }],
  creator: "GestionPark",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "GestionPark",
    title: "GestionPark — Gérez vos boxs de stockage en toute autonomie",
    description:
      "Suivi des locations, paiements et locataires depuis un seul tableau de bord. Sans agence, sans Excel.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GestionPark" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GestionPark — Logiciel de gestion de boxs de stockage",
    description: "Suivi des loyers, import CSV bancaire, relances automatiques. Essai gratuit 14 jours.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
        <CrispChat />
        <CookieBanner />
      </body>
    </html>
  );
}
