// app/api/magic-clocks/create/route.ts
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
  if (typeof url !== "string") return null;
  if (!url) return null;
  if (url.startsWith("data:") || url.startsWith("blob:")) return null;
  return url;
}

export async function POST(req: Request) {
  try {
    // ✅ 1) Auth — récupérer le vrai user connecté
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // ✅ 2) Récupérer le vrai profil du créateur
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("handle, display_name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { ok: false, error: "Profil introuvable" },
        { status: 404 }
      );
    }

    const body = (await req.json().catch(() => ({}))) ?? {};

    const {
      id, title, slug, mode, hashtags, ppvPrice,
      beforeUrl, afterUrl, beforeCoverTime, afterCoverTime,
      studio, display, progress, payload,
      gatingMode, work,
    } = body as any;

    // 3) Titre obligatoire
    const rawTitle =
      title ?? studio?.title ?? work?.title ?? payload?.title ?? "Magic Clock";
    const finalTitle = String(rawTitle).trim();
    if (!finalTitle) {
      return NextResponse.json(
        { ok: false, error: "Missing title" },
        { status: 400 }
      );
    }

    // 4) Mode / gating
    const finalMode: "FREE" | "SUB" | "PPV" =
      gatingMode ?? mode ?? studio?.mode ?? work?.mode ?? payload?.mode ?? "FREE";

    // 5) Hashtags
    const finalHashtags: string[] = Array.isArray(hashtags)
      ? hashtags
      : Array.isArray(studio?.hashtags) ? studio.hashtags
      : Array.isArray(work?.hashtags) ? work.hashtags
      : Array.isArray(payload?.hashtags) ? payload.hashtags
      : [];

    // 6) Prix PPV
    const finalPpvPrice =
      finalMode === "PPV"
        ? ppvPrice ?? studio?.ppvPrice ?? work?.ppvPrice ?? payload?.ppvPrice ?? null
        : null;

    // ✅ 7) Validation PPV — prix obligatoire si mode PPV
    if (finalMode === "PPV" && (!finalPpvPrice || finalPpvPrice <= 0)) {
      return NextResponse.json(
        { ok: false, error: "Prix PPV obligatoire et doit être > 0" },
        { status: 400 }
      );
    }

    // 8) Studio "light"
    const finalStudio = {
      title: finalTitle,
      mode: finalMode,
      hashtags: finalHashtags,
      ppvPrice: finalPpvPrice,
      beforeUrl:
        sanitizeUrl(beforeUrl) ?? sanitizeUrl(studio?.beforeUrl) ??
        sanitizeUrl(work?.studio?.beforeUrl) ?? sanitizeUrl(payload?.studio?.beforeUrl),
      afterUrl:
        sanitizeUrl(afterUrl) ?? sanitizeUrl(studio?.afterUrl) ??
        sanitizeUrl(work?.studio?.afterUrl) ?? sanitizeUrl(payload?.studio?.afterUrl),
      beforeCoverTime:
        beforeCoverTime ?? studio?.beforeCoverTime ??
        work?.studio?.beforeCoverTime ?? payload?.studio?.beforeCoverTime ?? null,
      afterCoverTime:
        afterCoverTime ?? studio?.afterCoverTime ??
        work?.studio?.afterCoverTime ?? payload?.studio?.afterCoverTime ?? null,
    };

    // 9) Display & progress
    const finalDisplay = display ?? work?.display ?? payload?.display ?? null;
    const finalProgress = progress ?? work?.progress ?? payload?.progress ?? null;

    // 10) Slug
    const existingSlug = slug ?? work?.slug ?? payload?.slug ?? id ?? null;
    const base = slugify(finalTitle) || "magic-clock";
    const finalSlug =
      typeof existingSlug === "string" && existingSlug.trim()
        ? existingSlug.trim()
        : `${base}-${Date.now().toString(36)}`;

    // ✅ 11) Vérifier que le slug n'existe pas déjà
    const { data: existing } = await supabaseAdmin
      .from("magic_clocks")
      .select("id")
      .eq("slug", finalSlug)
      .single();

    const uniqueSlug = existing
      ? `${finalSlug}-${Date.now().toString(36)}`
      : finalSlug;

    // 12) Work complet
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

    // ✅ 13) Insertion avec le vrai créateur
    const { data, error } = await supabaseAdmin
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
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("[Magic Clock] Supabase insert error", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data.id, slug: data.slug });

  } catch (error: any) {
    console.error("[Magic Clock] POST /api/magic-clocks/create failed", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
