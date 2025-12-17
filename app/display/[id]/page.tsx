// app/display/[id]/page.tsx

"use client";

import Link from "next/link";
import MagicDisplayViewer from "../MagicDisplayViewer";

type PageProps = {
  params: { id: string };
};

export default function MagicDisplayPage({ params }: PageProps) {
  const rawId = decodeURIComponent(params.id);

  const isOnboardingBear = rawId === "mcw-onboarding-bear-001";

  const title = isOnboardingBear
    ? "Magic Clock te montre comment transformer ton expérience en lumière pour les autres"
    : `Magic Display #${rawId}`;

  const subtitle = isOnboardingBear
    ? "MVP : Magic Display d’onboarding (ours 🐻) — aperçu pédagogique des 6 faces du cube."
    : "MVP : visualisation pédagogique liée à ce Magic Clock. Plus tard cette page affichera les formules, sections, temps de pose, etc.";

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

        {/* On passe l'ID brut au viewer, qui sait gérer l’ours 🐻 */}
        <MagicDisplayViewer contentId={rawId} />
      </section>
    </main>
  );
}
