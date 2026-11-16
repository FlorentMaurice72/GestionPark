// Service Universign — signature électronique
// Sandbox : UNIVERSIGN_API_URL=https://api.alpha.universign.com
// Production : UNIVERSIGN_API_URL=https://api.universign.com

const BASE_URL = (process.env.UNIVERSIGN_API_URL ?? "https://api.universign.com").replace(/\/$/, "");

function authHeaders() {
  return { Authorization: `Bearer ${process.env.UNIVERSIGN_API_KEY}` };
}

async function checkReponse(res: Response, contexte: string) {
  if (!res.ok) {
    const corps = await res.text().catch(() => "");
    throw new Error(`Universign ${contexte} — ${res.status}: ${corps}`);
  }
}

export async function uploadFichier(buffer: Buffer, nom: string): Promise<string> {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)], { type: "application/pdf" }), nom);

  const res = await fetch(`${BASE_URL}/v1/files`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  await checkReponse(res, "upload fichier");
  const data = await res.json() as { id: string };
  return data.id;
}

export async function creerTransaction(nom: string, fileId: string): Promise<{ txId: string; docId: string }> {
  const res = await fetch(`${BASE_URL}/v1/transactions`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nom,
      documents: [{ file_id: fileId, name: "bail.pdf" }],
    }),
  });
  await checkReponse(res, "créer transaction");
  const data = await res.json() as { id: string; documents: { id: string }[] };
  return { txId: data.id, docId: data.documents[0].id };
}

// Coordonnées sur la page 2 du PDF (page de signatures dédiée).
// A4 = 595 x 842 pt — Universign utilise Y depuis le bas de page.
// Zone de signature bailleur : gauche, milieu de page (~y=440 depuis bas)
// Zone de signature locataire : droite, milieu de page
const CHAMP_BAILLEUR = { page: 2, x: 50,  y: 410, width: 190, height: 70 };
const CHAMP_LOCATAIRE = { page: 2, x: 310, y: 410, width: 190, height: 70 };

export async function ajouterChampSignature(
  txId: string,
  docId: string,
  partie: "bailleur" | "locataire",
): Promise<string> {
  const coords = partie === "bailleur" ? CHAMP_BAILLEUR : CHAMP_LOCATAIRE;
  const res = await fetch(`${BASE_URL}/v1/transactions/${txId}/documents/${docId}/fields`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ type: "signature", ...coords }),
  });
  await checkReponse(res, `champ signature ${partie}`);
  const data = await res.json() as { id: string };
  return data.id;
}

interface Signataire {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  fieldId: string;
}

export async function ajouterParticipant(txId: string, s: Signataire): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/transactions/${txId}/participants`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: s.prenom,
      last_name: s.nom,
      email: s.email,
      phone_number: s.telephone,
      phone_number_type: "prerequisite",
      signature_level: "level1",
      signature_field_id: s.fieldId,
    }),
  });
  await checkReponse(res, `ajouter participant ${s.email}`);
}

export async function demarrerTransaction(txId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/transactions/${txId}/start`, {
    method: "POST",
    headers: authHeaders(),
  });
  await checkReponse(res, "démarrer transaction");
}

export async function recupererPdfSigne(txId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/v1/transactions/${txId}`, {
    headers: authHeaders(),
  });
  await checkReponse(res, "récupérer transaction");
  const data = await res.json() as {
    status: string;
    documents: { signed_file_url?: string; download_url?: string }[];
  };
  const url = data.documents[0]?.signed_file_url ?? data.documents[0]?.download_url;
  if (!url) throw new Error("PDF signé non disponible");
  return url;
}
