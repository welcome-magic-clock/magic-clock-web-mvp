// app/create/display/page.tsx

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

        <div className="mt-4 rounded-3xl bg-slate-50 p-3 sm:p-4">
          <p className="text-sm font-medium text-slate-700">
            Aperçu avant / après
          </p>

          <div className="mt-3 rounded-3xl bg-slate-100 p-3 sm:p-4">
            {/* 🧊 Carte Magic Display avec ratio fixe */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-slate-200">
              {/* ratio ~3:4 via padding-top */}
              <div className="relative w-full pt-[133%]">
                <img
                  src="/pictures/mp-1.png"
                  alt="Balayage caramel lumineux - Magic Display"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay profil + badge FREE */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 pb-4 pt-10 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-white/40 bg-slate-200">
                      <img
                        src="/images/sample1.jpg"
                        alt="Avatar créateur"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5 text-sm">
                      <div className="font-medium leading-tight">
                        Sofia Rivera
                      </div>
                      <div className="text-xs text-slate-200">
                        @sofia_rivera · 12 400 vues
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-full border border-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    FREE
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-base font-semibold text-slate-900">
                Balayage caramel lumineux
              </p>
              <p className="text-xs text-slate-600">
                MVP : l&apos;image est fixe. Plus tard, elle viendra
                directement de ton Magic Studio (avant / après choisi pour ce
                Magic Clock).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
