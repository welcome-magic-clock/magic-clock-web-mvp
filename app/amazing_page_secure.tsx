// app/page.tsx — Amazing · flux public
// ✅ Charge depuis Supabase — zéro email, identification par UUID

import { Suspense } from "react";
import { SearchToolbar } from "@/components/search/SearchToolbar";
import { supabaseAdmin } from "@/core/supabase/admin";
import { FEED } from "@/features/amazing/feed";
import type { FeedCard } from "@/core/domain/types";
import AmazingFeed from "@/features/amazing/AmazingFeed";

// ─────────────────────────────────────────────────────────────
// Charge les magic_clocks publiés
// Filtre : is_published = true
// Tri : plus récents en premier
// ─────────────────────────────────────────────────────────────
async function getAmazingFeed(): Promise<FeedCard[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("magic_clocks")
      .select(
        // ✅ Jamais d'email sélectionné — uniquement données publiques
        "id, slug, title, gating_mode, ppv_price, creator_handle, creator_name, work, created_at",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[Amazing] Feed error:", error.message);
      return FEED;
    }

    if (!data || data.length === 0) return FEED;

    const supabaseCards: FeedCard[] = data
      .map((row) => {
        const work = (row.work as any) ?? {};
        const studio = work.studio ?? {};

        // ✅ URLs CDN R2 — chemin par userId (jamais par email)
        //    Format : cdn.magic-clock.com/studio/{timestamp}.webp
        //    (le userId est encodé dans le chemin lors de l'upload R2)
        const beforeUrl: string | null =
          typeof studio.beforeUrl === "string" && studio.beforeUrl
            ? studio.beforeUrl
            : null;
        const afterUrl: string | null =
          typeof studio.afterUrl === "string" && studio.afterUrl
            ? studio.afterUrl
            : null;

        // Carte incomplète (pas encore d'images R2) → skip
        if (!beforeUrl && !afterUrl) return null;

        const title = (typeof row.title === "string" && row.title)
          ? row.title
          : studio.title ?? "Magic Clock";

        const handle = row.creator_handle ?? "magic_clock";
        const creatorName = row.creator_name ?? handle;
        const mode = row.gating_mode ?? "FREE";
        const access = mode === "PPV" ? "PPV" : mode === "SUB" ? "ABO" : "FREE";
        const hashtags: string[] = Array.isArray(studio.hashtags)
          ? studio.hashtags
          : Array.isArray(work.hashtags) ? work.hashtags : [];

        return {
          id: row.slug ?? row.id,      // slug en priorité pour les URLs
          title,
          image: afterUrl ?? beforeUrl ?? "",
          beforeUrl,
          afterUrl,
          user: handle,
          access: access as "FREE" | "ABO" | "PPV",
          views: 0,
          likes: 0,
          creatorName,
          creatorHandle: handle.startsWith("@") ? handle : `@${handle}`,
          hashtags,
          // ✅ Métadonnées pour MediaCard (lien Display)
          slug: row.slug,
          magicClockId: row.id,
        } satisfies FeedCard & { slug?: string | null; magicClockId?: string };
      })
      .filter(Boolean) as FeedCard[];

    // Nouveaux créateurs en tête, contenu de démo en fin
    return [...supabaseCards, ...FEED];

  } catch (err) {
    console.error("[Amazing] Unexpected error:", err);
    return FEED;
  }
}

// ─────────────────────────────────────────────────────────────
export default async function AmazingPage() {
  const feed = await getAmazingFeed();

  return (
    <Suspense fallback={null}>
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        <SearchToolbar variant="amazing" />
        <header className="mb-4 sm:mb-6">
          <h1 className="text-xl font-semibold sm:text-2xl">Amazing · flux public</h1>
          <p className="mt-2 text-sm text-slate-600">
            Découvre les meilleurs Magic Clock : transformations, techniques et
            contenus pédagogiques beauté. Sur mobile, chaque carte est pensée
            comme un mini Reel vertical.
          </p>
        </header>
        <p className="mb-4 text-sm text-slate-500">{feed.length} transformations trouvées.</p>
        <AmazingFeed feed={feed} />
      </main>
    </Suspense>
  );
}
