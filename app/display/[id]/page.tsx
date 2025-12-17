// app/display/[id]/page.tsx

import Link from "next/link";
import MagicDisplayViewer from "../MagicDisplayViewer";
import { findContentById } from "@/core/domain/repository";
import type { FeedCard } from "@/core/domain/types";

// on cast le viewer en any pour laisser passer string | number
const ViewerAny: any = MagicDisplayViewer;

type PageProps = {
  params: { id: string };
};

export default function MagicDisplayPage({ params }: PageProps) {
  const rawId = params.id; // peut être "mcw-onboarding-bear-001"
  const content: FeedCard | undefined = findContentById(rawId);

  const title =
    content?.title ?? `Magic Display #${rawId}`;

  const subtitle =
    (content as any)?.subtitle ??
    "MVP : visualisation pédagogique liée à ce Magic Clock. Plus tard, cette page affichera les formules, sections, temps de pose, etc.";

  const contentIdForViewer = (content as any)?.id ?? rawId;

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
          <h1 className="text-xl font-semibold sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {subtitle}
          </p>
        </header>

        <ViewerAny contentId={contentIdForViewer} />
      </section>
    </main>
  );
}
