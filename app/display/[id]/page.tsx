// app/display/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";

import { findContentById } from "@/core/domain/repository";
import CREATORS from "@/features/meet/creators";

type PageProps = {
  params: {
    id: string;
  };
};

export default function MagicDisplayPage({ params }: PageProps) {
  const item = findContentById(params.id);

  if (!item) {
    return (
      <main className="container max-w-3xl py-8 space-y-4">
        <p className="text-sm text-slate-600">
          Ce Magic Clock n&apos;existe pas ou plus.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-brand-600 hover:underline"
        >
          ← Retour au flux Amazing
        </Link>
      </main>
    );
  }

  // ✅ On récupère le bon créateur à partir de item.user
  const creator = CREATORS.find((c) => c.handle === item.user);

  const creatorName = creator?.name ?? "Créateur inconnu";
  const creatorHandle = creator?.handle ?? item.user;
  const creatorCity = creator?.city;
  const creatorLangs = creator?.langs?.join(", ");
  const creatorAvatar = creator?.avatar ?? "/images/sample1.jpg";

  const accessLabel =
    item.access === "FREE"
      ? "FREE"
      : item.access === "ABO"
      ? "Abonnement"
      : "PPV";

  return (
    <main className="container max-w-3xl py-6 pb-24 space-y-4">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
      >
        ← Retour au flux Amazing
      </Link>

      <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* Image principale */}
        <div className="relative aspect-[3/4] w-full bg-slate-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Ligne créateur + badge d’accès */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src={creatorAvatar}
                  alt={creatorName}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-sm">
                <div className="font-medium">{creatorName}</div>
                <div className="text-[11px] text-slate-500">
                  {creatorHandle}
                  {creatorCity ? ` · ${creatorCity}` : ""}
                  {creatorLangs ? ` · Langues : ${creatorLangs}` : ""}
                </div>
              </div>
            </div>

            <div className="rounded-full border border-white/40 bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {accessLabel}
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-lg font-semibold sm:text-xl">
            {item.title}
          </h1>

          {/* Texte MVP (placeholder) */}
          <p className="text-sm text-slate-600">
            MVP : cette page affichera plus tard la fiche complète du Magic
            Display pour ce Magic Clock (formules, temps de pose, produits,
            étapes, etc.). Pour l&apos;instant, elle sert de page de détail
            liée au créateur correct.
          </p>
        </div>
      </article>
    </main>
  );
}
