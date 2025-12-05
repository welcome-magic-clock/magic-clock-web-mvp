// app/display/[id]/page.tsx

import Link from "next/link";
import MagicDisplayViewer from "../MagicDisplayViewer";

type PageProps = {
  params: { id: string };
};

export default function MagicDisplayPage({ params }: PageProps) {
  const parsed = Number.parseInt(params.id, 10);
  const contentId = Number.isFinite(parsed) ? parsed : 0;

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
            Magic Display #{contentId}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            MVP : visualisation pédagogique liée à ce Magic Clock. Plus tard,
            cette page affichera les formules, sections, temps de pose, etc.
          </p>
        </header>

        {/* ❤️ Le cœur visuel du Magic Display */}
        <MagicDisplayViewer contentId={contentId} />
      </section>
    </main>
  );
}
