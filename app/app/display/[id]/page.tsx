// app/display/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";

import { FEED } from "@/features/amazing/feed";
import CREATORS from "@/features/meet/creators";

type PageProps = {
  params: { id: string };
};

export default function DisplayPage({ params }: PageProps) {
  // On cherche dans FEED l'item qui correspond à l'id de l'URL
  const item =
    FEED.find((i) => String(i.id) === String(params.id)) ?? FEED[0];

  // On retrouve le créateur à partir de son handle (@sofia_rivera, etc.)
  const creator = CREATORS.find((c) => c.handle === item.user);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <Link
        href="/"
        className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
      >
        ← Retour au flux Amazing
      </Link>

      <article className="mt-4 overflow-hidden rounded-[32px] bg-white shadow-xl border border-slate-200">
        {/* Image avant/après en grand */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[16/9] bg-slate-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 768px"
          />

          {/* Overlay créateur en bas de l'image */}
          {creator && (
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-300">
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

        {/* Détails sous l'image */}
        <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <h1 className="text-lg font-semibold sm:text-xl">{item.title}</h1>

          {creator && (
            <p className="mt-1 text-sm text-slate-600">
              Par {creator.name} ({creator.city}) · Langues :{" "}
              {creator.langs.join(", ")}
            </p>
          )}

          <p className="mt-2 text-xs text-slate-500">
            MVP : cette page affichera plus tard la fiche complète du Magic
            Display (formules, temps de pose, produits utilisés, étapes, etc.).
          </p>
        </div>
      </article>
    </main>
  );
}
