// app/u/[handle]/page.tsx

import Link from "next/link";
import MediaCard from "@/features/amazing/MediaCard";
import { listCreators, listFeedByCreator } from "@/core/domain/repository";

type PageProps = {
  params: {
    handle: string;
  };
};

function resolveCreatorFromParam(handleParam: string) {
  const creators = listCreators();
  const normalized = handleParam.toLowerCase();

  // on essaie plusieurs formes possibles
  return (
    creators.find(
      (c) => c.handle.toLowerCase() === normalized
    ) ||
    creators.find(
      (c) => c.handle.replace(/^@/, "").toLowerCase() === normalized
    ) ||
    creators.find(
      (c) =>
        c.handle.replace(/^@/, "").replace(/_/g, "-").toLowerCase() ===
        normalized
    ) ||
    creators[0]
  );
}

export default function CreatorPublicPage({ params }: PageProps) {
  const creator = resolveCreatorFromParam(params.handle);

  // on utilise directement son handle pour filtrer le feed
  const created = listFeedByCreator(creator.handle);

  const followerLabel = creator.followers.toLocaleString("fr-CH");
  const langs =
    creator.langs && creator.langs.length > 0
      ? creator.langs.join(", ")
      : undefined;

  return (
    <main className="container space-y-8 py-8">
      {/* Lien retour */}
      <div>
        <Link
          href="/meet"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          ← Retour à Meet me
        </Link>
      </div>

      {/* HEADER PROFIL PUBLIC */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-200">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">{creator.name}</h1>
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Créateur Magic Clock
              </span>
            </div>
            <p className="text-sm text-slate-600">
              @{creator.handle}
              {creator.city ? ` · ${creator.city}` : ""}
              {langs ? ` · Langues : ${langs}` : ""}
            </p>
            <p className="text-xs text-slate-500">
              {followerLabel} followers · {created.length} Magic Clock dans
              Amazing (MVP)
            </p>
          </div>
        </div>

        {/* Petit lien miroir vers My Magic Clock */}
        <div className="text-sm">
          <Link
            href="/mymagic"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Ouvrir My Magic Clock (vue créateur)
          </Link>
        </div>
      </header>

      {/* SECTION CONTENUS DU CRÉATEUR */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Magic Clock dans Amazing</h2>
        <p className="text-sm text-slate-600">
          Les Magic Clock publiés par {creator.name} dans le flux Amazing.
          Plus tard, chaque carte sera liée à son Magic Studio &amp; Magic
          Display complet.
        </p>

        {created.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucun Magic Clock publié pour l&apos;instant (MVP).
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {created.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
