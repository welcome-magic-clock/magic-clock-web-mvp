"use client";

import MagicDisplayFaceDialBase from "./MagicDisplayFaceDialBase";

type MediaType = "photo" | "video" | "file";

type BackCircleProps = {
  face: {
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
  openedSegmentId: string | number | null;
  onSegmentChange: (id: string | number) => void;
  creatorName: string;
  creatorInitials: string;
  creatorAvatar?: string | null;
};

type DialStatus = "empty" | "in-progress" | "complete";

type DialSegment = {
  id: number;
  label: string;
  status: DialStatus;
  mediaType?: MediaType;
  mediaUrl?: string | null;
};

export default function MagicDisplayFaceBackCircle({
  face,
  openedSegmentId,
  onSegmentChange,
  creatorName,
  creatorInitials,
  creatorAvatar = null,
}: BackCircleProps) {
  const rawSegments = face.segments ?? [];
  const segmentCount = rawSegments.length || 1;

  const dialSegments: DialSegment[] = rawSegments.map((seg, index) => {
    const media = seg.media?.[0];
    const mediaType = (media?.type as MediaType | undefined) ?? undefined;
    const mediaUrl = media?.url ?? "";

    const hasMedia = !!mediaUrl;
    const hasNotes = !!seg.notes && seg.notes.trim().length > 0;
    const hasTitle = !!seg.title && seg.title.trim().length > 0;

    let status: DialStatus = "empty";
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

  // Toujours un nombre pour MagicDisplayFaceDialBase
  const selectedId: number =
    typeof openedSegmentId === "number"
      ? openedSegmentId
      : dialSegments[0]?.id ?? 1;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <MagicDisplayFaceDialBase
        creatorName={creatorName}
        creatorAvatar={creatorAvatar}
        creatorInitials={creatorInitials}
        segmentCount={segmentCount}
        segments={dialSegments}
        selectedId={selectedId}
        needles={{ needle2Enabled: false }}
        mode="preview"
        onSegmentClick={(seg) => onSegmentChange(seg.id)}
      />
    </div>
  );
}
