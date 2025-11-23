// app/create/display/page.tsx

import Image from "next/image";

export default function MagicDisplayEditorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Éditeur Magic Display (MVP)
        </h1>
        <p className="text-sm text-slate-600">
          Ici tu prépares l&apos;affichage final de ton Magic Clock : avant/après,
          overlay du profil créateur et niveau d&apos;accès (FREE / Abonnement / PPV).
          Pour l&apos;instant, tout est visuel, sans sauvegarde.
        </p>
      </header>

      {/* Aperçu Magic Display */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6">
        <h2 className="text-xs font-semibold tracking-wide text-slate-500">
          APERÇU MAGIC DISPLAY
        </h2>

        <div className="mt-3 rounded-3xl bg-slate-50 p-3 sm:p-4">
          <div className="overflow-hidden rounded-3xl bg-slate-100">
            {/* ✅ IMPORTANT : chemin correct vers l'image */}
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/pictures/mp-4.png"
                alt="Balayage caramel lumineux — avant / après"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Overlay profil + badge d’accès */}
            <div className="relative -mt-24 flex items-end justify-between px-4 pb-4 pt-16">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-white/70 bg-slate-200">
                  <Image
                    src="/creators/sofia-rivera.jpeg"
                    alt="Sofia Rivera"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold leading-tight">
                    Sofia Rivera
                  </div>
                  <div className="text-[11px] text-white/80">
                    @sofia_rivera · 12 400 vues
                  </div>
                </div>
              </div>

              <div className="rounded-full border border-white/80 bg-black/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                FREE
              </div>
            </div>
          </div>

          {/* Titre + note MVP */}
          <div className="mt-3 space-y-1">
            <h3 className="text-base font-semibold">
              Balayage caramel lumineux
            </h3>
            <p className="text-xs text-slate-600">
              MVP : l&apos;image est fixe. Plus tard, elle viendra directement de ton
              Magic Studio (avant / après choisi pour ce Magic Clock).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
