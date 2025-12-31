// features/display/MagicDisplayPreviewShell.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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

// Presets de rotation pour chaque face (on veut Face 2 en front par défaut)
const FACE_PRESETS = [
  { x: -90, y: 0 }, // Face 1 (top)
  { x: 0, y: 0 }, // Face 2 (front)
  { x: 0, y: -90 }, // Face 3 (right)
  { x: 0, y: -180 }, // Face 4 (back)
  { x: 0, y: -270 }, // Face 5 (left)
  { x: 90, y: 0 }, // Face 6 (bottom)
];

export default function MagicDisplayPreviewShell({
  display,
  onBack,
  onOpenFace,
}: MagicDisplayPreviewShellProps) {
  const faces = display.faces ?? [];
  const hasFaces = faces.length > 0;

  // Index 0-based dans faces[] — on démarre sur Face 2 => index 1
  const [activeFaceIndex, setActiveFaceIndex] = useState(1);

  // Rotation actuelle du cube
  const [rotation, setRotation] = useState<{ x: number; y: number }>(
    () => FACE_PRESETS[1],
  );

  // Drag manuel
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const rotationStartRef = useRef<{ x: number; y: number }>(FACE_PRESETS[1]);

  // sécuriser l’index si nombre de faces < 6 (au cas où)
  const safeIndex =
    !hasFaces ? 0 : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);
  const activeFace = hasFaces ? faces[safeIndex] : undefined;

  // 🔁 Auto-rotation lente sur l’axe Y (pause pendant le drag)
  useEffect(() => {
    if (!hasFaces || isDragging) return;

    const id = window.setInterval(() => {
      setRotation((prev) => ({ ...prev, y: prev.y + 0.25 }));
    }, 40);

    return () => window.clearInterval(id);
  }, [hasFaces, isDragging]);

  // Navigation flèches
  function goToFace(nextIndex: number) {
    if (!hasFaces) return;
    const maxIndex = Math.max(0, faces.length - 1);
    const wrapped =
      ((nextIndex % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);

    setActiveFaceIndex(wrapped);

    const preset = FACE_PRESETS[wrapped] ?? FACE_PRESETS[1];
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
    const nextY = rotationStartRef.current.y + dx * factor;

    // On laisse l’utilisateur atteindre presque top/bottom
    const clampedX = Math.max(-88, Math.min(88, nextX));

    setRotation({ x: clampedX, y: nextY });
  }

  function handleCubePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
    setIsDragging(false);
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
            {/* ⭐️ Scène 3D – cube parfait */}
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

                          {/* Cube 3D central */}
                <div className="relative mx-auto mt-2 aspect-square w-full max-w-xs [perspective:1400px] sm:max-w-sm">
                  <div
                    className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-200 ease-out"
                    style={{
                      // légère réduction + rotation actuelle
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

                      const transforms = [
                        `rotateY(0deg) translateZ(${depth}px)`,   // front
                        `rotateY(90deg) translateZ(${depth}px)`,  // right
                        `rotateY(180deg) translateZ(${depth}px)`, // back
                        `rotateY(-90deg) translateZ(${depth}px)`, // left
                        `rotateX(90deg) translateZ(${depth}px)`,  // top
                        `rotateX(-90deg) translateZ(${depth}px)`, // bottom
                      ];

                      return facesForCube.map((face, index) => {
                        const imgUrl = getFaceMainPhotoUrl(face);
                        const label = face.title || `Face ${index + 1}`;

                        return (
                          <div
                            key={index}
                            className="absolute left-1/2 top-1/2 overflow-hidden rounded-[2.4rem] border border-slate-900/10 bg-slate-900/95 text-xs shadow-xl shadow-slate-900/40 [backface-visibility:hidden]"
                            style={{
                              width: size,
                              height: size,
                              // centrage + placement 3D
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

                            {/* Légende en bas */}
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

                                  {/* halo global (on le laisse tel quel) */}
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_60%)]" />
                </div> {/* ferme le cube (mx-auto ...) */}
              </div>   {/* ✅ nouveau : ferme le conteneur relative w-full max-w-5xl */}

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

              {/* Panneau face active */}
              <div className="mt-6 w-full max-w-4xl rounded-3xl border border-slate-200 bg-white px-4 py-4 text-xs text-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:px-6 sm:py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500">
                      Face active
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {activeFace?.title || `Face ${safeIndex + 1}`}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {activeFace?.notes && activeFace.notes.trim().length > 0
                        ? activeFace.notes
                        : "Pas de notes pédagogiques, tout est dit dans le titre."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenFace?.(safeIndex)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-800 hover:border-slate-400 hover:bg-white"
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
