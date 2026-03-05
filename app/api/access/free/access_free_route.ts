// app/api/access/free/route.ts
// ✅ Sécurité : user_id UUID uniquement, jamais d'email
// ✅ Protection : un créateur ne peut pas "acheter" son propre contenu
// ✅ Séparation : rôles créateur / client distincts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const magicClockId = searchParams.get("magicClockId");

    if (!magicClockId) {
      return NextResponse.json(
        { ok: false, error: "magicClockId manquant" },
        { status: 400 },
      );
    }

    // ✅ 1) Vérifier que le Magic Clock existe, est publié et FREE
    const { data: clock, error: clockError } = await supabaseAdmin
      .from("magic_clocks")
      .select("id, slug, gating_mode, is_published, user_id")
      .eq("id", magicClockId)
      .maybeSingle();

    if (clockError || !clock) {
      return NextResponse.json(
        { ok: false, error: "Magic Clock introuvable" },
        { status: 404 },
      );
    }
    if (!clock.is_published) {
      return NextResponse.json(
        { ok: false, error: "Contenu non publié" },
        { status: 403 },
      );
    }
    if (clock.gating_mode !== "FREE") {
      return NextResponse.json(
        { ok: false, error: "Ce contenu n'est pas en accès libre" },
        { status: 403 },
      );
    }

    // ✅ 2) Auth — user connecté (optionnel mais recommandé)
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (list: { name: string; value: string; options?: any }[]) =>
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            ),
        },
      },
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // ✅ 3) Protection créateur/client
      // Un créateur ne peut pas "acquérir" son propre Magic Clock
      // → son contenu va dans Créations, pas dans Bibliothèque
      if (clock.user_id && clock.user_id === user.id) {
        return NextResponse.json(
          {
            ok: true,
            access: "CREATOR",
            magicClockId,
            slug: clock.slug,
            message: "Tu es le créateur — retrouve ce contenu dans Créations",
          },
          { status: 200 },
        );
      }

      // ✅ 4) Enregistrer l'accès client par user_id UUID
      // upsert : idempotent — pas de doublon si on débloquer plusieurs fois
      await supabaseAdmin
        .from("magic_clock_accesses")
        .upsert(
          {
            user_id: user.id,               // ✅ UUID — jamais email ou handle
            magic_clock_id: magicClockId,
            access_type: "FREE",
          },
          {
            onConflict: "user_id,magic_clock_id,access_type",
            ignoreDuplicates: true,
          },
        );
    }

    return NextResponse.json(
      {
        ok: true,
        access: "FREE",
        magicClockId,
        slug: clock.slug,
      },
      { status: 200 },
    );

  } catch (error: any) {
    console.error("[Access/FREE] error", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
