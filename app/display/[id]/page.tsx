// app/display/[id]/page.tsx
//
// Affichage d’un Magic Display à partir d’un identifiant.
//
// 1) Si l'id correspond à un preset (ex : mcw-onboarding-bear-001)
//    → on affiche ce preset directement.
// 2) Sinon, on cherche dans Supabase (table `magic_clocks`) et on lit work.display
//    (ou quelques variantes possibles).
// 3) Si on ne trouve toujours rien, on retombe sur l’ancien comportement
//    avec MagicDisplayViewer + findContentById, SANS 404.
// 4) Si vraiment rien n’est trouvable, on affiche un petit message explicite.
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

// ⚠️ Important : on supporte à la fois id ET displayId
// (au cas où le dossier aurait été renommé).
type PageProps = {
  params: { id?: string; displayId?: string };
};

async function loadDisplayFromSupabase(
  id: string,
): Promise<PreviewDisplay | null> {
  if (!id) {
    console.warn("[Display] loadDisplayFromSupabase appelé sans id");
    return null;
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("magic_clocks")
      .select("id, work")
      .eq("id", id)
      .limit(1);

    if (error) {
      console.error("[Display] Erreur Supabase pour id", id, error);
      return null;
    }

    const row = (data ?? [])[0] as { id: string; work: any } | undefined;
    if (!row) {
      console.warn("[Display] Aucune ligne magic_clocks pour id", id);
      return null;
    }

    const work = row.work ?? {};

    // Petit log de debug (tu le verras dans la console browser ou Vercel)
    try {
      console.log(
        "[Display] work pour id",
        id,
        JSON.stringify(work).slice(0, 300),
      );
    } catch {
      // pas grave si JSON.stringify plante
    }

    // On teste plusieurs chemins possibles
    const display =
      (work as any).display ??
      (work as any).previewDisplay ??
      (work as any).magicDisplay ??
      null;

    if (!display) {
      console.warn(
        "[Display] Aucun display exploitable trouvé dans work.* pour magic_clock",
        id,
      );
      return null;
    }

    // On fait confiance au typage PreviewDisplay côté front
    return display as PreviewDisplay;
  } catch (err) {
    console.error(
      "[Display] Exception pendant la lecture Supabase pour id",
      id,
      err,
    );
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  // On récupère le paramètre, quel que soit le nom du dossier ([id] ou [displayId])
  const paramValue = params.id ?? params.displayId ?? "";
  const rawId = paramValue ? decodeURIComponent(paramValue) : "";

  console.log("[Display] Page ouverte avec rawId =", rawId);

  // 1) Presets en mémoire (ours onboarding, etc.)
  const preset = rawId ? DISPLAY_PRESETS[rawId] : undefined;
  if (preset) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        <MagicDisplayPreviewShell display={preset} />
      </main>
    );
  }

  // 2) Essai via Supabase
  const supaDisplay = rawId ? await loadDisplayFromSupabase(rawId) : null;
  if (supaDisplay) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        <MagicDisplayPreviewShell display={supaDisplay} />
      </main>
    );
  }

  // 3) Fallback : ancien comportement (contenus "static" du repo)
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
      </main>
    );
  }

  // 4) Dernier secours : pas de preset, pas de Supabase, pas de legacy → message propre
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
    </main>
  );
}
