// app/api/magic-clocks/[id]/like/route.ts
// ✅ v1.0 — Toggle like Magic Clock (like / unlike avec anti-doublon Supabase)

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  // Auth — pattern exact du projet (same as /api/access/free)
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

  // Vérifier que l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Toggle via RPC atomique (retourne true=liked, false=unliked)
  const { data: liked, error } = await supabaseAdmin.rpc("toggle_like", {
    p_clock_id: id,
    p_user_id: user.id,
  });

  if (error) {
    console.error("[like] rpc error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, liked });
}
