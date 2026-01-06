// features/display/MagicDisplayFaceBackCircle.tsx
"use client";

import MagicDisplayFaceDialBase from "./MagicDisplayFaceDialBase";
import type { PreviewFace, PreviewSegment } from "./MagicDisplayPreviewShell";
import type { FaceNeedles } from "./MagicDisplayNeedles";

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
  const segments = (face.segments as PreviewSegment[]) ?? [];

  // 🔢 Nombre de segments sur le cercle (faceEditor ou presets)
  const safeSegmentCount =
    (face.segmentCount && face.segmentCount > 0
      ? face.segmentCount
      : segments.length) || 1;

  // 🧷 Aiguilles : on force toujours un booléen, jamais "undefined"
  const needles: FaceNeedles = {
    needle2Enabled: !!face.needles?.needle2Enabled,
  };

  // 🎯 Segment sélectionné
  let selectedId: number | string | null =
    openedSegmentId != null ? openedSegmentId : segments[0]?.id ?? null;

  if (segments.length > 0) {
    const exists = segments.some(
      (seg) =>
        seg.id === selectedId ||
        String(seg.id) === String(selectedId),
    );
    if (!exists) {
      selectedId = segments[0].id;
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <MagicDisplayFaceDialBase
        creatorName={creatorName}
        creatorAvatar={creatorAvatar ?? undefined}
        creatorInitials={creatorInitials}
        segmentCount={safeSegmentCount}
        segments={segments as any}
        selectedId={(selectedId as number) ?? undefined}
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
