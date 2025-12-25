// app/p/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { findContentById } from "@/core/domain/repository";
import type { Access as FeedAccess } from "@/core/domain/types";

type PageProps = {
  params: { id: string };
};

function formatAccessLabel(access: FeedAccess): string {
  if (access === "FREE") return "FREE";
  if (access === "ABO") return "Abonnement"; // 🔁 ABO (et plus SUB)
  if (access === "PPV") return "PayPerView";
  return "FREE";
}

export default function ContentDetailPage({ params }: PageProps) {
  // 🔑 On laisse l'id en string, le repository gère string/number
  const card = findContentById(params.id);

  if (!card) {
    return notFound();
  }

  const accessLabel = formatAccessLabel(card.access as FeedAccess);
  const username = card.user.replace(/^@/, "");

  const hasBefore = !!card.beforeUrl;
  const hasAfter = !!card.afterUrl;

  return (
    <main className="container max-w-5xl py-8 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Magic Clock — Détail
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {card.title || `Magic Clock #${card.id}`}
          </h1>
          <p className="text-xs text-slate-500">
            par{" "}
            <Link
              href={`/u/${encodeURIComponent(username)}`}
              className="font-medium text-slate-900 hover:underline"
            >
              {username}
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bouton principal vers My Magic Clock */}
          <Link
            href="/mymagic"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Ouvrir dans My Magic Clock
          </Link>

          {/* Lien secondaire vers Amazing (retour au flux) */}
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Retour à Amazing
          </Link>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Bloc AVANT / APRÈS ou image simple */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-900/5">
          {hasBefore || hasAfter ? (
            <div className="grid aspect-[4/3] grid-cols-2 divide-x divide-slate-200 bg-black/5">
              {/* AVANT */}
              <div className="relative">
                {hasBefore ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.beforeUrl as string}
                    alt="Avant"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    Avant
                  </div>
                )}
              </div>

              {/* APRÈS */}
              <div className="relative">
                {hasAfter ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.afterUrl as string}
                    alt="Après"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    Après
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title ?? ""}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* ASIDE DROITE : métadonnées & futur Display */}
        <aside className="space-y-4">
          {/* Accès & stats */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Accès
            </p>
            <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
              {accessLabel}
            </p>

            <p className="mt-3 text-xs text-slate-500">
              {card.views.toLocaleString("fr-CH")} vues
              {card.likes != null && (
                <> · {card.likes.toLocaleString("fr-CH")} likes</>
              )}
            </p>
          </div>

          {/* Placeholder pour le cube 3D (future intégration Magic Display) */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
            <p className="font-medium text-slate-700 mb-1">
              Magic Display (à venir)
            </p>
            <p>
              Ici s’affichera le cube 3D du Magic Clock sélectionné : rotation,
              faces pédagogiques, aiguilles… exactement ce que nous avons
              défini pour le Bear et les autres œuvres.
            </p>
            <p className="mt-2">
              Pour l’instant, ce bloc est une maquette statique pour poser la
              bonne arborescence UX.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
