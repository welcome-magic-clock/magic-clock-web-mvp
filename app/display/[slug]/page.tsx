// app/display/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
    slug: string;
  };
};

/**
 * 1) On regarde si le slug correspond à un preset (ex. mcw-onboarding-bear-001)
 * 2) Sinon on va chercher un Magic Clock publié dans Supabase (table magic_clocks)
 *    et on lit work.display.
 */
async function getDisplayForId(rawId: string): Promise<PreviewDisplay | null> {
  // 1) Presets en mémoire
  const preset = DISPLAY_PRESETS[rawId];
  if (preset) {
    return preset;
  }

  // 2) Lecture Supabase
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("magic_clocks")
    .select("id, work")
    .eq("id", rawId)
    .eq("is_published", true)
    .limit(1);

  if (error) {
    console.error("[Display] Erreur Supabase pour id", rawId, error);
    return null;
  }

  const row = (data ?? [])[0] as { id: string; work: any } | undefined;
  if (!row || !row.work) {
    return null;
  }

  const display = (row.work as any).display;

  if (!display || !Array.isArray(display.segments)) {
    console.warn(
      "[Display] Aucun display exploitable trouvé dans work.display pour magic_clock",
      rawId,
    );
    return null;
  }

  return display as PreviewDisplay;
}

export default async function DisplayPage({ params }: PageProps) {
  const debugParams = JSON.stringify(params ?? {}, null, 2);

  const rawId = decodeURIComponent(params.slug ?? "");

  if (!rawId) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 sm:pb-28">
        <h1 className="text-2xl font-semibold">Magic Display introuvable</h1>
        <p className="mt-2 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            (vide)
          </code>
        </p>

        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-xs text-slate-700">
          <h2 className="mb-2 font-semibold">
            DEBUG (pour Amiral + Capitaine)
          </h2>
          <p className="mb-1 font-mono text-[11px] uppercase text-slate-500">
            params :
          </p>
          <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
            {debugParams}
          </pre>
          <p className="mt-3 font-mono text-[11px] uppercase text-slate-500">
            supabase :
          </p>
          <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
            [Supabase] rawId vide → pas d’appel
          </pre>
        </section>
      </main>
    );
  }

  const display = await getDisplayForId(rawId);

  if (!display) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 sm:pb-28">
        <h1 className="text-2xl font-semibold">Magic Display introuvable</h1>
        <p className="mt-2 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            {rawId || "undefined"}
          </code>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Si tu viens de publier ce Magic Clock, il est possible que le Display
          n&apos;ait pas encore été correctement enregistré dans Supabase. On
          corrigera ça ensemble dans la suite.
        </p>

        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-xs text-slate-700">
          <h2 className="mb-2 font-semibold">
            DEBUG (pour Amiral + Capitaine)
          </h2>
          <p className="mb-1 font-mono text-[11px] uppercase text-slate-500">
            params :
          </p>
          <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
            {debugParams}
          </pre>
          <p className="mt-3 font-mono text-[11px] uppercase text-slate-500">
            Supabase :
          </p>
          <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
            [Supabase] Aucun display trouvé dans presets ou Supabase
          </pre>
        </section>
      </main>
    );
  }

  // ✅ Cas OK : on a un Display (preset ou venant de Supabase)
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <MagicDisplayPreviewShell display={display} />
    </main>
  );
}
