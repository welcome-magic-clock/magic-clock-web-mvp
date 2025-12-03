// app/meet/page.tsx

import { SearchToolbar } from "@/components/search/SearchToolbar";
import { CREATORS } from "@/features/meet/creators";

// Typage souple : on laisse passer city / country sans que TS nous embête
type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers?: number;
  city?: string;
  country?: string;
};

function CreatorGridCard({ creator }: { creator: Creator }) {
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

        {(creator.city || creator.country) && (
          <p className="text-[11px] text-slate-400">
            {creator.city}
            {creator.city && creator.country ? " · " : ""}
            {creator.country}
          </p>
        )}
      </div>
    </article>
  );
}

export default function MeetPage() {
  const baseCreators = CREATORS as Creator[];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* 🔍 Barre de recherche + bulles (même composant que Amazing) */}
      <section className="mb-4">
        <SearchToolbar variant="meetme" />
      </section>

      {/* Titre + grille de créateurs */}
      <section className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>
          <p className="text-xs text-slate-500">
            Découvre et contacte les créateurs Magic Clock.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {baseCreators.map((creator) => (
            <CreatorGridCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
    </main>
  );
}
