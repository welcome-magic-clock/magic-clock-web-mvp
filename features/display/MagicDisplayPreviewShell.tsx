// features/display/MagicDisplayPreviewShell.tsx
"use client";

import { useRef, useState } from "react";
import type React from "react";

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
  media?: PreviewMedia[];
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

function getFaceMainPhotoUrl(face: PreviewFace | undefined): string | null {
  if (!face) return null;
  const firstSeg = face.segments?.[0];
  if (!firstSeg?.media || firstSeg.media.length === 0) return null;

  const photo =
    firstSeg.media.find((m) => m.type === "photo") ?? firstSeg.media[0];

  return photo?.url ?? null;
}

function normalizeAngle(angle: number): number {
  let a = ((angle + 180) % 360) - 180;
  if (a <= -180) a += 360;
  if (a > 180) a -= 360;
  return a;
}

/**
 * Presets de rotation pour chaque face.
 *
 * Index / Face :
 *   0 -> Face 1 (TOP)
 *   1 -> Face 2 (FRONT)
 *   2 -> Face 3 (RIGHT)
 *   3 -> Face 4 (BACK)
 *   4 -> Face 5 (LEFT)
 *   5 -> Face 6 (BOTTOM)
 */
const FACE_PRESETS: { x: number; y: number }[] = [
  { x: -90, y: 0 },   // top
  { x: 0,   y: 0 },   // front
  { x: 0,   y: -90 }, // right
  { x: 0,   y: -180 },// back
  { x: 0,   y: -270 },// left
  { x: 90,  y: 0 },   // bottom
];

const INITIAL_FACE_INDEX = 1; // Face 2 (front)
const INITIAL_ROTATION = FACE_PRESETS[INITIAL_FACE_INDEX];

export default function MagicDisplayPreviewShell({
  display,
  onBack,
  onOpenFace,
}: MagicDisplayPreviewShellProps) {
  const faces = display.faces ?? [];
  const hasFaces = faces.length > 0;

  const [activeFaceIndex, setActiveFaceIndex] =
    useState<number>(INITIAL_FACE_INDEX);

  const [rotation, setRotation] = useState<{ x: number; y: number }>(
    () => INITIAL_ROTATION,
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const rotationStartRef = useRef<{ x: number; y: number }>(INITIAL_ROTATION);

  const [fullScreenFaceIndex, setFullScreenFaceIndex] = useState<number | null>(
    null,
  );

  const safeIndex =
    !hasFaces ? 0 : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);
  const activeFace = hasFaces ? faces[safeIndex] : undefined;

  function goToFace(nextIndex: number) {
    if (!hasFaces) return;
    const maxIndex = Math.max(0, faces.length - 1);
    const wrapped =
      ((nextIndex % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);

    setActiveFaceIndex(wrapped);

    const preset = FACE_PRESETS[wrapped] ?? FACE_PRESETS[INITIAL_FACE_INDEX];
    setRotation(preset);
    rotationStartRef.current = preset;
  }

  function goPrevFace() {
    goToFace(activeFaceIndex - 1);
  }

  function goNextFace() {
    goToFace(activeFaceIndex + 1);
  }

  function handleCubePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!hasFaces) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotationStartRef.current = { ...rotation };
  }

  function handleCubePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const factor = 0.4;

    const nextX = rotationStartRef.current.x - dy * factor;
    const nextY = rotationStartRef.current.y + dx * factor;

    const clampedX = Math.max(-88, Math.min(88, nextX));
    const wrappedY = normalizeAngle(nextY);

    setRotation({ x: clampedX, y: wrappedY });
  }

  function handleCubePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
    setIsDragging(false);

    if (!hasFaces) return;

    setRotation((prev) => {
      const prevX = prev.x;
      const prevY = normalizeAngle(prev.y);

      let bestIndex = INITIAL_FACE_INDEX;
      let bestScore = Number.POSITIVE_INFINITY;

      FACE_PRESETS.forEach((preset, index) => {
        const targetX = preset.x;
        const targetY = normalizeAngle(preset.y);

        const dx = prevX - targetX;
        const dy = normalizeAngle(prevY - targetY);
        const score = dx * dx + dy * dy;

        if (score < bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });

      const snapped = FACE_PRESETS[bestIndex] ?? prev;

      setActiveFaceIndex(bestIndex);
      rotationStartRef.current = snapped;

      return snapped;
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-4 sm:px-8 sm:pt-6">
        {/* Haut : retour + titre */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="sr-only">Retour</span>
            <span aria-hidden>←</span>
          </button>

          <div className="text-right text-[11px] sm:text-xs">
            <p className="font-medium uppercase tracking-[0.28em] text-slate-500">
              Visualiser mon Magic Clock
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
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
            <section className="flex flex-1 flex-col items-center gap-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                Vue 3D du Magic Clock
              </p>

              <div className="relative w-full max-w-5xl">
                {/* Flèche gauche (desktop) */}
                <button
                  type="button"
                  onClick={goPrevFace}
                  aria-label="Face précédente"
                  className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 transform items-center justify-center rounded-full border border-slate-300 bg-white/90 px-3 py-2 text-xs text-slate-700 shadow-sm backdrop-blur-sm hover:border-slate-400 hover:bg-white sm:flex"
                >
                  <span className="text-sm leading-none">←</span>
                </button>

                {/* Flèche droite (desktop) */}
                <button
                  type="button"
                  onClick={goNextFace}
                  aria-label="Face suivante"
                  className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 transform items-center justify-center rounded-full border border-slate-300 bg-white/90 px-3 py-2 text-xs text-slate-700 shadow-sm backdrop-blur-sm hover:border-slate-400 hover:bg-white sm:flex"
                >
                  <span className="text-sm leading-none">→</span>
                </button>

                <div className="mx-auto mt-2 flex flex-col items-center">
             {/* Titre de la face active au-dessus du cube */}
<div className="mb-3 text-center">
  <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500">
    Face active
  </p>

  {(() => {
    const faceNumberLabel = `Face ${safeIndex + 1}`;

    const rawTitle = activeFace?.title?.trim();
    const rawDescription = activeFace?.segments?.[0]?.description?.trim();

    // On évite de répéter "Face 2" si c'est juste le titre par défaut
    let displayTitle: string | null = null;

    if (
      rawTitle &&
      rawTitle.toLowerCase() !== faceNumberLabel.toLowerCase()
    ) {
      displayTitle = rawTitle;
    } else if (
      rawDescription &&
      rawDescription.toLowerCase() !== faceNumberLabel.toLowerCase()
    ) {
      displayTitle = rawDescription;
    }

    return (
      <>
        {/* Face 1 / Face 2 / Face 3... */}
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {faceNumberLabel}
        </p>

        {/* Titre saisi par le créateur, ex. "Préparation / sectionnement" */}
        {displayTitle && (
          <p className="mt-1 text-[13px] text-slate-600">
            {displayTitle}
          </p>
        )}
      </>
    );
  })()}
</div>

                  {/* Cube 3D */}
                  <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[440px] [perspective:1400px]">
                   <div
  className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-200 ease-out"
  style={{
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
  }}
  onPointerDown={handleCubePointerDown}
  onPointerMove={handleCubePointerMove}
  onPointerUp={handleCubePointerUp}
  onPointerLeave={handleCubePointerUp}
>
                      {(() => {
                        const facesForCube: PreviewFace[] =
                          faces.length >= 6
                            ? faces.slice(0, 6)
                            : Array.from({ length: 6 }, (_, i) => faces[i % faces.length]);

                        const size = 280;
                        const depth = size / 2;

                        const transforms = [
                          `rotateX(90deg) translateZ(${depth}px)`,  // top
                          `rotateY(0deg) translateZ(${depth}px)`,  // front
                          `rotateY(90deg) translateZ(${depth}px)`, // right
                          `rotateY(180deg) translateZ(${depth}px)`,// back
                          `rotateY(-90deg) translateZ(${depth}px)`,// left
                          `rotateX(-90deg) translateZ(${depth}px)`,// bottom
                        ];

                        return facesForCube.map((face, index) => {
                          const imgUrl = getFaceMainPhotoUrl(face);
                          const label = face.title || `Face ${index + 1}`;

                          return (
                            <div
                              key={index}
                              className="absolute left-1/2 top-1/2 overflow-hidden rounded-none border border-slate-900/10 bg-slate-900/95 text-xs shadow-xl shadow-slate-900/40 [backface-visibility:hidden]"
                              style={{
                                width: size,
                                height: size,
                                transform: `translate(-50%, -50%) ${transforms[index]}`,
                              }}
                            >
                              {imgUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={imgUrl}
                                  alt={label}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-300">
                                    Face {index + 1}
                                  </p>
                                  <p className="mt-2 max-w-[70%] text-center text-sm font-semibold text-slate-50">
                                    {label}
                                  </p>
                                </div>
                              )}

                              {/* Bouton éditeur */}
                              <button
                                type="button"
                                onClick={() => onOpenFace?.(index)}
                                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 text-xs text-slate-900 shadow-sm backdrop-blur hover:border-white hover:bg-white"
                              >
                                <span className="text-xs" aria-hidden>
                                  ↗︎
                                </span>
                                <span className="sr-only">
                                  Ouvrir cette face
                                </span>
                              </button>

                              {/* Légende bas */}
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-2 pt-6">
                                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-200">
                                  Face {index + 1}
                                </p>
                                <p className="truncate text-xs font-semibold text-slate-50">
                                  {label}
                                </p>
                              </div>

                              {/* Bouton plein écran */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFullScreenFaceIndex(index);
                                }}
                                className="absolute right-3 bottom-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 text-xs text-slate-900 shadow-sm backdrop-blur hover:border-white hover:bg-white"
                              >
                                <span aria-hidden>⤢</span>
                                <span className="sr-only">
                                  Afficher cette face en plein écran
                                </span>
                              </button>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Halo agrandi */}
                    <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_75%)]" />
                  </div>

                  {/* Note pédagogique */}
                  <div className="mt-4 max-w-xl text-center text-[11px] text-slate-600">
                    {activeFace?.notes && activeFace.notes.trim().length > 0
                      ? activeFace.notes
                      : "Pas de notes pédagogiques, tout est dit dans le titre."}
                  </div>
                </div>
              </div>

              {/* Flèches mobile */}
              <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
                <button
                  type="button"
                  onClick={goPrevFace}
                  aria-label="Face précédente"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-xs text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50"
                >
                  ←
                </button>
                <span className="text-[11px] text-slate-500">
                  Face {safeIndex + 1} / {faces.length}
                </span>
                <button
                  type="button"
                  onClick={goNextFace}
                  aria-label="Face suivante"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-xs text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50"
                >
                  →
                </button>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Overlay plein écran */}
      {fullScreenFaceIndex !== null && faces[fullScreenFaceIndex] && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-[520px] overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
            <button
              type="button"
              onClick={() => setFullScreenFaceIndex(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-sm text-slate-100 shadow hover:bg-black/80"
            >
              ✕
            </button>

            {(() => {
              const face = faces[fullScreenFaceIndex]!;
              const imgUrl = getFaceMainPhotoUrl(face);
              const label =
                face.title || `Face ${fullScreenFaceIndex + 1}`;

              return (
                <>
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt={label}
                      className="h-[60vh] w-full bg-slate-950 object-contain"
                    />
                  ) : (
                    <div className="flex h-[60vh] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-300">
                        Face {fullScreenFaceIndex + 1}
                      </p>
                      <p className="mt-2 max-w-[70%] text-center text-base font-semibold text-slate-50">
                        {label}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-3 text-xs text-slate-100">
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
                      Face {fullScreenFaceIndex + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-50">
                      {label}
                    </p>
                    {face.notes && face.notes.trim().length > 0 && (
                      <p className="mt-1 text-[11px] text-slate-300">
                        {face.notes}
                      </p>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
