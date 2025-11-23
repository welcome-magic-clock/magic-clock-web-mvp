import Image from "next/image";
import type { Creator } from "@/core/domain/types";

type Props = {
  c: Creator;
};

export default function CreatorCard({ c }: Props) {
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
      {/* Grande image de profil */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={c.avatar}
          alt={c.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 320px"
        />
      </div>

      {/* Infos créateur */}
      <div className="px-5 pb-5 pt-4">
        <h2 className="text-base font-semibold">{c.name}</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          {c.city} · Langues: {c.langs.join(", ")}
        </p>

        <p className="mt-2 text-[13px] text-slate-600">
          {c.followers.toLocaleString("fr-CH")} followers
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {c.access.includes("FREE") && (
            <span className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold">
              FREE
            </span>
          )}
          {c.access.includes("ABO") && (
            <span className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold">
              ABO
            </span>
          )}
          {c.access.includes("PPV") && (
            <span className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold">
              PPV
            </span>
          )}
        </div>

        <button className="mt-3 text-[13px] font-semibold text-violet-600">
          Voir profil
        </button>
      </div>
    </article>
  );
}
