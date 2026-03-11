// app/api/access/free/route.ts
// ✅ v2 — Notification Supabase au créateur après acquisition FREE
// ✅ Sécurité : user_id UUID uniquement, jamais d'email
// ✅ Protection : un créateur ne peut pas "acheter" son propre contenu

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
    const { data: clock } = await supabaseAdmin
      .from("magic_clocks")
      .select("id, slug, title, gating_mode, is_published, user_id, creator_handle, creator_name, after_url, thumbnail_url, work")
      .eq("id", magicClockId)
      .maybeSingle();

    if (!clock) {
      return NextResponse.json({ ok: false, error: "Magic Clock introuvable" }, { status: 404 });
    }
    if (!clock.is_published) {
      return NextResponse.json({ ok: false, error: "Contenu non publié" }, { status: 403 });
    }
    if (clock.gating_mode !== "FREE") {
      return NextResponse.json({ ok: false, error: "Ce contenu n'est pas en accès libre" }, { status: 403 });
    }

    // ✅ 2) Auth — user connecté
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (list: { name: string; value: string; options?: any }[]) =>
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
      },
    );

    const { data: { user } } = await supabase.auth.getUser();

    let buyerHandle: string | null = null;

    if (user) {
      // ✅ 3) Protection créateur/client
      if (clock.user_id && clock.user_id === user.id) {
        return NextResponse.json({
          ok: true,
          access: "CREATOR",
          magicClockId,
          slug: clock.slug,
          message: "Tu es le créateur — retrouve ce contenu dans Créations",
        });
      }

      // ✅ 4) Récupérer le handle de l'acheteur
      const { data: buyerProfile } = await supabaseAdmin
        .from("profiles")
        .select("handle, display_name")
        .eq("id", user.id)
        .maybeSingle();
      buyerHandle = buyerProfile?.handle ?? null;

      // ✅ 5) Enregistrer l'accès
      await supabaseAdmin
        .from("magic_clock_accesses")
        .upsert(
          { user_id: user.id, magic_clock_id: magicClockId, access_type: "FREE" },
          { onConflict: "user_id,magic_clock_id,access_type", ignoreDuplicates: true },
        );

      // ✅ 6) Notifier le créateur si on connaît son user_id
      if (clock.user_id && clock.user_id !== user.id) {
        const buyerName = buyerProfile?.handle
          ? `@${buyerProfile.handle}`
          : "Un utilisateur";

        await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: clock.user_id,
            type: "acquisition",
            title: "Nouveau Magic Clock débloqué 🎉",
            message: `${buyerName} vient de débloquer ton Magic Clock "${clock.title ?? ""}". Invite-le à te suivre !`,
            from_handle: buyerProfile?.handle ?? null,
            magic_clock_id: magicClockId,
          });
      }
    }

    return NextResponse.json({ ok: true, access: "FREE", magicClockId, slug: clock.slug });

  } catch (error: any) {
    console.error("[Access/FREE] error", error);
    return NextResponse.json({ ok: false, error: error?.message ?? "Unknown error" }, { status: 500 });
  }
}
