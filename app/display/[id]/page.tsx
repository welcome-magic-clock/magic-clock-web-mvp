// app/display/[id]/page.tsx
//
// Page d'affichage d'un Magic Display à partir d'un identifiant.
// - Si l'id correspond à un preset (ex : mcw-onboarding-bear-001) → on affiche ce preset.
// - Sinon on regarde dans Supabase (table `magic_clocks`) et on lit work.display.
//   Cela permet au bouton ↗ depuis My Magic Clock d'ouvrir le Display qui vient
//   d'être publié.
//

import { notFound } from "next/navigation";
import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

// On force le mode dynamique car on va lire Supabase à chaque fois
export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    id: string; // ⚠️ le dossier est [id], donc c'est bien "id" ici
  };
};

/**
 * Récupère un objet PreviewDisplay pour un id donné.
 * 1) On essaie d'abord les presets en mémoire.
 * 2) Sinon on va chercher un Magic Clock publié dans Supabase et on lit work.display.
 */
async function getDisplayForId(rawId: string): Promise<PreviewDisplay | null> {
  // 1) Presets (Bear, autres tutos officiels)
  const preset = DISPLAY_PRESETS[rawId];
  if (preset) {
    return preset;
  }

  // 2) Supabase : Magic Clock publié
  try {
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
      console.warn("[Display] Aucun work trouvé pour magic_clock", rawId);
      return null;
    }

    const display = (row.work as any).display;

    // On tolère un display "simple", mais il faut au moins un objet cohérent
    if (!display) {
      console.warn(
        "[Display] Aucun display dans work.display pour magic_clock",
        rawId,
      );
      return null;
    }

    return display as PreviewDisplay;
  } catch (err) {
    console.error(
      "[Display] Exception pendant la lecture Supabase pour id",
      rawId,
      err,
    );
    return null;
  }
}

export default async function DisplayPage({ params }: PageProps) {
  // ⚠️ On récupère bien params.id (et plus displayId)
  const rawId = decodeURIComponent(params.id);

  const display = await getDisplayForId(rawId);

  if (!display) {
    // Aucun preset ni Magic Clock publié trouvé → 404 propre
    notFound();
  }

  // Layout très simple pour le moment : écran plein avec le cube
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <MagicDisplayPreviewShell display={display} />
    </main>
  );
}
