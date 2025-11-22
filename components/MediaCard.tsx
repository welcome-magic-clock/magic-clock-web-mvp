"use client";

import Link from "next/link";
import { Play, ArrowUpRight, Eye, Heart } from "lucide-react";

type MediaCardProps = {
  item: {
    id: number | string;
    title: string;
    user: string;
    avatarInitials?: string;
    tags?: string[];
    views?: number;
    likes?: number;
    type?: "VIDEO" | "PHOTO";
    access?: "FREE" | "PPV" | "SUB";
    language?: string;
    description?: string;
  };
};

function formatCount(n?: number) {
  if (!n || n <= 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)} K`;
  return n.toString();
}

export default function MediaCard({ item }: MediaCardProps) {
  const {
    id,
    title,
    user,
    avatarInitials = user?.[0]?.toUpperCase?.() ?? "M",
    tags = ["balayage", "blond froid", "soin"],
    views = 1330,
    likes = 0,
    description = "Magic Clock · contenus pédagogiques. Swipe dans le flux pour découvrir d'autres créateurs.",
  } = item ?? {};

  const hrefDisplay = `/display/${id}`;

  return (
    <article
      className="
        snap-start
        rounded-[32px]
        bg-slate-950
        text-slate-50
        shadow-[0_18px_40px_rgba(15,23,42,0.65)]
        overflow-hidden
        flex flex-col
        min-h-[70vh]
        sm:min-h-[420px]
      "
    >
      {/* Zone média (plein écran vertical sur mobile) */}
      <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Faux média : halo au centre pour rappeler la future vidéo / image */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_30%,rgba(148,163,184,0.35),transparent_60%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.25),transparent_65%)]" />
        </div>

        {/* Badge Magic Display */}
        <div className="pointer-events-none absolute left-4 top-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-50 shadow-lg">
            <Play className="h-3 w-3" />
            Magic Display
          </span>
        </div>

        {/* Dégradé en bas pour lire le texte */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />

        {/* Bandeau bas : avatar + auteur + bouton Display */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4">
          <div className="flex items-end justify-between gap-3">
            {/* Avatar + @user + titre */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold">
                  {avatarInitials}
                </div>
                <span className="text-xs text-slate-300">@{user}</span>
              </div>
              <h2 className="max-w-xs text-base font-semibold leading-snug text-slate-50">
                {title}
              </h2>
            </div>

            {/* Bouton Ouvrir Display */}
            <Link
              href={hrefDisplay}
              className="
                inline-flex items-center gap-1.5 rounded-full
                bg-slate-50 px-4 py-2 text-[11px] font-semibold
                text-slate-900 shadow-lg
                hover:bg-slate-100 active:bg-slate-200
                transition-colors
              "
            >
              Ouvrir Display
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Zone texte / stats (sous la zone média) */}
      <div className="space-y-3 px-4 pb-4 pt-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Description courte */}
        <p className="text-[12px] leading-snug text-slate-300">
          {description}
        </p>

        {/* Stats vues / likes */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatCount(views)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {formatCount(likes)}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            Swipe pour voir d&apos;autres Magic Clock
          </span>
        </div>
      </div>
    </article>
  );
}
