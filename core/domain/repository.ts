// core/domain/repository.ts
// ✅ Zéro mock — toutes les données viennent de Supabase en production.
// Ce fichier est un pont de compatibilité pour les composants encore migrés.
//
// ⚠️ USAGE EN PRODUCTION :
//   - Amazing       → app/page.tsx          lit Supabase directement (supabaseAdmin)
//   - My Magic      → app/mymagic/page.tsx  lit Supabase directement (supabaseAdmin)
//   - Meet me       → app/meet/page.tsx     lit Supabase directement (getSupabaseBrowser)
//   - Ces fonctions NE SONT PLUS appelées dans les pages principales.
//   - Elles restent pour les tests et les composants intermédiaires.

import type { Creator, FeedCard } from "@/core/domain/types";
import { CREATORS } from "@/features/meet/creators";
import { FEED } from "@/features/amazing/feed";

// FEED = [ONBOARDING_MAGIC_CLOCK_FEED_CARD] uniquement (l'ours d'onboarding)
// Toutes les vraies FeedCards viennent de Supabase — pas d'ici.
const ALL_FEED_CARDS: FeedCard[] = FEED;

/**
 * Retourne les créateurs statiques (tableau vide en prod).
 * ⚠️ En production : meet/page.tsx charge depuis Supabase profiles.
 */
export function listCreators(): Creator[] {
  return CREATORS;
}

/**
 * Cherche un créateur par handle dans la liste statique.
 * ⚠️ En production : utiliser /api/creators/[handle] (Supabase).
 */
export function findCreatorByHandle(handle: string): Creator | undefined {
  return CREATORS.find((c) => c.handle === handle);
}

/**
 * Retourne le feed statique (ours d'onboarding uniquement).
 * ⚠️ En production : Amazing charge depuis Supabase directement.
 */
export function listFeed(): FeedCard[] {
  return ALL_FEED_CARDS;
}

/**
 * Retourne les contenus d'un créateur dans le feed statique.
 * ⚠️ En production : toujours vide (FEED ne contient que l'ours).
 */
export function listFeedByCreator(handle: string): FeedCard[] {
  return ALL_FEED_CARDS.filter((item) => item.user === handle);
}

/**
 * Retourne les Magic Clocks "créés" par un créateur dans le feed statique.
 * ⚠️ En production : mymagic/page.tsx charge depuis Supabase directement.
 */
export function listCreatedByCreator(handle: string): FeedCard[] {
  return ALL_FEED_CARDS.filter((item) => item.user === handle);
}

/**
 * Bibliothèque achetée par un viewer.
 * ⚠️ Non utilisé en production — mymagic/page.tsx utilise magic_clock_accesses (Supabase).
 * Retourne tableau vide pour ne jamais polluer l'UI avec de fausses données.
 */
export function listLibraryForViewer(_viewerHandle: string): FeedCard[] {
  return [];
}

/**
 * Recherche d'un contenu par id dans le feed statique.
 * ⚠️ En production : toujours null sauf pour l'ours d'onboarding.
 */
export function findContentById(id: number | string): FeedCard | undefined {
  const target = String(id);
  return ALL_FEED_CARDS.find((item) => String(item.id) === target);
}
