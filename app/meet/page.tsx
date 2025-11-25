import { Search } from "lucide-react";
import { CREATORS } from "@/features/meet/creators";

const REPEAT_COUNT = 6;
const CARDS_PER_ROW = 10;

const TRENDING_ROWS = [
  {
    id: "magic-pro",
    label: "#MagicClockPro",
    description: "Créateurs très actifs sur Magic Clock.",
  },
  {
    id: "balayage",
    label: "#BalayageCaramel",
    description: "Balayages, blonds chauds et jeux de lumière.",
  },
];

function MiniCreatorCard({ creator }: { creator: any }) {
  return (
    <button
      type="button"
      className="w-40 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/60"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs font-semibold text-slate-900">
          {creator.name}
        </p>
        <p className="truncate text-[11px] text-slate-500">
          @{creator.handle}
        </p>
        {typeof creator.followers === "number" && (
          <p className="mt-1 text-[11px] text-slate-500">
            {creator.followers.toLocaleString("fr-CH")} followers
          </p>
        )}
        {(creator.city || creator.country) && (
          <p className="mt-1 text-[11px] text-slate-400">
            {creator.city}
            {creator.city && creator.country ? " · " : ""}
            {creator.country}
          </p>
        )}
      </div>
    </button>
  );
}

export default function MeetPage() {
  const baseCreators = CREATORS;

  const extendedCreators = Array.from({ length: REPEAT_COUNT }, (_, idx) =>
    baseCreators.map((creator: any) => ({
      ...creator,
      _fakeId: `${creator.id}-repeat-${idx}`,
    }))
  ).flat();

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        {/* Titre */}
        <header className="mb-4 sm:mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">Meet me</h1>
        </header>

        {/* Barre de recherche seule, comme Instagram */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder=""
              disabled
            />
          </div>
        </div>

        {/* Compteur */}
        <p className="mb-3 text-xs text-slate-500">
          {baseCreators.length} créateurs trouvés.
        </p>

        {/* Lignes hashtags avec scroll horizontal */}
        <section className="space-y-6 sm:space-y-8">
          {TRENDING_ROWS.map((row, rowIndex) => {
            const start = rowIndex * CARDS_PER_ROW;
            const rowCreators = extendedCreators.slice(
              start,
              start + CARDS_PER_ROW
            );

            return (
              <div key={row.id} className="space-y-2">
                <div className="flex items-baseline justify-between px-1">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {row.label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {row.description}
                    </p>
                  </div>
                </div>

                {/* Lignes scrollables façon TikTok */}
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {rowCreators.map((creator: any) => (
                    <MiniCreatorCard
                      key={creator._fakeId ?? creator.id}
                      creator={creator}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
