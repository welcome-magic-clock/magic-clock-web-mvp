import { Search, Globe2, Users, Star } from "lucide-react";
import CreatorCard from "@/features/meet/CreatorCard";
import { CREATORS } from "@/features/meet/creators";
import type { Creator } from "@/core/domain/types";

type HashtagGroupDef = {
  slug: string;
  hashtag: string;
  description: string;
  filter: (c: Creator) => boolean;
};

const HASHTAG_GROUPS: HashtagGroupDef[] = [
  {
    slug: "magicclockpro",
    hashtag: "#MagicClockPro",
    description: "Créateurs très actifs sur Magic Clock.",
    // Tout le monde
    filter: () => true,
  },
  {
    slug: "balayagecaramel",
    hashtag: "#BalayageCaramel",
    description: "Balayages, blonds chauds et jeux de lumière.",
    filter: (c) =>
      c.specialties.includes("Balayage") ||
      c.specialties.includes("Blond froid"),
  },
  {
    slug: "curlylovers",
    hashtag: "#CurlyLovers",
    description: "Spécialistes des boucles et textures naturelles.",
    filter: (c) => c.specialties.some((s) => s.toLowerCase().includes("curly")),
  },
  {
    slug: "videopro",
    hashtag: "#VideoPro",
    description: "Créateurs très à l’aise avec la vidéo et le storytelling.",
    filter: (c) =>
      c.specialties.some((s) => s.toLowerCase().includes("vidéo")) ||
      c.specialties.some((s) => s.toLowerCase().includes("video")),
  },
];

export default function MeetPage() {
  const baseCreators = CREATORS;
  const totalCreators = baseCreators.length;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28 overflow-x-hidden">
      {/* Header + zone recherche/filtres (collée en haut sur mobile) */}
      <div className="sticky top-0 z-20 border-b border-slate-100 bg-slate-50/95 pb-3 pt-1 backdrop-blur sm:static sm:border-none sm:bg-transparent sm:pb-5">
        <header className="space-y-2 sm:space-y-3">
          <h1 className="text-xl font-semibold sm:text-2xl">Meet me</h1>
          <p className="text-sm text-slate-600">
            Trouve des créateurs Magic Clock près de toi ou dans le monde
            entier. Sur mobile, swipe la liste pour découvrir de nouveaux
            profils.
          </p>
        </header>

        {/* Bloc recherche + filtres (statique pour le MVP) */}
        <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-4 sm:p-5">
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

      {/* Résultats + lignes de créateurs */}
      <section className="mt-4 space-y-8 sm:mt-6">
        <p className="text-xs text-slate-500">
          {totalCreators} créateurs trouvés.
        </p>

        {HASHTAG_GROUPS.map((group) => {
          const creatorsForGroup = baseCreators.filter(group.filter);
          if (!creatorsForGroup.length) return null;

          return (
            <div key={group.slug} className="space-y-2">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  {group.hashtag}
                </h2>
                <p className="text-xs text-slate-500">{group.description}</p>
              </div>

              {/* Ligne horizontale scrollable façon TikTok */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {creatorsForGroup.map((creator) => (
                  <div
                    key={`${group.slug}-${creator.id}`}
                    className="w-[240px] flex-shrink-0 sm:w-[260px]"
                  >
                    <CreatorCard c={creator} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
