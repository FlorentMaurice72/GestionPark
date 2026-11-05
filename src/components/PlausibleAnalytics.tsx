import Script from "next/script";

export function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "gestionpark.fr";
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
