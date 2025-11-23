// app/mymagic/page.tsx

import MediaCard from "@/features/amazing/MediaCard";
import { listFeed } from "@/core/domain/repository";
import type { FeedCard } from "@/core/domain/types";

export default function MyMagicClockPage() {
  // On force le type du feed sur FeedCard[] pour être aligné avec MediaCard
  const all = listFeed() as unknown as FeedCard[];
  const created = all.slice(0, 4);
  const purchased = all.slice(4, 8);

  return (
    <div className="container space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-200">
            <img
              src="/images/sample1.jpg"
              alt="Profil utilisateur"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">My Magic Clock</h1>
            <p className="text-sm text-slate-600">
              Votre espace personnel : profil, cockpit et Magic Clock créés ou
              débloqués.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-2 space-y-2">
          <h2 className="text-lg font-semibold">Profil</h2>
          <p className="text-sm text-slate-600">
            MVP : cette section accueillera vos informations de compte (nom,
            handle, pays, langues, résumé créateur, etc.).
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 space-y-2">
          <h2 className="text-lg font-semibold">Résumé Cockpit</h2>
          <p className="text-sm text-slate-600">
            MVP visuel : ici s&apos;afficheront un extrait de vos revenus
            estimés, abonnements actifs et achats PPV, synchronisés avec le
            module Monétisation.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mes Magic Clock créés</h2>
        <p className="text-sm text-slate-600">
          Pour l&apos;instant, nous réutilisons une sélection de contenus du
          flux Amazing comme aperçu. Plus tard, seuls vos propres Magic Clock
          (Studio + Display) apparaîtront ici.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {created.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Magic Clock débloqués (Abonnements &amp; PPV)
        </h2>
        <p className="text-sm text-slate-600">
          Section bibliothèque de l&apos;utilisateur : contenus accessibles
          grâce à un abonnement ou à un achat PPV. Pour le MVP, nous affichons
          une autre sélection du flux.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {purchased.map((item) => (
            <div key={item.id} className="space-y-2">
              <MediaCard item={item} />
              <a
                href={`/display/${item.id}`}
                className="block text-[11px] font-medium text-brand-600 hover:underline"
              >
                Ouvrir le Magic Display (MVP)
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
