// features/display/MagicDisplayPreviewShell.tsx
"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
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

// Placement des faces dans l'espace 3D (même logique que MagicCube3D)
function faceTransform(index: number): string {
  const depth = "6.5rem";

  switch (index) {
    case 0:
      return `rotateX(90deg) translateZ(${depth})`; // TOP (Face 1)
    case 1:
      return `translateZ(${depth})`; // FRONT (Face 2)
    case 2:
      return `rotateY(90deg) translateZ(${depth})`; // RIGHT (Face 3)
    case 3:
      return `rotateY(180deg) translateZ(${depth})`; // BACK (Face 4)
    case 4:
      return `rotateY(-90deg) translateZ(${depth})`; // LEFT (Face 5)
    case 5:
      return `rotateX(-90deg) translateZ(${depth})`; // BOTTOM (Face 6)
    default:
      return `translateZ(${depth})`;
  }
}

export default function MagicDisplayPreviewShell({
  display,
  onBack,
  onOpenFace,
}: MagicDisplayPreviewShellProps) {
  const faces = display.faces ?? [];
  const hasFaces = faces.length > 0;

  // 👉 Face active : on commence sur la Face 2 (index 1)
  const [activeFaceIndex, setActiveFaceIndex] = useState(1);

  // Rotation globale du cube (comme MagicCube3D)
  const [rotation, setRotation] = useState<{ x: number; y: number }>({
    x: -18,
    y: 28,
  });

  // Auto-rotation au démarrage (puis coupée dès interaction)
  const [autoRotate, setAutoRotate] = useState(true);

  // Drag manuel
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const rotationStartRef = useRef<{ x: number; y: number }>({ x: -18, y: 28 });

  // sécuriser l’index si le nombre de faces change
  const safeIndex =
    !hasFaces ? 0 : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);
  const activeFace = hasFaces ? faces[safeIndex] : undefined;

  // 🔁 Auto-rotation douce sur l’axe Y
  useEffect(() => {
    if (!hasFaces || !autoRotate) return;

    const id = window.setInterval(() => {
      setRotation((prev) => ({
        ...prev,
        // sens gauche → droite (tu peux inverser le signe si tu préfères)
        y: prev.y - 0.25,
      }));
    }, 40);

    return () => window.clearInterval(id);
  }, [hasFaces, autoRotate]);

  function goPrevFace() {
    if (!hasFaces) return;
    setAutoRotate(false);

    setActiveFaceIndex((prev) => {
      const next = prev <= 0 ? faces.length - 1 : prev - 1;
      return next;
    });

    // tourner le cube vers la gauche (face précédente)
    setRotation((prev) => ({
      ...prev,
      y: prev.y + 90,
    }));
  }

  function goNextFace() {
    if (!hasFaces) return;
    setAutoRotate(false);

    setActiveFaceIndex((prev) => {
      const next = prev >= faces.length - 1 ? 0 : prev + 1;
      return next;
    });

    // tourner le cube vers la droite (face suivante)
    setRotation((prev) => ({
      ...prev,
      y: prev.y - 90,
    }));
  }

  // 🎛 Drag manuel du cube
  function handleCubePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!hasFaces) return;
    setAutoRotate(false); // dès que l’utilisateur touche le cube, on stabilise
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotationStartRef.current = { ...rotation };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // no-op
    }
  }

  function handleCubePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const factor = 0.4;
    const newY = rotationStartRef.current.y + dx * factor; // gauche / droite
    const newX = rotationStartRef.current.x - dy * factor; // haut / bas

    setRotation({ x: newX, y: newY });
  }

  function handleCubePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
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
            {/* ⭐️ Scène 3D – cube Magic Clock */}
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
                <div className="relative mx-auto mt-2 aspect-square w-full max-w-xs [perspective:1100px] sm:max-w-sm">
                  <div
                    className="absolute inset-0 transition-transform duration-150 ease-out [transform-style:preserve-3d]"
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

                      return facesForCube.map((face, index) => {
                        const imgUrl = getFaceMainPhotoUrl(face);
                        const label = face.title || `Face ${index + 1}`;

                        return (
                          <div
                            key={index}
                            style={{ transform: faceTransform(index) }}
                            className="absolute inset-[14%] overflow-hidden rounded-[2.4rem] bg-slate-200 shadow-xl [backface-visibility:hidden]"
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

                            {/* Légende en bas de la face */}
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

                  {/* Halo global */}
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_60%)]" />
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
