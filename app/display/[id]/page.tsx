// app/display/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";

import { FEED } from "@/features/amazing/feed";
import CREATORS from "@/features/meet/creators";
import MagicDisplayViewer from "@/app/display/MagicDisplayViewer";

type PageProps = {
  params: { id: string };
};

export default function DisplayPage({ params }: PageProps) {
  // On cherche l'index dans FEED qui correspond à l'id de l'URL
  const index = FEED.findIndex((i) => String(i.id) === String(params.id));

  // Sélection de l'item (fallback sur le premier si non trouvé)
  const item = index >= 0 ? FEED[index] : FEED[0];

  // ID numérique stable pour le MagicDisplayViewer (1, 2, 3, ...)
  const contentId = (index >= 0 ? index : 0) + 1;

  // Créateur lié à la carte
  const creator = CREATORS.find((c) => c.handle === item.user);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        ← Retour au flux Amazing
      </Link>

      <article className="mt-4 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
        {/* Image avant/après en grand */}
        <div className="relative w-full bg-slate-100 aspect-[3/4] sm:aspect-[16/9]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 768px"
          />

          {/* Overlay créateur en bas de l'image */}
          {creator && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-300">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {creator.name}
                    </p>
                    <p className="text-xs text-slate-200">
                      {creator.handle} ·{" "}
                      {item.views.toLocaleString("fr-CH")} vues
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-white/70 px-3 py-1 text-[11px] font-semibold text-white">
                  {item.access}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Détails + Magic Display */}
        <div className="space-y-3 px-5 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
          <header>
            <h1 className="text-lg font-semibold sm:text-xl">{item.title}</h1>

            {creator && (
              <p className="mt-1 text-sm text-slate-600">
                Par {creator.name}
                {creator.city ? ` (${creator.city})` : ""} · Langues :{" "}
                {creator.langs.join(", ")}
              </p>
            )}
          </header>

          <p className="text-xs text-slate-500">
            MVP : le Magic Display ci-dessous illustre la logique pédagogique
            de cette transformation (temps de pose, placements, neutralisation,
            etc.). Plus tard, il sera généré à partir des vrais paramètres
            saisis dans l’éditeur.
          </p>

          {/* 💫 Souffle de vie : Magic Display Viewer */}
          <div className="mt-4">
            <MagicDisplayViewer contentId={contentId} />
          </div>
        </div>
      </article>
    </main>
  );
}
