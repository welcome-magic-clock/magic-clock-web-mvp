// app/api/supabase-test/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/server/supabaseClient";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("magic_clocks")
    .select("id, slug, title, gating_mode, is_published, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("[supabase-test] error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    count: data?.length ?? 0,
    items: data ?? [],
  });
}
