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
        overlay du profil créateur et niveau d&apos;accès (FREE / Abonnement /
        PPV). Pour l&apos;instant, tout est visuel, sans sauvegarde.
      </p>

      {/* APERÇU MAGIC DISPLAY */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-slate-500">
          APERÇU MAGIC DISPLAY
        </h2>

        <div className="mt-4 rounded-3xl bg-slate-50 p-3 sm:p-4">
          <p className="text-sm font-medium text-slate-600">
            Aperçu avant / après
          </p>

          <div className="mt-3">
            <article className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-sm">
              {/* Image avant / après */}
              <div className="relative w-full aspect-[3/4] bg-slate-100">
                <Image
                  src="/pictures/mp-1.jpg"
                  alt="Exemple Magic Display - balayage caramel lumineux"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 400px, 100vw"
                />

                {/* Overlay gradient + bandeau créateur */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                      <span className="text-xs font-semibold text-slate-900">
                        S
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">
                        Sofia Rivera
                      </p>
                      <p className="text-[11px] text-slate-200">
                        @sofia_rivera · 12 400 vues
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/70 bg-black/30 px-3 py-1 text-xs font-semibold text-white">
                    FREE
                  </span>
                </div>
              </div>

              {/* Texte sous l’image */}
              <div className="space-y-1 px-4 py-3">
                <h3 className="text-sm font-semibold">
                  Balayage caramel lumineux
                </h3>
                <p className="pb-2 text-xs text-slate-500">
                  MVP : l&apos;image est fixe. Plus tard, elle viendra
                  directement de ton Magic Studio (avant / après choisi pour ce
                  Magic Clock).
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
