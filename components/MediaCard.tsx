"use client";

import Link from "next/link";
import { Eye, Heart } from "lucide-react";

type MediaCardProps = {
  item: any;          // MVP : typé en any pour éviter les blocages TS
  isFirst?: boolean;  // au cas où on veuille traiter la 1re carte différemment
};

export default function MediaCard({ item, isFirst }: MediaCardProps) {
  const title = item?.title ?? "Avant/Après couleur";
  const username = item?.user ?? "sofia";
  const views = item?.views ?? 1330;
  const likes = item?.likes ?? 0;
  const tags: string[] = item?.tags ?? ["balayage", "blond froid", "soin"];
  const id = item?.id ?? "demo";

  return (
    <article
      className={`
        snap-start
        rounded-3xl border border-slate-200 bg-slate-900 text-slate-50 shadow-sm
        overflow-hidden
        flex flex-col
        min-h-[70vh]
        sm:min-h-[520px]
      `}
    >
      {/* Zone "media" (fond dark pour l’instant) */}
      <div className="relative flex-1 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_rgba(15,23,42,1))]">
        {/* Badge Magic Display */}
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-slate-50 backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Magic Display
        </div>

        {/* Placeholder média (image/vidéo à venir) */}
        <div className="flex h-full items-center justify-center">
          <span className="text-[11px] text-slate-400">
            Média Magic Clock (avant / après, vidéo, etc.)
          </span>
        </div>
      </div>

      {/* Zone texte / méta */}
      <div className="relative flex flex-col gap-3 bg-gradient-to-t from-slate-950 via-slate-950/95 to-slate-950/80 px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
        {/* Ligne auteur + stats */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold">
              {String(username).charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">@{username}</span>
              <span className="text-[11px] text-slate-400">
                Magic Clock · contenus pédagogiques
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {views.toLocaleString("fr-CH")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {likes.toLocaleString("fr-CH")}
            </span>
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-base font-semibold leading-snug sm:text-lg">
          {title}
        </h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Description courte */}
        <p className="text-[11px] leading-snug text-slate-400 sm:text-xs">
          Magic Clock · contenus pédagogiques. Swipe dans le flux pour
          découvrir d&apos;autres créateurs.
        </p>

        {/* Bouton Ouvrir Display */}
        <div className="mt-1 flex justify-end">
          <Link
            href={`/display/${id}`}
            className="inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
          >
            Ouvrir Display
            <span className="ml-1 text-[13px]">↗︎</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
