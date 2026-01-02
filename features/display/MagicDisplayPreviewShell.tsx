// features/display/MagicDisplayPreviewShell.tsx
"use client";

import { useRef, useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import MagicDisplayFacePreview from "./MagicDisplayFacePreview";

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
  description?: string;
  notes?: string;
  segments: PreviewSegment[];
};

export type PreviewDisplay = {
  faces: PreviewFace[];
};

type MagicDisplayPreviewShellProps = {
  display: PreviewDisplay;
  onBack?: () => void;
  /** Optionnel, utilisé par MagicDisplayClient pour ouvrir une face */
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
 *
 * On prend l'INVERSE des rotations locales du cube.
 */
const FACE_PRESETS: { x: number; y: number }[] = [
  { x: -90, y: 0 }, // 0 : top (Face 1)
  { x: 0, y: 0 }, // 1 : front (Face 2)
  { x: 0, y: -90 }, // 2 : right (Face 3)
  { x: 0, y: -180 }, // 3 : back (Face 4)
  { x: 0, y: -270 }, // 4 : left (Face 5)
  { x: 90, y: 0 }, // 5 : bottom (Face 6)
];

const INITIAL_FACE_INDEX = 1; // Face 2 (front)
const INITIAL_ROTATION = FACE_PRESETS[INITIAL_FACE_INDEX];

export default function MagicDisplayPreviewShell({
  display,
  onBack,
}: MagicDisplayPreviewShellProps) {
  const router = useRouter();
  const faces = display.faces ?? [];
  const hasFaces = faces.length > 0;

  // Index 0-based dans faces[] — on démarre sur Face 2 => index 1
  const [activeFaceIndex, setActiveFaceIndex] = useState(INITIAL_FACE_INDEX);

  // Rotation actuelle du cube
  const [rotation, setRotation] = useState<{ x: number; y: number }>(
    () => INITIAL_ROTATION,
  );

  // Face actuellement retournée (back visible) ou null
  const [flippedFaceIndex, setFlippedFaceIndex] = useState<number | null>(null);

  // Drag manuel
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const rotationStartRef = useRef<{ x: number; y: number }>(INITIAL_ROTATION);

  // Face actuellement en plein écran (ou null)
  const [fullScreenFaceIndex, setFullScreenFaceIndex] = useState<number | null>(
    null,
  );

  // 👉 Face & segment dont on affiche le contenu sous le cube
  const [openedFaceForDetails, setOpenedFaceForDetails] =
    useState<number | null>(null);
  const [openedSegmentId, setOpenedSegmentId] = useState<
    string | number | null
  >(null);

  // sécuriser l’index si nombre de faces < 6 (au cas où)
  const safeIndex =
    !hasFaces ? 0 : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);
  const activeFace = hasFaces ? faces[safeIndex] : undefined;

  // Face + segment actifs pour le panneau "Contenu du segment sélectionné"
  const detailFace =
    openedFaceForDetails !== null ? faces[openedFaceForDetails] : undefined;
  const detailSegments: PreviewSegment[] = detailFace?.segments ?? [];

  let activeDetailSegment: PreviewSegment | undefined;
  if (detailSegments.length > 0) {
    activeDetailSegment =
      detailSegments.find(
        (seg: any) =>
          seg.id === openedSegmentId || (seg as any).key === openedSegmentId,
      ) ?? detailSegments[0];
  }

  const activeDetailIndex = activeDetailSegment
    ? detailSegments.indexOf(activeDetailSegment)
    : -1;

  const segmentTitle =
    activeDetailSegment &&
    ((activeDetailSegment.title as string | undefined) ?? "").trim()
      ? (activeDetailSegment.title as string).trim()
      : activeDetailIndex >= 0
        ? `Segment ${activeDetailIndex + 1}`
        : "";

  const segmentNotes =
    (activeDetailSegment &&
      (
        (activeDetailSegment.notes as string | undefined) ??
        (activeDetailSegment.description as string | undefined) ??
        ""
      ).trim()) ||
    "";

  // Navigation flèches : 2 → 3 → 4 → 5 → 6 → 1 (cycle simple +1)
  function goToFace(nextIndex: number) {
    if (!hasFaces) return;
    const maxIndex = Math.max(0, faces.length - 1);
    const wrapped =
      ((nextIndex % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);

    setActiveFaceIndex(wrapped);
    setFlippedFaceIndex(null); // on referme toute face retournée

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

    // X = bas/haut
    const nextX = rotationStartRef.current.x - dy * factor;

    // Y = gauche/droite → drag vers la droite => angle Y POSITIF
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
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else router.back();
            }}
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

                {/* Bloc centré : titre + cube */}
                <div className="mx-auto mt-2 flex flex-col items-center">
                  {/* Titre de la face active au-dessus du cube */}
                  <div className="mb-3 text-center">
                    <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500">
                      Face active
                    </p>

                    {(() => {
                      const faceNumberLabel = `Face ${safeIndex + 1}`;

                      const rawTitle = activeFace?.title?.trim();
                      const rawDescription =
                        activeFace?.segments?.[0]?.description?.trim();

                      // On évite de répéter "Face 2" si c'est juste le titre par défaut
                      let displayTitle: string | null = null;

                      if (
                        rawTitle &&
                        rawTitle.toLowerCase() !==
                          faceNumberLabel.toLowerCase()
                      ) {
                        displayTitle = rawTitle;
                      } else if (
                        rawDescription &&
                        rawDescription.toLowerCase() !==
                          faceNumberLabel.toLowerCase()
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

                  {/* Cube 3D central (agrandi) */}
                  <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[440px] [perspective:1400px]">
                    {/* 🌕 Halo derrière le cube, version plus pâle */}
                    <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_75%)]" />

                    {/* 🧊 Cube au-dessus */}
                    <div
                      className="absolute inset-0 z-10 [transform-style:preserve-3d] transition-transform duration-200 ease-out"
                      style={{
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
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
                            : Array.from({ length: 6 }, (_, i) =>
                                faces[i % faces.length],
                              );

                        const size = 280;
                        const depth = size / 2;

                        // Alignement 1–1 avec FACE_PRESETS
                        const transforms = [
                          `rotateX(90deg) translateZ(${depth}px)`, // top (Face 1)
                          `rotateY(0deg) translateZ(${depth}px)`, // front (Face 2)
                          `rotateY(90deg) translateZ(${depth}px)`, // right (Face 3)
                          `rotateY(180deg) translateZ(${depth}px)`, // back (Face 4)
                          `rotateY(-90deg) translateZ(${depth}px)`, // left (Face 5)
                          `rotateX(-90deg) translateZ(${depth}px)`, // bottom (Face 6)
                        ];

                        return facesForCube.map((face, index) => {
                          const imgUrl = getFaceMainPhotoUrl(face);
                          const label = face.title || `Face ${index + 1}`;
                          const isFlipped = flippedFaceIndex === index;

                          return (
                            <div
                              key={index}
                              className="absolute left-1/2 top-1/2 [transform-style:preserve-3d] transition-transform duration-500"
                              style={{
                                width: size,
                                height: size,
                                transform: `translate(-50%, -50%) ${transforms[index]} rotateY(${isFlipped ? 180 : 0}deg)`,
                              }}
                            >
                              {/* FACE AVANT : photo */}
                              <div className="absolute inset-0 overflow-hidden rounded-none border border-slate-900/10 bg-slate-900/95 text-xs shadow-xl shadow-slate-900/40 [backface-visibility:hidden]">
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

                                {/* Légère ombre en bas de la face */}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Bouton plein écran en bas à gauche */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFullScreenFaceIndex(index);
                                  }}
                                  className="absolute left-3 bottom-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 text-xs text-slate-900 shadow-sm backdrop-blur hover:border-white hover:bg-white"
                                >
                                  <span aria-hidden>⤢</span>
                                  <span className="sr-only">
                                    Afficher cette face en plein écran
                                  </span>
                                </button>

                                {/* Bouton flip → dos FacePreview */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFlippedFaceIndex((prev) =>
                                      prev === index ? null : index,
                                    );
                                    setOpenedFaceForDetails(index);

                                    const segs: PreviewSegment[] =
                                      face?.segments ?? [];
                                    const firstId =
                                      segs[0]?.id ??
                                      (segs.length > 0
                                        ? segs[0].id ?? 0
                                        : null);

                                    setOpenedSegmentId(firstId ?? null);
                                  }}
                                  className="absolute right-3 bottom-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 text-xs text-slate-900 shadow-sm backdrop-blur hover:border-white hover:bg-white"
                                >
                                  <span className="text-xs" aria-hidden>
                                    ↗︎
                                  </span>
                                  <span className="sr-only">
                                    Voir le détail de cette face
                                  </span>
                                </button>
                              </div>

                              {/* FACE ARRIÈRE : FacePreview collée derrière la carte */}
                              <div
                                className="absolute inset-0 rounded-none border border-slate-200 bg-transparent text-xs shadow-xl shadow-slate-900/30 [backface-visibility:hidden]"
                                style={{ transform: "rotateY(180deg)" }}
                              >
                                <div className="flex h-full w-full items-center justify-center bg-white/95">
                                  <div className="h-[94%] w-[94%] scale-[0.9]">
                                    <MagicDisplayFacePreview
                                      face={face}
                                      faceIndex={index}
                                      openedSegmentId={openedSegmentId}
                                      onSegmentChange={(id) =>
                                        setOpenedSegmentId(id)
                                      }
                                      creatorName="Aiko Tanaka"
                                      creatorInitials="AT"
                                    />
                                  </div>

                                  {/* Bouton pour refermer et revenir au cube */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFlippedFaceIndex(null);
                                      setOpenedFaceForDetails(null);
                                      setOpenedSegmentId(null);
                                    }}
                                    className="absolute right-3 bottom-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-xs text-slate-700 shadow-sm backdrop-blur hover:border-slate-400 hover:bg-white"
                                  >
                                    <span aria-hidden>↺</span>
                                    <span className="sr-only">
                                      Revenir à la vue cube
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Note pédagogique de la face (globale) */}
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

            {/* 📝 Bloc "Contenu du segment sélectionné" (sans cercle sous le cube) */}
            {detailFace && detailSegments.length > 0 && activeDetailSegment && (
              <section className="mt-6 w-full max-w-3xl self-center rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
                      Contenu du segment sélectionné
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Face {openedFaceForDetails! + 1} ·{" "}
                      {detailFace.title?.trim() || "Sans titre"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenedFaceForDetails(null);
                      setOpenedSegmentId(null);
                      setFlippedFaceIndex(null);
                    }}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                  >
                    Masquer
                  </button>
                </div>

                {/* Liste de segments sous forme de puces */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {detailSegments.map((seg, index) => {
                    const id = (seg as any).id ?? (seg as any).key ?? index;
                    const label =
                      (seg.title as string | undefined)?.trim() ||
                      `Segment ${index + 1}`;
                    const selected =
                      openedSegmentId === id || activeDetailIndex === index;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setOpenedSegmentId(id)}
                        className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] transition ${
                          selected
                            ? "border-brand-400 bg-brand-500/10 text-brand-600"
                            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Média principal */}
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {renderSegmentMedia(activeDetailSegment)}
                </div>

                {/* Notes du segment */}
                <div className="space-y-1">
                  {segmentTitle && (
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {segmentTitle}
                    </p>
                  )}
                  <p className="whitespace-pre-line text-[13px] text-slate-700">
                    {segmentNotes ||
                      "Pas de notes pédagogiques, tout est dit dans le titre."}
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* 🔍 Overlay plein écran pour la face sélectionnée */}
      {fullScreenFaceIndex !== null && faces[fullScreenFaceIndex] && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-[520px] overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
            {/* Bouton fermer */}
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
              const label = face.title || `Face ${fullScreenFaceIndex + 1}`;

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

/**
 * Affiche le premier média du segment en grand (lecture seule).
 */
function renderSegmentMedia(segment: PreviewSegment | undefined) {
  if (!segment) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
        Aucun segment sélectionné.
      </div>
    );
  }

  const mediaList = (segment.media as any[]) ?? [];

  if (!mediaList.length) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
        Aucun média pour ce segment.
      </div>
    );
  }

  const media = mediaList[0];
  const url = (media?.url as string | undefined) ?? "";
  const type = (media?.type as string | undefined) ?? "";

  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
        Média non disponible.
      </div>
    );
  }

  if (type === "video") {
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video src={url} controls className="h-full w-full object-cover" />;
  }

  if (type === "photo" || type === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={segment.title ?? "Média"}
        className="h-full w-full object-cover"
      />
    );
  }

  const filename = (media?.filename as string | undefined) ?? "Fichier";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-600">
      <div className="rounded-full border border-slate-300 bg-white/70 px-3 py-1">
        {filename}
      </div>
      <p className="max-w-xs text-center text-[11px] text-slate-500">
        Ce type de fichier sera téléchargeable dans la version utilisateur
        finale.
      </p>
    </div>
  );
}
