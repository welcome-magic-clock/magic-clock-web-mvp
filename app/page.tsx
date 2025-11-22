import { listFeed } from "@/core/domain/repository";
import MediaCard from "@/components/MediaCard";

export default function HomePage() {
  const feed = listFeed();

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pb-28 pt-4 sm:max-w-3xl sm:pb-32 sm:pt-6">
      {/* Header léger, façon app mobile */}
      <header className="mb-2 sm:mb-4">
        <h1 className="text-lg font-semibold sm:text-xl">
          Amazing · flux public
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
          Découvre les meilleurs Magic Clock : transformations, techniques et
          pédagogie beauté. Sur mobile, chaque carte est pensée comme un mini
          Reel vertical.
        </p>
      </header>

      {/* Flux vertical avec effet “swipe de carte en carte” */}
      <section className="flex flex-col gap-6 sm:gap-8 snap-y snap-mandatory">
        {feed.map((item: any) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
}
