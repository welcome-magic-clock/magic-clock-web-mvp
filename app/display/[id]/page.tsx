// app/display/[id]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

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
    id?: string; // le nom DOIT être "id" car le dossier est [id]
  };
};

/**
 * 1) Cherche d'abord un preset (Bear, etc.)
 * 2) Sinon, va chercher un Magic Clock publié dans Supabase et lit work.display
 */
async function getDisplayForId(rawId: string): Promise<PreviewDisplay | null> {
  if (!rawId) return null;

  // 1. Presets en mémoire
  const preset = DISPLAY_PRESETS[rawId];
  if (preset) return preset;

  // 2. Supabase
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("magic_clocks")
      .select("id, work")
      .eq("id", rawId)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("[Display] Supabase error for id", rawId, error);
      return null;
    }

    if (!data || !data.work) {
      return null;
    }

    const work = data.work as any;
    const display = work?.display;

    if (!display || !Array.isArray(display.segments)) {
      console.warn(
        "[Display] work.display absent ou invalide pour magic_clock",
        rawId,
      );
      return null;
    }

    return display as PreviewDisplay;
  } catch (err) {
    console.error("[Display] Exception Supabase", err);
    return null;
  }
}

export default async function DisplayPage({ params }: PageProps) {
  // ⚓️ IMPORTANT : on lit bien params.id (lié au dossier [id])
  const idParam =
    typeof params.id === "string" ? params.id.trim() : "";
  const rawId = idParam ? decodeURIComponent(idParam) : "";

  const display = await getDisplayForId(rawId);

  if (!display) {
    // Vue "Magic Display introuvable" + debug Amiral/Capitaine
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        <Link
          href="/mymagic"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          ← Retour à My Magic Clock
        </Link>

        <section className="mt-4 space-y-4">
          <header>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Magic Display introuvable
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Impossible de trouver un Display pour cet identifiant :{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                {rawId || "undefined"}
              </code>
            </p>
          </header>

          <p className="text-xs text-slate-500">
            Si tu viens de publier ce Magic Clock, il est possible que le Display
            n&apos;ait pas encore été correctement enregistré dans Supabase.
            On corrigera ça ensemble dans la suite.
          </p>

          <div className="mt-6 space-y-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-700">
            <p className="font-semibold">DEBUG (pour Amiral + Capitaine)</p>
            <p>
              <span className="font-semibold">params :</span>{" "}
              <code className="break-all">
                {JSON.stringify(params ?? {}, null, 2)}
              </code>
            </p>
            <p>
              <span className="font-semibold">Supabase :</span>{" "}
              <code>
                [Supabase] Aucun display trouvé dans presets ou Supabase
              </code>
            </p>
          </div>
        </section>
      </main>
    );
  }

  // ✅ Cas OK : on a un Display (preset ou DB)
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <MagicDisplayPreviewShell display={display} />
    </main>
  );
}
