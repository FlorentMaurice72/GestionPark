import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GestionPark — Logiciel de gestion de boxs de stockage";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F2C59 0%, #0047AB 60%, #0097A7 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cercles décoratifs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        {/* Logo + nom */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          {/* SVG logo inline */}
          <svg width="72" height="54" viewBox="0 0 80 60">
            <polygon points="30,4 50,14 30,24 10,14" fill="#20B2AA" />
            <polygon points="10,14 30,24 30,42 10,32" fill="#0097A7" />
            <polygon points="30,24 50,14 50,32 30,42" fill="#5B9EFF" />
            <polygon points="50,18 62,24 50,30 38,24" fill="#20B2AA" />
            <polygon points="50,30 62,24 62,38 50,44" fill="#5B9EFF" />
            <circle cx="26" cy="40" r="8" fill="#0097A7" />
            <circle cx="26" cy="40" r="3.5" fill="white" />
            <rect x="32" y="37" width="17" height="5" rx="2" fill="#0097A7" />
          </svg>
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "white",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            GESTIONPARK
          </span>
        </div>

        {/* Accroche principale */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          Gérez vos boxs de stockage
          <br />
          <span style={{ color: "#7DD3FC" }}>en toute autonomie</span>
        </div>

        {/* Sous-titre */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: 740,
            lineHeight: 1.5,
          }}
        >
          Suivi des loyers · Import CSV bancaire · Relances automatiques
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: 40,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 50,
            padding: "10px 32px",
            color: "white",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Essai gratuit 14 jours — sans carte bancaire
        </div>
      </div>
    ),
    { ...size },
  );
}
