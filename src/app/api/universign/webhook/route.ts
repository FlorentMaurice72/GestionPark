import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFichier as uploadSupabase } from "@/lib/supabase-storage";

interface UniversignEvent {
  event_type: string;
  data: {
    id: string;
    status: string;
    documents?: { signed_file_url?: string; download_url?: string }[];
  };
}

export async function POST(req: Request) {
  let event: UniversignEvent;
  try {
    event = await req.json() as UniversignEvent;
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  // Seul l'événement "transaction.completed" nous intéresse
  if (event.event_type !== "transaction.completed") {
    return NextResponse.json({ received: true });
  }

  const txId = event.data?.id;
  if (!txId) return NextResponse.json({ error: "transaction id manquant" }, { status: 400 });

  // Retrouver la location correspondante
  const location = await prisma.location.findFirst({
    where: { bailTransactionId: txId },
  });
  if (!location) {
    // Transaction inconnue — on ignore silencieusement
    return NextResponse.json({ received: true });
  }

  try {
    // Récupérer le PDF signé depuis Universign
    const signedUrl = event.data.documents?.[0]?.signed_file_url
      ?? event.data.documents?.[0]?.download_url;

    if (!signedUrl) {
      await prisma.location.update({
        where: { id: location.id },
        data: { bailStatutSignature: "signe" },
      });
      return NextResponse.json({ received: true });
    }

    // Télécharger le PDF signé
    const pdfRes = await fetch(signedUrl, {
      headers: { Authorization: `Bearer ${process.env.UNIVERSIGN_API_KEY}` },
    });
    if (!pdfRes.ok) throw new Error(`Téléchargement PDF signé : ${pdfRes.status}`);
    const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

    // Stocker dans Supabase
    const chemin = `bails-signes/${location.id}/bail-signe.pdf`;
    await uploadSupabase(chemin, new Uint8Array(pdfBuffer), "application/pdf");

    // Générer une URL publique permanente (signée 10 ans)
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
    console.error("Universign webhook erreur:", err);
    // On marque quand même comme signé même si le stockage échoue
    await prisma.location.update({
      where: { id: location.id },
      data: { bailStatutSignature: "signe" },
    });
  }

  return NextResponse.json({ received: true });
}
