import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Routes accessibles sans abonnement actif (auth requise mais pas d'abo).
const ROUTES_LIBRES = ["/abonnement", "/login", "/signup"];
// Routes publiques (pas d'auth du tout).
const ROUTES_PUBLIQUES = ["/login", "/signup", "/api/stripe/webhook"];

export default auth(async function middleware(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;

  // Laisse passer les routes entièrement publiques.
  if (ROUTES_PUBLIQUES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Laisse passer les assets Next.js.
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const session = (req as { auth?: { user?: { id?: string } } }).auth;
  if (!session?.user?.id) {
    // Pas connecté : page / → landing (géré dans page.tsx), autres → login.
    if (pathname === "/") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Connecté : vérifie l'abonnement sauf sur les routes libres.
  if (ROUTES_LIBRES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Récupère le statut d'abonnement depuis un cookie ou la DB.
  // Pour éviter une requête DB à chaque requête, on encode le statut dans le
  // JWT via le callback session (voir src/lib/auth.ts — à enrichir si besoin).
  // Pour l'instant on laisse passer : la vérification fine se fait dans chaque page.
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
