import MediaCard from "@/features/amazing/MediaCard";
import { listFeed } from "@/core/domain/repository";

export default function Page() {
  const feed = listFeed();

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-semibold">Amazing — Flux public</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feed.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
