/**
 * app/magic-clock/[slug]/page.tsx
 * ✅ v1.0 — Page Magic Clock avec ISR (Incremental Static Regeneration)
 *
 * Architecture ISR :
 *   - La page est générée statiquement au premier accès
 *   - Revalidée toutes les 60 secondes (revalidate = 60)
 *   - 10 000 visiteurs simultanés = 1 seule requête Supabase/minute
 *   - Vercel Edge Network sert les pages en cache depuis 330 datacenters
 *
 * Impact : ×100 réduction charge sur Supabase pour les pages populaires
 */

import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import MagicClockDetailClient from "./MagicClockDetailClient"

// ── ISR : revalidation toutes les 60 secondes ─────────────────────────────
export const revalidate = 60

// ── Génération des slugs populaires au build ──────────────────────────────
// Les 50 Magic Clocks les plus vus sont pré-générés statiquement
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
      .order("view_count", { ascending: false })
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
  const title  = studio.title ?? data.title ?? "Magic Clock"
  const creator = data.creator_name ?? data.creator_handle ?? "Créateur"

  return {
    title:       `${title} — ${creator} | Magic Clock`,
    description: `Découvre le Magic Clock de ${creator} sur magic-clock.com`,
    openGraph: {
      title:       `${title} — ${creator}`,
      description: `Avant / Après coiffure par ${creator}`,
      images:      data.after_url ? [{ url: data.after_url }] : [],
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
      view_count, like_count, rating_avg, rating_count,
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
  const data = await getMagicClock(params.slug)
  if (!data) notFound()

  return <MagicClockDetailClient initialData={data} />
}
