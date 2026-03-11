// features/amazing/feed.ts
// ✅ v2 — Mocks supprimés. Seul l'ours Onboarding subsiste comme carte système.

import type { FeedCard } from "@/core/domain/types";
import { ONBOARDING_MAGIC_CLOCK_FEED_CARD } from "@/core/domain/magicClockWork";

// BASE_FEED vide — toutes les données viennent de Supabase
export const BASE_FEED: FeedCard[] = [];

// Flux fallback minimal : uniquement l'ours si Supabase est inaccessible
export const FEED: FeedCard[] = [
  ONBOARDING_MAGIC_CLOCK_FEED_CARD,
];

export default FEED;
