// app/api/magic-clocks/create/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";

function makeSlugFromTitle(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const suffix = Date.now().toString(36);
  return `${base || "magic-clock"}-${suffix}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Pour debug dans les logs Vercel si besoin
    console.log("[MagicClock] /api/magic-clocks/create body", body);

    const {
      // nouveau contrat côté client
      id,
      title,
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

      // compat ancien contrat
      gatingMode,
      work,
      slug,
      payload,
    } = body ?? {};

    // 1) Titre
    const finalTitle = (
      title ??
      studio?.title ??
      work?.title ??
      ""
    )
      .toString()
      .trim();

    if (!finalTitle) {
      return NextResponse.json(
        { ok: false, error: "Missing title" },
        { status: 400 },
      );
    }

    // 2) Mode / gating
    const finalMode = (mode ??
      gatingMode ??
      studio?.mode ??
      work?.mode ??
      "FREE") as "FREE" | "PPV" | "SUB";

    // 3) Slug généré côté serveur
    const finalSlug = slug ?? makeSlugFromTitle(finalTitle);

    // 4) Hashtags
    const finalHashtags: string[] =
      (hashtags as string[] | undefined) ??
      (studio?.hashtags as string[] | undefined) ??
      (work?.hashtags as string[] | undefined) ??
      [];

    // 5) Bloc studio
    const studioBlock =
      studio ??
      work?.studio ?? {
        title: finalTitle,
        mode: finalMode,
        ppvPrice: finalMode === "PPV" ? ppvPrice ?? null : null,
        hashtags: finalHashtags,
        beforeUrl,
        afterUrl,
        beforeCoverTime,
        afterCoverTime,
      };

    // 6) Work complet à stocker en JSON
    const fullWork =
      work ??
      payload ?? {
        id: id ?? null,
        title: finalTitle,
        mode: finalMode,
        hashtags: finalHashtags,
        studio: studioBlock,
        display: display ?? null,
        progress: progress ?? null,
      };

    // 7) Insert Supabase
    const { data, error } = await supabaseAdmin
      .from("magic_clocks")
      .insert({
        title: finalTitle,
        slug: finalSlug,
        gating_mode: finalMode,
        work: fullWork,
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
