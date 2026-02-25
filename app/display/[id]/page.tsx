// app/display/[id]/page.tsx

import { notFound } from "next/navigation";
import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

type PageProps = {
  params: {
    id: string;
  };
};

async function getDisplayForId(rawId: string): Promise<PreviewDisplay | null> {
  // 1) Presets (ours, tutos officiels, etc.)
  const preset = DISPLAY_PRESETS[rawId];
  if (preset) {
    return preset;
  }

  // 2) Supabase : Magic Clock publié
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
  const rawId = decodeURIComponent(params.id);

  // 🔍 Si jamais ça rebug, ce bloc nous dira tout
  const debugParams = JSON.stringify(params ?? {}, null, 2);

  if (!rawId) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        <p className="mb-2 text-sm text-slate-500">
          ← Retour à My Magic Clock
        </p>
        <h1 className="mb-2 text-xl font-semibold">
          Magic Display introuvable
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code>(vide)</code>
        </p>

        <section className="space-y-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          <h2 className="font-semibold">
            DEBUG (pour Amiral + Capitaine)
          </h2>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase text-slate-400">
              params :
            </div>
            <pre className="overflow-x-auto rounded-md bg-white p-2">
              {debugParams}
            </pre>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase text-slate-400">
              supabase :
            </div>
            <pre className="overflow-x-auto rounded-md bg-white p-2">
              [Supabase] rawId vide → pas d’appel
            </pre>
          </div>
        </section>
      </main>
    );
  }

  const display = await getDisplayForId(rawId);

  if (!display) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        <p className="mb-2 text-sm text-slate-500">
          ← Retour à My Magic Clock
        </p>
        <h1 className="mb-2 text-xl font-semibold">
          Magic Display introuvable
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :{" "}
          <code>{rawId}</code>
        </p>

        <section className="space-y-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          <h2 className="font-semibold">
            DEBUG (pour Amiral + Capitaine)
          </h2>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase text-slate-400">
              params :
            </div>
            <pre className="overflow-x-auto rounded-md bg-white p-2">
              {debugParams}
            </pre>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase text-slate-400">
              supabase :
            </div>
            <pre className="overflow-x-auto rounded-md bg-white p-2">
              [Supabase] Aucun display trouvé dans presets ou Supabase
            </pre>
          </div>
        </section>
      </main>
    );
  }

  // ✅ Cas OK : on a un display (preset ou Supabase)
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <MagicDisplayPreviewShell display={display} />
    </main>
  );
}
