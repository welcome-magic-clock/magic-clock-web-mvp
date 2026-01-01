// features/display/MagicDisplayPreviewShell.tsx
"use client";

import { useRef, useState } from "react";
import type React from "react";
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

/**
 * Récupère la première photo d'une face (pour texturer le cube).
 */
function getFaceMainPhotoUrl(face: PreviewFace | undefined): string | null {
  if (!face) return null;
  const firstSeg = face.segments?.[0];
  if (!firstSeg?.media || firstSeg.media.length === 0) return null;

  const photo =
    firstSeg.media.find((m) => m.type === "photo") ?? firstSeg.media[0];

  return photo?.url ?? null;
}

/**
 * Normalise un angle en degrés dans l'intervalle [-180, 180].
 */
function normalizeAngle(angle: number): number {
  let a = ((angle + 180) % 360) - 180;
  if (a <= -180) a += 360;
  if (a > 180) a -= 360;
  return a;
}

/**
 * Presets de rotation pour chaque face, vue 4/4 frontale.
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
  { x: 90, y: 0 }, // top
  { x: 0, y: 0 }, // front
  { x: 0, y: 90 }, // right
  { x: 0, y: 180 }, // back
  { x: 0, y: -90 }, // left
  { x: -90, y: 0 }, // bottom
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

  // Index 0-based dans faces[] — on démarre sur Face 2 => index 1
  const [activeFaceIndex, setActiveFaceIndex] = useState(INITIAL_FACE_INDEX);

  // Rotation actuelle du cube
  const [rotation, setRotation] = useState<{ x: number; y: number }>(
    () => INITIAL_ROTATION,
  );

  // Drag manuel
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const rotationStartRef = useRef<{ x: number; y: number }>(INITIAL_ROTATION);

  // sécuriser l’index si nombre de faces < 6 (au cas où)
  const safeIndex =
    !hasFaces ? 0 : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);
  const activeFace = hasFaces ? faces[safeIndex] : undefined;

  // Navigation flèches : 2 → 3 → 4 → 5 → 6 → 1 (cycle simple +1)
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

  // 🎮 Drag manuel sur le cube
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

  // 🔁 inversion du sens de rotation horizontal
  let nextY = rotationStartRef.current.y - dx * factor;

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

    // 🔒 Snap automatique sur le preset le plus proche (distance angulaire circulaire)
    setRotation((prev) => {
      const prevX = prev.x;
      const prevY = normalizeAngle(prev.y);

      let bestIndex = INITIAL_FACE_INDEX;
      let bestScore = Number.POSITIVE_INFINITY;

      FACE_PRESETS.forEach((preset, index) => {
        const targetX = preset.x;
        const targetY = normalizeAngle(preset.y);

        const dx = prevX - targetX;
        const dy = normalizeAngle(prevY - targetY); // distance circulaire sur Y
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
          <BackButton
            fallbackHref="/magic-display"
            label="Retour au Magic Display"
          />
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
            {/* ⭐️ Scène 3D – cube + titre/notes de la face active */}
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

                {/* Bloc centré : titre + cube + note pédagogique */}
                <div className="mx-auto mt-2 flex flex-col items-center">
                  {/* Titre de la face active au-dessus du cube */}
                  <div className="mb-3 text-center">
                    <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500">
                      Face active
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {activeFace?.title || `Face ${safeIndex + 1}`}
                    </p>
                  </div>

                  {/* Cube 3D central */}
                  <div className="relative mx-auto aspect-square w-full max-w-xs [perspective:1400px] sm:max-w-sm">
                    <div
                      className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-200 ease-out"
                      style={{
                        transform: `scale(0.9) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                      }}
                      onPointerDown={handleCubePointerDown}
                      onPointerMove={handleCubePointerMove}
                      onPointerUp={handleCubePointerUp}
                      onPointerLeave={handleCubePointerUp}
                    >
                      {(() => {
                        // Toujours 6 faces pour le cube
                        const facesForCube: PreviewFace[] =
                          faces.length >= 6
                            ? faces.slice(0, 6)
                            : Array.from({ length: 6 }, (_, i) => faces[i % faces.length]);

                        const size = 220; // cube parfaitement carré 220×220
                        const depth = size / 2;

                        // IMPORTANT : index 0..5 alignés avec FACE_PRESETS
                        const transforms = [
                          `rotateX(90deg) translateZ(${depth}px)`, // index 0 : top (Face 1)
                          `rotateY(0deg) translateZ(${depth}px)`, // index 1 : front (Face 2)
                          `rotateY(90deg) translateZ(${depth}px)`, // index 2 : right (Face 3)
                          `rotateY(180deg) translateZ(${depth}px)`, // index 3 : back (Face 4)
                          `rotateY(-90deg) translateZ(${depth}px)`, // index 4 : left (Face 5)
                          `rotateX(-90deg) translateZ(${depth}px)`, // index 5 : bottom (Face 6)
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

                              {/* Flèche d’ouverture en haut à droite */}
                              <button
                                type="button"
                                onClick={() => onOpenFace?.(index)}
                                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 text-xs text-slate-900 shadow-sm backdrop-blur hover:border-white hover:bg-white"
                              >
                                <span className="text-xs" aria-hidden>
                                  ↗︎
                                </span>
                                <span className="sr-only">Ouvrir cette face</span>
                              </button>

                              {/* Légende en bas de la face */}
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-2 pt-6">
                                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-200">
                                  Face {index + 1}
                                </p>
                                <p className="truncate text-xs font-semibold text-slate-50">
                                  {label}
                                </p>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* halo global */}
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_60%)]" />
                  </div>

                  {/* Note pédagogique sous le cube */}
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
    </main>
  );
}
