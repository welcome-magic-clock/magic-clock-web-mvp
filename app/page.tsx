import MediaCard from "@/components/MediaCard";
import { listFeed } from "@/core/domain/repository";

export default function HomePage() {
  const feed = listFeed();

  return (
    <main className="container pb-24 pt-6 sm:pt-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold">Amazing · flux public</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Découvre les meilleurs Magic Clock : transformations, techniques et
          pédagogie beauté. Sur mobile, chaque carte est pensée comme un mini
          Reel vertical.
        </p>
      </header>

      <section className="space-y-6 md:space-y-8">
        {/* Sur mobile : pile verticale.
            Sur desktop : grille, mais chaque MediaCard garde son format “Reel”. */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {feed.map((content: any) => (
            <MediaCard key={content.id} content={content} />
          ))}
        </div>
      </section>
    </main>
  );
}
