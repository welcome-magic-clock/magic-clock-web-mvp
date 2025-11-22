import MediaCard from "@/components/MediaCard";
import { listFeed } from "@/core/domain/repository";

export default async function HomePage() {
  // Fake DB / dépôt de domaine pour le MVP
  const feed = await listFeed();

  return (
    <main className="container pb-24 pt-6 sm:pt-8">
      {/* Header plus léger, adapté mobile */}
      <header className="mb-4 sm:mb-8">
        <h1 className="text-lg font-semibold sm:text-xl">
          Amazing · flux public
        </h1>

        {/* Version courte pour mobile */}
        <p className="mt-1 text-xs text-slate-600 sm:hidden">
          Découvre les meilleurs Magic Clock, pensés comme des mini Reels
          beauté.
        </p>

        {/* Version complète pour desktop / tablette */}
        <p className="mt-2 hidden text-sm text-slate-600 sm:block">
          Découvre les meilleurs Magic Clock : transformations, techniques et
          contenus pédagogiques beauté. Sur mobile, chaque carte est pensée
          comme un mini Reel vertical.
        </p>
      </header>

      {/* Flux avec comportement “swipe carte par carte” sur mobile */}
      <section className="flex flex-col gap-4 sm:gap-6 snap-y snap-mandatory">
        {feed.map((item: any) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
}
