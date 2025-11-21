"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
import type { FeedCard } from "@/core/domain/types";
import { CREATORS } from "@/features/meet/creators";

type Props = {
  item: FeedCard;
};

function isVideo(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

function MediaSlot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/5]">
      {isVideo(src) ? (
        <video
          src={src}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image src={src} alt={alt} fill className="object-cover" />
      )}
    </div>
  );
}

export default function MediaCard({ item }: Props) {
  // Avatar depuis Meet me
  const creator = CREATORS.find((c) => c.handle === item.user);
  const avatar = creator?.avatar ?? item.image;

  // Pour plus tard : Magic Studio fournira vraiment beforeUrl / afterUrl
  const beforeUrl = (item as any).beforeUrl ?? item.image;
  const afterUrl = (item as any).afterUrl ?? item.image;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Canevas Magic Studio : Avant / Après */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <div className="grid grid-cols-2">
          <MediaSlot src={beforeUrl} alt={`${item.title} - Avant`} />
          <MediaSlot src={afterUrl} alt={`${item.title} - Après`} />
        </div>

        {/* Avatar + handle au centre (clic → Meet me) */}
        <Link
          href="/meet"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-1 rounded-full bg-white/95 px-4 py-2 shadow">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
              <Image
                src={avatar}
                alt={creator?.name ?? item.user}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-slate-800">
              @{item.user}
            </span>
          </div>
        </Link>

        {/* Flèche en haut à droite */}
        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow">
          <ArrowUpRight className="h-4 w-4 text-slate-700" />
        </div>

        {/* Handle en bas à gauche (même lien Meet me) */}
        <Link
          href="/meet"
          className="absolute bottom-2 left-2 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white hover:bg-black"
        >
          @{item.user}
        </Link>

        {/* Like en bas à droite */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          <Heart className="h-3 w-3" />
          <span>60</span>
        </div>
      </div>

      {/* Bas de carte : vues + hashtags */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="font-medium">{item.views.toLocaleString()}</span>
          <span>vues</span>
        </div>
        <div className="flex gap-2 text-[11px]">
          <span className="text-brand-600">#coiffure</span>
          <span className="text-brand-600">#color</span>
        </div>
      </div>
    </article>
  );
}
