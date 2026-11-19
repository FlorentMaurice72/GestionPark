import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { telechargerPdfSigne } from "@/lib/yousign";
import { uploadFichier as uploadSupabase } from "@/lib/supabase-storage";
import { envoyerEmailBailSigne } from "@/lib/email";

interface YouSignEvent {
  event_name: string;
  signature_request: {
    id: string;
    status: string;
    documents?: { id: string; nature?: string }[];
  };
}

async function verifierSignatureYouSign(req: Request, body: string): Promise<boolean> {
  const secret = process.env.YOUSIGN_WEBHOOK_SECRET;
  if (!secret) {
    // Pas de secret configuré → on accepte mais on log un avertissement
    console.warn("YOUSIGN_WEBHOOK_SECRET non défini — vérification de signature ignorée");
    return true;
  }
  const signature = req.headers.get("x-yousign-signature-256") ?? "";
  // Format attendu : "sha256=<hex>"
  const expected = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  if (!await verifierSignatureYouSign(req, rawBody)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  let event: YouSignEvent;
  try {
    event = JSON.parse(rawBody) as YouSignEvent;
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  // Seul l'événement "signature_request.done" nous intéresse
  if (event.event_name !== "signature_request.done") {
    return NextResponse.json({ received: true });
  }

  const requestId = event.signature_request?.id;
  if (!requestId) return NextResponse.json({ error: "signature_request.id manquant" }, { status: 400 });

  // Retrouver la location correspondante avec les données nécessaires pour l'email
  const location = await prisma.location.findFirst({
    where: { bailTransactionId: requestId },
    include: {
      locataire: { select: { nom: true, prenom: true } },
      box: { include: { bien: { select: { nom: true, utilisateurId: true } } } },
    },
  });
  if (!location) {
    return NextResponse.json({ received: true });
  }

  // Trouver l'ID du document signable dans le payload
  const documentId = event.signature_request.documents?.find(
    (d) => !d.nature || d.nature === "signable_document",
  )?.id;

  try {
    if (!documentId) {
      await prisma.location.update({
        where: { id: location.id },
        data: { bailStatutSignature: "signe" },
      });
      return NextResponse.json({ received: true });
    }

    // Télécharger le PDF signé depuis YouSign
    const pdfBuffer = await telechargerPdfSigne(requestId, documentId);

    // Stocker dans Supabase
    const chemin = `bails-signes/${location.id}/bail-signe.pdf`;
    await uploadSupabase(chemin, new Uint8Array(pdfBuffer), "application/pdf");

    // Générer une URL signée permanente (10 ans)
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    );
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(chemin, 60 * 60 * 24 * 365 * 10);

    await prisma.location.update({
      where: { id: location.id },
      data: {
        bailStatutSignature: "signe",
        bailSigneUrl: data?.signedUrl ?? null,
      },
    });
  } catch (err) {
    console.error("YouSign webhook erreur:", err);
    await prisma.location.update({
      where: { id: location.id },
      data: { bailStatutSignature: "signe" },
    });
  }

  // Notifier le bailleur par email (non-bloquant)
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: location.box.bien.utilisateurId },
      select: { email: true },
    });
    if (admin?.email) {
      const bailSigneUrl = await prisma.location.findUnique({
        where: { id: location.id },
        select: { bailSigneUrl: true },
      });
      await envoyerEmailBailSigne(admin.email, {
        locataireNom: location.locataire.nom,
        locatairePrenom: location.locataire.prenom,
        bienNom: location.box.bien.nom,
        boxNumero: location.box.numero,
        bailSigneUrl: bailSigneUrl?.bailSigneUrl ?? null,
      });
    }
  } catch (err) {
    console.error("Email bail signé — erreur non-bloquante:", err);
  }

  return NextResponse.json({ received: true });
}
