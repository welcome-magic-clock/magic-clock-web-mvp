/**
 * app/api/feed/amazing/route.ts
 * ✅ v1.1 — Fix colonnes DB : views_count, likes_count, saves_count, shares_count
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cache, CACHE_KEYS, TTL } from "@/lib/redis"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10))
    const filter = searchParams.get("filter") ?? "all"

    // ── 1. Vérifier le cache Redis ─────────────────────────────────────────
    const cacheKey = CACHE_KEYS.feedAmazing(page, filter)
    const cached = await cache.get<unknown[]>(cacheKey)
    if (cached) {
      return NextResponse.json(
        { data: cached, cached: true, page },
        {
          headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
            "X-Cache": "HIT",
          },
        }
      )
    }

    // ── 2. Cache miss → requête Supabase ───────────────────────────────────
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabaseAdmin
      .from("magic_clocks")
      .select(`
        id, slug, title, gating_mode, ppv_price,
        before_url, after_url,
        creator_handle, creator_name,
        created_at,
        views_count, likes_count, saves_count, shares_count,
        rating_avg, rating_count
      `)
      .is("deleted_at", null)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(from, to)

    // Filtres optionnels
    if (filter === "free") query = query.eq("gating_mode", "FREE")
    if (filter === "ppv")  query = query.eq("gating_mode", "PPV")
    if (filter === "sub")  query = query.eq("gating_mode", "SUB")

    const { data, error } = await query

    if (error) {
      console.error("[Feed Amazing] Supabase error:", error)
      return NextResponse.json({ error: "Erreur chargement feed" }, { status: 500 })
    }

    const result = data ?? []

    // ── 3. Stocker en cache Redis ──────────────────────────────────────────
    await cache.set(cacheKey, result, TTL.FEED)

    return NextResponse.json(
      { data: result, cached: false, page },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          "X-Cache": "MISS",
        },
      }
    )
  } catch (err) {
    console.error("[Feed Amazing] Unexpected error:", err)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
