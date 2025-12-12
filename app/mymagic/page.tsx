// app/mymagic/page.tsx

import Link from "next/link";
import MyMagicToolbar from "@/components/mymagic/MyMagicToolbar";
import MediaCard from "@/features/amazing/MediaCard";
import { listFeed, listCreators } from "@/core/domain/repository";
import Cockpit from "@/features/monet/Cockpit";

export default function MyMagicClockPage() {
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  // Tout le flux Amazing
  const all = listFeed();

  // Normalise les handles pour les comparer proprement
  const normalize = (value?: string | null) =>
    (value ?? "").trim().replace(/^@/, "").toLowerCase();

  const targetHandle = normalize(currentCreator.handle);

  // Détermine si un Magic Clock appartient au créateur courant
  const isOwnedByCurrent = (item: any) => {
    const candidates = [
      (item as any).user,
      (item as any).handle,
      (item as any).creatorHandle,
    ];

    return candidates.map((v) => normalize(v)).includes(targetHandle);
  };

  // Mes Magic Clock créés = ceux qui appartiennent à Aiko
  const created = all.filter((item) => isOwnedByCurrent(item));

  // Magic Clock débloqués = les autres créateurs
  const purchased = all.filter((item) => !isOwnedByCurrent(item));

  // 🟢 Restaure le followerLabel
  const followerLabel = currentCreator.followers.toLocaleString("fr-CH");

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Avatar + infos créateur */}
      <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200">
            <img
              src={currentCreator.avatar}
              alt={currentCreator.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{currentCreator.name}</h1>
            <p className="text-sm text-slate-600">
              @{currentCreator.handle}
              {currentCreator.city ? ` · ${currentCreator.city} (CH)` : ""}
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

      {/* 🔵 Toolbar bulles (messages / profil / cockpit / etc.) */}
      <MyMagicToolbar />

      {/* PROFIL + COCKPIT RÉSUMÉ */}
      <section
        id="mymagic-profile"
        className="mb-8 grid gap-6 lg:grid-cols-3"
      >
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Profil</h2>
          <p className="text-sm text-slate-600">
            Coiffeuse-coloriste professionnelle spécialisée dans les balayages
            blonds, les blonds lumineux et les transformations en douceur. Aiko
            partage ses techniques étape par étape à travers des Magic Clock
            pédagogiques, pour t&apos;aider à reproduire des résultats salon sur
            mesure et respectueux de la fibre.
          </p>
        </div>

        <div
          id="mymagic-cockpit"
          className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4"
        >
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

      {/* MES MAGIC CLOCK CRÉÉS */}
      <section id="mymagic-created" className="mb-8 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Mes Magic Clock créés</h2>
          <p className="text-sm text-slate-600">
            Ici apparaissent tes propres Magic Clock (Studio + Display).
            Pour le MVP, nous réutilisons les contenus du flux Amazing créés par
            ton profil et nous préparons déjà les catégories &laquo; En cours &raquo; et
            &laquo; Publiés &raquo;.
          </p>
        </div>

        <div className="space-y-4">
          {/* Sous-section : En cours (brouillons / en travail) */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              En cours
            </h3>
            <p className="text-xs text-slate-500">
              Magic Clock en construction (MVP : même liste que les publiés, en
              attendant le vrai statut &laquo; draft &raquo;).
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {created.map((item) => (
                <MediaCard key={`draft-${item.id}`} item={item} />
              ))}
            </div>
          </div>

          {/* Sous-section : Publiés (sur Amazing) */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Publiés sur Amazing
            </h3>
            <p className="text-xs text-slate-500">
              Magic Clock déjà visibles dans le flux Amazing (contenus publics
              publiés depuis ton profil).
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {created.map((item) => (
                <MediaCard key={`published-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAGIC CLOCK DÉBLOQUÉS */}
      <section id="mymagic-unlocked" className="space-y-3">
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
              <Link
                href={`/display/${item.id}`}
                className="block text-[11px] font-medium text-brand-600 hover:underline"
              >
                Ouvrir le Magic Display (MVP)
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
