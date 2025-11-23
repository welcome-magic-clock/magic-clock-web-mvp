"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Globe2, Users, Star, Sparkles } from "lucide-react";

// ─────────────────────────────────────────────
// Types & faux créateurs (MVP)
// ─────────────────────────────────────────────

type Creator = {
  id: number;
  name: string;
  handle: string;
  location: string;
  country: string;
  language: string;
  specialties: string[];
  followers: number;
  avatarInitial: string;
  isOnline: boolean;
  aboPrice: number;
  ppvPrice: number;
};

const CREATORS: Creator[] = [
  {
    id: 1,
    name: "Sofia",
    handle: "@sofia_colorist",
    location: "Genève",
    country: "Suisse",
    language: "FR",
    specialties: ["Balayage", "Blond froid", "Soin"],
    followers: 18500,
    avatarInitial: "S",
    isOnline: true,
    aboPrice: 14.9,
    ppvPrice: 9.9,
  },
  {
    id: 2,
    name: "Maya",
    handle: "@maya_hair",
    location: "Paris",
    country: "France",
    language: "FR",
    specialties: ["Coupe", "Brun glossy"],
    followers: 32000,
    avatarInitial: "M",
    isOnline: false,
    aboPrice: 7.9,
    ppvPrice: 4.9,
  },
  {
    id: 3,
    name: "Lena",
    handle: "@lena_colorstudio",
    location: "Barcelona",
    country: "Espagne",
    language: "ES",
    specialties: ["Balayage", "Copper", "Curly"],
    followers: 54000,
    avatarInitial: "L",
    isOnline: true,
    aboPrice: 11.9,
    ppvPrice: 7.9,
  },
  {
    id: 4,
    name: "Alex",
    handle: "@alex_blondexpert",
    location: "Berlin",
    country: "Allemagne",
    language: "DE",
    specialties: ["Blond froid", "Techniques avancées"],
    followers: 8700,
    avatarInitial: "A",
    isOnline: false,
    aboPrice: 19.9,
    ppvPrice: 14.9,
  },
];

// Langues & spécialités proposées dans les filtres
const LANGS = ["Toutes", "FR", "EN", "ES", "IT", "DE"];
const SPECIALTIES = [
  "Balayage",
  "Blond froid",
  "Coupe",
  "Soin",
  "Curly",
  "Techniques avancées",
];

export default function MeetPage() {
  const [query, setQuery] = useState("");
  const [langFilter, setLangFilter] = useState<string>("Toutes");
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [minFollowers, setMinFollowers] = useState<number>(0);

  const filteredCreators = useMemo(() => {
    return CREATORS.filter((creator) => {
      const q = query.trim().toLowerCase();

      const matchesQuery =
        !q ||
        creator.name.toLowerCase().includes(q) ||
        creator.handle.toLowerCase().includes(q) ||
        creator.location.toLowerCase().includes(q) ||
        creator.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesLang =
        langFilter === "Toutes" ? true : creator.language === langFilter;

      const matchesSpecialty = specialtyFilter
        ? creator.specialties.includes(specialtyFilter)
        : true;

      const matchesFollowers = creator.followers >= minFollowers;

      return matchesQuery && matchesLang && matchesSpecialty && matchesFollowers;
    });
  }, [query, langFilter, specialtyFilter, minFollowers]);

  return (
    <main className="container py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Meet me</h1>
        <p className="text-sm text-slate-600 max-w-xl">
          Trouve des créateurs Magic Clock près de toi ou dans le monde entier.
          Sur mobile, swipe la liste pour découvrir de nouveaux profils.
        </p>
      </header>

      {/* Filtres principaux */}
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-3 sm:p-4 shadow-sm">
        {/* Barre de recherche */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un créateur, une ville, une technique..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Filtres rapides (langues + followers) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Langues */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Globe2 className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex gap-1.5">
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLangFilter(lang)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium border ${
                    langFilter === lang
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {lang === "Toutes" ? "Toutes les langues" : lang}
                </button>
              ))}
            </div>
          </div>

          {/* Followers min */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                Min. followers
              </span>
              <span className="font-medium text-slate-700">
                {minFollowers === 0
                  ? "Aucune limite"
                  : `${minFollowers.toLocaleString("fr-CH")}+`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={5000}
              value={minFollowers}
              onChange={(e) => setMinFollowers(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Spécialités (chips scrollables) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Star className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setSpecialtyFilter(null)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium border ${
                specialtyFilter === null
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              Toutes les spécialités
            </button>
            {SPECIALTIES.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() =>
                  setSpecialtyFilter(
                    specialtyFilter === spec ? null : spec
                  )
                }
                className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium border ${
                  specialtyFilter === spec
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {filteredCreators.length} créateur
            {filteredCreators.length > 1 ? "s" : ""} trouvé
            {filteredCreators.length > 1 ? "s" : ""}.
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            Swipe pour découvrir de nouveaux profils.
          </span>
        </div>

        <div className="flex flex-col gap-4 pb-4">
          {filteredCreators.map((creator) => (
            <article
              key={creator.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-50 shadow-sm sm:hover:shadow-md transition-shadow"
            >
              {/* Bandeau top (média) */}
              <div className="relative h-[52vh] min-h-[320px] max-h-[520px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Magic Display
                  </span>
                </div>
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900">
                      <span className="ml-0.5 text-xs font-semibold">
                        ▶
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Infos créateur */}
              <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
                      {creator.avatarInitial}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {creator.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {creator.handle} · Magic Clock
                      </span>
                    </div>
                  </div>
                  <div className="hidden text-right text-[11px] text-slate-400 sm:block">
                    <div className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>
                        {creator.followers.toLocaleString("fr-CH")} followers
                      </span>
                    </div>
                    <div className="mt-0.5 inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{creator.location}</span>
                    </div>
                  </div>
                </div>

                {/* Spécialités */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {creator.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] text-slate-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Légende + métriques */}
                <div className="mt-2 flex flex-col gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs">
                    Contenus pédagogiques et transformations beauté avec Magic
                    Clock. Abonnements & PPV disponibles.
                  </p>
                  <div className="flex items-center gap-3 sm:text-right">
                    <div className="flex flex-col gap-0.5">
                      <span>
                        Abo dès{" "}
                        <span className="font-semibold text-slate-100">
                          {creator.aboPrice.toFixed(2)} CHF
                        </span>
                        /mois
                      </span>
                      <span>
                        PPV dès{" "}
                        <span className="font-semibold text-slate-100">
                          {creator.ppvPrice.toFixed(2)} CHF
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${
                        creator.isOnline ? "bg-emerald-400" : "bg-slate-500"
                      }`}
                    />
                    <span>
                      {creator.isOnline
                        ? "Actuellement en ligne"
                        : "Répond généralement en moins de 24h"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100"
                    >
                      Voir profil
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm"
                    >
                      Ouvrir Display ↗︎
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filteredCreators.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-center text-sm text-slate-500">
              Aucun créateur ne correspond encore à ces filtres. Essaie d’élargir
              la recherche (langue, spécialité ou followers).
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
