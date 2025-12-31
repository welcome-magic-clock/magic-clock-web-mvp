"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/navigation/BackButton";

export type MediaKind = "photo" | "video" | "file";

export type PreviewMedia = {
  type: MediaKind;
  url: string;
  filename?: string;
};

export type PreviewSegment = {
  id: number;
  title: string;
  description?: string;
  notes?: string;
  /** Médias associés à ce segment (photo / vidéo / fichier) */
  media?: PreviewMedia[]; // ⬅️ IMPORTANT : optionnel
};

export type PreviewFace = {
  title: string;
  notes?: string;
  segments: PreviewSegment[];
};

export type PreviewDisplay = {
  faces: PreviewFace[];
};

type MagicDisplayPreviewShellProps = {
  display: PreviewDisplay;
  onBack: () => void;
  onOpenFace?: (faceIndex: number) => void;
};

export default function MagicDisplayPreviewShell({
  display,
  onBack,
  onOpenFace,
}: MagicDisplayPreviewShellProps) {
  const faces = display.faces ?? [];
  const hasFaces = faces.length > 0;

  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
  const [autoAngle, setAutoAngle] = useState(0);

  // sécuriser l’index si le nombre de faces change
  const safeIndex =
    !hasFaces ? 0 : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);
  const activeFace = hasFaces ? faces[safeIndex] : undefined;
  const firstSegment = activeFace?.segments?.[0];
  const mainMedia = firstSegment?.media?.[0];

  // 🔁 rotation douce automatique du “cube/carte”
  useEffect(() => {
    if (!hasFaces) return;

    const id = window.setInterval(() => {
      setAutoAngle((prev) => (prev + 0.4) % 360); // rotation lente
    }, 40);

    return () => window.clearInterval(id);
  }, [hasFaces]);

  function goPrevFace() {
    if (!hasFaces) return;
    setActiveFaceIndex((prev) =>
      prev <= 0 ? faces.length - 1 : prev - 1,
    );
  }

  function goNextFace() {
    if (!hasFaces) return;
    setActiveFaceIndex((prev) =>
      prev >= faces.length - 1 ? 0 : prev + 1,
    );
  }

  return (
    <main className="min-h-screen bg-black text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-4 sm:px-8 sm:pt-6">
        {/* Haut : retour + titre */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <BackButton
            fallbackHref="/magic-display"
            label="Retour au Magic Display"
          />
          <div className="text-right text-[11px] sm:text-xs">
            <p className="font-medium uppercase tracking-[0.28em] text-slate-300">
              Visualiser mon Magic Clock
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Vue utilisateur finale, 100&nbsp;% lecture seule.
            </p>
          </div>
        </header>

        {!hasFaces ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-500">
              Aucun contenu n’est encore associé à ce Magic Clock.
            </p>
          </div>
        ) : (
          <>
            {/* ⭐️ Scène 3D premium */}
            <section className="flex flex-1 flex-col items-center gap-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">
                Vue 3D du Magic Clock
              </p>

              <div className="relative w-full max-w-5xl">
                {/* Flèche gauche */}
                <button
                  type="button"
                  onClick={goPrevFace}
                  aria-label="Face précédente"
                  className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 transform items-center justify-center rounded-full border border-slate-700/70 bg-black/60 px-3 py-2 text-xs text-slate-100 backdrop-blur-sm hover:border-slate-500 hover:bg-black/80 sm:flex"
                >
                  <span className="text-sm leading-none">←</span>
                </button>

                {/* Flèche droite */}
                <button
                  type="button"
                  onClick={goNextFace}
                  aria-label="Face suivante"
                  className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 transform items-center justify-center rounded-full border border-slate-700/70 bg-black/60 px-3 py-2 text-xs text-slate-100 backdrop-blur-sm hover:border-slate-500 hover:bg-black/80 sm:flex"
                >
                  <span className="text-sm leading-none">→</span>
                </button>

                {/* Carte 3D centrale */}
                <div className="mx-auto h-[min(420px,70vh)] w-full max-w-4xl [perspective:1600px]">
                  <div
                    className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 shadow-[0_40px_120px_rgba(0,0,0,0.9)] backdrop-blur-xl [transform-style:preserve-3d]"
                    style={{
                      transform: `rotateY(${autoAngle}deg) rotateX(6deg)`,
                    }}
                  >
                    {/* Contenu de la face : média si présent, sinon carte texte épurée */}
                    <div className="absolute inset-0">
                      {mainMedia && mainMedia.type === "photo" && mainMedia.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mainMedia.url}
                          alt={firstSegment?.title ?? activeFace?.title ?? ""}
                          className="h-full w-full object-cover"
                        />
                      )}

                      {mainMedia && mainMedia.type === "video" && mainMedia.url && (
                        <video
                          src={mainMedia.url}
                          className="h-full w-full object-cover"
                          controls
                        />
                      )}

                      {!mainMedia && (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
                          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-400">
                            Face {safeIndex + 1}
                          </p>
                          <p className="max-w-md text-center text-lg font-semibold text-slate-50 sm:text-2xl">
                            {activeFace?.title || `Face ${safeIndex + 1}`}
                          </p>
                          <p className="max-w-md text-center text-xs text-slate-300 sm:text-sm">
                            {firstSegment?.description ||
                              "Aucun média associé pour l’instant."}
                          </p>
                        </div>
                      )}

                      {/* Légende en bas de la carte */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-6 pb-4 pt-10">
                        <div className="flex flex-wrap items-end justify-between gap-2">
                          <div className="space-y-1">
                            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-300">
                              Face {safeIndex + 1}
                            </p>
                            <p className="text-sm font-semibold text-slate-50 sm:text-base">
                              {activeFace?.title || "Face sans titre"}
                            </p>
                          </div>
                          {firstSegment?.title && (
                            <p className="max-w-xs truncate text-[11px] text-slate-200 sm:text-xs">
                              {firstSegment.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flèches mobile en dessous */}
                <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
                  <button
                    type="button"
                    onClick={goPrevFace}
                    aria-label="Face précédente"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/70 bg-black/60 text-xs text-slate-100 backdrop-blur-sm hover:border-slate-500 hover:bg-black/80"
                  >
                    ←
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Face {safeIndex + 1} / {faces.length}
                  </span>
                  <button
                    type="button"
                    onClick={goNextFace}
                    aria-label="Face suivante"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/70 bg-black/60 text-xs text-slate-100 backdrop-blur-sm hover:border-slate-500 hover:bg-black/80"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Panneau face active */}
              <div className="mt-6 w-full max-w-4xl rounded-3xl border border-slate-800 bg-black/60 px-4 py-4 text-xs text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-6 sm:py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-slate-400">
                      Face active
                    </p>
                    <p className="text-sm font-semibold text-slate-50">
                      {activeFace?.title || `Face ${safeIndex + 1}`}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {activeFace?.notes && activeFace.notes.trim().length > 0
                        ? activeFace.notes
                        : "Pas de notes pédagogiques, tout est dit dans le titre."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenFace?.(safeIndex)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-black/70 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-slate-400 hover:bg-black/90"
                    >
                      <span>Ouvrir cette face</span>
                      <span aria-hidden>↗︎</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
