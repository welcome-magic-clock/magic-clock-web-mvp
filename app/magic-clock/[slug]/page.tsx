/**
 * app/magic-clock/[slug]/page.tsx
 * ✅ v1.1 — Fix colonnes DB : views_count, likes_count
 */
import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import MagicClockDetailClient from "./MagicClockDetailClient"

export const revalidate = 60

// ── Génération des slugs populaires au build ──────────────────────────────
export async function generateStaticParams() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
    const { data } = await supabase
      .from("magic_clocks")
      .select("slug")
      .is("deleted_at", null)
      .eq("is_published", true)
      .order("views_count", { ascending: false })
      .limit(50)

    return (data ?? [])
      .filter(row => row.slug)
      .map(row => ({ slug: row.slug as string }))
  } catch {
    return []
  }
}

// ── Métadonnées dynamiques ────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getMagicClock(params.slug)
  if (!data) return { title: "Magic Clock" }

  const studio = (data.work as any)?.studio ?? {}
  const title = studio.title ?? data.title ?? "Magic Clock"
  const creator = data.creator_name ?? data.creator_handle ?? "Créateur"

  return {
    title: `${title} — ${creator} | Magic Clock`,
    description: `Découvre le Magic Clock de ${creator} sur magic-clock.com`,
    openGraph: {
      title: `${title} — ${creator}`,
      description: `Avant / Après coiffure par ${creator}`,
      images: data.after_url ? [{ url: data.after_url }] : [],
    },
  }
}

// ── Chargement des données ────────────────────────────────────────────────
async function getMagicClock(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data, error } = await supabase
    .from("magic_clocks")
    .select(`
      id, slug, title, gating_mode, ppv_price,
      before_url, after_url, work,
      creator_handle, creator_name,
      views_count, likes_count, saves_count, shares_count,
      rating_avg, rating_count,
      created_at, deleted_at
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle()

  if (error || !data) return null
  return data
}

// ── Page serveur ──────────────────────────────────────────────────────────
export default async function MagicClockPage({ params }: { params: { slug: string } }) {
  const raw = await getMagicClock(params.slug)
  if (!raw) notFound()

  const data = {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    gatingMode: raw.gating_mode as "FREE" | "SUB" | "PPV",
    ppvPrice: raw.ppv_price,
    creatorHandle: raw.creator_handle,
    creatorName: raw.creator_name,
    creatorAvatar: null,
    creatorBio: null,
    creatorFollowers: 0,
    beforeUrl: raw.before_url,
    afterUrl: raw.after_url,
    thumbnailUrl: raw.after_url,
    ratingAvg: raw.rating_avg,
    ratingCount: raw.rating_count ?? 0,
    creatorRatingAvg: null,
    viewsCount: raw.views_count ?? 0,
    likesCount: raw.likes_count ?? 0,
    hashtags: [],
  }

  return <MagicClockDetailClient clock={data} />
}
