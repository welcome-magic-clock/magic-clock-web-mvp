// app/api/magic-clocks/[id]/rate/route.ts
// ✅ v1.0 — Note un Magic Clock (1-5 étoiles) depuis My Magic Clock > Bibliothèque
// POST body: { rating: 1-5 }
// → Appelle upsert_rating() RPC → met à jour magic_clocks.rating_avg + profiles.creator_rating_avg
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  // Auth user
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list: { name: string; value: string; options?: Record<string, unknown> }[]) =>
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // Valider le rating
  const body = await req.json().catch(() => ({}));
  const rating = Number(body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return NextResponse.json(
      { error: "rating must be an integer between 1 and 5" },
      { status: 400 }
    );

  const { error } = await supabaseAdmin.rpc("upsert_rating", {
    p_clock_id: id,
    p_user_id: user.id,
    p_rating: rating,
  });

  if (error)
    console.error("[API] error:", error.message);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });

  return NextResponse.json({ ok: true, rating });
}
