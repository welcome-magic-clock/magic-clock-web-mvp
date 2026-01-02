// app/display/[id]/DisplayClient.tsx
"use client";

import Link from "next/link";
import MagicDisplayViewer from "../MagicDisplayViewer";
import { findContentById } from "@/core/domain/repository";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";

export default function DisplayClient({ id }: { id: string }) {
  const rawId = decodeURIComponent(id);

  // 👉 1) Cas “preset” (Bear & futurs onboarding)
  const presetDisplay: PreviewDisplay | undefined = DISPLAY_PRESETS[rawId];

  if (presetDisplay) {
    // Vue finale 100 % lecture seule : cube 3D + cercle Aiko
    return <MagicDisplayPreviewShell display={presetDisplay} />;
  }

  // 👉 2) Cas normal MVP : ancien comportement
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
