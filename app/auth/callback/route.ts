// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await sb.auth.exchangeCodeForSession(code);

    if (!error) {
      // ✅ Connexion réussie — rediriger vers la page demandée
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // ❌ Échec — rediriger vers l'accueil avec message d'erreur
  return NextResponse.redirect(
    `${origin}/?error=auth_callback_failed`
  );
}
