// features/amazing/FeedCard.tsx

import Image from "next/image";
import CREATORS from "@/features/meet/creators";
import type { FeedCard as FeedCardType } from "@/core/domain/types";

type Props = {
  item: FeedCardType;
};

export default function FeedCard({ item }: Props) {
  const creator = CREATORS.find((c) => c.handle === item.user);

  return (
    <article
      className="
        rounded-[32px]
        bg-white
        shadow-xl
        border border-slate-200
        overflow-hidden
        flex flex-col
      "
    >
      {/* Image avant/après */}
      <div className="relative w-full overflow-hidden bg-slate-100">
        <div className="relative h-[420px] sm:h-[520px]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
          />
        </div>

        {/* Overlay profil créateur */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-white/70 bg-slate-200">
              {creator && (
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold leading-tight">
                {creator?.name ?? "Créateur inconnu"}
              </p>
              <p className="text-[11px] opacity-80">
                {creator?.handle} · {item.views.toLocaleString("fr-CH")} vues
              </p>
            </div>
          </div>

          {/* Badges d’accès (FREE / ABO / PPV) */}
          <div className="flex gap-2 pointer-events-auto">
            <span className="rounded-full border border-white/80 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white">
              {item.access}
            </span>
          </div>
        </div>
      </div>

      {/* Titre & lien détail (MVP simple) */}
      <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        <h2 className="text-sm font-semibold sm:text-base">{item.title}</h2>
        <a
          href={`/display/${item.id}`}
          className="mt-2 inline-block text-[12px] font-medium text-violet-600 hover:underline"
        >
          Ouvrir le Magic Display
        </a>
      </div>
    </article>
  );
}
