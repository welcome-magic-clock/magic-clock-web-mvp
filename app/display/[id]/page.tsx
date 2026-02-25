// app/display/[id]/page.tsx
//
// Affichage d’un Magic Display à partir d’un identifiant.
//
// 1) Si l'id correspond à un preset (ex : mcw-onboarding-bear-001)
//    → on affiche ce preset directement.
// 2) Sinon, on cherche dans Supabase (table `magic_clocks`) et on lit work.display
//    (ou quelques variantes possibles).
// 3) Si on ne trouve toujours rien, on retombe sur l’ancien comportement
//    avec MagicDisplayViewer + findContentById.
// 4) Si vraiment rien n’est trouvable, on affiche un message explicite
//    + un bloc DEBUG pour t’aider à voir ce qui se passe.
//

import type { Metadata } from "next";
import Link from "next/link";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import { findContentById } from "@/core/domain/repository";
import MagicDisplayViewer from "../MagicDisplayViewer";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

export const metadata: Metadata = {
  title: "Magic Display",
};

// On garde les deux pour être 100% safe (id ou displayId)
type PageProps = {
  params: { id?: string; displayId?: string };
};

type SupabaseDisplayResult = {
  display: PreviewDisplay | null;
  debug: string;
};

async function loadDisplayFromSupabase(id: string): Promise<SupabaseDisplayResult> {
  if (!id) {
    return {
      display: null,
      debug: "[Supabase] id vide → requête non envoyée",
    };
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("magic_clocks")
      .select("id, work")
      .eq("id", id)
      .limit(1);

    if (error) {
      return {
        display: null,
        debug: `[Supabase] Erreur pour id ${id} : ${error.message}`,
      };
    }

    const row = (data ?? [])[0] as { id: string; work: any } | undefined;
    if (!row) {
      return {
        display: null,
        debug: `[Supabase] Aucune ligne magic_clocks pour id ${id}`,
      };
    }

    const work = row.work ?? {};
    const workKeys = Object.keys(work || {});

    const display =
      (work as any).display ??
      (work as any).previewDisplay ??
      (work as any).magicDisplay ??
      null;

    if (!display) {
      return {
        display: null,
        debug: `[Supabase] Ligne trouvée pour id ${id}, mais aucun display dans work.display / work.previewDisplay / work.magicDisplay (keys: ${workKeys.join(
          ", ",
        ) || "aucune"})`,
      };
    }

    return {
      display: display as PreviewDisplay,
      debug: `[Supabase] Display trouvé dans work.display (ou équivalent) pour id ${id}`,
    };
  } catch (err: any) {
    return {
      display: null,
      debug: `[Supabase] Exception pour id ${id} : ${String(err?.message ?? err)}`,
    };
  }
}

export default async function Page(props: PageProps) {
  const params = props?.params ?? {};
  const paramValue = params.id ?? params.displayId ?? "";
  const rawId = paramValue ? decodeURIComponent(paramValue) : "";

  // On prépare déjà les infos debug
  const debugParams = JSON.stringify(params, null, 2);

  // 1) Presets (ours onboarding, etc.)
  const preset = rawId ? DISPLAY_PRESETS[rawId] : undefined;
  if (preset) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        <MagicDisplayPreviewShell display={preset} />

        <section className="mt-8 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">DEBUG</h2>
          <p>Preset trouvé pour id : <code className="px-1">{rawId}</code></p>
          <p className="mt-2">params :</p>
          <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2">
{debugParams}
          </pre>
        </section>
      </main>
    );
  }

  // 2) Essai via Supabase
  const supaResult = rawId
    ? await loadDisplayFromSupabase(rawId)
    : { display: null, debug: "[Supabase] rawId vide → pas d’appel" };

  if (supaResult.display) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        <MagicDisplayPreviewShell display={supaResult.display} />

        <section className="mt-8 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">DEBUG</h2>
          <p>
            Display chargé depuis Supabase pour id{" "}
            <code className="px-1">{rawId}</code>
          </p>
          <p className="mt-2">params :</p>
          <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2">
{debugParams}
          </pre>
          <p className="mt-2">supabase :</p>
          <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2">
{supaResult.debug}
          </pre>
        </section>
      </main>
    );
  }

  // 3) Fallback legacy : contenus "static" (findContentById)
  const content = rawId ? findContentById(rawId) : null;
  if (content) {
    const title = content.title ?? `Magic Display #${rawId}`;
    const subtitle =
      "Visualisation pédagogique liée à ce Magic Clock. Bientôt, cette page affichera les formules, sections, temps de pose, etc.";

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
            <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          </header>

          <MagicDisplayViewer contentId={content.id} />
        </section>

        <section className="mt-8 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">DEBUG</h2>
          <p>
            Contenu trouvé via <code>findContentById</code> pour id{" "}
            <code className="px-1">{rawId}</code>
          </p>
          <p className="mt-2">params :</p>
          <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2">
{debugParams}
          </pre>
          <p className="mt-2">supabase :</p>
          <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2">
{supaResult.debug}
          </pre>
        </section>
      </main>
    );
  }

  // 4) Rien trouvé → message + DEBUG complet
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
      <Link
        href="/mymagic"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        ← Retour à My Magic Clock
      </Link>

      <section className="mt-6 space-y-3">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Magic Display introuvable
        </h1>
        <p className="text-sm text-slate-600">
          Impossible de trouver un Display pour cet identifiant :
          <br />
          <code className="mt-1 inline-block rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">
            {rawId || "(vide)"}
          </code>
        </p>
        <p className="text-xs text-slate-500">
          Si tu viens de publier ce Magic Clock, il est possible que le Display
          n&apos;ait pas encore été correctement enregistré dans Supabase. On
          corrigera ça ensemble dans la suite.
        </p>
      </section>

      <section className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
        <h2 className="mb-2 text-sm font-semibold text-slate-800">
          DEBUG (pour Amiral + Capitaine)
        </h2>

        <p className="font-medium">params :</p>
        <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2">
{debugParams}
        </pre>

        <p className="mt-3 font-medium">supabase :</p>
        <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2">
{supaResult.debug}
        </pre>
      </section>
    </main>
  );
}
