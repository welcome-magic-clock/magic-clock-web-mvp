// app/mymagic/page.tsx

import { MyMagicToolbar } from "@/components/navigation/MyMagicToolbar";
import MediaCard from "@/features/amazing/MediaCard";
import {
  listFeed,
  listCreators,
  listFeedByCreator,
} from "@/core/domain/repository";
import Cockpit from "@/features/monet/Cockpit";

export default function MyMagicClockPage() {
  // On choisit Aiko Tanaka comme créatrice "courante"
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  // On récupère tout le feed + on sépare :
  // - créés par Aiko
  // - débloqués (les autres)
  const all = listFeed();
  const created = listFeedByCreator(currentCreator.handle);
  const purchased = all.filter((item) => item.user !== currentCreator.handle);

  const followerLabel = currentCreator.followers.toLocaleString("fr-CH");

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* 🔮 Menu bulles interne My Magic Clock */}
      <section className="mb-4">
        <MyMagicToolbar />
      </section>

      {/* HEADER PROFIL CRÉATEUR */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200">
            <img
              src={currentCreator.avatar}
              alt={currentCreator.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">
                {currentCreator.name}
              </h1>
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Créateur Magic Clock
              </span>
            </div>
            <p className="text-sm text-slate-600">
              @{currentCreator.handle}
              {currentCreator.city ? ` · ${currentCreator.city}` : ""}
              {currentCreator.langs?.length
                ? ` · Langues : ${currentCreator.langs.join(", ")}`
                : ""}
            </p>
            <p className="text-xs text-slate-500">
              {followerLabel} followers · {created.length} Magic Clock créés ·{" "}
              {purchased.length} Magic Clock débloqués (MVP)
            </p>
          </div>
        </div>
      </header>

      {/* PROFIL + COCKPIT RÉSUMÉ */}
      <section className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Profil</h2>
          <p className="text-sm text-slate-600">
            MVP : cette section accueillera tes informations de compte
            (bio créateur, liens externes, spécialités, certifications,
            langues, etc.). Pour l&apos;instant, elle illustre simplement
            l&apos;espace profil associé à ton compte Magic Clock.
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
          <h2 className="text-lg font-semibold">Résumé Cockpit</h2>

          <Cockpit mode="compact" followers={currentCreator.followers} />

          <a
            href="/monet"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline"
          >
            Ouvrir le cockpit complet
            <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      {/* MES MAGIC CLOCK CRÉÉS (uniquement ceux d'Aiko) */}
      <section className="mb-8 space-y-3" id="creations">
        <h2 className="text-lg font-semibold">Mes Magic Clock créés</h2>
        <p className="text-sm text-slate-600">
          Ici apparaissent uniquement tes propres Magic Clock (Studio + Display).
          Pour le MVP, nous réutilisons les contenus du flux Amazing créés par
          ton profil.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {created.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* MAGIC CLOCK DÉBLOQUÉS (les autres créateurs) */}
      <section className="space-y-3" id="unlocked">
        <h2 className="text-lg font-semibold">
          Magic Clock débloqués (Abonnements &amp; PPV)
        </h2>
        <p className="text-sm text-slate-600">
          Section bibliothèque de l&apos;utilisateur : contenus accessibles
          grâce à un abonnement ou à un achat PPV. Pour le MVP, nous affichons
          ici les autres Magic Clock du flux Amazing (autres créateurs que toi).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </main>
  );
}
