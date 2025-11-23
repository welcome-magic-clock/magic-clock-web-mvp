import Image from "next/image";
import CREATORS from "@/features/meet/creators";
import type { FeedItem } from "./feed";

type Props = {
  item: FeedItem;
};

export default function FeedCard({ item }: Props) {
  const creator = CREATORS.find(c => c.id === item.creatorId);

  if (!creator) return null;

  return (
    <article className="rounded-[32px] bg-white shadow-xl border border-slate-200 overflow-hidden">
      {/* Image avant/après */}
      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 600px"
        />

        {/* Avatar créateur au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border-[3px] border-white shadow-lg overflow-hidden">
            <Image
              src={creator.avatar}
              alt={creator.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Infos sous la carte */}
      <div className="px-5 pb-5 pt-4">
        <p className="text-[13px] text-slate-500">@{creator.handle.slice(1)}</p>
        <h2 className="mt-1 text-base font-semibold">{item.title}</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          {creator.city} · Langues: {creator.langs.join(", ")}
        </p>

        <div className="mt-3 flex gap-2">
          <span className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold">
            {item.access}
          </span>
        </div>
      </div>
    </article>
  );
}
