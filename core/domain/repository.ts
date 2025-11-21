// core/domain/repository.ts
// Repository "en mémoire" pour le MVP (sans Prisma / base de données)

import type { Creator, FeedCard } from "@/core/domain/types";
import { CREATORS } from "@/features/meet/creators";
import { FEED } from "@/features/amazing/feed";

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
export function listFeed(): FeedCard[] {
  return FEED;
}

/**
 * Retourne les contenus d’un créateur donné.
 */
export function listFeedByCreator(handle: string): FeedCard[] {
  return FEED.filter((item) => item.user === handle);
}

/**
 * MVP : Magic Clock "créés" par un créateur.
 * Pour l’instant, on dit simplement :
 * - les contenus où item.user === handle sont ses créations.
 */
export function listCreatedByCreator(handle: string): FeedCard[] {
  return FEED.filter((item) => item.user === handle);
}

/**
 * MVP : Bibliothèque "achetée" par le viewer.
 * Pour l’instant, on renvoie un sous-ensemble fixe du feed.
 * Plus tard : branché sur Prisma + paiements.
 */
export function listLibraryForViewer(viewerHandle: string): FeedCard[] {
  // En attendant : on simule une petite librairie
  return FEED.slice(0, 4);
}

/**
 * Trouve un contenu par son id.
 * Utile pour les pages détail (Magic Display, etc.).
 */
export function findContentById(id: string | number): FeedCard | undefined {
  const target = String(id);
  return FEED.find((item) => String(item.id) === target);
}
