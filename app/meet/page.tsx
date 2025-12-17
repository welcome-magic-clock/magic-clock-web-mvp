// app/meet/page.tsx
"use client";

import { BadgeCheck } from "lucide-react";
import { SearchToolbar } from "@/components/search/SearchToolbar";
import { CREATORS } from "@/features/meet/creators";

// On part du type réel de CREATORS et on lui ajoute juste city / country
type CreatorWithLocation = (typeof CREATORS)[number] & {
  city?: string;
  country?: string;
};

function CreatorGridCard({ creator }: { creator: CreatorWithLocation }) {
  const hasLocation =
    (creator as any).city != null || (creator as any).country != null;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="aspect-[3/4] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={creator.avatar}
          alt={creator.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-1 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">
          {creator.name}
        </p>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>@{creator.handle}</span>
          {(creator as any).isCertified === true && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              <span>Certifié</span>
            </span>
          )}
        </div>

        {typeof creator.followers === "number" && (
          <p className="text-[11px] text-slate-500">
            {creator.followers.toLocaleString("fr-CH")} followers
          </p>
        )}

        {hasLocation && (
          <p className="text-[11px] text-slate-400">
            {(creator as any).city}
            {(creator as any).city && (creator as any).country ? " · " : ""}
            {(creator as any).country}
          </p>
        )}
      </div>
    </article>
  );
}

export default function MeetPage() {
  const baseCreators = CREATORS as CreatorWithLocation[];

 // 🔹 Profil système Magic Clock Bear (avatar + certifié)
const systemBearCreator = {
  id: "magic-clock-bear",
  name: "Magic Clock",                    // ← nouveau nom
  handle: "magic_clock_app",
  avatar: "/images/magic-clock-bear/avatar.png",
  followers: 125_000_000,                 // ← + de 100 millions
  isCertified: true,
  city: "Neuchâtel",
  country: "Suisse",
} as unknown as CreatorWithLocation;

  // On place l’ours en tout premier dans la liste
  const baseCreatorsWithBear: CreatorWithLocation[] = [
    systemBearCreator,
    ...baseCreators,
  ];

  // On “allonge” la page : on répète la liste 10×
  const REPEAT_TIMES = 10;

  const extendedCreators = Array.from(
    { length: REPEAT_TIMES },
    (_, idx) =>
      baseCreatorsWithBear.map((creator) => ({
        ...creator,
        _fakeId: `${creator.id}-repeat-${idx}`,
      })) as CreatorWithLocation[]
  ).flat();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* 🔍 Barre de recherche + bulles (comme Amazing, variante Meet me) */}
      <SearchToolbar variant="meetme" />

      {/* Titre + description */}
      <header className="mb-4 mt-2 space-y-1">
        <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>
        <p className="text-xs text-slate-500">
          Découvre et contacte les créateurs Magic Clock.
        </p>
      </header>

      {/* Grille de créateurs (2 colonnes mobile, 3 colonnes desktop) */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {extendedCreators.map((creator: any) => (
          <CreatorGridCard
            key={creator._fakeId ?? creator.id}
            creator={creator}
          />
        ))}
      </section>
    </main>
  );
}
