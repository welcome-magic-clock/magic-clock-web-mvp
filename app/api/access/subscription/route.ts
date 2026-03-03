// app/api/access/subscription/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/core/supabase/admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("handle")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ ok: false, error: "Profil introuvable" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({} as any));
    const contentId = body?.contentId;

    if (!contentId) {
      return NextResponse.json({ ok: false, error: "contentId manquant" }, { status: 400 });
    }

    const { data: magicClock } = await supabaseAdmin
      .from("magic_clocks")
      .select("id, gating_mode, is_published")
      .eq("id", contentId)
      .single();

    if (!magicClock || !magicClock.is_published) {
      return NextResponse.json({ ok: false, error: "Contenu introuvable" }, { status: 404 });
    }

    if (magicClock.gating_mode !== "SUB") {
      return NextResponse.json({ ok: false, error: "Ce contenu n'est pas en mode abonnement" }, { status: 400 });
    }

    const { data: existingAccess } = await supabaseAdmin
      .from("magic_clock_accesses")
      .select("id")
      .eq("user_handle", profile.handle)
      .eq("magic_clock_id", contentId)
      .eq("access_type", "SUB")
      .single();

    if (!existingAccess) {
      await supabaseAdmin
        .from("magic_clock_accesses")
        .insert({
          user_handle: profile.handle,
          magic_clock_id: contentId,
          access_type: "SUB",
        });
    }

    return NextResponse.json({ ok: true, access: "SUBSCRIPTION", contentId }, { status: 200 });

  } catch (error: any) {
    console.error("[Access/SUB] POST failed", error);
    return NextResponse.json({ ok: false, error: error?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
