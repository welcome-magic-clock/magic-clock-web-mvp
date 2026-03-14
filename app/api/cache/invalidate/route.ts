/**
 * app/api/cache/invalidate/route.ts
 * ✅ v1.0 — Invalidation manuelle du cache Redis
 *
 * POST /api/cache/invalidate
 * Header: Authorization: Bearer <CACHE_INVALIDATION_SECRET>
 * Body: { pattern: "feed:*" } ou { key: "feed:amazing:all:page0" }
 *
 * Usage : webhook post-deploy, admin panel, scripts CI/CD
 */
import { NextRequest, NextResponse } from "next/server"
import { cache } from "@/lib/redis"

export async function POST(req: NextRequest) {
  // ── Auth par secret ────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization") ?? ""
  const secret = process.env.CACHE_INVALIDATION_SECRET
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json() as { pattern?: string; key?: string }

    if (body.pattern) {
      await cache.invalidatePattern(body.pattern)
      return NextResponse.json({ success: true, invalidated: `pattern:${body.pattern}` })
    }

    if (body.key) {
      await cache.del(body.key)
      return NextResponse.json({ success: true, invalidated: `key:${body.key}` })
    }

    // Sans paramètre → invalide tout le cache Magic Clock
    await cache.invalidatePattern("feed:*")
    await cache.invalidatePattern("mc:*")
    await cache.invalidatePattern("profile:*")
    await cache.invalidatePattern("stats:*")
    await cache.invalidatePattern("creator-clocks:*")

    return NextResponse.json({ success: true, invalidated: "all" })
  } catch (err) {
    console.error("[Cache Invalidate] Error:", err)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
