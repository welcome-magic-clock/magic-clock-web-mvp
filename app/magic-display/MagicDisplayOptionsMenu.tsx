// app/magic-display/MagicDisplayOptionsMenu.tsx
"use client";

import type { TemplateId } from "./magicDisplayTypes";
import { MOCK_CUBES } from "./magicDisplayConstants";

type Props = {
  isDuplicateOpen:    boolean;
  onClose:            () => void;
  onApplyTemplate:    (t: TemplateId) => void;
  onReset:            () => void;
  onToggleDuplicate:  () => void;
};

export function MagicDisplayOptionsMenu({
  isDuplicateOpen,
  onClose,
  onApplyTemplate,
  onReset,
  onToggleDuplicate,
}: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer le menu Options"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />

      <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-4 shadow-xl sm:rounded-3xl sm:p-6">
        {/* En-tête */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Options du cube
            </p>
            <h2 className="text-sm font-semibold text-slate-900">
              Magic Clock affichage &amp; structure
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
          >
            <span className="text-xs">✕</span>
          </button>
        </div>

        <div className="space-y-5 text-xs text-slate-700">
          {/* Modèles pré-conçus */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Modèles pré-conçus
            </p>
            <p className="text-[11px] text-slate-500">
              Applique une structure prête pour gagner du temps.
            </p>
            <div className="space-y-1.5">
              {(["BALAYAGE_4", "COULEUR_3", "BLOND_6"] as TemplateId[]).map((id) => {
                const labels: Record<TemplateId, { title: string; sub: string }> = {
                  BALAYAGE_4: { title: "Balayage en 4 étapes",          sub: "Diagnostic, préparation, application, patine / finition." },
                  COULEUR_3:  { title: "Couleur complète en 3 étapes",  sub: "Racines, longueurs / pointes, finition & conseils maison." },
                  BLOND_6:    { title: "Blond signature (6 faces)",      sub: "Idéal pour les transformations premium et contenus pédagogiques." },
                };
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onApplyTemplate(id)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{labels[id].title}</p>
                      <p className="text-[11px] text-slate-500">{labels[id].sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gestion du cube */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Gestion du cube
            </p>
            <div className="space-y-1.5">
              {/* Dupliquer */}
              <button
                type="button"
                onClick={onToggleDuplicate}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">Dupliquer depuis un autre Magic Clock</p>
                  <p className="text-[11px] text-slate-500">Reprend la structure d'un cube existant.</p>
                </div>
              </button>

              {isDuplicateOpen && (
                <div className="mt-2 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold text-slate-600">
                    Choisis un Magic Clock d&apos;exemple
                  </p>
                  {MOCK_CUBES.map((cube) => (
                    <button
                      key={cube.id}
                      type="button"
                      onClick={() => onApplyTemplate(cube.id)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{cube.title}</p>
                        <p className="text-[11px] text-slate-500">{cube.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{cube.meta}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Reset */}
              <button
                type="button"
                onClick={onReset}
                className="flex w-full items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-rose-700 hover:border-rose-300 hover:bg-rose-100"
              >
                <div>
                  <p className="font-medium">Réinitialiser ce cube</p>
                  <p className="text-[11px]">Effacer tous les médias et le contenu des faces.</p>
                </div>
              </button>
            </div>
          </div>

          <p className="border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            Astuce : commence par préparer un modèle, puis ajoute les photos / vidéos face par face.
          </p>
        </div>
      </div>
    </div>
  );
}
