// app/api/magic-clocks/[id]/like/route.ts
// ✅ v1.0 — Toggle like Magic Clock (like / unlike avec anti-doublon Supabase)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const supabase = createClient();

  // Vérifier que l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Toggle via RPC atomique (retourne true=liked, false=unliked)
  const { data: liked, error } = await supabase.rpc("toggle_like", {
    p_clock_id: id,
    p_user_id: user.id,
  });

  if (error) {
    console.error("[like] rpc error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, liked });
}
