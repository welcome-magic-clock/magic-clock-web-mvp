// app/api/magic-clocks/create/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      gatingMode, // "FREE" | "PPV" | "SUB"
      work,       // payload complet (studio + display)
    } = body ?? {};

    if (!title || !slug || !gatingMode || !work) {
      return NextResponse.json(
        { ok: false, error: "Missing fields in body" },
        { status: 400 },
      );
    }

    // Pour l’instant : on fixe en dur Aiko Tanaka comme créatrice
    const { data, error } = await supabaseAdmin
      .from("magic_clocks")
      .insert({
        title,
        slug,
        gating_mode: gatingMode,
        work,
        creator_handle: "aiko_tanaka",
        creator_name: "Aiko Tanaka",
        is_published: true,
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("[Magic Clock] Supabase insert error", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      slug: data.slug,
    });
  } catch (error: any) {
    console.error(
      "[Magic Clock] POST /api/magic-clocks/create failed",
      error,
    );
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
