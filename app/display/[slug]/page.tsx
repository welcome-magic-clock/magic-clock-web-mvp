// app/display/[slug]/page.tsx

import type { Metadata } from "next";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

export const metadata: Metadata = {
  title: "Magic Display",
};

type PageProps = {
  params: {
    slug?: string;
  };
};

/**
 * Decode "safe" (évite throw si string mal encodée)
 */
function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * 1) Presets (en mémoire)
 * 2) Supabase (magic_clocks.work.display)
 */
async function getDisplayForSlug(rawSlug: string): Promise<PreviewDisplay | null> {
  // 1) Preset
  const preset = DISPLAY_PRESETS[rawSlug];
  if (preset) return preset;

  // 2) Supabase
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("magic_clocks")
    .select("id, work")
    .eq("id", rawSlug)
    .eq("is_published", true)
    .single();

  // .single() renvoie error si 0 ligne OU >1 ligne (ce qui est bien pour debug)
  if (error) {
    console.error("[Display] Supabase error for id:", rawSlug, error);
    return null;
  }

  if (!data?.work) return null;

  const display = (data.work as any)?.display;

  if (!display || !Array.isArray(display.segments)) {
    console.warn(
      "[Display] work.display invalide ou segments manquants pour id:",
      rawSlug,
      { displayPreview: display }
    );
    return null;
  }

  return display as PreviewDisplay;
}

function DebugBox({
  params,
  slug,
  supabaseMsg,
}: {
  params: PageProps["params"];
  slug: string;
  supabaseMsg: string;
}) {
  const debugParams = JSON.stringify(params ?? {}, null, 2);

  return (
    <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-xs text-slate-700">
      <h2 className="mb-2 font-semibold">DEBUG (pour Amiral + Capitaine)</h2>

      <p className="mb-1 font-mono text-[11px] uppercase text-slate-500">
        params :
      </p>
      <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
        {debugParams}
      </pre>

      <p className="mt-3 mb-1 font-mono text-[11px] uppercase text-slate-500">
        slug :
      </p>
      <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
        {slug || "(vide)"}
      </pre>

      <p className="mt-3 mb-1 font-mono text-[11px] uppercase text-slate-500">
        supabase :
      </p>
      <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
        {supabaseMsg}
      </pre>
    </section>
  );
}

export default async function DisplayPage({ params }: PageProps) {
  // 1) Normalisation du slug (robuste)
  const slugInput = typeof params?.slug === "string" ? params.slug : "";
  const rawSlug = safeDecodeURIComponent(slugInput).trim();

  // 2) Cas "slug vide" : généralement navigation vers /display (sans id)
  if (!rawSlug) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pb-28 sm:pt-10">
        <h1 className="text-2xl font-semibold">Magic Display introuvable</h1>
        <p className="mt-2 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">(vide)</code>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Tu es probablement arrivé sur <code>/display</code> sans identifiant.
          Retourne dans <strong>My Magic Clock</strong> et clique sur la flèche ↗
          d’un contenu publié.
        </p>

        <DebugBox
          params={params}
          slug={rawSlug}
          supabaseMsg="[Supabase] slug vide → pas d’appel"
        />
      </main>
    );
  }

  // 3) Load display
  const display = await getDisplayForSlug(rawSlug);

  if (!display) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pb-28 sm:pt-10">
        <h1 className="text-2xl font-semibold">Magic Display introuvable</h1>

        <p className="mt-2 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            {rawSlug}
          </code>
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Si tu viens de publier ce Magic Clock, il est possible que{" "}
          <code>work.display</code> ne soit pas encore enregistré correctement.
          On corrige ça ensemble.
        </p>

        <DebugBox
          params={params}
          slug={rawSlug}
          supabaseMsg="[Supabase] Aucun display trouvé dans presets ou Supabase"
        />
      </main>
    );
  }

  // 4) OK
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <MagicDisplayPreviewShell display={display} />
    </main>
  );
}
