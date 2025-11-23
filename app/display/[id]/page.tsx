// app/display/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { id: string };
};

export default function MagicDisplayPage({ params }: Props) {
  // MVP : on ignore params.id pour l’instant
  // et on affiche un exemple fixe de Magic Display.
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
        <div className="relative aspect-[3/4] w-full bg-slate-100">
          <Image
            src="/pictures/mp-1.png"
            alt="Balayage caramel lumineux"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {/* Ligne créateur + badge d’accès */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src="/images/sample1.jpg"
                  alt="Sofia Rivera"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-sm">
                <div className="font-medium">Sofia Rivera</div>
                <div className="text-[11px] text-slate-500">
                  @sofia_rivera · 12 400 vues
                </div>
              </div>
            </div>

            <div className="rounded-full border border-white/40 bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              FREE
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-lg font-semibold sm:text-xl">
            Balayage caramel lumineux
          </h1>

          {/* Texte MVP */}
          <p className="text-sm text-slate-600">
            MVP : cette page affichera plus tard la fiche complète du Magic
            Display pour ce Magic Clock (formules, temps de pose, produits,
            étapes, etc.). Pour l&apos;instant, elle sert d&apos;exemple visuel
            stable.
          </p>
        </div>
      </section>
    </main>
  );
}
