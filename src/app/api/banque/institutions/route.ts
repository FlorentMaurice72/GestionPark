import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInstitutions } from "@/lib/nordigen";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const institutions = await getInstitutions("FR");
    const sorted = institutions
      .map((i) => ({ id: i.id, name: i.name, logo: i.logo }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return NextResponse.json(sorted);
  } catch (err) {
    console.error("[banque/institutions]", err);
    return NextResponse.json({ error: "Impossible de récupérer les banques" }, { status: 502 });
  }
}
