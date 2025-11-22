import { listFeed } from "@/core/domain/repository";
import { MediaCard } from "@/components/MediaCard";

export const metadata = {
  title: "Magic Clock — Amazing",
};

export default async function AmazingPage() {
  const feed = listFeed();

  return (
    <div className="container pb-24 pt-4 space-y-4">
      {/* Header mobile-friendly */}
      <header className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">
          Amazing · flux public
        </h1>
        <p className="text-xs text-slate-500">
          Découvre les meilleurs Magic Clock : transformations, techniques et
          pédagogie beauté. Sur mobile, chaque carte est pensée comme un mini
          Reel vertical.
        </p>
      </header>

      {/* Grille responsive : 1 colonne mobile, puis 2 / 3 colonnes */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {feed.map((item: any) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}
