// app/meet/page.tsx
"use client";

import { BadgeCheck } from "lucide-react";
import { SearchToolbar } from "@/components/search/SearchToolbar";
import { CREATORS } from "@/features/meet/creators";

// Base : type d'un créateur dans CREATORS
type CreatorBase = (typeof CREATORS)[number];

// On étend avec les infos de localisation + isCertified optionnel
type CreatorWithLocation = CreatorBase & {
  city?: string;
  country?: string;
  isCertified?: boolean;
};

function formatFollowers(count?: number): string {
  if (typeof count !== "number") return "";

  // ≥ 1 million → "125M" / "2,5M"
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    const formatted = millions.toLocaleString("fr-CH", {
      maximumFractionDigits: millions >= 10 ? 0 : 1,
      minimumFractionDigits: millions >= 10 ? 0 : 1,
    });
    return `${formatted}M`;
  }

  // ≥ 1 000 → "12,4k" / "3k"
  if (count >= 1_000) {
    const thousands = count / 1_000;
    const formatted = thousands.toLocaleString("fr-CH", {
      maximumFractionDigits: thousands >= 10 ? 0 : 1,
      minimumFractionDigits: thousands >= 10 ? 0 : 1,
    });
    return `${formatted}k`;
  }

  // < 1 000 → nombre normal
  return count.toLocaleString("fr-CH");
}

function CreatorGridCard({ creator }: { creator: CreatorWithLocation }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      {/* Cover */}
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Texte */}
      <div className="space-y-1 px-4 py-3">
        {/* Nom */}
        <p className="text-sm font-semibold text-slate-900">
          {creator.name}
        </p>

        {/* Handle + badge certifié sur la même ligne */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500 truncate">
            @{creator.handle}
          </p>

          {creator.isCertified && (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              <span>Certifié</span>
            </span>
          )}
        </div>

        {/* Followers */}
        {typeof creator.followers === "number" && (
          <p className="text-[11px] text-slate-500">
            {formatFollowers(creator.followers)} followers
          </p>
        )}

        {/* Ville / pays (optionnels) */}
        {(creator as any).city || (creator as any).country ? (
          <p className="text-[11px] text-slate-400">
            {(creator as any).city}
            {(creator as any).city && (creator as any).country ? " · " : ""}
            {(creator as any).country}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function MeetPage() {
  const baseCreators = CREATORS as CreatorWithLocation[];

  // 🔹 Profil système Magic Clock (Bear)
  const systemBearCreator: CreatorWithLocation = {
    id: "magic-clock-bear",
    name: "Magic Clock",
    handle: "magic_clock_app",
    avatar: "/images/magic-clock-bear/avatar.png",
    followers: 125_000_000,
    isCertified: true,
    langs: ["fr"],      // champs attendus dans le type original
    access: "PUBLIC",   // idem (PUBLIC / PRIVATE, etc.)
    city: "Neuchâtel",
    country: "Suisse",
  } as CreatorWithLocation;

  // On met Magic Clock tout en haut de la liste
  const creatorsWithSystem: CreatorWithLocation[] = [
    systemBearCreator,
    ...baseCreators,
  ];

  // On “allonge” la page : on répète la liste 10×
  const REPEAT_TIMES = 10;

  const extendedCreators = Array.from({ length: REPEAT_TIMES }, (_, idx) =>
    creatorsWithSystem.map((creator) => ({
      ...creator,
      _fakeId: `${creator.id}-repeat-${idx}`,
    }))
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
