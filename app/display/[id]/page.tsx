// app/display/[id]/page.tsx
//
// Affichage d’un Magic Display à partir d’un identifiant.
//
// 1) Si l'id correspond à un preset (ex : mcw-onboarding-bear-001)
//    → on affiche ce preset directement dans MagicDisplayPreviewShell.
// 2) Sinon, on cherche dans Supabase (table `magic_clocks`) et on lit `work.display`.
// 3) Si on ne trouve toujours rien, on retombe sur l’ancien comportement
//    avec MagicDisplayViewer + findContentById, au lieu d’un 404 brutal.
//

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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

// ⚠️ Très important : le segment du dossier est [id],
// donc Next nous fournit bien params.id (et pas displayId).
type PageProps = {
  params: { id: string };
};

// Petite aide pour lire proprement Supabase
async function loadDisplayFromSupabase(
  id: string,
): Promise<PreviewDisplay | null> {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("magic_clocks")
      .select("id, work")
      .eq("id", id)
      // Pour l’instant on ne filtre PAS sur is_published,
      // pour éviter de rater un Display à cause d’un flag incorrect.
      .limit(1);

    if (error) {
      console.error("[Display] Erreur Supabase pour id", id, error);
      return null;
    }

    const row = (data ?? [])[0] as { id: string; work: any } | undefined;
    if (!row || !row.work) {
      return null;
    }

    const display = (row.work as any).display;

    if (!display) {
      console.warn(
        "[Display] Aucun display trouvé dans work.display pour magic_clock",
        id,
      );
      return null;
    }

    // On fait confiance à la forme du JSON qu’on a nous-mêmes sauvegardé.
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
  const rawId = decodeURIComponent(params.id);

  // 1) Presets en mémoire (Bear onboarding, etc.)
  const preset = DISPLAY_PRESETS[rawId];
  if (preset) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        <MagicDisplayPreviewShell display={preset} />
      </main>
    );
  }

  // 2) Tentative via Supabase : magic_clocks.work.display
  const supabaseDisplay = await loadDisplayFromSupabase(rawId);

  if (supabaseDisplay) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
        <MagicDisplayPreviewShell display={supabaseDisplay} />
      </main>
    );
  }

  // 3) Fallback : ancien comportement (MagicDisplayViewer),
  //    pour éviter le 404 quand on a un contenu legacy / sans display.
  const content = findContentById(rawId);

  // Si même le legacy ne connaît pas cet id → là seulement, 404 propre.
  if (!content) {
    notFound();
  }

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
