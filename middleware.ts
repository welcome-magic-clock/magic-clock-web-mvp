// middleware.ts — Protection des routes authentifiées
// ✅ v2.0 — Redirect → /auth?next= · Studio + Monet libres pour visiteurs
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes qui nécessitent une session active
const PROTECTED_ROUTES = [
  "/mymagic",
  "/notifications",
  "/messages",
];

// Routes intentionnellement libres pour les visiteurs (pas dans PROTECTED_ROUTES)
// /studio → modale "connecte-toi pour publier"
// /monet  → simulateur accessible en visiteur

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
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !session) {
    // ✅ Redirect sécurisé : /auth?next=<pathname>
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/mymagic/:path*",
    "/mymagic",
    "/notifications/:path*",
    "/notifications",
    "/messages/:path*",
    "/messages",
  ],
};
