"use client";

import { useState } from "react";
import MagicCube3D from "./MagicCube3D";
import MagicDisplayFacePreview from "./MagicDisplayFacePreview";

type MagicDisplayPreviewShellProps = {
  display: any;        // objet complet du Display (faces, etc.)
  onBack: () => void;  // retour vers l'écran d'édition
};

export default function MagicDisplayPreviewShell({
  display,
  onBack,
}: MagicDisplayPreviewShellProps) {
  const faces = (display?.faces ?? []) as any[];

  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
  const [openedFaceIndex, setOpenedFaceIndex] = useState<number | null>(null);

  const hasFaces = faces.length > 0;
  const safeFaceIndex =
    activeFaceIndex < faces.length ? activeFaceIndex : 0;

  const activeFace = hasFaces ? faces[safeFaceIndex] : null;
  const faceTitle =
    (activeFace?.title as string | undefined)?.trim() ||
    `Face ${safeFaceIndex + 1}`;
  const faceNotes = ((activeFace?.notes as string | undefined) ?? "").trim();

  const showFacePreview =
    openedFaceIndex !== null &&
    openedFaceIndex >= 0 &&
    openedFaceIndex < faces.length;

  if (!hasFaces) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-slate-50">
        <header className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium hover:bg-slate-800/60"
          >
            ← Retour à l’édition
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-slate-400">
          Aucun Display à prévisualiser pour le moment.
        </div>
      </div>
    );
  }

  // 🧊 Vue "Face" en plein écran (read-only)
  if (showFacePreview) {
    const openedFace = faces[openedFaceIndex!];

    return (
      <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-slate-50">
        <MagicDisplayFacePreview
          face={openedFace}
          faceIndex={openedFaceIndex!}
          onBack={() => setOpenedFaceIndex(null)}
        />
      </div>
    );
  }

  // Helpers rotation cube
  const goToPrevFace = () => {
    setActiveFaceIndex((prev) =>
      prev <= 0 ? faces.length - 1 : prev - 1
    );
  };

  const goToNextFace = () => {
    setActiveFaceIndex((prev) =>
      prev >= faces.length - 1 ? 0 : prev + 1
    );
  };

  // Pour ↑ / ↓ : même logique pour l’instant (on pourra raffiner avec une vraie
  // top/bottom map quand on connaîtra le mapping exact des faces dans MagicCube3D).
  const rotateUp = goToPrevFace;
  const rotateDown = goToNextFace;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium hover:bg-slate-800/60"
        >
          ← Retour à l’édition
        </button>

        <div className="text-xs font-medium text-slate-100">
          Face {safeFaceIndex + 1} · {faceTitle}
        </div>

        <div className="w-24" />
      </header>

      {/* Corps */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-8 pt-6">
        {/* Cube + flèches */}
        <div className="relative w-full max-w-sm">
          <div className="relative mx-auto aspect-square w-full">
            {/* Cube 3D en lecture seule */}
            <MagicCube3D
              // ⚠️ adapte ces props si ton MagicCube3D a une API différente
              faces={faces}
              activeFaceIndex={safeFaceIndex}
              onFaceChange={setActiveFaceIndex}
              readOnly
            />

            {/* Flèche ↗︎ pour entrer dans la face */}
            <button
              type="button"
              onClick={() => setOpenedFaceIndex(safeFaceIndex)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-xs font-semibold text-slate-50 shadow-sm hover:bg-slate-800"
              aria-label="Entrer dans la face"
            >
              ↗︎
            </button>

            {/* Flèches de rotation ultra épurées */}
            <button
              type="button"
              onClick={rotateUp}
              className="absolute left-1/2 top-[-2.25rem] -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs leading-none text-slate-50 shadow-sm hover:bg-slate-800"
              aria-label="Tourner vers le haut"
            >
              ↑
            </button>

            <button
              type="button"
              onClick={rotateDown}
              className="absolute bottom-[-2.25rem] left-1/2 -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs leading-none text-slate-50 shadow-sm hover:bg-slate-800"
              aria-label="Tourner vers le bas"
            >
              ↓
            </button>

            <button
              type="button"
              onClick={goToPrevFace}
              className="absolute left-[-2.25rem] top-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs leading-none text-slate-50 shadow-sm hover:bg-slate-800"
              aria-label="Tourner vers la gauche"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goToNextFace}
              className="absolute right-[-2.25rem] top-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs leading-none text-slate-50 shadow-sm hover:bg-slate-800"
              aria-label="Tourner vers la droite"
            >
              →
            </button>
          </div>
        </div>

        {/* Notes pédagogiques de la face */}
        <section className="max-w-xl text-center">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Notes pédagogiques
          </p>
          <p className="whitespace-pre-line text-sm text-slate-100">
            {faceNotes ||
              "Pas de notes pédagogiques tout est dit dans le titre."}
          </p>
        </section>
      </main>
    </div>
  );
}
