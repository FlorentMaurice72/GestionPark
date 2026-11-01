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

  const start = raw.slice(0, 30);
  const end = raw.slice(-20);
  const firstCodes = [...raw.slice(0, 5)].map(c => c.charCodeAt(0));

  return NextResponse.json({
    defined: !!raw,
    length: raw.length,
    scheme,
    host,
    parseError: error,
    start,
    end,
    firstCharCodes: firstCodes,
  });
}
