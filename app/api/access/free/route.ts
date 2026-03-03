// app/api/access/free/route.ts
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
        { status: 400 }
      );
    }

    // ✅ 1) Vérifier que le Magic Clock existe et est FREE
    const { data: clock, error: clockError } = await supabaseAdmin
      .from("magic_clocks")
      .select("id, gating_mode, is_published")
      .eq("id", magicClockId)
      .single();

    if (clockError || !clock) {
      return NextResponse.json(
        { ok: false, error: "Magic Clock introuvable" },
        { status: 404 }
      );
    }

    if (!clock.is_published) {
      return NextResponse.json(
        { ok: false, error: "Contenu non publié" },
        { status: 403 }
      );
    }

    if (clock.gating_mode !== "FREE") {
      return NextResponse.json(
        { ok: false, error: "Ce contenu n'est pas en accès libre" },
        { status: 403 }
      );
    }

    // ✅ 2) Auth optionnelle — enregistrer l'accès si connecté
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Si connecté, on log l'accès (best-effort, pas bloquant)
    if (user) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("handle")
        .eq("id", user.id)
        .single();

      if (profile?.handle) {
        await supabaseAdmin
          .from("magic_clock_accesses")
          .upsert(
            {
              user_handle: profile.handle,
              magic_clock_id: magicClockId,
              access_type: "FREE",
            },
            { onConflict: "user_handle,magic_clock_id,access_type", ignoreDuplicates: true }
          );
      }
    }

    return NextResponse.json(
      { ok: true, access: "FREE", magicClockId },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("[Access/FREE] error", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
