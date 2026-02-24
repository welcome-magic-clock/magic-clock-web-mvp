// core/domain/repository.supabase.ts
import type { FeedCard } from "./types";
import type { MagicClockWork } from "./magicClockWork";
import {
  magicClockWorkToFeedCard,
  ONBOARDING_MAGIC_CLOCK_FEED_CARD,
} from "./magicClockWork";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

type MagicClockRow = {
  id: string;
  slug: string | null;
  creator_handle: string;
  creator_name: string;
  title: string;
  subtitle: string | null;
  gating_mode: "FREE" | "SUB" | "PPV";
  ppv_price: number | null;
  is_published: boolean;
  work: MagicClockWork;
};

export async function listFeedFromSupabase(): Promise<FeedCard[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("magic_clocks")
    .select("id, slug, creator_handle, creator_name, title, subtitle, gating_mode, ppv_price, is_published, work")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[repository.supabase] listFeedFromSupabase error:", error);
    // En cas d'erreur : on retombe au minimum sur l'ours d'onboarding
    return [ONBOARDING_MAGIC_CLOCK_FEED_CARD];
  }

  const dynamicCards =
    data?.map((row) =>
      magicClockWorkToFeedCard(row.work as MagicClockWork)
    ) ?? [];

  return [ONBOARDING_MAGIC_CLOCK_FEED_CARD, ...dynamicCards];
}
