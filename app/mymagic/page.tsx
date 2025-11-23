// app/mymagic/page.tsx

import Link from "next/link";
import MediaCard from "@/features/amazing/MediaCard";
import { listFeed, listCreators } from "@/core/domain/repository";

export default function MyMagicClockPage() {
  // On récupère tout le feed pour remplir les sections "créés" et "débloqués"
  const all = listFeed();
  const created = all.slice(0, 4);
  const purchased = all.slice(4, 8);

  // On choisit Aiko Tanaka comme créatrice "courante"
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const followerLabel = currentCreator.followers.toLocaleString("fr-CH");

  return (
    <div className="container space-y-8">
      {/* HEADER PROFIL CRÉATEUR */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-200">
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
            <p className="text-[11px] text-slate-500">
              Vue publique :{" "}
              <Link
                href={`/u/${currentCreator.handle}`}
                className="font-medium text-brand-600 hover:underline"
              >
                voir mon profil créateur
              </Link>
            </p>
          </div>
        </div>
      </header>

      {/* PROFIL + COCKPIT RÉSUMÉ */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-2 space-y-2">
          <h2 className="text-lg font-semibold">Profil</h2>
          <p className="text-sm text-slate-600">
            MVP : cette section accueillera tes informations de compte
            (bio créateur, liens externes, spécialités, certifications,
            langues, etc.). Pour l&apos;instant, elle illustre simplement
            l&apos;espace profil associé à ton compte Magic Clock.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 space-y-2">
          <h2 className="text-lg font-semibold">Résumé Cockpit</h2>
          <p className="text-sm text-slate-600">
            MVP visuel : ici s&apos;afficheront un extrait de tes revenus
            estimés (Abo + PPV), abonnements actifs et achats PPV, synchronisés
            avec le module Monétisation.
          </p>
        </div>
      </section>

      {/* MES MAGIC CLOCK CRÉÉS */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mes Magic Clock créés</h2>
        <p className="text-sm text-slate-600">
          Pour l&apos;instant, nous réutilisons une sélection de contenus du
          flux Amazing comme aperçu. Plus tard, seuls tes propres Magic Clock
          (Studio + Display) apparaîtront ici.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {created.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* MAGIC CLOCK DÉBLOQUÉS */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Magic Clock débloqués (Abonnements &amp; PPV)
        </h2>
        <p className="text-sm text-slate-600">
          Section bibliothèque de l&apos;utilisateur : contenus accessibles
          grâce à un abonnement ou à un achat PPV. Pour le MVP, nous affichons
          une autre sélection du flux Amazing.
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
