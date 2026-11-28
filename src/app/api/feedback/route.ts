import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Resend } from "resend";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@gestion-park.fr";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "GestionPark <onboarding@resend.dev>";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json() as { type?: string; message?: string };
  const { type, message } = body;

  if (!message || message.trim().length < 5) {
    return NextResponse.json({ error: "Message trop court" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email non configuré" }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const userEmail = session.user.email ?? "inconnu";
  const typeLabel = type ?? "Autre";

  await resend.emails.send({
    from: EMAIL_FROM,
    to: CONTACT_EMAIL,
    subject: `[GestionPark] Remontée utilisateur — ${typeLabel}`,
    html: `
      <p><strong>De :</strong> ${userEmail}</p>
      <p><strong>Type :</strong> ${typeLabel}</p>
      <hr>
      <p style="white-space:pre-wrap">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    `,
    text: `De : ${userEmail}\nType : ${typeLabel}\n\n${message.trim()}`,
    replyTo: userEmail,
  });

  return NextResponse.json({ ok: true });
}
