// app/magic-clock/[slug]/page.tsx
// ✅ v1.0 — Page présentation Magic Clock — fix 404
// Affiche before/after + infos créateur + CTA acquisition

import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/core/supabase/admin";
import MagicClockDetailClient from "./MagicClockDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MagicClockDetailPage({ params }: Props) {
  const { slug } = await params;

  const { data: clock } = await supabaseAdmin
    .from("magic_clocks")
    .select(`
      id, slug, title, gating_mode, ppv_price, is_published,
      creator_handle, creator_name, user_id,
      before_url, after_url, thumbnail_url,
      rating_avg, rating_count, views_count, likes_count,
      work, created_at
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!clock) notFound();

  // Profil créateur
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("handle, display_name, avatar_url, bio, followers_count, is_creator")
    .eq("handle", clock.creator_handle ?? "")
    .maybeSingle();

  // Hashtags depuis work
  const hashtags: string[] = Array.isArray(clock.work?.studio?.hashtags)
    ? clock.work.studio.hashtags
    : [];

  const beforeUrl = clock.before_url ?? clock.work?.studio?.beforeUrl ?? null;
  const afterUrl  = clock.after_url  ?? clock.work?.studio?.afterUrl  ?? null;

  return (
    <MagicClockDetailClient
      clock={{
        id: clock.id,
        slug: clock.slug ?? slug,
        title: clock.title ?? "Magic Clock",
        gatingMode: clock.gating_mode as "FREE" | "SUB" | "PPV",
        ppvPrice: clock.ppv_price ?? null,
        creatorHandle: clock.creator_handle ?? "",
        creatorName: clock.creator_name ?? profile?.display_name ?? clock.creator_handle ?? "",
        creatorAvatar: profile?.avatar_url ?? null,
        creatorBio: profile?.bio ?? null,
        creatorFollowers: profile?.followers_count ?? 0,
        beforeUrl,
        afterUrl,
        thumbnailUrl: clock.thumbnail_url ?? afterUrl ?? beforeUrl ?? null,
        ratingAvg: clock.rating_avg ?? null,
        ratingCount: clock.rating_count ?? 0,
        viewsCount: clock.views_count ?? 0,
        likesCount: clock.likes_count ?? 0,
        hashtags,
      }}
    />
  );
}
