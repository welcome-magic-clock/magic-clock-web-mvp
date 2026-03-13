// app/api/magic-clocks/[id]/view/route.ts
// ✅ v1.0 — Incrément vues Magic Clock (appelé automatiquement à l'ouverture)

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  // Incrément atomique via RPC
  const { error } = await supabaseAdmin.rpc("increment_views", { clock_id: id });

  if (error) {
    console.error("[view] rpc error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
