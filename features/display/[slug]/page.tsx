// app/display/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";

/**
 * Optionnel : SEO de base – tu pourras le rendre dynamique selon le slug.
 */
export const metadata: Metadata = {
  title: "Magic Clock – Display",
};

/**
 * Récupère un Display à partir du slug.
 * Pour l’instant, on utilise DISPLAY_PRESETS (mock).
 * Plus tard : fetch depuis ta base de données.
 */
function getDisplayForSlug(slug: string): PreviewDisplay | null {
  const display = DISPLAY_PRESETS[slug];
  return display ?? null;
}

type DisplayPageProps = {
  params: {
    slug: string;
  };
};

export default function DisplayPage({ params }: DisplayPageProps) {
  const { slug } = params;

  const display = getDisplayForSlug(slug);

  if (!display) {
    // Si le slug n'existe pas, on renvoie sur la 404 Next
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Tu peux ajouter un petit header si tu veux */}
      {/* <header className="border-b border-white/10 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Magic Clock · Display
        </p>
        <h1 className="text-lg font-semibold">{slug}</h1>
      </header> */}

      <MagicDisplayPreviewShell display={display} />
    </div>
  );
}
