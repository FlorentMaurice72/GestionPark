import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFichier, BUCKET } from "@/lib/supabase-storage";

const TAILLE_MAX = 10 * 1024 * 1024; // 10 Mo
const TYPES_AUTORISES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const formData = await request.formData();
  const fichier = formData.get("file");
  if (!(fichier instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (fichier.size > TAILLE_MAX) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
  }
  if (!TYPES_AUTORISES.has(fichier.type)) {
    return NextResponse.json(
      { error: "Type de fichier non autorisé (PDF, JPEG, PNG, DOCX acceptés)" },
      { status: 400 },
    );
  }

  const timestamp = Date.now();
  const nomNettoye = fichier.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 80);
  const path = `${userId}/${timestamp}_${nomNettoye}`;

  const buffer = new Uint8Array(await fichier.arrayBuffer());
  await uploadFichier(path, buffer, fichier.type);

  return NextResponse.json({ fileId: path, bucket: BUCKET });
}
