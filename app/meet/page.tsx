// app/meet/page.tsx

import { SearchToolbar } from "@/components/search/SearchToolbar";
import { CREATORS } from "@/features/meet/creators";

// On part du type réel de CREATORS et on lui ajoute juste city / country
type CreatorWithLocation = (typeof CREATORS)[number] & {
  city?: string;
  country?: string;
};

function CreatorGridCard({ creator }: { creator: CreatorWithLocation }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="aspect-[3/4] w-full overflow-hidden">
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
        <p className="text-[11px] text-slate-500">@{creator.handle}</p>

        {typeof creator.followers === "number" && (
          <p className="text-[11px] text-slate-500">
            {creator.followers.toLocaleString("fr-CH")} followers
          </p>
        )}

        {((creator as any).city || (creator as any).country) && (
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

  // On “allonge” la page : on répète la liste 10×
  const REPEAT_TIMES = 10;

  const extendedCreators = Array.from({ length: REPEAT_TIMES }, (_, idx) =>
    baseCreators.map((creator) => ({
      ...creator,
      _fakeId: `${creator.id}-repeat-${idx}`,
    }))
  ).flat();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* 🔍 Barre de recherche + bulles (comme Amazing, variante Meet me) */}
      <section className="mb-4">
        <SearchToolbar variant="meetme" />
      </section>

      {/* Titre + description */}
      <header className="mb-4 space-y-1">
        <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>
        <p className="text-xs text-slate-500">
          Découvre et contacte les créateurs Magic Clock.
        </p>
      </header>

      {/* Grille de créateurs (mix Instagram / Magic Clock) */}
      <section className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {extendedCreators.map((creator) => (
          <CreatorGridCard
            key={creator._fakeId ?? creator.id}
            creator={creator}
          />
        ))}
      </section>
    </main>
  );
}
