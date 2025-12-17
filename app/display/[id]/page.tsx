// app/display/[id]/page.tsx

import Link from "next/link";
import Image from "next/image";
import MagicDisplayViewer from "../MagicDisplayViewer";
import { findContentById } from "@/core/domain/repository";
import { ONBOARDING_MAGIC_CLOCK_WORK } from "@/core/domain/magicClockWork";

type PageProps = {
  params: { id: string };
};

export default function MagicDisplayPage({ params }: PageProps) {
  const rawId = params.id;

  // 🔎 On récupère la carte de contenu (Amazing / My Magic Clock)
  const content = findContentById(rawId);

  // 🐻 Est-ce le Magic Clock d’onboarding de l’ours ?
  const isOnboardingBear =
    rawId === ONBOARDING_MAGIC_CLOCK_WORK.id ||
    String(content?.id) === String(ONBOARDING_MAGIC_CLOCK_WORK.id);

  // 🎯 Titre et sous-titre affichés
  const title = isOnboardingBear
    ? ONBOARDING_MAGIC_CLOCK_WORK.title
    : content?.title ?? `Magic Display #${rawId}`;

  const subtitle = isOnboardingBear
    ? ONBOARDING_MAGIC_CLOCK_WORK.subtitle ??
      "MVP : visualisation pédagogique liée à ce Magic Clock. Plus tard, cette page affichera les formules, sections, temps de pose, etc."
    : "MVP : visualisation pédagogique liée à ce Magic Clock. Plus tard, cette page affichera les formules, sections, temps de pose, etc.";

  // 🧮 Id numérique pour le viewer (MVP)
  const numericId =
    typeof content?.id === "number"
      ? (content.id as number)
      : Number.isFinite(Number(rawId))
      ? Number(rawId)
      : 0;

  // 🧊 Faces du Magic Clock d’onboarding (les 6 images Bear)
  const faces = isOnboardingBear
    ? ONBOARDING_MAGIC_CLOCK_WORK.display.faces
    : [];

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <Link
        href="/mymagic"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        ← Retour à My Magic Clock
      </Link>

      <section className="mt-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
          <p className="text-sm text-slate-600">{subtitle}</p>

          {isOnboardingBear && (
            <p className="text-xs text-slate-500">
              Ce Magic Display est offert par{" "}
              <span className="font-semibold">Magic Clock</span> pour te
              montrer le voyage complet : Studio, Display, Amazing, My Magic
              Clock et Monétisation.
            </p>
          )}
        </header>

        {/* 🎛 Viewer 3D / placeholder actuel */}
        <MagicDisplayViewer contentId={numericId} />

        {/* 🧊 Grille des 6 faces Bear */}
        {faces.length > 0 && (
          <section className="mt-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Faces de ce Magic Clock
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {faces.map((face) => (
                <figure
                  key={face.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <div className="relative aspect-[4/5] w-full">
                    {face.mediaUrl ? (
                      <Image
                        src={face.mediaUrl}
                        alt={face.label}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        (Pas d’image pour cette face)
                      </div>
                    )}
                  </div>
                  <figcaption className="space-y-1 px-3 py-2 text-xs">
                    <p className="font-semibold text-slate-800">
                      {face.label}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {face.description}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
