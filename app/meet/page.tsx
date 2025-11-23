import CreatorCard from "@/features/meet/CreatorCard";
import { CREATORS } from "@/features/meet/creators";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Meet me — Découvrir les créateurs</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CREATORS.map((c) => (
            <CreatorCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </main>
  );
}
