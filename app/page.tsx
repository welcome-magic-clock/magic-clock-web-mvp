import MediaCard from "@/components/MediaCard";
import { listFeed } from "@/core/domain/repository";

const REPEAT_COUNT = 8; // on répète le feed 8x pour simuler un scroll infini

export default async function HomePage() {
  const feed = await listFeed();

  // On duplique le feed plusieurs fois avec des IDs factices
  const extendedFeed = Array.from({ length: REPEAT_COUNT }, (_, idx) =>
    feed.map((item: any) => ({
      ...item,
      _fakeId: `${item.id}-repeat-${idx}`,
    }))
  ).flat();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Amazing · flux public
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Découvre les meilleurs Magic Clock : transformations, techniques et contenus pédagogiques beauté.
          Sur mobile, chaque carte est pensée comme un mini Reel vertical.
        </p>
      </header>

      <section className="flex flex-col gap-6 sm:gap-8 snap-y snap-mandatory">
        {extendedFeed.map((item: any) => (
          <MediaCard key={item._fakeId} item={item} />
        ))}
      </section>
    </main>
  );
}
