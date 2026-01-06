// features/display/MagicDisplayFaceBackCircle.tsx
"use client";

import MagicDisplayFaceDialBase from "./MagicDisplayFaceDialBase";
import type { PreviewFace, PreviewSegment } from "./MagicDisplayPreviewShell";

type MediaType = "photo" | "video" | "file";

type DialStatus = "empty" | "in-progress" | "complete";

type DialSegment = {
  id: number;
  label: string;
  status: DialStatus;
  mediaType?: MediaType;
  mediaUrl?: string | null;
};

type FaceNeedles = {
  needle2Enabled: boolean;
};

type MagicDisplayFaceBackCircleProps = {
  face: PreviewFace;
  openedSegmentId: number | string | null;
  onSegmentChange?: (id: number | string | null) => void;
  creatorName: string;
  creatorInitials: string;
  creatorAvatar?: string | null;
};

export default function MagicDisplayFaceBackCircle({
  face,
  openedSegmentId,
  onSegmentChange,
  creatorName,
  creatorInitials,
  creatorAvatar = null,
}: MagicDisplayFaceBackCircleProps) {
  const rawSegments = (face.segments as PreviewSegment[]) ?? [];

  // 🔢 Nombre de segments : on privilégie face.segmentCount si défini
  const baseCount = rawSegments.length || 1;
  const segmentCount =
    typeof (face as any).segmentCount === "number" &&
    (face as any).segmentCount > 0
      ? (face as any).segmentCount
      : baseCount;

  // 🧭 Aiguilles : on récupère la config de la face, avec fallback propre
  const needles: FaceNeedles = {
    needle2Enabled: !!(face as any).needles?.needle2Enabled,
  };

  // 🎨 Reconstruction des segments pour le cadran
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
      id: (seg.id as number) ?? index + 1,
      label: seg.title?.trim() || `Segment ${index + 1}`,
      status,
      mediaType: mediaType ?? (hasMedia ? "photo" : undefined),
      mediaUrl: hasMedia ? mediaUrl : null,
    };
  });

  // Toujours un nombre pour MagicDisplayFaceDialBase
  let selectedId: number =
    typeof openedSegmentId === "number"
      ? openedSegmentId
      : dialSegments[0]?.id ?? 1;

  // Si l'id demandé n'existe pas dans la liste, on retombe sur le premier
  if (!dialSegments.some((s) => s.id === selectedId)) {
    selectedId = dialSegments[0]?.id ?? 1;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <MagicDisplayFaceDialBase
        creatorName={creatorName}
        creatorAvatar={creatorAvatar ?? undefined}
        creatorInitials={creatorInitials}
        segmentCount={segmentCount}
        segments={dialSegments as any}
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
