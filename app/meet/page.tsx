// app/meet/page.tsx
"use client";

import { SearchToolbar } from "@/components/search/SearchToolbar";
import CreatorCard from "@/features/meet/CreatorCard";
import { CREATORS } from "@/features/meet/creators";

export default function MeetPage() {
  const creators = CREATORS;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* HEADER + BARRE DE RECHERCHE + BULLES */}
      <section className="mb-6 space-y-4">
        <header className="space-y-1.5">
          <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>
          <p className="text-sm text-slate-600">
            Trouve les créateurs Magic Clock par{" "}
            <span className="font-medium">@pseudo</span>,{" "}
            <span className="font-medium">#hashtag</span>, métier ou pays.
          </p>
        </header>

        {/* Même composant que dans Amazing, mais en variante 'meet' */}
        <SearchToolbar variant="meet" />
      </section>

      {/* COMPTEUR */}
      <p className="mb-3 text-xs text-slate-500">
        {creators.length} créateurs trouvés.
      </p>

      {/* GRILLE DE CRÉATEURS — MIX INSTAGRAM / MAGIC CLOCK */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((creator: any) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </section>
    </main>
  );
}
