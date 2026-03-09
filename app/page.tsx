// app/page.tsx — Amazing V3
// ✅ Header signature Magic Clock + pills Lucide + feed Supabase

import { Suspense } from "react";
import { supabaseAdmin } from "@/core/supabase/admin";
import { FEED } from "@/features/amazing/feed";
import type { FeedCard } from "@/core/domain/types";
import AmazingFeed from "@/features/amazing/AmazingFeed";
import AmazingHeader from "@/features/amazing/AmazingHeader";

async function getAmazingFeed(): Promise<FeedCard[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("magic_clocks")
      .select(
        "id, slug, title, gating_mode, ppv_price, creator_handle, creator_name, work, created_at",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[Amazing] Feed error:", error.message);
      return FEED;
    }

    if (!data || data.length === 0) return FEED;

    const supabaseCards: FeedCard[] = data
      .map((row) => {
        const work   = (row.work as any) ?? {};
        const studio = work.studio ?? {};

        const beforeUrl: string | null =
          typeof studio.beforeUrl === "string" && studio.beforeUrl ? studio.beforeUrl : null;
        const afterUrl: string | null =
          typeof studio.afterUrl === "string" && studio.afterUrl ? studio.afterUrl : null;

        if (!beforeUrl && !afterUrl) return null;

        const title = (typeof row.title === "string" && row.title)
          ? row.title : studio.title ?? "Magic Clock";

        const handle      = row.creator_handle ?? "magic_clock";
        const creatorName = row.creator_name ?? handle;
        const mode        = row.gating_mode ?? "FREE";
        const access      = mode === "PPV" ? "PPV" : mode === "SUB" ? "ABO" : "FREE";
        const hashtags: string[] = Array.isArray(studio.hashtags)
          ? studio.hashtags
          : Array.isArray(work.hashtags) ? work.hashtags : [];

        return {
          id: row.slug ?? row.id,
          title,
          image:  afterUrl ?? beforeUrl ?? "",
          beforeUrl,
          afterUrl,
          user:    handle,
          access:  access as "FREE" | "ABO" | "PPV",
          views:   0,
          likes:   0,
          creatorName,
          creatorHandle: handle.startsWith("@") ? handle : `@${handle}`,
          hashtags,
          slug:         row.slug,
          magicClockId: row.id,
        } satisfies FeedCard & { slug?: string | null; magicClockId?: string };
      })
      .filter(Boolean) as FeedCard[];

    return [...supabaseCards, ...FEED];
  } catch (err) {
    console.error("[Amazing] Unexpected error:", err);
    return FEED;
  }
}

export default async function AmazingPage() {
  const feed = await getAmazingFeed();

  return (
    <Suspense fallback={null}>
      <main className="mx-auto max-w-lg pb-36 pt-0">
        <AmazingHeader count={feed.length} />
        <AmazingFeed feed={feed} />
      </main>
    </Suspense>
  );
}
