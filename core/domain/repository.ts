// core/domain/repository.ts
// Repository "en mémoire" pour le MVP (sans Prisma / base de données)

import type { Creator, FeedCard } from "@/core/domain/types";
import { CREATORS } from "@/features/meet/creators";
import { FEED } from "@/features/amazing/feed";
import { ONBOARDING_MAGIC_CLOCK_FEED_CARD } from "./magicClockWork";

// 👇 tableau commun pour Amazing, My Magic Clock et Magic Display
const ALL_FEED_CARDS: FeedCard[] = [
  ONBOARDING_MAGIC_CLOCK_FEED_CARD, // Bear en premier
  ...FEED,
];

/**
 * Retourne tous les créateurs (utilisé par Meet me, etc.)
 */
export function listCreators(): Creator[] {
  return CREATORS;
}

/**
 * Cherche un créateur par son handle (@sofia, @aiko, etc.)
 */
export function findCreatorByHandle(handle: string): Creator | undefined {
  return CREATORS.find((c) => c.handle === handle);
}

/**
 * Retourne tout le feed global (Amazing).
 */
export async function listFeed(): Promise<FeedCard[]> {
  return ALL_FEED_CARDS;
}

/**
 * Retourne les contenus d’un créateur donné.
 */
export function listFeedByCreator(handle: string): FeedCard[] {
  return ALL_FEED_CARDS.filter((item) => item.user === handle);
}

/**
 * MVP : Magic Clock "créés" par un créateur.
 */
export function listCreatedByCreator(handle: string): FeedCard[] {
  return ALL_FEED_CARDS.filter((item) => item.user === handle);
}

/**
 * MVP : Bibliothèque "achetée" par le viewer.
 */
export function listLibraryForViewer(viewerHandle: string): FeedCard[] {
  return ALL_FEED_CARDS.slice(0, 4);
}

/**
 * Recherche d'un contenu par son id (pour Magic Display, détails, etc.)
 */
export function findContentById(id: number | string): FeedCard | undefined {
  const target = String(id);
  return ALL_FEED_CARDS.find((item) => String(item.id) === target);
}
