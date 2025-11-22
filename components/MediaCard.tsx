"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, ExternalLink, Heart, Eye } from "lucide-react";

export type MediaCardProps = {
  content: any; // MVP : on accepte tout, on lit seulement les champs utiles
};

export default function MediaCard({ content }: MediaCardProps) {
  const id = content?.id ?? 0;
  const title = content?.title ?? "Avant/Après couleur";
  const user = content?.user ?? "sofia";
  const avatarUrl = content?.avatarUrl as string | undefined;
  const thumbnailUrl = content?.thumbnailUrl as string | undefined;
  const tags: string[] = content?.tags ?? [
    "#balayage",
    "#blond froid",
    "#soin",
  ];
  const views = content?.views ?? 1000;
  const likes = content?.likes ?? 0;

  return (
    <article className="w-full max-w-[480px] mx-auto">
      <div className="relative w-full overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg">
        {/* Zone média verticale */}
        <div className="relative h-[520px] w-full bg-slate-900">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 480px"
            />
          ) : (
            // Fallback visuel Magic Clock (dégradé)
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1f2937,#020617)]" />
          )}

          {/* Badge Magic Display */}
          <div className="absolute left-4 top-3 sm:top-4 z-20">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium shadow-sm">
              <Play className="h-3 w-3 fill-slate-100 text-slate-100" />
              <span>Magic Display</span>
            </span>
          </div>

          {/* Overlay gradient bas */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-transparent" />

          {/* Infos créateur + titre + CTA */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-16">
            {/* Créateur */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800/80 ring-2 ring-slate-900/80">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-semibold uppercase text-slate-100">
                    {user?.[0] ?? "S"}
                  </span>
                )}
              </div>
              <span className="rounded-full bg-slate-900/70 px-2 py-1 text-[11px] text-slate-100">
                @{user}
              </span>
            </div>

            {/* Titre */}
            <div className="mt-2 space-y-1.5">
              <p className="text-sm font-semibold leading-snug text-white line-clamp-2">
                {title}
              </p>
            </div>

            {/* Hashtags */}
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-100/90">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-900/80 px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description + CTA + stats */}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[60%] text-[11px] text-slate-200 line-clamp-2">
                Magic Clock · contenus pédagogiques. Swipe dans le flux pour
                découvrir d&apos;autres créateurs.
              </p>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                {/* Stats vues / likes */}
                <div className="flex items-center gap-3 text-[11px] text-slate-200">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {views.toLocaleString("fr-CH")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {likes.toLocaleString("fr-CH")}
                  </span>
                </div>

                {/* CTA Ouvrir Display */}
                <Link
                  href={`/display/${id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-900 shadow-sm hover:bg-white hover:shadow-md transition"
                >
                  <span>Ouvrir Display</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
