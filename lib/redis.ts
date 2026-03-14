/**
 * lib/redis.ts
 * ✅ v1.0 — Cache Redis Upstash pour Magic Clock
 *
 * Variables d'environnement requises (Vercel + .env.local) :
 *   UPSTASH_REDIS_REST_URL     → URL REST Upstash
 *   UPSTASH_REDIS_REST_TOKEN   → Token Upstash
 *
 * Usage :
 *   import { cache } from "@/lib/redis"
 *   const data = await cache.get<MyType>("key")
 *   await cache.set("key", data, 60) // TTL en secondes
 *   await cache.del("key")
 *   await cache.invalidatePattern("feed:*")
 */

const REDIS_URL  = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

// ── Fallback no-op si Redis non configuré ──────────────────────────────────
// Permet de développer sans Redis — aucune erreur, juste pas de cache
const noop = {
  get:               async <T>(_key: string): Promise<T | null> => null,
  set:               async (_key: string, _val: unknown, _ttl?: number) => {},
  del:               async (_key: string) => {},
  invalidatePattern: async (_pattern: string) => {},
}

if (!REDIS_URL || !REDIS_TOKEN) {
  console.warn("[Redis] UPSTASH_REDIS_REST_URL ou TOKEN manquant — cache désactivé")
}

// ── Client Redis REST ──────────────────────────────────────────────────────
async function redisRequest(command: string[]): Promise<unknown> {
  if (!REDIS_URL || !REDIS_TOKEN) return null
  const res = await fetch(`${REDIS_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  if (!res.ok) {
    console.error("[Redis] Request failed:", res.status, command[0])
    return null
  }
  const json = await res.json() as { result: unknown }
  return json.result
}

// ── API publique ───────────────────────────────────────────────────────────
export const cache = {
  /**
   * GET — récupère une valeur (désérialisée depuis JSON)
   */
  async get<T>(key: string): Promise<T | null> {
    if (!REDIS_URL) return null
    try {
      const raw = await redisRequest(["GET", key]) as string | null
      if (!raw) return null
      return JSON.parse(raw) as T
    } catch (e) {
      console.error("[Redis] GET error:", key, e)
      return null
    }
  },

  /**
   * SET — stocke une valeur (sérialisée en JSON) avec TTL optionnel
   * @param ttl  Durée en secondes (défaut: 60s)
   */
  async set(key: string, value: unknown, ttl = 60): Promise<void> {
    if (!REDIS_URL) return
    try {
      await redisRequest(["SET", key, JSON.stringify(value), "EX", String(ttl)])
    } catch (e) {
      console.error("[Redis] SET error:", key, e)
    }
  },

  /**
   * DEL — supprime une clé
   */
  async del(key: string): Promise<void> {
    if (!REDIS_URL) return
    try {
      await redisRequest(["DEL", key])
    } catch (e) {
      console.error("[Redis] DEL error:", key, e)
    }
  },

  /**
   * INVALIDATE PATTERN — supprime toutes les clés correspondant au pattern
   * Utilise SCAN + DEL (compatible Upstash)
   * Exemple : cache.invalidatePattern("feed:*")
   */
  async invalidatePattern(pattern: string): Promise<void> {
    if (!REDIS_URL) return
    try {
      let cursor = "0"
      do {
        const result = await redisRequest(["SCAN", cursor, "MATCH", pattern, "COUNT", "100"]) as [string, string[]]
        if (!result) break
        cursor = result[0]
        const keys = result[1]
        if (keys.length > 0) {
          await redisRequest(["DEL", ...keys])
        }
      } while (cursor !== "0")
    } catch (e) {
      console.error("[Redis] INVALIDATE error:", pattern, e)
    }
  },
}

// ── Clés de cache Magic Clock ──────────────────────────────────────────────
// Centralise les noms de clés pour éviter les typos et faciliter l'invalidation
export const CACHE_KEYS = {
  // Feed Amazing — partagé par tous les visiteurs
  feedAmazing: (page = 0, filter = "all") => `feed:amazing:${filter}:page${page}`,
  feedAmazingAll: () => "feed:amazing:*",

  // Profil créateur — chargé sur Meet Me
  creatorProfile: (handle: string) => `profile:${handle}`,
  creatorProfileAll: (handle: string) => `profile:${handle}*`,

  // Magic Clock individuel — métadonnées publiques
  magicClock: (idOrSlug: string) => `mc:${idOrSlug}`,
  magicClockAll: () => "mc:*",

  // Stats d'un Magic Clock — vues, likes
  magicClockStats: (id: string) => `stats:${id}`,

  // Liste des Magic Clocks d'un créateur
  creatorClocks: (handle: string) => `creator-clocks:${handle}`,
}

// ── TTL constants ──────────────────────────────────────────────────────────
export const TTL = {
  FEED:           30,    // 30s  — feed rafraîchi fréquemment
  PROFILE:        300,   // 5min — profil peu changeant
  MAGIC_CLOCK:    3600,  // 1h   — contenu stable
  STATS:          10,    // 10s  — stats temps réel
  CREATOR_CLOCKS: 120,   // 2min — liste des créations
}
