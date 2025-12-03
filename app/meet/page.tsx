// app/meet/page.tsx

import { SearchToolbar } from "@/components/search/SearchToolbar";
import { CREATORS } from "@/features/meet/creators";
import CreatorCard from "@/features/meet/CreatorCard";

const REPEAT_COUNT = 4; // on répète la liste pour allonger le scroll

export default function MeetPage() {
  const baseCreators = CREATORS;

  // On duplique les créateurs pour avoir un long scroll (fake infini)
  const extendedCreators = Array.from({ length: REPEAT_COUNT }, (_, idx) =>
    baseCreators.map((creator: any) => ({
      ...creator,
      _fakeId: `${creator.id}-repeat-${idx}`,
    }))
  ).flat();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* 🔍 Barre de recherche + bulles */}
      <section className="mb-4">
        <SearchToolbar variant="meetme" />
      </section>

      {/* 🧑‍🎨 Grille de créateurs : 2 colonnes mobile / 3 colonnes desktop */}
      <section
        aria-label="Créateurs Magic Clock"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6"
      >
        {extendedCreators.map((creator: any) => {
          const { _fakeId, ...creatorProps } = creator;

          return (
            <CreatorCard
              key={_fakeId ?? creator.id}
              {...creatorProps} // on passe les props “plates”, pas creator={...}
            />
          );
        })}
      </section>
    </main>
  );
}
