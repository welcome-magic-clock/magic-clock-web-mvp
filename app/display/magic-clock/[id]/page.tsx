// app/magic-clock-display/[id]/page.tsx
//
// Route "propre" pour afficher / débugger un Magic Display.
// - URL : /magic-clock-display/:id
// - 3 cas :
//   1) preset en mémoire (Bear, etc.) → cube affiché
//   2) entrée Supabase avec work.display valide → cube affiché
//   3) sinon → page de debug (PAS de 404)

import Link from "next/link";
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

type DisplayLoadResult =
  | { kind: "preset"; id: string; display: PreviewDisplay }
  | {
      kind: "supabase";
      id: string;
      display: PreviewDisplay | null;
      row: any | null;
      message: string;
    }
  | { kind: "none"; id: string; message: string };

async function loadDisplay(id: string): Promise<DisplayLoadResult> {
  const rawId = decodeURIComponent(id ?? "");

  if (!rawId) {
    return {
      kind: "none",
      id: "(vide)",
      message: "id vide reçu dans params.id",
    };
  }

  // 1) Preset en mémoire (Bear & co)
  const preset = DISPLAY_PRESETS[rawId];
  if (preset) {
    return { kind: "preset", id: rawId, display: preset };
  }

  // 2) Recherche dans Supabase
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("magic_clocks")
      .select("id, slug, work")
      .eq("id", rawId)
      .limit(1);

    if (error) {
      return {
        kind: "supabase",
        id: rawId,
        display: null,
        row: null,
        message: `[Supabase] Erreur pour id=${rawId} : ${error.message}`,
      };
    }

    const row = (data ?? [])[0] as any | undefined;

    if (!row) {
      return {
        kind: "supabase",
        id: rawId,
        display: null,
        row: null,
        message: `[Supabase] Aucun enregistrement trouvé dans magic_clocks pour id=${rawId}`,
      };
    }

    const work = row.work ?? {};
    const display = (work as any).display;

    if (!display || !Array.isArray(display.segments)) {
      return {
        kind: "supabase",
        id: rawId,
        display: null,
        row,
        message:
          "[Supabase] Ligne trouvée, mais work.display est absent ou invalide. C’est normal tant que le Display n’est pas encore sauvegardé depuis l’éditeur.",
      };
    }

    return {
      kind: "supabase",
      id: rawId,
      display: display as PreviewDisplay,
      row,
      message: "[Supabase] Display trouvé dans work.display ✅",
    };
  } catch (err: any) {
    return {
      kind: "supabase",
      id: rawId,
      display: null,
      row: null,
      message: `[Supabase] Exception lors de la lecture : ${String(
        err?.message ?? err,
      )}`,
    };
  }
}

export default async function MagicClockDisplayPage({ params }: PageProps) {
  const result = await loadDisplay(params.id);

  const backLink = (
    <div className="mb-4">
      <Link
        href="/mymagic"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        ← Retour à My Magic Clock
      </Link>
    </div>
  );

  // 1) Preset (Bear)
  if (result.kind === "preset") {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        {backLink}
        <MagicDisplayPreviewShell display={result.display} />
      </main>
    );
  }

  // 2) Display valide venant de Supabase
  if (result.kind === "supabase" && result.display) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        {backLink}
        <MagicDisplayPreviewShell display={result.display} />
      </main>
    );
  }

  // 3) Pas de display exploitable → page de debug, mais on reste en 200 (pas de 404)
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6">
      {backLink}

      <h1 className="text-xl font-semibold sm:text-2xl">
        DEBUG Magic Display
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        Vue de debug pour comprendre pourquoi le Magic Display n&apos;apparaît
        pas encore. On est sur la route{" "}
        <code className="rounded bg-slate-100 px-1 py-[1px] text-xs">
          /magic-clock-display/[id]/page.tsx
        </code>
        .
      </p>

      <section className="mt-6 space-y-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-700">
        <div>
          <div className="mb-1 font-semibold uppercase text-slate-500">
            id reçu :
          </div>
          <pre className="overflow-x-auto rounded-md bg-white px-3 py-2">
            {result.id}
          </pre>
        </div>

        <div>
          <div className="mb-1 font-semibold uppercase text-slate-500">
            message :
          </div>
          <pre className="overflow-x-auto rounded-md bg-white px-3 py-2">
            {result.message}
          </pre>
        </div>

        {result.kind === "supabase" && (
          <div>
            <div className="mb-1 font-semibold uppercase text-slate-500">
              ligne Supabase (magic_clocks) :
            </div>
            <pre className="max-h-64 overflow-auto rounded-md bg-white px-3 py-2">
              {JSON.stringify(result.row, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
