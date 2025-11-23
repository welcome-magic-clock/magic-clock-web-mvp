import CreatorCard from "@/features/meet/CreatorCard";
import { CREATORS } from "@/features/meet/creators";

const LANGS = ["FR", "EN", "ES", "IT", "DE"];
const SPECIALITIES = [
  "Balayage",
  "Blond froid",
  "Coupe",
  "Soin",
  "Curly",
  "Techniques avancées",
];

export default function MeetPage() {
  const creators = CREATORS;

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

      {/* Barre de recherche / filtres (MVP statique) */}
      <section className="mb-4 space-y-3 rounded-3xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm sm:mb-6 sm:space-y-4 sm:px-5 sm:py-4">
        {/* Champ de recherche (placeholder visuel) */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
          <span className="text-sm text-slate-400 flex-1">
            Rechercher un créateur, une ville, une technique…
          </span>
        </div>

        {/* Langues */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-white">
            Toutes les langues
          </span>
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700"
            >
              {code}
            </button>
          ))}
        </div>

        {/* Slider followers (visuel) */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>Min. followers</span>
          <span>Aucune limite</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100">
          <div className="h-full w-1/3 rounded-full bg-slate-900" />
        </div>

        {/* Spécialités */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-white">
            Toutes les spécialités
          </span>
          {SPECIALITIES.map((name) => (
            <button
              key={name}
              type="button"
              className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700"
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Compteur */}
      <p className="mb-3 text-xs text-slate-500 sm:mb-4">
        {creators.length} créateurs trouvés.
      </p>

      {/* Liste des créateurs */}
      <section className="flex flex-col gap-6 sm:gap-6">
        {creators.map((c) => (
          <CreatorCard key={c.id} c={c} />
        ))}
      </section>
    </main>
  );
}
