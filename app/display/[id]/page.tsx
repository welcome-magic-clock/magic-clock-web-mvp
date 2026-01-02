// app/display/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import { findContentById } from "@/core/domain/repository";
import MagicDisplayViewer from "./MagicDisplayViewer";

// Ids utilisés pour la génération statique
const STATIC_DISPLAY_IDS = [
  "mcw-onboarding-bear-001",
  // Tu pourras en ajouter d'autres ici plus tard
];

export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_DISPLAY_IDS.map((id) => ({ id }));
}

export const metadata: Metadata = {
  title: "Magic Display",
};

type PageProps = {
  params: { id: string };
};

function getDisplayForId(id: string): PreviewDisplay | null {
  const preset = DISPLAY_PRESETS[id];
  if (preset) return preset;

  // Plus tard : fetch Supabase / API ici si besoin

  return null;
}

export default function Page({ params }: PageProps) {
  const rawId = decodeURIComponent(params.id);

  // 1) Cas Bear (et futurs presets) → cube 3D
  const display = getDisplayForId(rawId);
  if (display) {
    return <MagicDisplayPreviewShell display={display} />;
  }

  // 2) Cas normal MVP → ancien comportement
  const content = findContentById(rawId);

  const title = content?.title ?? `Magic Display #${rawId}`;
  const subtitle =
    "MVP : visualisation pédagogique liée à ce Magic Clock. Plus tard, cette page affichera les formules, sections, temps de pose, etc.";

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

        <MagicDisplayViewer contentId={content?.id ?? rawId} />
      </section>
    </main>
  );
}
