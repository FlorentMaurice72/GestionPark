import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://gestionpark.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${SITE_URL}/abonnement`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/login`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/signup`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.7 },
    { url: `${SITE_URL}/tarifs`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/blog/gerer-ses-boxs-sans-excel`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/blog/import-csv-bancaire-loyers`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/blog/5-erreurs-gestion-box-stockage`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/parrainage`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/cgu`,              lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];
}
