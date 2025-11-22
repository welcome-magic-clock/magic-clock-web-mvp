import MediaCard from "@/components/MediaCard";
import { getAmazingFeed } from "@/core/domain/repository";

export default async function HomePage() {
  // Fake DB / dépôt de domaine
  const feed = getAmazingFeed?.() ?? [];

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pb-28 pt-6 sm:pb-32 sm:pt-8">
      <header className="mb-2 sm:mb-4">
        <h1 className="text-xl font-semibold">Amazing · flux public</h1>
        <p className="mt-2 text-sm text-slate-600">
          Découvre les meilleurs Magic Clock : transformations, techniques et
          contenus pédagogiques beauté. Sur mobile, chaque carte est pensée
          comme un mini Reel vertical.
        </p>
      </header>

      {/* Liste des cartes — scroll vertical avec snap sur mobile */}
      <section className="flex flex-col gap-6 sm:gap-8 snap-y snap-mandatory">
        {feed.map((item: any, index: number) => (
          <MediaCard key={item.id ?? index} item={item} isFirst={index === 0} />
        ))}
      </section>
    </main>
  );
}
