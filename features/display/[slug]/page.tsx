// app/display/[slug]/page.tsx

import { notFound } from "next/navigation";
import MagicDisplayPreviewShell from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import type { PreviewDisplay } from "@/features/display/MagicDisplayPreviewShell";

type PageProps = {
  params: {
    slug: string;
  };
};

function getDisplayForSlug(slug: string): PreviewDisplay | null {
  // 1) Presets (Bear, autres tutos officiels)
  const preset = DISPLAY_PRESETS[slug];
  if (preset) return preset;

  // 2) Plus tard : fetch Supabase / API ici
  // if (data) return mapRowToPreviewDisplay(data);

  return null;
}

export default function DisplayPage({ params }: PageProps) {
  const { slug } = params;

  const display = getDisplayForSlug(slug);

  if (!display) {
    // Si aucun preset ou enregistrement trouvé → 404 propre
    notFound();
  }

  return <MagicDisplayPreviewShell display={display} />;
}
