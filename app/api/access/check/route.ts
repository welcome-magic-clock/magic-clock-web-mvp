// app/api/access/check/route.ts
// ✅ v1.0 — Porte unique d'accès Magic Clock
// ✅ Règles business :
//    FREE/SUB/PPV : accès uniquement si enregistré dans magic_clock_accesses
//    deleted_at   : invisible pour tous SAUF acheteurs/abonnés ayant déjà l'accès
//    Créateur     : accès seulement si deleted_at IS NULL
//    Anonyme      : jamais d'accès au contenu (même FREE non encore débloqué)
// ✅ Retourne { granted: bool, reason, gating_mode, deleted }

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type AccessReason =
  | "creator"          // le créateur accède à son propre MC (non supprimé)
  | "acquired"         // accès enregistré dans magic_clock_accesses
  | "not_authenticated"// pas connecté
  | "not_found"        // MC introuvable ou hard-deleted
  | "no_access"        // connecté mais pas d'accès acquis
  | "creator_deleted"; // créateur tente d'accéder à son MC supprimé

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const magicClockId = searchParams.get("id");
    const slug         = searchParams.get("slug");

    if (!magicClockId && !slug) {
      return NextResponse.json({ granted: false, reason: "missing_param" }, { status: 400 });
    }

    // ── 1. Récupérer le Magic Clock (sans filtre deleted_at ni is_published) ──
    let query = supabaseAdmin
      .from("magic_clocks")
      .select("id, slug, gating_mode, is_published, user_id, deleted_at");

    if (magicClockId) query = query.eq("id", magicClockId);
    else              query = query.eq("slug", slug!);

    const { data: clock, error: clockErr } = await query.maybeSingle();

    if (clockErr || !clock) {
      return NextResponse.json(
        { granted: false, reason: "not_found" satisfies AccessReason },
        { status: 404 }
      );
    }

    const isDeleted = !!clock.deleted_at;

    // ── 2. Auth ───────────────────────────────────────────────────────────────
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
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // ── 3. Non connecté → refus total (jamais d'accès anonyme) ───────────────
    if (!user) {
      return NextResponse.json(
        { granted: false, reason: "not_authenticated" satisfies AccessReason, deleted: isDeleted },
        { status: 401 }
      );
    }

    // ── 4. Créateur du MC ─────────────────────────────────────────────────────
    if (clock.user_id === user.id) {
      if (isDeleted) {
        // Créateur a supprimé → il n'y accède plus
        return NextResponse.json(
          { granted: false, reason: "creator_deleted" satisfies AccessReason, deleted: true },
          { status: 403 }
        );
      }
      // Créateur, non supprimé → accès total
      return NextResponse.json({
        granted: true,
        reason: "creator" satisfies AccessReason,
        gating_mode: clock.gating_mode,
        deleted: false,
        id: clock.id,
        slug: clock.slug,
      });
    }

    // ── 5. Vérifier magic_clock_accesses ─────────────────────────────────────
    // Un abonné/PPV/FREE qui a débloqué garde l'accès même si deleted_at
    const { data: access } = await supabaseAdmin
      .from("magic_clock_accesses")
      .select("access_type, created_at")
      .eq("user_id", user.id)
      .eq("magic_clock_id", clock.id)
      .maybeSingle();

    if (access) {
      return NextResponse.json({
        granted: true,
        reason: "acquired" satisfies AccessReason,
        gating_mode: clock.gating_mode,
        access_type: access.access_type,
        deleted: isDeleted, // info pour l'UI (bannière discrète possible)
        id: clock.id,
        slug: clock.slug,
      });
    }

    // ── 6. Aucun accès acquis ─────────────────────────────────────────────────
    return NextResponse.json(
      {
        granted: false,
        reason: "no_access" satisfies AccessReason,
        gating_mode: clock.gating_mode,
        deleted: isDeleted,
        id: clock.id,
        slug: clock.slug,
      },
      { status: 403 }
    );

  } catch (err: any) {
    console.error("[access/check] error:", err);
    return NextResponse.json({ granted: false, reason: "server_error" }, { status: 500 });
  }
}
