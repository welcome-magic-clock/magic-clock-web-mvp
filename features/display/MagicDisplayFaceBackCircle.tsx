// features/display/MagicDisplayFaceBackCircle.tsx
"use client";

import MagicDisplayFaceDialBase from "./MagicDisplayFaceDialBase";
import type {
  PreviewFace,
  PreviewSegment,
  PreviewMedia,
} from "./MagicDisplayPreviewShell";

type MediaType = "photo" | "video" | "file";

type DialStatus = "empty" | "in-progress" | "complete";

type DialSegment = {
  id: number;
  label: string;
  status: DialStatus;
  mediaType?: MediaType;
  mediaUrl?: string | null;
};

type MagicDisplayFaceBackCircleProps = {
  face: PreviewFace;
  openedSegmentId: number | string | null;
  onSegmentChange?: (id: number | string | null) => void;

  creatorName: string;
  creatorInitials: string;
  creatorAvatar: string | null;
};

export default function MagicDisplayFaceBackCircle({
  face,
  openedSegmentId,
  onSegmentChange,
  creatorName,
  creatorInitials,
  creatorAvatar,
}: MagicDisplayFaceBackCircleProps) {
  const rawSegments = (face.segments as PreviewSegment[]) ?? [];
  const safeSegmentCount =
    face.segmentCount && face.segmentCount > 0
      ? face.segmentCount
      : rawSegments.length || 1;

  const needles = face.needles ?? { needle2Enabled: false };

  const dialSegments: DialSegment[] = rawSegments.map((seg, index) => {
    const media = (seg.media?.[0] as PreviewMedia | undefined) ?? undefined;
    const mediaType = (media?.type as MediaType | undefined) ?? undefined;
    const mediaUrl = media?.url ?? "";

    const hasMedia = !!mediaUrl;
    const hasNotes = !!seg.notes && seg.notes.trim().length > 0;
    const hasTitle = !!seg.title && seg.title.trim().length > 0;

    let status: DialStatus = "empty";
    if (hasMedia || hasNotes) status = "complete";
    else if (hasTitle) status = "in-progress";

    return {
      id: (seg.id as number) ?? index + 1,
      label: seg.title?.trim() || `Segment ${index + 1}`,
      status,
      mediaType: mediaType ?? (hasMedia ? "photo" : undefined),
      mediaUrl: hasMedia ? mediaUrl : null,
    };
  });

  // 🔎 Sélection du segment actif (toujours un nombre pour le DialBase)
  let selectedId: number =
    typeof openedSegmentId === "number"
      ? openedSegmentId
      : dialSegments[0]?.id ?? 1;

  if (dialSegments.length > 0) {
    const exists = dialSegments.some((s) => s.id === selectedId);
    if (!exists) {
      selectedId = dialSegments[0].id;
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <MagicDisplayFaceDialBase
        creatorName={creatorName}
        creatorAvatar={creatorAvatar ?? undefined}
        creatorInitials={creatorInitials}
        segmentCount={safeSegmentCount}
        segments={dialSegments}
        selectedId={selectedId}
        needles={needles}
        mode="preview"
        onSegmentClick={(seg: any) => {
          const id = seg?.id ?? seg;
          onSegmentChange?.(id);
        }}
      />
    </div>
  );
}
