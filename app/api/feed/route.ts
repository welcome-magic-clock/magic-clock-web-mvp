// app/api/feed/route.ts
// ✅ Zéro mock — lit depuis Supabase magic_clocks (données réelles)
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";

export async function GET() {
  try {
    const { data: clocks, error } = await supabaseAdmin
      .from("magic_clocks")
      .select(
        "id, slug, title, gating_mode, ppv_price, creator_handle, creator_name, work, created_at, before_url, after_url, views_count, likes_count, rating_avg"
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[/api/feed] Supabase error:", error.message);
      return NextResponse.json([], { status: 200 });
    }

    const feed = (clocks ?? [])
      .map((row) => {
        const work = (row.work as any) ?? {};
        const studio = work.studio ?? {};
        const beforeUrl =
          typeof row.before_url === "string" && row.before_url
            ? row.before_url
            : typeof studio.beforeUrl === "string" && studio.beforeUrl
            ? studio.beforeUrl
            : null;
        const afterUrl =
          typeof row.after_url === "string" && row.after_url
            ? row.after_url
            : typeof studio.afterUrl === "string" && studio.afterUrl
            ? studio.afterUrl
            : null;
        if (!beforeUrl && !afterUrl) return null;

        const handle = row.creator_handle ?? "magic_clock";
        const mode = row.gating_mode ?? "FREE";
        return {
          id: row.id,
          slug: row.slug,
          title: row.title ?? "Magic Clock",
          image: afterUrl ?? beforeUrl ?? "",
          beforeUrl,
          afterUrl,
          user: handle,
          access: mode === "PPV" ? "PPV" : mode === "SUB" ? "ABO" : "FREE",
          views: row.views_count ?? 0,
          likes: row.likes_count ?? 0,
          stars: typeof row.rating_avg === "number" ? row.rating_avg : undefined,
          creatorName: row.creator_name ?? handle,
          creatorHandle: handle.startsWith("@") ? handle : `@${handle}`,
          hashtags: Array.isArray(studio.hashtags) ? studio.hashtags : [],
        };
      })
      .filter(Boolean);

    return NextResponse.json(feed);
  } catch (err: any) {
    console.error("[/api/feed] Unexpected error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
