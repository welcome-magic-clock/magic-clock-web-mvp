// app/create/display/page.tsx

export default function MagicDisplayEditorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28 space-y-8">
      {/* Titre + explication */}
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

      {/* Zone principale : Preview à gauche, réglages à droite */}
      <section className="grid gap-6 lg:grid-cols-[3fr,2fr] items-start">
        {/* Preview Magic Display */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            Aperçu Magic Display
          </p>

          <div className="relative overflow-hidden rounded-3xl bg-slate-100">
            {/* Avant/Après : on réutilise une image d&apos;exemple */}
            <div className="aspect-[3/4] w-full">
              <img
                src="/pictures/mp-1.png"
                alt="Aperçu avant / après"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Overlay bas : profil + accès */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0">
              <div className="h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-4 pt-6 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-white/40 bg-slate-300">
                    <img
                      src="/creators/sofia-rivera.jpeg"
                      alt="Avatar créateur"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 text-white">
                    <p className="text-sm font-semibold leading-tight">
                      Sofia Rivera
                    </p>
                    <p className="text-[11px] text-white/80">
                      @sofia_rivera · 12&nbsp;400 vues
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full border border-white/70 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  FREE
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-sm font-semibold">Balayage caramel lumineux</p>
            <p className="text-xs text-slate-500">
              MVP : l&apos;image est fixe. Plus tard, elle viendra directement de
              ton Magic Studio.
            </p>
          </div>
        </div>

        {/* Panneau de réglages (non fonctionnel pour l&apos;instant) */}
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Réglages Magic Display (maquette)
          </p>

          {/* Titre */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Titre du Magic Clock
            </label>
            <input
              type="text"
              defaultValue="Balayage caramel lumineux"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Créateur */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Profil créateur affiché
            </label>
            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
              <option>@sofia_rivera (Madrid)</option>
              <option>@maya_flores (LA)</option>
              <option>@aiko_tanaka (Tokyo)</option>
              <option>@lena_martin (Berlin)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Plus tard : on choisira parmi tes vrais profils créateurs.
            </p>
          </div>

          {/* Accès */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Niveau d&apos;accès
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-brand-500 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
              >
                FREE
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Abonnement
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                PPV
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Pour le MVP, ces boutons ne changent pas encore l&apos;aperçu.
            </p>
          </div>

          {/* Note de roadmap */}
          <div className="mt-2 rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] text-slate-600">
              Étape suivante : connecter cet éditeur au Magic Studio choisi, puis
              permettre d&apos;enregistrer et de publier le duo Studio + Display dans
              Amazing &amp; My Magic Clock.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
