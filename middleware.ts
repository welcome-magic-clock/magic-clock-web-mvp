// middleware.ts — Protection des routes authentifiées
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes qui nécessitent une session active
const PROTECTED_ROUTES = [
  "/mymagic",
  "/studio",
  "/monet",
  "/notifications",
  "/messages",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Visiteur sans session → redirect vers Amazing avec paramètre login
  if (isProtected && !session) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("login", "1");
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/mymagic/:path*",
    "/studio/:path*",
    "/monet/:path*",
    "/notifications/:path*",
    "/messages/:path*",
  ],
};
