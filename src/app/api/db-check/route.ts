import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const raw = process.env.DATABASE_URL ?? "";
  let host = "(non défini)";
  let scheme = "(non défini)";
  let error: string | null = null;

  try {
    const url = new URL(raw);
    scheme = url.protocol;
    host = url.hostname + ":" + url.port;
  } catch (e) {
    error = String(e);
  }

  return NextResponse.json({
    defined: !!raw,
    length: raw.length,
    scheme,
    host,
    parseError: error,
  });
}
