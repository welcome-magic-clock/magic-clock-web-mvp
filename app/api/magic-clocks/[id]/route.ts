// app/api/magic-clocks/[id]/route.ts
// ✅ v1.0 — DELETE Magic Clock (owner only — abonnés/PPV conservent leurs accès)

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  // ── Auth ──────────────────────────────────────────────────────────────────
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
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // ── Vérifier ownership ────────────────────────────────────────────────────
  const { data: clock, error: fetchErr } = await supabaseAdmin
    .from("magic_clocks")
    .select("id, creator_id")
    .eq("id", id)
    .single();

  if (fetchErr || !clock) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (clock.creator_id !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // ── Soft-delete : on marque deleted_at (les accès acquis restent valides) ─
  // Si la colonne deleted_at n'existe pas encore, on passe en hard-delete
  const { error: delErr } = await supabaseAdmin
    .from("magic_clocks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (delErr) {
    // Fallback hard-delete si deleted_at n'existe pas en DB
    const { error: hardErr } = await supabaseAdmin
      .from("magic_clocks")
      .delete()
      .eq("id", id);
    if (hardErr) {
      console.error("[delete-mc] error:", hardErr.message);
      return NextResponse.json({ error: hardErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
