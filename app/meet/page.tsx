import { Search, Globe2, Users, Star } from "lucide-react";
import { CREATORS } from "@/features/meet/creators";

const REPEAT_COUNT = 6; // on répète la liste pour remplir plusieurs lignes
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
  {
    id: "blond-froid",
    label: "#BlondFroid",
    description: "Spécialistes du blond froid et polaire.",
  },
  {
    id: "curly-care",
    label: "#CurlyCare",
    description: "Boucles, wavy et méthodes curly.",
  },
  {
    id: "advanced",
    label: "#TechniquesAvancées",
    description: "Colorimétrie avancée, corrections, transformations.",
  },
];

function MiniCreatorCard({ creator }: { creator: any }) {
  return (
    <button
      className="w-40 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-brand-500/60"
      type="button"
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

  // On étend un peu la liste pour remplir plusieurs rangées
  const extendedCreators = Array.from({ length: REPEAT_COUNT }, (_, idx) =>
    baseCreators.map((creator: any) => ({
      ...creator,
      _fakeId: `${creator.id}-repeat-${idx}`,
    }))
  ).flat();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28 overflow-x-hidden">
      {/* HEADER + FILTRES STICKY */}
      <div className="sticky top-0 z-20 mb-4 border-b border-slate-200/70 bg-slate-50/95 px-4 pb-4 pt-1 backdrop-blur sm:px-6">
        {/* Header texte */}
        <header className="mb-3 space-y-2 sm:mb-4">
          <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>
          <p className="text-sm text-slate-600">
            Trouve des créateurs Magic Clock près de toi ou dans le monde
            entier. Sur mobile, swipe la liste pour découvrir de nouveaux
            profils.
          </p>
        </header>

        {/* Bloc recherche + filtres (statique pour le MVP) */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {/* Barre de recherche */}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un créateur, une ville, une technique..."
              className="h-8 w-full bg-transparent text-xs outline-none placeholder:text-slate-400 sm:text-sm"
              disabled
            />
          </div>

          <div className="mt-3 grid gap-3 text-xs sm:mt-4 sm:text-[13px]">
            {/* Langues */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-slate-100 px-2.5 text-[11px] text-slate-500">
                <Globe2 className="mr-1 h-3 w-3" />
                Toutes les langues
              </span>
              {["FR", "EN", "ES", "IT", "DE"].map((code) => (
                <span
                  key={code}
                  className="inline-flex h-7 items-center rounded-full border border-slate-200 px-3"
                >
                  {code}
                </span>
              ))}
            </div>

            {/* Followers (placeholder slider) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Min. followers
                </span>
                <span>Aucune limite</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className="h-full w-1/3 rounded-full bg-slate-400" />
              </div>
            </div>

            {/* Spécialités */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-slate-900 px-3 text-[11px] font-medium text-white">
                <Star className="mr-1 h-3 w-3" />
                Toutes les spécialités
              </span>
              {[
                "Balayage",
                "Blond froid",
                "Coupe",
                "Soin",
                "Curly",
                "Techniques avancées",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex h-7 items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-[11px] text-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Petit compteur sous le bloc sticky */}
      <p className="mb-3 text-xs text-slate-500">
        {baseCreators.length} créateurs trouvés.
      </p>

      {/* LIGNES TYPE TIKTOK DISCOVER */}
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
                <button
                  type="button"
                  className="text-[11px] font-medium text-brand-600"
                >
                  Voir tout
                </button>
              </div>

              {/* CONTAINER sans marges négatives */}
              <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-2">
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
