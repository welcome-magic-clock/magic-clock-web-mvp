// app/create/display/page.tsx

import Image from "next/image";
import { FEED } from "@/features/amazing/feed";

const SAMPLE_IMAGE = FEED[0]?.image ?? "/mp-1.png";

export default function MagicDisplayEditorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <h1 className="text-xl font-semibold sm:text-2xl">
        Éditeur Magic Display (MVP)
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        Ici tu prépares l&apos;affichage final de ton Magic Clock : avant/après,
        overlay du profil créateur et niveau d&apos;accès (FREE / Abonnement / PPV).
        Pour l&apos;instant, tout est visuel, sans sauvegarde.
      </p>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Aperçu Magic Display
        </h2>

        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
          {/* Bloc image avant / après */}
          <div className="relative aspect-[9/16] w-full">
            <Image
              src={SAMPLE_IMAGE}
              alt="Aperçu avant / après"
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />

            {/* Dégradé + bandeau bas comme dans Amazing */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-white/40 bg-slate-200">
                  <Image
                    src="/images/sample1.jpg"
                    alt="Sofia Rivera"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    Sofia Rivera
                  </span>
                  <span className="text-xs text-slate-200">
                    @sofia_rivera · 12 400 vues
                  </span>
                </div>
              </div>

              <span className="rounded-full border border-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                FREE
              </span>
            </div>
          </div>

          {/* Texte sous la carte */}
          <div className="border-t border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold">Balayage caramel lumineux</p>
            <p className="mt-1 text-xs text-slate-500">
              MVP : l&apos;image est fixe. Plus tard, elle viendra directement
              de ton Magic Studio (avant / après choisi pour ce Magic Clock).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
