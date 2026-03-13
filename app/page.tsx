// app/page.tsx — Amazing v7.1
// ✅ 0 mock — 100% Supabase — id UUID réel
// ✅ v7.0 — AmazingHeader retiré ici : géré directement dans AmazingFeed (state filtre/search)
// ✅ v7.1 — Filtre deleted_at IS NULL (soft-delete)
// ✅ dynamic force pour feed toujours frais
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { supabaseAdmin } from "@/core/supabase/admin";
import type { FeedCard } from "@/core/domain/types";
import AmazingFeed from "@/features/amazing/AmazingFeed";

async function getAmazingFeed(): Promise<FeedCard[]> {
  try {
    const { data: clocks, error } = await supabaseAdmin
      .from("magic_clocks")
      .select(
        "id, slug, title, gating_mode, ppv_price, creator_handle, creator_name, work, created_at, rating_avg, views_count, likes_count, before_url, after_url",
      )
      .eq("is_published", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) { console.error("[Amazing] Feed error:", error.message); return []; }
    if (!clocks || clocks.length === 0) return [];

    const handles = [...new Set(clocks.map((r) => r.creator_handle).filter(Boolean))];
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("handle, avatar_url, display_name")
      .in("handle", handles);

    const profileMap = new Map<string, { avatar_url: string | null; display_name: string | null }>();
    for (const p of profiles ?? []) {
      profileMap.set(p.handle, { avatar_url: p.avatar_url, display_name: p.display_name });
    }

    const supabaseCards: FeedCard[] = clocks
      .map((row) => {
        const work = (row.work as any) ?? {};
        const studio = work.studio ?? {};

        const beforeUrl: string | null =
          (typeof row.before_url === "string" && row.before_url) ? row.before_url :
          (typeof studio.beforeUrl === "string" && studio.beforeUrl) ? studio.beforeUrl : null;

        const afterUrl: string | null =
          (typeof row.after_url === "string" && row.after_url) ? row.after_url :
          (typeof studio.afterUrl === "string" && studio.afterUrl) ? studio.afterUrl : null;

        if (!beforeUrl && !afterUrl) return null;

        const title = (typeof row.title === "string" && row.title) ? row.title : studio.title ?? "Magic Clock";
        const handle = row.creator_handle ?? "magic_clock";
        const profile = profileMap.get(handle);
        const creatorName = profile?.display_name ?? row.creator_name ?? handle;
        const creatorAvatar = profile?.avatar_url ?? null;
        const mode = row.gating_mode ?? "FREE";
        const access = mode === "PPV" ? "PPV" : mode === "SUB" ? "ABO" : "FREE";
        const hashtags: string[] = Array.isArray(studio.hashtags) ? studio.hashtags :
          Array.isArray(work.hashtags) ? work.hashtags : [];
        const stars: number | undefined = typeof row.rating_avg === "number" ? row.rating_avg : undefined;

        return {
          id: row.id,
          title,
          image: afterUrl ?? beforeUrl ?? "",
          beforeUrl,
          afterUrl,
          user: handle,
          access: access as "FREE" | "ABO" | "PPV",
          views: typeof row.views_count === "number" ? row.views_count : 0,
          likes: typeof row.likes_count === "number" ? row.likes_count : 0,
          stars,
          creatorName,
          creatorHandle: handle.startsWith("@") ? handle : `@${handle}`,
          creatorAvatar: creatorAvatar ?? undefined,
          hashtags,
          slug: row.slug,
          magicClockId: row.id,
        } satisfies FeedCard & { slug?: string | null; magicClockId?: string };
      })
      .filter(Boolean) as FeedCard[];

    return supabaseCards;
  } catch (err) {
    console.error("[Amazing] Unexpected error:", err);
    return [];
  }
}

export default async function AmazingPage() {
  const feed = await getAmazingFeed();
  return (
    <Suspense fallback={null}>
      <main className="mx-auto max-w-lg pb-36 pt-0">
        {/* ✅ AmazingFeed intègre AmazingHeader + state filtre/search */}
        <AmazingFeed feed={feed} />
      </main>
    </Suspense>
  );
}
