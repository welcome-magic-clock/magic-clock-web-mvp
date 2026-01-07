// app/create/display/page.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

import MagicDisplayFaceEditor from "@/features/display/MagicDisplayFaceEditor";
import MagicDisplayPreviewShell, {
  type PreviewDisplay,
  type PreviewFace,
  type PreviewSegment,
} from "@/features/display/MagicDisplayPreviewShell";

type FaceEditorPayload = {
  faceId: number;
  faceLabel?: string;
  segmentCount: number;
  segments: {
    id: number;
    title: string;
    description?: string; // ⬅️ maintenant optionnel, comme dans MagicDisplayFaceEditor
    notes?: string;       // ⬅️ optionnel aussi
    media?: {
      type: "photo" | "video" | "file";
      url: string;
      filename?: string;
    }[];                  // ⬅️ le tableau lui-même est optionnel
  }[];
};

function createInitialDisplay(): PreviewDisplay {
  const faces: PreviewFace[] = Array.from({ length: 6 }, (_, index) => ({
    title: `Face ${index + 1}`,
    description: "",
    notes: "",
    segments: [],
  }));

  return { faces };
}

export default function MagicDisplayEditorPage() {
  const [displayDraft, setDisplayDraft] = useState<PreviewDisplay>(
    () => createInitialDisplay(),
  );

  // face en cours d’édition (0 → 5)
  const [editingFaceIndex, setEditingFaceIndex] = useState(0);

  // ancre pour scroller sur la preview 3D
  const previewRef = useRef<HTMLDivElement | null>(null);

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

    // ❗️On NE TOUCHE PLUS à description ici
    const nextFace: PreviewFace = {
      title: previous?.title || `Face ${payload.faceId}`,     // titre système
      description: previous?.description ?? "",               // texte que tu édites dans "Faces de ce cube"
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
const currentFaceData = displayDraft.faces?.[editingFaceIndex];

const currentFaceLabel =
  currentFaceData?.description?.trim() ||
  currentFaceData?.title?.trim() ||
  `Face ${currentFaceId}`;
  const handleScrollToPreview = () => {
    previewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* HEADER + bouton Visualiser */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Magic Display</h1>
          <p className="mt-2 text-sm text-slate-600">
            Étape 2 : tu prépares ici l&apos;affichage final de ton Magic Clock :
            carte avant/après + cube 3D interactif. Ce rendu sera ensuite
            utilisé sur Amazing (FREE / Abonnement / PPV).
          </p>
        </div>

        <button
          type="button"
          onClick={handleScrollToPreview}
          className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          Visualiser mon Magic Clock
        </button>
      </div>

      {/* SECTION 1 : Aperçu carte Magic Studio (Avant / Après) */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-slate-500">
          APERÇU MAGIC STUDIO
        </h2>

        <div className="mt-3 rounded-3xl bg-slate-50 p-3 sm:p-4">
          <h3 className="text-sm font-medium text-slate-700">
            Carte avant / après (vitrine)
          </h3>

          <div className="mt-3 rounded-3xl bg-slate-100 p-3">
            {/* Carte Magic Display */}
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-slate-200">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/mp-1.png"
                  alt="Balayage caramel lumineux - avant/après"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 400px"
                  priority
                />

                {/* Gradient bas + barre d'infos créateur */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/90 text-sm font-semibold">
                      S
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">
                        Sofia Rivera
                      </span>
                      <span className="text-[11px] text-slate-200">
                        @sofia_rivera · 12&nbsp;400 vues
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    FREE
                  </span>
                </div>
              </div>
            </div>

            {/* Légende sous la carte */}
            <div className="mt-4 space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Balayage caramel lumineux
              </p>
              <p className="text-xs text-slate-600">
                MVP : l&apos;image est fixe. Plus tard, elle viendra directement de
                ton Magic Studio (avant / après choisi pour ce Magic Clock).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 : Faces + Cube 3D Preview */}
      <section
        ref={previewRef}
        className="mt-8 grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6 lg:grid-cols-2"
      >
        {/* Colonne gauche : Editor des faces */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Faces du Magic Display
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            Atelier : choisis une face, définis ses segments, notes et médias.
            Le cube 3D à droite se met à jour en temps réel avec ton travail.
          </p>

          {/* Sélecteur Face 1 → 6 */}
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
                      ? "border-violet-500 bg-violet-500/10 text-violet-600"
                      : "border-slate-300 bg-slate-100 text-slate-600 hover:border-slate-400 hover:bg-slate-200",
                  ].join(" ")}
                >
                  Face {id}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <MagicDisplayFaceEditor
  faceId={currentFaceId}
  faceLabel={currentFaceLabel}
  onFaceChange={handleFaceChange}
/>
          </div>
        </div>

        {/* Colonne droite : Cube 3D + détails segment */}
        <div className="flex flex-col">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Aperçu du Magic Clock (cube 3D)
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            Vitrine read-only : ce cube correspond à ce que verront les
            utilisateurs quand ils ouvriront ton Magic Clock depuis Amazing.
          </p>

          <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50">
            <MagicDisplayPreviewShell display={displayDraft} />
          </div>
        </div>
      </section>
    </main>
  );
}
