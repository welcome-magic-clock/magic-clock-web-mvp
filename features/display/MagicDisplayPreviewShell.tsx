"use client";

import { useState } from "react";
import MagicCube3D from "@/features/display/MagicCube3D";

type MediaKind = "photo" | "video" | "file";

type PreviewMedia = {
  type: MediaKind;
  url: string;
  filename?: string;
};

type PreviewSegment = {
  id: number;
  title: string;
  description?: string;
  notes?: string;
  media?: PreviewMedia[];
};

type PreviewFace = {
  title: string;
  notes?: string;
  segments: PreviewSegment[];
};

type MagicDisplayPreviewShellProps = {
  display: {
    faces: PreviewFace[];
  };
  onBack: () => void;
  /** Appelé quand l’utilisateur clique sur la flèche ↗ de la face active */
  onOpenFace?: (faceIndex: number) => void;
};

const FACE_ANGLES = [-90, -30, 30, 90, 150, 210];

export default function MagicDisplayPreviewShell({
  display,
  onBack,
  onOpenFace,
}: MagicDisplayPreviewShellProps) {
  const faces = display?.faces ?? [];
  const hasFaces = faces.length > 0;
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);

  const safeFaceIndex =
    !hasFaces || activeFaceIndex < 0 || activeFaceIndex >= faces.length
      ? 0
      : activeFaceIndex;

  const activeFace = hasFaces ? faces[safeFaceIndex] : null;

  // ➜ On prépare des "segments" pour le cube 3D
  const segmentsForCube = faces.map((face, index) => {
    const firstSegment = face.segments?.[0];
    const firstMedia = firstSegment?.media?.[0];

    const hasMedia =
      Boolean(firstSegment?.media && firstSegment.media.length > 0) || false;

    const label = face.title || `Face ${index + 1}`;
    const description =
      firstSegment?.description || firstSegment?.title || face.title || "";
    const notes = face.notes ?? firstSegment?.notes ?? "";

    const mediaType: MediaKind | undefined = firstMedia?.type;
    const mediaUrl = firstMedia?.url ?? undefined;

    return {
      id: index + 1,
      label,
      description,
      angleDeg: FACE_ANGLES[index] ?? -90,
      hasMedia,
      mediaType,
      mediaUrl: mediaUrl ?? null,
      notes,
    };
  });

  const selectedSegmentId =
    segmentsForCube[safeFaceIndex]?.id ?? (segmentsForCube[0]?.id ?? null);

  function handleCubeSelect(id: number | null) {
    if (id == null) return;
    const idx = segmentsForCube.findIndex((seg) => seg.id === id);
    if (idx >= 0) {
      setActiveFaceIndex(idx);
    }
  }

  function goPrevFace() {
    if (!hasFaces) return;
    setActiveFaceIndex((prev) =>
      prev - 1 < 0 ? faces.length - 1 : prev - 1,
    );
  }

  function goNextFace() {
    if (!hasFaces) return;
    setActiveFaceIndex((prev) =>
      prev + 1 >= faces.length ? 0 : prev + 1,
    );
  }

  const activeNotes = activeFace
    ? activeFace.notes || activeFace.segments?.[0]?.notes || ""
    : "";

  return (
    <main className="flex min-h-screen flex-col bg-black text-slate-50">
      {/* Header ultra simple */}
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-200 hover:text-white"
        >
          <span className="text-sm">←</span>
          <span>Retour au Magic Display</span>
        </button>

        <h1 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Visualiser mon Magic Clock
        </h1>

        <div className="w-20" />
      </header>

      {/* Zone centrale : cube + flèches + face active */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-4 sm:px-6">
        {/* Cube + flèches 2025 minimalistes */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <MagicCube3D
              segments={segmentsForCube}
              selectedId={selectedSegmentId}
              onSelect={handleCubeSelect}
            />

            {/* Flèche haut */}
            <button
              type="button"
              onClick={goPrevFace}
              className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-white/10"
            >
              ↑
            </button>

            {/* Flèche bas */}
            <button
              type="button"
              onClick={goNextFace}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-white/10"
            >
              ↓
            </button>

            {/* Flèche gauche */}
            <button
              type="button"
              onClick={goPrevFace}
              className="absolute left-[-3rem] top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-white/10"
            >
              ←
            </button>

            {/* Flèche droite */}
            <button
              type="button"
              onClick={goNextFace}
              className="absolute right-[-3rem] top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-white/10"
            >
              →
            </button>
          </div>
        </div>

        {/* Panneau Face active */}
        <div className="relative mt-12 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-100 sm:px-5 sm:py-4">
          {/* Flèche ↗ pour ouvrir la face en détail (et uniquement elle est cliquable) */}
          {hasFaces && (
            <button
              type="button"
              onClick={() => onOpenFace?.(safeFaceIndex)}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/5 text-[11px] font-semibold text-slate-50 hover:bg-white/10"
              aria-label="Ouvrir cette face en détail"
            >
              ↗
            </button>
          )}

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Face active
          </p>

          <h2 className="mt-1 text-sm font-semibold text-slate-50">
            {activeFace
              ? activeFace.title || `Face ${safeFaceIndex + 1}`
              : "Aucune face définie"}
          </h2>

          <div className="mt-2 min-h-[3rem] text-[11px] leading-relaxed text-slate-100">
            {activeNotes ? (
              <p className="whitespace-pre-line">{activeNotes}</p>
            ) : (
              <p className="italic text-slate-400">
                Pas de notes pédagogiques, tout est dit dans le titre.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
