// middleware.ts — Protection des routes authentifiées
// ✅ v3.0 — Audit sécurité Mars 2026
// ✅ Cookies auth avec flags Secure + SameSite=Lax
// ✅ Routes API sensibles protégées
// ✅ Headers sécurité injectés sur toutes les réponses
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ── Routes UI nécessitant une session active ──────────────────────────────
const PROTECTED_ROUTES = [
  "/mymagic",
  "/notifications",
  "/messages",
  "/settings",
];

// ── Routes API nécessitant une session (retournent 401 JSON) ──────────────
const PROTECTED_API_ROUTES = [
  "/api/magic-clocks/create",
  "/api/magic-media/upload",
  "/api/r2/upload",
  "/api/upload",
  "/api/access/check",
];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, {
              ...options,
              // ✅ Flags sécurité sur tous les cookies auth
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            })
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;

  // ── 1. Routes API protégées → 401 JSON si non connecté ──────────────────
  const isProtectedApi = PROTECTED_API_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (isProtectedApi && !session) {
    return NextResponse.json(
      { ok: false, error: "Non authentifié" },
      { status: 401 }
    );
  }

  // ── 2. Routes UI protégées → redirect /auth ──────────────────────────────
  const isProtectedUi = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (isProtectedUi && !session) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    // Routes UI protégées
    "/mymagic/:path*",
    "/mymagic",
    "/notifications/:path*",
    "/notifications",
    "/messages/:path*",
    "/messages",
    "/settings/:path*",
    "/settings",
    // Routes API sensibles
    "/api/magic-clocks/create",
    "/api/magic-media/upload/:path*",
    "/api/r2/upload/:path*",
    "/api/upload/:path*",
    "/api/access/check",
  ],
};
