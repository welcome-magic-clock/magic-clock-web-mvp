// app/display/[id]/page.tsx

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
    id?: string;
  };
};

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * 1) Presets en mémoire
 * 2) Sinon Supabase: magic_clocks.work.display (si publié)
 */
async function getDisplayForId(rawId: string): Promise<PreviewDisplay | null> {
  // 1) Presets
  const preset = DISPLAY_PRESETS[rawId];
  if (preset) return preset;

  // 2) Supabase
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("magic_clocks")
    .select("id, work")
    .eq("id", rawId)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("[Display] Erreur Supabase pour id", rawId, error);
    return null;
  }

  if (!data?.work) return null;

  const display = (data.work as any)?.display;

  if (!display || !Array.isArray(display.segments)) {
    console.warn(
      "[Display] Aucun display exploitable trouvé dans work.display pour magic_clock",
      rawId,
      { displayPreview: display },
    );
    return null;
  }

  return display as PreviewDisplay;
}

function DebugBox({
  params,
  id,
  supabaseMsg,
}: {
  params: PageProps["params"];
  id: string;
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
        id :
      </p>
      <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
        {id || "(vide)"}
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
  const idInput = typeof params?.id === "string" ? params.id : "";
  const rawId = safeDecodeURIComponent(idInput).trim();

  if (!rawId) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pb-28 sm:pt-10">
        <h1 className="text-2xl font-semibold">Magic Display introuvable</h1>
        <p className="mt-2 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">(vide)</code>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Tu es probablement arrivé sur <code>/display</code> sans identifiant.
        </p>

        <DebugBox
          params={params}
          id={rawId}
          supabaseMsg="[Supabase] id vide → pas d’appel"
        />
      </main>
    );
  }

  const display = await getDisplayForId(rawId);

  if (!display) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pb-28 sm:pt-10">
        <h1 className="text-2xl font-semibold">Magic Display introuvable</h1>

        <p className="mt-2 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            {rawId}
          </code>
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Si tu viens de publier ce Magic Clock, il est possible que{" "}
          <code>work.display</code> ne soit pas encore enregistré correctement.
        </p>

        <DebugBox
          params={params}
          id={rawId}
          supabaseMsg="[Supabase] Aucun display trouvé dans presets ou Supabase"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <MagicDisplayPreviewShell display={display} />
    </main>
  );
}
