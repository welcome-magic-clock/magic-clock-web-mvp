// features/display/MagicDisplayPreviewShell.tsx
"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
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
  media?: PreviewMedia[]; // optionnel
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
 * Si aucune photo, on prend le premier média disponible.
 */
function getFaceMainPhotoUrl(face: PreviewFace | undefined): string | null {
  if (!face) return null;
  const firstSeg = face.segments?.[0];
  if (!firstSeg?.media || firstSeg.media.length === 0) return null;

  const photo =
    firstSeg.media.find((m) => m.type === "photo") ?? firstSeg.media[0];

  return photo?.url ?? null;
}

export default function MagicDisplayPreviewShell({
  display,
  onBack,
  onOpenFace,
}: MagicDisplayPreviewShellProps) {
  const faces = display.faces ?? [];
  const hasFaces = faces.length > 0;

  // 🔵 États du cube (face active + rotations)
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
  const [autoAngle, setAutoAngle] = useState(0); // rotation automatique (Y)
  const [userAngles, setUserAngles] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const userAnglesStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // sécuriser l’index si le nombre de faces change
  const safeIndex =
    !hasFaces ? 0 : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);
  const activeFace = hasFaces ? faces[safeIndex] : undefined;

  // 🎛 Orientation du cube selon la face active
  const FACE_ROTATIONS = [
    { x: -18, y: 0 }, // Face 1 : devant
    { x: -18, y: -90 }, // Face 2 : côté droit
    { x: -18, y: -180 }, // Face 3 : derrière
    { x: -18, y: -270 }, // Face 4 : côté gauche
    { x: -55, y: 0 }, // Face 5 : dessus légèrement incliné
    { x: 55, y: 0 }, // Face 6 : dessous légèrement incliné
  ];

  const rotation = FACE_ROTATIONS[safeIndex % FACE_ROTATIONS.length];

  // 🔁 Rotation automatique douce (Y) — pause pendant le drag
  useEffect(() => {
    if (!hasFaces || isDragging) return;

    const id = window.setInterval(() => {
      setAutoAngle((prev) => (prev + 0.25) % 360); // vitesse douce
    }, 40);

    return () => window.clearInterval(id);
  }, [hasFaces, isDragging]);

  function goPrevFace() {
    if (!hasFaces) return;
    setActiveFaceIndex((prev) => (prev <= 0 ? faces.length - 1 : prev - 1));
  }

  function goNextFace() {
    if (!hasFaces) return;
    setActiveFaceIndex((prev) => (prev >= faces.length - 1 ? 0 : prev + 1));
  }

  // 🖐️ Drag du cube (desktop + mobile)
  function handleCubePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!hasFaces) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    userAnglesStartRef.current = { ...userAngles };
  }

  function handleCubePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Sensibilité du drag
    const factor = 0.4;
    const newY = userAnglesStartRef.current.y + dx * factor; // gauche/droite
    const newX = userAnglesStartRef.current.x - dy * factor; // haut/bas

    setUserAngles({ x: newX, y: newY });
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
            {/* ⭐️ Scène 3D – VRAI cube */}
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

                {/* Cube 3D central alimenté par le JSON PreviewDisplay */}
                <div className="mx-auto h-[min(380px,70vh)] w-full max-w-sm [perspective:1600px]">
                  {hasFaces && (
                    <div
                      className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 ease-out"
                      style={{
                        transform: `rotateX(${
                          rotation.x + userAngles.x
                        }deg) rotateY(${
                          rotation.y + autoAngle + userAngles.y
                        }deg)`,
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
                            : Array.from(
                                { length: 6 },
                                (_, i) => faces[i % faces.length],
                              );

                        const depth = 90;

                        const transforms = [
                          `rotateY(0deg) translateZ(${depth}px)`,
                          `rotateY(90deg) translateZ(${depth}px)`,
                          `rotateY(180deg) translateZ(${depth}px)`,
                          `rotateY(-90deg) translateZ(${depth}px)`,
                          `rotateX(90deg) translateZ(${depth}px)`,
                          `rotateX(-90deg) translateZ(${depth}px)`,
                        ];

                        return facesForCube.map((face, index) => {
                          const imgUrl = getFaceMainPhotoUrl(face);
                          const label =
                            face.title || `Face ${index + 1}`;

                          return (
                            <div
                              key={index}
                              className="absolute inset-1 rounded-[24px] overflow-hidden shadow-xl bg-slate-200 [backface-visibility:hidden]"
                              style={{ transform: transforms[index] }}
                            >
                              {imgUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={imgUrl}
                                  alt={label}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
                                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-500">
                                    Face {index + 1}
                                  </p>
                                  <p className="mt-2 max-w-[70%] text-center text-sm font-semibold text-slate-800">
                                    {label}
                                  </p>
                                </div>
                              )}

                              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pb-2 pt-6">
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
                  )}
                </div>

                {/* Flèches mobile en dessous */}
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
              </div>

              {/* Panneau face active – thème clair */}
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
                      {activeFace?.notes &&
                      activeFace.notes.trim().length > 0
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
