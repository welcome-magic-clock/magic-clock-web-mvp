// app/create/display/page.tsx

import Image from "next/image";

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

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-slate-500">
          APERÇU MAGIC DISPLAY
        </h2>

        <div className="mt-3 rounded-3xl bg-slate-50 p-3 sm:p-4">
          <h3 className="text-sm font-medium text-slate-700">
            Aperçu avant / après
          </h3>

          <div className="mt-3 rounded-3xl bg-slate-100 p-3">
            {/* Carte Magic Display */}
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-slate-200">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/mp-1.png"
                  alt="Balayage caramel lumineux - avant/après"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 400px"
                  priority
                />

                {/* Gradient bas + barre d'infos créateur */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/90 text-sm font-semibold">
                      S
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">
                        Sofia Rivera
                      </span>
                      <span className="text-[11px] text-slate-200">
                        @sofia_rivera · 12&nbsp;400 vues
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    FREE
                  </span>
                </div>
              </div>
            </div>

            {/* Légende sous la carte */}
            <div className="mt-4 space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Balayage caramel lumineux
              </p>
              <p className="text-xs text-slate-600">
                MVP : l&apos;image est fixe. Plus tard, elle viendra directement de
                ton Magic Studio (avant / après choisi pour ce Magic Clock).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
