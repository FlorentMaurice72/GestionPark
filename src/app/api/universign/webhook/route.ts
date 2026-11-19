import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { telechargerPdfSigne } from "@/lib/yousign";
import { uploadFichier as uploadSupabase } from "@/lib/supabase-storage";

interface YouSignEvent {
  event_name: string;
  signature_request: {
    id: string;
    status: string;
    documents?: { id: string; nature?: string }[];
  };
}

export async function POST(req: Request) {
  let event: YouSignEvent;
  try {
    event = await req.json() as YouSignEvent;
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  // Seul l'événement "signature_request.done" nous intéresse
  if (event.event_name !== "signature_request.done") {
    return NextResponse.json({ received: true });
  }

  const requestId = event.signature_request?.id;
  if (!requestId) return NextResponse.json({ error: "signature_request.id manquant" }, { status: 400 });

  // Retrouver la location correspondante
  const location = await prisma.location.findFirst({
    where: { bailTransactionId: requestId },
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

  return NextResponse.json({ received: true });
}
