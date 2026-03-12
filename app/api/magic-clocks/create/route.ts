// app/api/magic-clocks/create/route.ts
// ✅ Sécurité : user.id (UUID) uniquement — jamais d'email en BDD
// ✅ v2 — before_url / after_url insérés en colonnes dédiées pour le feed Amazing
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeUrl(url: unknown): string | null {
  if (typeof url !== "string" || !url) return null;
  // ✅ Jamais de blob: ou data: en base — uniquement des URLs CDN permanentes
  if (url.startsWith("data:") || url.startsWith("blob:")) return null;
  return url;
}

export async function POST(req: Request) {
  try {
    // ✅ Auth — UUID uniquement
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (list: { name: string; value: string; options?: any }[]) =>
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            ),
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    // ✅ Profil : handle + display_name uniquement — jamais l'email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("handle, display_name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ ok: false, error: "Profil introuvable" }, { status: 404 });
    }

    const body = (await req.json().catch(() => ({}))) ?? {};
    const {
      id,
      title,
      slug,
      mode,
      hashtags,
      ppvPrice,
      beforeUrl,
      afterUrl,
      beforeCoverTime,
      afterCoverTime,
      studio,
      display,
      progress,
      payload,
      gatingMode,
      work,
    } = body as any;

    // Titre
    const rawTitle = title ?? studio?.title ?? work?.title ?? payload?.title ?? "Magic Clock";
    const finalTitle = String(rawTitle).trim();
    if (!finalTitle)
      return NextResponse.json({ ok: false, error: "Missing title" }, { status: 400 });

    // Mode
    const finalMode: "FREE" | "SUB" | "PPV" =
      gatingMode ?? mode ?? studio?.mode ?? work?.mode ?? payload?.mode ?? "FREE";

    // Hashtags
    const finalHashtags: string[] = Array.isArray(hashtags)
      ? hashtags
      : Array.isArray(studio?.hashtags)
      ? studio.hashtags
      : Array.isArray(work?.hashtags)
      ? work.hashtags
      : Array.isArray(payload?.hashtags)
      ? payload.hashtags
      : [];

    // PPV
    const finalPpvPrice =
      finalMode === "PPV"
        ? (ppvPrice ?? studio?.ppvPrice ?? work?.ppvPrice ?? payload?.ppvPrice ?? null)
        : null;

    if (finalMode === "PPV" && (!finalPpvPrice || finalPpvPrice <= 0)) {
      return NextResponse.json(
        { ok: false, error: "Prix PPV obligatoire > 0" },
        { status: 400 },
      );
    }

    // Studio — URLs CDN uniquement (sanitizeUrl rejette blob: et data:)
    const finalStudio = {
      title: finalTitle,
      mode: finalMode,
      hashtags: finalHashtags,
      ppvPrice: finalPpvPrice,
      beforeUrl:
        sanitizeUrl(beforeUrl) ??
        sanitizeUrl(studio?.beforeUrl) ??
        sanitizeUrl(work?.studio?.beforeUrl) ??
        sanitizeUrl(payload?.studio?.beforeUrl),
      afterUrl:
        sanitizeUrl(afterUrl) ??
        sanitizeUrl(studio?.afterUrl) ??
        sanitizeUrl(work?.studio?.afterUrl) ??
        sanitizeUrl(payload?.studio?.afterUrl),
      beforeCoverTime:
        beforeCoverTime ?? studio?.beforeCoverTime ?? work?.studio?.beforeCoverTime ?? null,
      afterCoverTime:
        afterCoverTime ?? studio?.afterCoverTime ?? work?.studio?.afterCoverTime ?? null,
    };

    // ✅ URLs dédiées pour le feed Amazing (colonnes before_url / after_url)
    const finalBeforeUrl = finalStudio.beforeUrl ?? null;
    const finalAfterUrl = finalStudio.afterUrl ?? null;

    // Display & progress
    const finalDisplay = display ?? work?.display ?? payload?.display ?? null;
    const finalProgress = progress ?? work?.progress ?? payload?.progress ?? null;

    // Slug unique
    const base = slugify(finalTitle) || "magic-clock";
    const rawSlug = slug ?? work?.slug ?? payload?.slug ?? id ?? null;
    const candidateSlug =
      typeof rawSlug === "string" && rawSlug.trim()
        ? rawSlug.trim()
        : `${base}-${Date.now().toString(36)}`;

    const { data: existing } = await supabaseAdmin
      .from("magic_clocks")
      .select("id")
      .eq("slug", candidateSlug)
      .maybeSingle();

    const uniqueSlug = existing ? `${candidateSlug}-${Date.now().toString(36)}` : candidateSlug;

    // Work
    const fullWork = work ?? payload ?? {
      id: id ?? null,
      slug: uniqueSlug,
      title: finalTitle,
      mode: finalMode,
      hashtags: finalHashtags,
      studio: finalStudio,
      display: finalDisplay,
      progress: finalProgress,
      createdAt: new Date().toISOString(),
    };

    // ✅ INSERT — user_id UUID + handle public + before_url/after_url en colonnes dédiées
    // JAMAIS d'email en base de données
    const { data, error } = await supabaseAdmin
      .from("magic_clocks")
      .insert({
        title: finalTitle,
        slug: uniqueSlug,
        gating_mode: finalMode,
        ppv_price: finalPpvPrice,
        work: fullWork,
        user_id: user.id,          // ✅ UUID auth
        creator_handle: profile.handle,   // ✅ handle public
        creator_name: profile.display_name ?? profile.handle,
        is_published: true,
        // ✅ FIX v2 : colonnes dédiées pour le feed Amazing
        before_url: finalBeforeUrl,
        after_url: finalAfterUrl,
      })
      .select("id, slug")
      .single();

    if (error) {
      // Si user_id n'existe pas encore (avant migration), retry sans
      if (error.code === "42703") {
        const { data: data2, error: error2 } = await supabaseAdmin
          .from("magic_clocks")
          .insert({
            title: finalTitle,
            slug: uniqueSlug,
            gating_mode: finalMode,
            ppv_price: finalPpvPrice,
            work: fullWork,
            creator_handle: profile.handle,
            creator_name: profile.display_name ?? profile.handle,
            is_published: true,
            before_url: finalBeforeUrl,
            after_url: finalAfterUrl,
          })
          .select("id, slug")
          .single();

        if (error2) {
          console.error("[Magic Clock] Insert error (no user_id):", error2);
          return NextResponse.json({ ok: false, error: error2.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true, id: data2.id, slug: data2.slug });
      }

      console.error("[Magic Clock] Insert error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
  } catch (error: any) {
    console.error("[Magic Clock] Unexpected error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
