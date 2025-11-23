// app/page.tsx

import { FEED } from "@/features/amazing/feed";
import FeedCard from "@/features/amazing/FeedCard";

const REPEAT_COUNT = 10; // on répète 10x pour simuler un scroll infini

export default function AmazingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Amazing · flux public
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Découvre les meilleurs Magic Clock : transformations, techniques et
          contenus pédagogiques beauté. Sur mobile, chaque carte est pensée
          comme un mini Reel vertical.
        </p>
      </header>

      <p className="mb-4 text-sm text-slate-500">
        {FEED.length} transformations trouvées.
      </p>

      <section className="flex flex-col gap-6 sm:gap-8 snap-y snap-mandatory">
        {Array.from({ length: REPEAT_COUNT }).map((_, idx) =>
          FEED.map((item) => (
            <FeedCard
              key={`${item.id}-repeat-${idx}`}
              item={item}
            />
          ))
        )}
      </section>
    </main>
  );
}
