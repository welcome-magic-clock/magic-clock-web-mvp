import Link from "next/link";
import MediaCard from "@/features/amazing/MediaCard";
import { listFeed, listCreatedByCreator } from "@/core/domain/repository";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";
import { canViewContent } from "@/core/domain/access";

export const metadata = {
  title: "My Magic Clock",
};

export default async function MyMagicClockPage() {
  // MVP : on simule un handle de créateur “connecté”
  const currentCreatorHandle = "sofia";

  // Contexte d’accès (Abo + PPV) depuis le cookie
  const viewer = await getViewerAccessContextFromCookie();

  // Créations : contenus où user === handle
  const created = listCreatedByCreator(currentCreatorHandle);

  // Bibliothèque : contenus du feed global pour lesquels canViewContent = ALLOWED
  const all = listFeed();
  const acquired = all.filter((item) => {
    const decision = canViewContent(
      {
        id: item.id,
        access: item.access,
        user: item.user,
      },
      viewer
    );
    return decision === "ALLOWED";
  });

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
              Votre espace personnel : profil, cockpit et Magic Clock créés ou débloqués.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-2 space-y-2">
          <h2 className="text-lg font-semibold">Profil</h2>
          <p className="text-sm text-slate-600">
            MVP : cette section accueillera vos informations de compte (nom, handle, pays,
            langues, résumé créateur, etc.).
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 space-y-2">
          <h2 className="text-lg font-semibold">Résumé Cockpit</h2>
          <p className="text-sm text-slate-600">
            MVP visuel : ici s&apos;afficheront un extrait de vos revenus estimés, abonnements
            actifs et achats PPV, synchronisés avec le module Monétisation.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mes Magic Clock créés</h2>
        <p className="text-sm text-slate-600">
          Contenus dont vous êtes le créateur. Plus tard, cette section sera liée à vos Magic Clock
          (Studio + Display) réels.
        </p>
        {created.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucun Magic Clock créé pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {created.map((item) => (
              <div key={item.id} className="space-y-2">
                <MediaCard item={item} />
                <Link
                  href={`/display/${item.id}`}
                  className="block text-xs font-medium text-brand-600 hover:underline text-center"
                >
                  Ouvrir le Magic Display (MVP)
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Bibliothèque (Acquis)</h2>
        <p className="text-sm text-slate-600">
          Contenus accessibles grâce à un accès FREE, à un abonnement créateur ou à un achat PPV.
        </p>
        {acquired.length === 0 ? (
          <p className="text-sm text-slate-500">
            Débloquez des Magic Clocks depuis Amazing (FREE / Abo / PPV) pour les voir ici.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {acquired.map((item) => (
              <div key={item.id} className="space-y-2">
                <MediaCard item={item} />
                <Link
                  href={`/display/${item.id}`}
                  className="block text-xs font-medium text-brand-600 hover:underline text-center"
                >
                  Ouvrir le Magic Display (MVP)
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
