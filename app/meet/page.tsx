import { Search, Globe2, Users, Star } from "lucide-react";
import CreatorCard from "@/features/meet/CreatorCard";
import { CREATORS } from "@/features/meet/creators";

export default function MeetPage() {
  // Faux infini : on répète la liste de créateurs
  const extendedCreators = [...CREATORS, ...CREATORS, ...CREATORS];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
      {/* Header */}
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold">Meet me</h1>
        <p className="mt-1 text-sm text-slate-600">
          Trouve des créateurs Magic Clock près de toi ou dans le monde entier.
          Sur mobile, swipe la liste pour découvrir de nouveaux profils.
        </p>
      </header>

      {/* Bloc recherche + filtres */}
      <section className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {/* Barre de recherche */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 sm:px-4">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un créateur, une ville, une technique..."
            className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Langues */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-slate-400" />
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
              Toutes les langues
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["FR", "EN", "ES", "IT", "DE"].map((lang) => (
              <button
                key={lang}
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Min followers (slider déco pour le moment) */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Users className="h-4 w-4 text-slate-400" />
          <span>Min. followers</span>
          <div className="mx-2 flex-1">
            <input
              type="range"
              min={0}
              max={100000}
              defaultValue={0}
              className="w-full accent-indigo-500"
            />
          </div>
          <span className="whitespace-nowrap text-[11px] text-slate-400">
            Aucune limite
          </span>
        </div>

        {/* Spécialités */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-slate-400" />
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
              Toutes les spécialités
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Balayage",
              "Blond froid",
              "Coupe",
              "Soin",
              "Curly",
              "Techniques avancées",
            ].map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Compteur */}
      <p className="mb-3 text-xs text-slate-500">
        {CREATORS.length} créateurs trouvés.
      </p>

      {/* Liste des créateurs avec snap comme Amazing */}
      <section className="flex flex-col gap-6 sm:gap-8 snap-y snap-mandatory">
        {extendedCreators.map((creator, index) => (
          <div key={`${creator.id}-${index}`} className="snap-start">
            <CreatorCard c={creator} />
          </div>
        ))}
      </section>
    </main>
  );
}
