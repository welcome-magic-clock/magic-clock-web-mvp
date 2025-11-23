// app/meet/page.tsx

import { Search, Globe2, Users, Star } from "lucide-react";
import CreatorCard from "@/features/meet/CreatorCard";
import { CREATORS } from "@/features/meet/creators";

export default function MeetPage() {
  const totalCreators = CREATORS.length;

  const specialties = [
    "Balayage",
    "Blond froid",
    "Coupe",
    "Soin",
    "Curly",
    "Techniques avancées",
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Header */}
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>
        <p className="mt-2 text-sm text-slate-600">
          Trouve des créateurs Magic Clock près de toi ou dans le monde entier.
          Sur mobile, swipe la liste pour découvrir de nouveaux profils.
        </p>
      </header>

      {/* Bloc recherche + filtres (UI seulement, pas encore de logique) */}
      <section className="mb-4 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-4">
        <div className="space-y-3">
          {/* Barre de recherche */}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un créateur, une ville, une technique..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Filtres langues */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-slate-500" />
              <button className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                Toutes les langues
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["FR", "EN", "ES", "IT", "DE"].map((lang) => (
                <button
                  key={lang}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre followers (slider visuel) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <span>Min. followers</span>
              </div>
              <span>Aucune limite</span>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              defaultValue={0}
              className="w-full"
            />
          </div>

          {/* Filtres spécialités */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-slate-500" />
                <button className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                  Toutes les spécialités
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700"
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Résumé résultats */}
      <p className="mb-3 text-xs text-slate-500">
        {totalCreators} créateur{totalCreators > 1 ? "s" : ""} trouvé
        {totalCreators > 1 ? "s" : ""}.
      </p>

      {/* Liste de créateurs façon “cartes plein écran” avec snap */}
      <section className="flex flex-col gap-6 sm:gap-8 snap-y snap-mandatory">
        {CREATORS.map((creator) => (
          <div key={creator.id} className="snap-start">
            <CreatorCard c={creator} />
          </div>
        ))}
      </section>
    </main>
  );
}
