// app/display/MagicDisplayViewer.tsx
"use client";

import Image from "next/image";
import type { MagicClockWork } from "@/core/domain/magicClockWork";
import { ONBOARDING_MAGIC_CLOCK_WORK } from "@/core/domain/magicClockWork";

type Props = {
  contentId: number | string;
};

/**
 * Pour le MVP, seul le Magic Clock d’onboarding (l’ours 🐻)
 * a un vrai Magic Display illustré.
 */
function getWorkForContent(contentId: number | string): MagicClockWork | null {
  const idAsString = String(contentId);

  if (idAsString === ONBOARDING_MAGIC_CLOCK_WORK.id) {
    return ONBOARDING_MAGIC_CLOCK_WORK;
  }

  // Les autres contenus auront leur Display plus tard
  return null;
}

export default function MagicDisplayViewer({ contentId }: Props) {
  const work = getWorkForContent(contentId);

  // Si ce n’est pas le Magic Clock de l’ours, on affiche juste un message MVP
  if (!work) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Le Magic Display détaillé pour ce contenu arrive dans une prochaine
        mise à jour du MVP. Pour l’instant, seul le Magic Clock d’onboarding
        (notre ours 🐻) dispose de son Display illustré.
      </div>
    );
  }

  const faces = work.display.faces;

  return (
    <div className="space-y-4">
      {/* Grille des 6 faces du cube */}
      <div className="grid gap-4 sm:grid-cols-2">
        {faces.map((face) => (
          <article
            key={face.id}
            className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm"
          >
            <div className="mb-2 text-xs font-semibold text-slate-500">
              Face {face.id}
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
              {face.mediaUrl ? (
                <Image
                  src={face.mediaUrl}
                  alt={face.label}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  Visuel à venir
                </div>
              )}
            </div>

            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              {face.label}
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              {face.description}
            </p>
          </article>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        MVP : chaque face représente une étape du Magic Clock. Plus tard, ce
        viewer affichera les segments circulaires interactifs, les aiguilles et
        les vidéos intégrées.
      </p>
    </div>
  );
}
