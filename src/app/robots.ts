import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://gestionpark.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/profil", "/biens", "/locataires", "/finances", "/loyers", "/alertes"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
