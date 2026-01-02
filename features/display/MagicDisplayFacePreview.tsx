"use client";

import MagicDisplayFaceDialBase from "./MagicDisplayFaceDialBase";

type MediaType = "photo" | "video" | "file";

export type MagicDisplayFacePreviewProps = {
  face: {
    title?: string;
    description?: string;
    notes?: string;
    segments: {
      id: number;
      title?: string;
      description?: string;
      notes?: string;
      media?: {
        type: MediaType | string;
        url: string;
        filename?: string;
      }[];
    }[];
  };
  faceIndex: number;
  openedSegmentId: string | number | null;
  onSegmentChange: (id: string | number) => void;
  creatorName: string;
 creatorAvatar?: string | null;
  creatorAvatar?: string | null;
};

export default function MagicDisplayFacePreview({
  face,
  faceIndex,
  openedSegmentId,
  onSegmentChange,
  creatorName,
  creatorInitials,
  creatorAvatar,
}: MagicDisplayFacePreviewProps) {
  const rawSegments = face.segments ?? [];
  const segmentCount = rawSegments.length || 1;

  const dialSegments = rawSegments.map((seg, index) => {
    const media = seg.media?.[0];
    const mediaType = (media?.type as MediaType | undefined) ?? undefined;
    const mediaUrl = media?.url ?? "";

    const hasMedia = !!mediaUrl;
    const hasNotes = !!seg.notes && seg.notes.trim().length > 0;
    const hasTitle = !!seg.title && seg.title.trim().length > 0;

    let status: "empty" | "in-progress" | "complete" = "empty";
    if (hasMedia || hasNotes) status = "complete";
    else if (hasTitle) status = "in-progress";

    return {
      id: seg.id ?? index + 1,
      label: seg.title?.trim() || `Segment ${index + 1}`,
      status,
      mediaType: mediaType ?? (hasMedia ? "photo" : undefined),
      mediaUrl: hasMedia ? mediaUrl : null,
    };
  });

  // ✅ Toujours un number (jamais undefined)
  const selectedId: number =
    typeof openedSegmentId === "number"
      ? openedSegmentId
      : dialSegments.length > 0
        ? dialSegments[0].id
        : 1;

  return (
    <section className="flex h-full w-full flex-col rounded-3xl bg-white px-4 pb-4 pt-3">
      {/* En-tête de la face */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Face {faceIndex + 1} / 6
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {face.title?.trim() || `Face ${faceIndex + 1}`}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
          <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
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
          <span className="font-medium">{creatorName}</span>
        </div>
      </div>

      {/* Dial commun en mode preview */}
      <div className="flex flex-1 items-center justify-center">
       <MagicDisplayFaceDialBase
  creatorName={creatorName}
  creatorAvatar={creatorAvatar ?? null}
  creatorInitials={creatorInitials}
  segmentCount={segmentCount}
  segments={dialSegments}
  selectedId={selectedId ?? undefined}
  needles={{ needle2Enabled: false }}
  mode={variant === "circle-only" ? "preview" : "preview"} // pour l’instant même mode
  onSegmentClick={(seg) => onSegmentChange(seg.id)}
/>

      <p className="mt-3 text-center text-[11px] text-slate-500">
        Tap sur une bulle pour explorer le segment associé à cette étape.
      </p>
    </section>
  );
}
