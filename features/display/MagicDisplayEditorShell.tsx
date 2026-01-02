// features/display/MagicDisplayEditorShell.tsx
"use client";

import { useCallback, useState } from "react";
import MagicDisplayFaceEditor from "./MagicDisplayFaceEditor";
import MagicDisplayPreviewShell, {
  type PreviewDisplay,
  type PreviewFace,
  type PreviewSegment,
} from "./MagicDisplayPreviewShell";

/**
 * Crée un display vide avec 6 faces (compatibles cube 3D).
 */
function createInitialDisplay(): PreviewDisplay {
  const faces: PreviewFace[] = Array.from({ length: 6 }, (_, index) => ({
    title: `Face ${index + 1}`,
    description: "",
    notes: "",
    segments: [],
  }));

  return { faces };
}

type FaceEditorPayload = {
  faceId: number;
  faceLabel?: string;
  segmentCount: number;
  segments: {
    id: number;
    title: string;
    description?: string; // ⬅️ optionnel
    notes?: string;       // ⬅️ optionnel
    media?: {
      type: "photo" | "video" | "file";
      url: string;
      filename?: string;
    }[];                  // ⬅️ optionnel
  }[];
};

export default function MagicDisplayEditorShell() {
  const [displayDraft, setDisplayDraft] = useState<PreviewDisplay>(
    () => createInitialDisplay(),
  );

  // Face en cours d’édition côté Editor (0 → 5)
  const [editingFaceIndex, setEditingFaceIndex] = useState(0);

  /**
   * 🔁 Reçoit les infos d’une face depuis MagicDisplayFaceEditor
   * et met à jour displayDraft.faces[faceId - 1]
   */
  const handleFaceChange = useCallback((payload: FaceEditorPayload) => {
    setDisplayDraft((prev) => {
      const faces = [...(prev.faces ?? [])];

      const index = Math.max(0, Math.min(5, (payload.faceId ?? 1) - 1));
      const previous = faces[index];

     const mappedSegments: PreviewSegment[] = payload.segments.map((seg) => ({
  id: seg.id,
  title: seg.title,
  description: seg.description,
  notes: seg.notes,
  media: seg.media,
}));

      const nextFace: PreviewFace = {
        title: payload.faceLabel || previous?.title || `Face ${payload.faceId}`,
        description: previous?.description ?? "",
        notes: previous?.notes ?? "",
        segments: mappedSegments,
      };

      faces[index] = nextFace;

      return {
        ...prev,
        faces,
      };
    });
  }, []);

  const currentFaceId = editingFaceIndex + 1;
  const currentFaceLabel = `Face ${currentFaceId}`;

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-950 text-slate-50 lg:grid-cols-2">
      {/* 🛠️ Colonne gauche : Editor */}
      <div className="border-b border-slate-800 p-4 lg:border-b-0 lg:border-r">
        <header className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Magic Clock · Studio
            </p>
            <h1 className="text-lg font-semibold text-slate-50">
              Magic Display Editor
            </h1>
            <p className="text-xs text-slate-400">
              Atelier : tu construis les faces ici, le cube se met à jour à
              droite en temps réel.
            </p>
          </div>
        </header>

        {/* Sélecteur de face 1 → 6 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, idx) => {
            const id = idx + 1;
            const isActive = idx === editingFaceIndex;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setEditingFaceIndex(idx)}
                className={[
                  "rounded-full border px-3 py-1 text-xs transition",
                  isActive
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800",
                ].join(" ")}
              >
                Face {id}
              </button>
            );
          })}
        </div>

        {/* Editor pour la face sélectionnée */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4">
          <MagicDisplayFaceEditor
            faceId={currentFaceId}
            faceLabel={currentFaceLabel}
            onFaceChange={handleFaceChange}
          />
        </div>
      </div>

      {/* 🔮 Colonne droite : Preview cube 3D */}
      <div className="flex flex-col p-4">
        <header className="mb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Magic Clock · Preview
          </p>
          <h2 className="text-sm font-semibold text-slate-50">
            Cube 3D & détails du segment
          </h2>
          <p className="text-xs text-slate-400">
            Vitrine read-only : ce que tu vois ici correspond à ce qui sera
            affiché pour les utilisateurs.
          </p>
        </header>

        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70">
          <MagicDisplayPreviewShell display={displayDraft} />
        </div>
      </div>
    </div>
  );
}
