// Service YouSign API v3 — signature électronique
// Sandbox : YOUSIGN_API_URL=https://api-sandbox.yousign.app/v3
// Production : YOUSIGN_API_URL=https://api.yousign.app/v3

const BASE_URL = (process.env.YOUSIGN_API_URL ?? "https://api-sandbox.yousign.app/v3").replace(/\/$/, "");

function authHeaders() {
  return { Authorization: `Bearer ${process.env.YOUSIGN_API_KEY}` };
}

async function checkReponse(res: Response, contexte: string) {
  if (!res.ok) {
    const corps = await res.text().catch(() => "");
    throw new Error(`YouSign ${contexte} — ${res.status}: ${corps}`);
  }
}

export async function creerDemandeSignature(nom: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/signature_requests`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nom,
      delivery_mode: "email",
      timezone: "Europe/Paris",
    }),
  });
  await checkReponse(res, "créer demande");
  const data = await res.json() as { id: string };
  return data.id;
}

export async function ajouterDocument(requestId: string, buffer: Buffer, nom: string): Promise<string> {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)], { type: "application/pdf" }), nom);
  form.append("nature", "signable_document");

  const res = await fetch(`${BASE_URL}/signature_requests/${requestId}/documents`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  await checkReponse(res, "ajouter document");
  const data = await res.json() as { id: string };
  return data.id;
}

// Coordonnées page 2 du PDF (A4 = 595 × 842 pt, Y depuis le bas de page).
const CHAMP_BAILLEUR  = { page: 2, x: 50,  y: 410, width: 190, height: 70 };
const CHAMP_LOCATAIRE = { page: 2, x: 310, y: 410, width: 190, height: 70 };

interface Signataire {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
}

export async function ajouterSignataire(
  requestId: string,
  documentId: string,
  partie: "bailleur" | "locataire",
  s: Signataire,
): Promise<string> {
  const coords = partie === "bailleur" ? CHAMP_BAILLEUR : CHAMP_LOCATAIRE;
  const res = await fetch(`${BASE_URL}/signature_requests/${requestId}/signers`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      info: {
        first_name: s.prenom || "Bailleur",
        last_name: s.nom || ".",
        email: s.email,
        ...(s.telephone ? { phone_number: s.telephone } : {}),
      },
      signature_level: "electronic_signature",
      signature_authentication_mode: "no_otp",
      fields: [
        {
          document_id: documentId,
          type: "signature",
          page: coords.page,
          x: coords.x,
          y: coords.y,
          width: coords.width,
          height: coords.height,
        },
      ],
    }),
  });
  await checkReponse(res, `ajouter signataire ${partie}`);
  const data = await res.json() as { id: string };
  return data.id;
}

export async function activerDemande(requestId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/signature_requests/${requestId}/activate`, {
    method: "POST",
    headers: authHeaders(),
  });
  await checkReponse(res, "activer demande");
}

export async function telechargerPdfSigne(requestId: string, documentId: string): Promise<Buffer> {
  const res = await fetch(
    `${BASE_URL}/signature_requests/${requestId}/documents/${documentId}/download`,
    { headers: authHeaders() },
  );
  if (!res.ok) {
    const corps = await res.text().catch(() => "");
    throw new Error(`YouSign téléchargement PDF — ${res.status}: ${corps}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
