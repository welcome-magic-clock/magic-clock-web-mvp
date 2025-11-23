import MediaCard from "@/components/MediaCard";
import { listFeed } from "@/core/domain/repository";

export default async function HomePage() {
  // Récupération du flux Amazing (fake DB / dépôt de domaine)
  const feed = await listFeed();

  // Faux infini : on répète le flux plusieurs fois pour donner une vraie profondeur de scroll
  const extendedFeed = [...feed, ...feed, ...feed];

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold">Amazing · flux public</h1>
        <p className="mt-1 text-sm text-slate-600">
          Découvre les meilleurs Magic Clock : transformations, techniques et
          contenus pédagogiques beauté. Sur mobile, chaque carte est pensée comme
          un mini Reel vertical.
        </p>
      </header>

      {/* Flux principal : cartes en colonne sur mobile, grille sur desktop */}
      <section className="flex flex-col gap-6 sm:gap-8 snap-y snap-mandatory">
        {extendedFeed.map((item: any, index: number) => (
          <MediaCard key={`${item.id}-${index}`} item={item} />
        ))}
      </section>
    </main>
  );
}
