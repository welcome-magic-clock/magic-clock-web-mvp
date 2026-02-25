// app/display/magic-clock/[id]/page.tsx
//
// Affiche un Magic Display stocké dans Supabase (table magic_clocks)
// en lisant work.display pour l'id donné.

import Link from "next/link";
import { notFound } from "next/navigation";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

type PageProps = {
  params: {
    id: string;
  };
};

async function loadDisplayFromSupabase(
  rawId: string,
): Promise<PreviewDisplay | null> {
  if (!rawId) return null;

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("magic_clocks")
      .select("id, work")
      .eq("id", rawId)
      .eq("is_published", true)
      .limit(1);

    if (error) {
      console.error("[Display] Supabase error for id", rawId, error);
      return null;
    }

    const row = (data ?? [])[0] as { id: string; work: any } | undefined;
    if (!row || !row.work) {
      return null;
    }

    const display = (row.work as any).display;
    if (!display || !Array.isArray(display.segments)) {
      console.warn(
        "[Display] Invalid or missing work.display for magic_clock",
        rawId,
      );
      return null;
    }

    return display as PreviewDisplay;
  } catch (err) {
    console.error("[Display] Exception while reading Supabase", err);
    return null;
  }
}

export default async function MagicClockDisplayPage({ params }: PageProps) {
  const rawId = decodeURIComponent(params.id ?? "");

  const display = await loadDisplayFromSupabase(rawId);

  if (!display) {
    // Fallback propre si rien trouvé
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-4">
        <Link
          href="/mymagic"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          ← Retour à My Magic Clock
        </Link>
      </div>

      <MagicDisplayPreviewShell display={display} />
    </main>
  );
}
