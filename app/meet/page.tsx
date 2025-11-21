import CreatorCard from "@/features/meet/CreatorCard";
import { listCreators } from "@/core/domain/repository";

export default function Page() {
  const creators = listCreators();

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-semibold">
        Meet me — Découvrir les créateurs
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {creators.map((c) => (
          <CreatorCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
