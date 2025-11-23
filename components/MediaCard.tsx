import Link from "next/link";
import { Eye, Heart, Play } from "lucide-react";

export type MediaCardProps = {
  // On garde volontairement un type souple pour le MVP
  item: any;
};

export default function MediaCard({ item }: MediaCardProps) {
  const title: string = item?.title ?? "Avant/Après couleur";

  // Dans notre FEED actuel, on n’a que "user" en string,
  // donc on dérive un handle propre et des initiales.
  const rawUser: string = item?.user ?? "sofia";
  const creatorHandle = `@${rawUser}`;
  const avatarInitials =
    rawUser.charAt(0).toUpperCase() || "M";

  const views: number =
    typeof item?.views === "number" ? item.views : 1000;
  const likes: number =
    typeof item?.likes === "number" ? item.likes : 0;

  const tags: string[] =
    item?.tags ?? ["#balayage", "#blond froid", "#soin"];

  const description: string =
    item?.description ??
    "Magic Clock · contenus pédagogiques. Swipe dans le flux pour découvrir d'autres créateurs.";

  const displayUrl: string = item?.displayUrl ?? "#";

  return (
    <article
      className="
        group
        snap-start
        flex flex-col
        overflow-hidden
        rounded-[32px]
        border border-slate-800/60
        bg-slate-950
        text-slate-50
        shadow-xl
        min-h-[calc(100vh-160px)]
        sm:min-h-[420px]
        lg:min-h-[460px]
      "
    >
      {/* Zone média (placeholder gradient pour le MVP) */}
      <div className="relative flex-1 bg-gradient-to-b from-slate-800/60 via-slate-900 to-slate-950">
        {/* Badges top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-3 sm:px-6">
          <span className="inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Magic Display
          </span>

          <span className="hidden text-[10px] text-slate-400 sm:inline">
            Média Magic Clock (avant / après, vidéo, etc.)
          </span>
        </div>

        {/* Icône Play au centre (placeholder vidéo) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur">
            <Play className="h-6 w-6 text-slate-50" />
          </div>
        </div>

        {/* Dégradé bas pour la jonction avec le bloc texte */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* Bloc infos */}
      <div className="relative z-10 border-t border-slate-800/60 bg-slate-950/95 px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
        {/* Ligne créateur */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold">
            {avatarInitials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">{creatorHandle}</span>
            <span className="text-[11px] text-slate-400">
              Magic Clock · contenus pédagogiques
            </span>
          </div>
        </div>

        {/* Titre */}
        <h2 className="mt-2 text-sm font-semibold leading-tight sm:text-base">
          <span className="line-clamp-1">{title}</span>
        </h2>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description courte */}
        <p className="mt-2 text-[11px] leading-snug text-slate-400 sm:text-xs">
          {description}
        </p>

        {/* Stats + bouton */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{views.toLocaleString("fr-CH")}</span>
            </div>
            <div className="inline-flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{likes.toLocaleString("fr-CH")}</span>
            </div>
          </div>

          <Link
            href={displayUrl}
            className="
              inline-flex items-center justify-center
              rounded-full bg-slate-50 px-4 py-1.5
              text-xs font-semibold text-slate-900
              hover:bg-slate-100
            "
          >
            Ouvrir Display
            <span className="ml-1 text-[11px]">↗︎</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
