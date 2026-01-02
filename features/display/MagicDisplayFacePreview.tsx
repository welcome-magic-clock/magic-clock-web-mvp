// features/display/MagicDisplayFacePreview.tsx
"use client";

import MagicDisplayFaceDialBase from "./MagicDisplayFaceDialBase";
import type {
  PreviewFace,
  PreviewSegment,
} from "./MagicDisplayPreviewShell";

type MagicDisplayFacePreviewProps = {
  face: PreviewFace;
  faceIndex: number; // 0-based
  creatorName?: string;
  creatorAvatar?: string | null;
  creatorInitials?: string;
  openedSegmentId: string | number | null;
  onSegmentChange?: (id: string | number) => void;
  // Optionnel : utilisé par certains appels existants (ex. "circle-only")
  variant?: "circle-only" | "full";
};

export default function MagicDisplayFacePreview({
  face,
  faceIndex,
  creatorName = "Créateur",
  creatorAvatar = null,
  creatorInitials = "MC",
  openedSegmentId,
  onSegmentChange,
}: MagicDisplayFacePreviewProps) {
  const segments = (face?.segments ?? []) as PreviewSegment[];

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm sm:px-5 sm:py-5">
      {/* Ligne titre */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Face {faceIndex + 1} / 6
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {face.title?.trim() || "Sans titre"}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
            {creatorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold">{creatorInitials}</span>
            )}
          </span>
          <span className="font-medium truncate max-w-[120px] sm:max-w-[180px]">
            {creatorName}
          </span>
        </div>
      </div>

      {/* Cercle + bulles (shared dial) */}
      <MagicDisplayFaceDialBase
        mode="preview"
        segments={segments}
        openedSegmentId={openedSegmentId}
        onSegmentChange={onSegmentChange}
        creatorAvatar={creatorAvatar}
        creatorInitials={creatorInitials}
      />

      {/* Petite légende sous le cercle */}
      <p className="mt-3 text-center text-[10px] text-slate-500">
        Tap sur une bulle pour explorer le segment associé à cette étape.
      </p>
    </section>
  );
}
