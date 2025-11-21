import MediaCard from "@/features/amazing/MediaCard";
import { findCreatorByHandle, listFeedByCreator, listCreators } from "@/core/domain/repository";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { username: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const creator = findCreatorByHandle(params.username);
  if (!creator) {
    return {
      title: "@unknown · Magic Clock",
    };
  }
  return {
    title: `@${creator.handle} · ${creator.name}`,
  };
}

export function generateStaticParams() {
  return listCreators().map((c) => ({ username: c.handle }));
}

export default function CreatorPage({ params }: Props) {
  const creator = findCreatorByHandle(params.username);
  if (!creator) {
    notFound();
  }
  const feed = listFeedByCreator(creator!.handle);

  return (
    <div className="container space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-200">
            <img
              src={creator!.avatar}
              alt={creator!.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">@{creator!.handle}</h1>
            <p className="text-sm text-slate-600">{creator!.name}</p>
            <p className="text-sm text-slate-500">
              {creator!.city} · {creator!.followers.toLocaleString()} abonnés
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Langues : {creator!.langs.join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">
            S&apos;abonner
          </button>
          <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm">
            Message
          </button>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contenus</h2>
        {feed.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucun contenu publié pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feed.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
