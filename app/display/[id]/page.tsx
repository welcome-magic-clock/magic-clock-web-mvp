// app/display/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { getDisplayCardById } from "@/core/domain/repository";

type PageProps = {
  params: { id: string };
};

export default function MagicDisplayPage({ params }: PageProps) {
  const data = getDisplayCardById(params.id);

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">
        <p className="mb-4 text-sm text-slate-500">
          Ce Magic Clock n&apos;existe pas ou plus.
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          ← Retour au flux Amazing
        </Link>
      </main>
    );
  }

  const { card, creator } = data;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">
      <Link
        href="/"
        className="text-sm font-medium text-brand-600 hover:underline"
      >
        ← Retour au flux Amazing
      </Link>

      <section className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* Image avant / après */}
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        </div>

        {/* Bandeau créateur + badge FREE/PPV/ABO */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
              <Image
                src={creator.avatar}
                alt={creator.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{creator.name}</span>
              <span className="text-xs text-slate-500">
                @{creator.handle} ·{" "}
                {card.views.toLocaleString("fr-FR")} vues
              </span>
            </div>
            <span className="ml-auto rounded-full border border-white/80 bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {card.access}
            </span>
          </div>

          {/* Titre + texte MVP */}
          <h1 className="mt-4 text-lg font-semibold">{card.title}</h1>
          <p className="mt-2 text-sm text-slate-600">
            MVP : cette page affichera plus tard la fiche complète du Magic
            Display (formules, temps de pose, produits utilisés, étapes, etc.).
          </p>
        </div>
      </section>
    </main>
  );
}
