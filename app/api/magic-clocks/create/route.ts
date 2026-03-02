// app/api/magic-clocks/create/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";

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
  // on évite d’enregistrer les data: / blob:
  if (url.startsWith("data:") || url.startsWith("blob:")) return null;
  return url;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) ?? {};

    // On accepte l’ancien ET le nouveau format
    const {
      // nouveau format MagicDisplayClient
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

      // ancien format (si jamais encore utilisé quelque part)
      gatingMode,
      work,
    } = body as any;

    // 1) Titre obligatoire (mais on va le chercher partout)
    const rawTitle =
      title ??
      studio?.title ??
      work?.title ??
      payload?.title ??
      "Magic Clock";

    const finalTitle = String(rawTitle).trim();
    if (!finalTitle) {
      return NextResponse.json(
        { ok: false, error: "Missing title" },
        { status: 400 },
      );
    }

    // 2) Mode / gating
    const finalMode: "FREE" | "SUB" | "PPV" =
      gatingMode ??
      mode ??
      studio?.mode ??
      work?.mode ??
      payload?.mode ??
      "FREE";

    // 3) Hashtags
    const finalHashtags: string[] =
      Array.isArray(hashtags)
        ? hashtags
        : Array.isArray(studio?.hashtags)
        ? studio.hashtags
        : Array.isArray(work?.hashtags)
        ? work.hashtags
        : Array.isArray(payload?.hashtags)
        ? payload.hashtags
        : [];

    // 4) Prix PPV
    const finalPpvPrice =
      finalMode === "PPV"
        ? ppvPrice ??
          studio?.ppvPrice ??
          work?.ppvPrice ??
          payload?.ppvPrice ??
          null
        : null;

    // 5) Studio “light” (pour reconstruction éventuelle)
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
        beforeCoverTime ??
        studio?.beforeCoverTime ??
        work?.studio?.beforeCoverTime ??
        payload?.studio?.beforeCoverTime ??
        null,
      afterCoverTime:
        afterCoverTime ??
        studio?.afterCoverTime ??
        work?.studio?.afterCoverTime ??
        payload?.studio?.afterCoverTime ??
        null,
    };

    // 6) Display & progress (optionnels)
    const finalDisplay = display ?? work?.display ?? payload?.display ?? null;
    const finalProgress = progress ?? work?.progress ?? payload?.progress ?? null;

    // 7) Slug
    const existingSlug =
      slug ?? work?.slug ?? payload?.slug ?? id ?? null;

    const base = slugify(finalTitle) || "magic-clock";
    const finalSlug =
      typeof existingSlug === "string" && existingSlug.trim()
        ? existingSlug.trim()
        : `${base}-${Date.now().toString(36)}`;

    // 8) Work complet stocké dans la colonne JSON
    const fullWork =
      work ??
      payload ?? {
        id: id ?? null,
        slug: finalSlug,
        title: finalTitle,
        mode: finalMode,
        hashtags: finalHashtags,
        studio: finalStudio,
        display: finalDisplay,
        progress: finalProgress,
        createdAt: new Date().toISOString(),
      };

    // 9) Insertion Supabase
    const { data, error } = await supabaseAdmin
      .from("magic_clocks")
      .insert({
        title: finalTitle,
        slug: finalSlug,
        gating_mode: finalMode,
        work: fullWork,
        // pour l’instant on fixe toujours Aiko
        creator_handle: "aiko_tanaka",
        creator_name: "Aiko Tanaka",
        is_published: true,
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("[Magic Clock] Supabase insert error", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      slug: data.slug,
    });
  } catch (error: any) {
    console.error(
      "[Magic Clock] POST /api/magic-clocks/create failed",
      error,
    );
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
