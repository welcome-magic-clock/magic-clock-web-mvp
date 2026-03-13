// app/api/magic-clocks/[id]/liked/route.ts
// ✅ v1.0 — Vérifie si l'user courant a déjà liké ce Magic Clock
// GET → { liked: boolean }
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ liked: false });

  // Auth user
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) =>
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ liked: false });

  const { data, error } = await supabaseAdmin.rpc("get_user_like", {
    p_clock_id: id,
    p_user_id: user.id,
  });

  if (error) return NextResponse.json({ liked: false });

  return NextResponse.json({ liked: data === true });
}
