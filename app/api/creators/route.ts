// app/api/creators/route.ts
// ✅ Zéro mock — lit depuis Supabase profiles (créateurs réels uniquement)
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";

export async function GET() {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, handle, display_name, bio, profession, avatar_url, followers_count, is_creator"
      )
      .not("handle", "is", null)
      .order("followers_count", { ascending: false, nullsFirst: false })
      .limit(50);

    if (error) {
      console.error("[/api/creators] Supabase error:", error.message);
      return NextResponse.json([], { status: 200 }); // liste vide plutôt qu'erreur
    }

    const creators = (profiles ?? []).map((p) => ({
      id: p.id,
      handle: `@${(p.handle ?? "").replace(/^@/, "")}`,
      name: p.display_name ?? p.handle ?? "Créateur",
      city: "",
      langs: ["FR"],
      followers: p.followers_count ?? 0,
      specialties: p.profession ? [p.profession] : [],
      avatar: p.avatar_url ?? "",
      access: ["FREE"] as ("FREE" | "ABO" | "PPV")[],
      bio: p.bio ?? undefined,
    }));

    return NextResponse.json(creators);
  } catch (err: any) {
    console.error("[/api/creators] Unexpected error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
