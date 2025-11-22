"use client";

import Link from "next/link";
import { Play, Eye, Heart, ArrowUpRight } from "lucide-react";

type MediaCardProps = {
  content: any; // on reste volontairement flexible pour le MVP
};

export function MediaCard({ content }: MediaCardProps) {
  const {
    id,
    title,
    userHandle,
    user,
    avatarInitials,
    tags,
    description,
    views,
    likes,
    displayId,
  } = content ?? {};

  const handle = userHandle ?? user ?? "creator";
  const initials =
    avatarInitials ??
    (typeof handle === "string" ? handle.replace("@", "").charAt(0).toUpperCase() : "M");

  const safeTags: string[] = Array.isArray(tags) ? tags : [];
  const safeDescription: string =
    description ??
    "Magic Clock · contenus pédagogiques. Swipe dans le flux pour découvrir d'autres créateurs.";

  const safeTitle: string = title ?? "Avant/Après couleur";
  const safeViews: number = typeof views === "number" ? views : 1000;
  const safeLikes: number = typeof likes === "number" ? likes : 0;
  const safeDisplayId = displayId ?? id ?? 1;

  const shortHandle =
    typeof handle === "string" && handle.startsWith("@") ? handle : `@${handle}`;

  const formatCount = (n: number) => {
    if (!Number.isFinite(n)) return "0";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)} K`;
    return n.toLocaleString("fr-CH");
  };

  const firstTags = safeTags.slice(0, 3);

  return (
    <article className="group relative flex min-h-[70vh] w-full flex-col overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-md sm:min-h-[380px]">
      {/* Fond “media” (placeholder pour l’instant) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#020617_0,_#020617_45%,_#020617_100%)] group-hover:scale-[1.01] transition-transform duration-300" />

      {/* Badge Magic Display */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 sm:left-5 sm:top-5">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-slate-50 backdrop-blur">
          <Play className="h-3 w-3" />
          Magic Display
        </span>
      </div>

      {/* Overlay bas (infos) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5 sm:pt-20">
        {/* Ligne avatar / handle */}
        <div className="flex items-center gap-2 text-xs text-slate-200">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold">
            {initials}
          </div>
          <span className="font-medium">{shortHandle}</span>
        </div>

        {/* Titre */}
        <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-snug">
          {safeTitle}
        </h2>

        {/* Tags */}
        {firstTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {firstTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-200"
              >
                #{tag.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-[11px] text-slate-300">
          {safeDescription}
        </p>

        {/* Stats + CTA */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatCount(safeViews)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {formatCount(safeLikes)}
            </span>
          </div>

          <div className="pointer-events-auto">
            <Link
              href={`/display/${safeDisplayId}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              Ouvrir Display
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MediaCard;
