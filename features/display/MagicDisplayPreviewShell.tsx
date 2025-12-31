"use client";

import { useMemo, useState } from "react";
import MagicCube3D from "@/features/display/MagicCube3D";

type MediaItem = {
  type: "photo" | "video" | "file";
  url: string;
  filename?: string;
};

type DisplaySegment = {
  id: number | string;
  title: string;
  description?: string;
  notes?: string;
  media?: MediaItem[];
};

type DisplayFace = {
  title: string;
  notes?: string;
  segments: DisplaySegment[];
};

export type MagicDisplayPreviewShellProps = {
  display: {
    faces: DisplayFace[];
  };
  onBack: () => void;
};

export default function MagicDisplayPreviewShell({
  display,
  onBack,
}: MagicDisplayPreviewShellProps) {
  const faces = display?.faces ?? [];
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);

  const safeFaceIndex =
    faces.length === 0
      ? -1
      : Math.min(Math.max(activeFaceIndex, 0), faces.length - 1);

  const activeFace =
    safeFaceIndex >= 0 && faces[safeFaceIndex] ? faces[safeFaceIndex] : null;

  // 🧩 On re-map les faces en "segments" pour MagicCube3D
  const cubeSegments = useMemo(
    () =>
      faces.map((face, idx) => {
        const firstSeg = face.segments?.[0];

        const hasMedia = face.segments?.some(
          (seg) => seg.media && seg.media.length > 0,
        );

        return {
          id: idx + 1,
          label: face.title || `Face ${idx + 1}`,
          description:
            firstSeg?.description ||
            firstSeg?.title ||
            face.title ||
            `Face ${idx + 1}`,
          // même pattern que INITIAL_SEGMENTS : -90, -30, 30, 90, 150, 210…
          angleDeg: -90 + idx * 60,
          hasMedia: Boolean(hasMedia),
        };
      }),
    [faces],
  );

  const selectedId =
    safeFaceIndex >= 0 && cubeSegments[safeFaceIndex]
      ? cubeSegments[safeFaceIndex].id
      : null;

  function handleSelectFromCube(id: number | null) {
    if (id == null) return;
    const idx = cubeSegments.findIndex((seg) => seg.id === id);
    if (idx >= 0) {
      setActiveFaceIndex(idx);
    }
  }

  function goPrevFace() {
    if (faces.length === 0) return;
    setActiveFaceIndex((prev) => (prev - 1 + faces.length) % faces.length);
  }

  function goNextFace() {
    if (faces.length === 0) return;
    setActiveFaceIndex((prev) => (prev + 1) % faces.length);
  }

  // 🧾 Texte pour les notes pédagogiques
  const notesText =
    activeFace?.notes?.trim() ||
    "Pas de notes pédagogiques, tout est dit dans le titre.";

  return (
    <main className="flex min-h-screen flex-col bg-black text-slate-100">
      {/* Barre du haut */}
      <header className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center rounded-full border border-slate-700 bg-black/40 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-black/70"
        >
          ← Retour
        </button>
        <p className="text-xs text-slate-400 sm:text-sm">
          Aperçu utilisateur · lecture seule
        </p>
      </header>

      {/* Contenu principal */}
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-2 sm:flex-row sm:items-stretch sm:px-8">
        {/* Colonne gauche : cube + flèches */}
        <div className="flex flex-1 flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <div className="aspect-square w-full">
              <MagicCube3D
                segments={cubeSegments}
                selectedId={selectedId}
                onSelect={handleSelectFromCube}
              />
            </div>

            {/* Flèches ultra épurées autour du cube */}
            <button
              type="button"
              onClick={goPrevFace}
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-black/70 px-3 py-1 text-xs font-semibold text-slate-100 hover:border-slate-400 hover:bg-black"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={goNextFace}
              className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-full border border-slate-700 bg-black/70 px-3 py-1 text-xs font-semibold text-slate-100 hover:border-slate-400 hover:bg-black"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={goPrevFace}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-black/70 px-3 py-1 text-xs font-semibold text-slate-100 hover:border-slate-400 hover:bg-black"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNextFace}
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-black/70 px-3 py-1 text-xs font-semibold text-slate-100 hover:border-slate-400 hover:bg-black"
            >
              →
            </button>
          </div>

          {/* Titre de la face active */}
          {activeFace && (
            <div className="text-center text-xs sm:text-sm">
              <p className="text-slate-400">
                Face {safeFaceIndex + 1} / {faces.length}
              </p>
              <p className="mt-1 font-semibold text-slate-50">
                {activeFace.title || `Face ${safeFaceIndex + 1}`}
              </p>
            </div>
          )}
        </div>

        {/* Colonne droite : Notes + segments */}
        <div className="flex w-full max-w-xl flex-1 flex-col gap-4 rounded-3xl bg-slate-900/70 p-4 sm:p-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Notes pédagogiques de la face active
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-100">
              {notesText}
            </p>
          </div>

          <div className="h-px w-full bg-slate-700/60" />

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Segments &amp; contenu
            </h3>

            {activeFace && activeFace.segments?.length ? (
              <ul className="space-y-2 text-xs text-slate-100">
                {activeFace.segments.map((seg) => {
                  const hasMedia = seg.media && seg.media.length > 0;

                  return (
                    <li
                      key={seg.id}
                      className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2"
                    >
                      <p className="font-semibold">
                        {seg.title || "Segment"}
                      </p>
                      {seg.description && (
                        <p className="mt-0.5 text-[11px] text-slate-300">
                          {seg.description}
                        </p>
                      )}
                      {seg.notes && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {seg.notes}
                        </p>
                      )}
                      {hasMedia && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          Médias associés disponibles dans ce segment.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">
                Aucun segment détaillé n&apos;est défini pour cette face.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
