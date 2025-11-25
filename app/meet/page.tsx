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
  const totalCreators = baseCreators.length;

  // On étend un peu la liste pour remplir plusieurs rangées
  const extendedCreators = Array.from({ length: REPEAT_COUNT }, (_, idx) =>
    baseCreators.map((creator: any) => ({
      ...creator,
      _fakeId: `${creator.id}-repeat-${idx}`,
    }))
  ).flat();

  return (
    <main className="mx-auto flex max-w-5xl flex-col overflow-x-hidden px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Titre + barre de recherche ultra simple (style Instagram) */}
      <header className="mb-4 space-y-3 sm:mb-6">
        <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>

        <div className="w-full max-w-md">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder=""
              className="flex-1 bg-transparent text-sm outline-none"
              disabled
            />
          </label>
        </div>
      </header>

      {/* Résultats + lignes de créateurs */}
      <section className="space-y-6 sm:space-y-8">
        <p className="text-xs text-slate-500">{totalCreators} créateurs trouvés.</p>

        {TRENDING_ROWS.map((row, rowIndex) => {
          const start = rowIndex * CARDS_PER_ROW;
          const rowCreators = extendedCreators.slice(
            start,
            start + CARDS_PER_ROW
          );

          if (!rowCreators.length) return null;

          return (
            <div key={row.id} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {row.label}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {row.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-[11px] font-medium text-brand-600"
                >
                  Voir tout
                </button>
              </div>

              {/* Lignes scrollables façon TikTok, mais SANS marges négatives */}
              <div className="flex gap-3 overflow-x-auto pb-2">
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
    </main>
  );
}
