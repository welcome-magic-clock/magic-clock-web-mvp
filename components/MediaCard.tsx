"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Play, ArrowUpRight } from "lucide-react";

type MediaCardProps = {
  item: any; // MVP : on reste souple, on typera mieux plus tard
};

export function MediaCard({ item }: MediaCardProps) {
  const cover = item.coverUrl ?? "/magic-clock-placeholder.jpg";
  const user = item.user ?? "demo_creator";
  const title = item.title ?? "Transformation couleur & soin";
  const likes = item.likes ?? item.stats?.likes ?? 0;
  const views = item.views ?? item.stats?.views ?? 0;
  const tags: string[] = item.tags ?? ["balayage", "blond froid", "soin"];

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Media principale */}
      <div className="relative w-full overflow-hidden">
        <Link
          href={`/display/${item.id ?? 1}`}
          className="block w-full"
          prefetch={false}
        >
          {/* Ratio vertical 9/14 pour coller à la sensation Reels/TikTok */}
          <div className="relative w-full aspect-[9/14]">
            <Image
              src={cover}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />

            {/* Badge Play / Magic Display */}
            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
              <Play className="h-3 w-3 fill-white text-white" />
              <span>Magic Display</span>
            </div>

            {/* Overlay bas (dégradé + infos) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
              <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-slate-100">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold">
                    {user[0]?.toUpperCase() ?? "M"}
                  </span>
                  <span>@{user}</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    <span>{views.toLocaleString("fr-CH")}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{likes.toLocaleString("fr-CH")}</span>
                  </span>
                </span>
              </div>
              <p className="line-clamp-2 text-[13px] font-semibold text-white">
                {title}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Zone info / tags / bouton Display */}
      <div className="flex flex-col gap-2 p-3">
        {/* Tags en “swipe horizontal” pour donner le feeling du pouce */}
        <div className="-mx-1 overflow-x-auto pb-1">
          <div className="flex snap-x snap-mandatory gap-1 px-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="snap-start whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex flex-col">
            <span>Magic Clock · contenus pédagogiques</span>
            <span className="text-[10px] text-slate-400">
              Swipe dans le flux pour découvrir d&apos;autres créateurs.
            </span>
          </div>
          <Link
            href={`/display/${item.id ?? 1}`}
            prefetch={false}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-sm"
          >
            <span>Ouvrir Display</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
