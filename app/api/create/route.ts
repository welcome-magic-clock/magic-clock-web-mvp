/**
 * app/api/create/route.ts
 * ✅ v3.0 — Création Magic Clock avec invalidation cache Redis
 *
 * POST /api/create
 * 1. Valide le token Turnstile
 * 2. Crée le Magic Clock dans Supabase
 * 3. Invalide le cache Redis feed:amazing:*
 * 4. Retourne le slug créé
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cache, CACHE_KEYS } from "@/lib/redis"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── Validation Turnstile ───────────────────────────────────────────────────
async function validateTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn("[Create] TURNSTILE_SECRET_KEY manquant — validation ignorée")
    return true
  }
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    })
    const data = await res.json() as { success: boolean }
    return data.success === true
  } catch (e) {
    console.error("[Create] Turnstile validation error:", e)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      turnstileToken?: string
      title: string
      beforeUrl: string
      afterUrl: string
      gatingMode: "FREE" | "SUB" | "PPV"
      ppvPrice?: number
      creatorId: string
      creatorHandle: string
      creatorName: string
      hashtags?: string[]
    }

    // ── 1. Validation Turnstile ────────────────────────────────────────────
    const turnstileToken = body.turnstileToken ?? ""
    const isHuman = await validateTurnstile(turnstileToken)
    if (!isHuman) {
      return NextResponse.json(
        { error: "Validation anti-bot échouée. Réessaie." },
        { status: 403 }
      )
    }

    // ── 2. Validation des champs requis ────────────────────────────────────
    if (!body.title || !body.beforeUrl || !body.afterUrl || !body.gatingMode) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      )
    }

    // ── 3. Génération du slug ──────────────────────────────────────────────
    const base = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)
    const uid = Math.random().toString(36).slice(2, 10)
    const slug = `${base}-${uid}`

    // ── 4. Insertion Supabase ──────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from("magic_clocks")
      .insert({
        slug,
        title: body.title,
        before_url: body.beforeUrl,
        after_url: body.afterUrl,
        thumbnail_url: body.afterUrl,
        gating_mode: body.gatingMode,
        ppv_price: body.gatingMode === "PPV" ? (body.ppvPrice ?? 2.99) : null,
        creator_id: body.creatorId,
        creator_handle: body.creatorHandle,
        creator_name: body.creatorName,
        hashtags: body.hashtags ?? [],
        is_published: true,
        view_count: 0,
        like_count: 0,
        rating_avg: null,
        rating_count: 0,
      })
      .select("id, slug")
      .single()

    if (error || !data) {
      console.error("[Create] Supabase insert error:", error)
      return NextResponse.json(
        { error: "Erreur création Magic Clock" },
        { status: 500 }
      )
    }

    // ── 5. Invalidation cache Redis ────────────────────────────────────────
    await cache.invalidatePattern(CACHE_KEYS.feedAmazingAll())
    await cache.invalidatePattern(CACHE_KEYS.creatorClocks(body.creatorHandle))

    return NextResponse.json({
      success: true,
      id: data.id,
      slug: data.slug,
    })
  } catch (err) {
    console.error("[Create] Unexpected error:", err)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
