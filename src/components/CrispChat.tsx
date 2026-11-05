"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

function loadCrisp(websiteId: string) {
  if (document.getElementById("crisp-script")) return;
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = websiteId;
  const script = document.createElement("script");
  script.id = "crisp-script";
  script.src = "https://client.crisp.chat/l.js";
  script.async = true;
  document.head.appendChild(script);
}

export function CrispChat() {
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  useEffect(() => {
    if (!websiteId) return;

    try {
      if (localStorage.getItem("gp-cookie-consent") === "accepted") {
        loadCrisp(websiteId);
        return;
      }
    } catch {}

    function onConsent(e: Event) {
      if ((e as CustomEvent).detail === "accepted") loadCrisp(websiteId!);
    }
    window.addEventListener("gp-cookie-consent", onConsent);
    return () => window.removeEventListener("gp-cookie-consent", onConsent);
  }, [websiteId]);

  return null;
}
