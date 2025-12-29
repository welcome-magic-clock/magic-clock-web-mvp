// features/display/progress.ts
export type SegmentStatus = "empty" | "in-progress" | "complete";

export type Segment = {
  id: number;
  status: SegmentStatus;
  notes: string;
  mediaUrl?: string | null;
};

export type FaceState = {
  faceId: number;
  segmentCount: number;
  segments: Segment[];
};

function isFaceCovered(face: FaceState): boolean {
  const active = face.segments.slice(0, face.segmentCount);
  return active.some((s) => s.status !== "empty");
}

function hasUniversalContent(face: FaceState): boolean {
  const active = face.segments.slice(0, face.segmentCount);
  return active.some((s) => s.status === "complete");
}

export function computeMagicClockPublishProgress(opts: {
  studioCompleted: boolean;
  faces: Record<number, FaceState>;
}) {
  const { studioCompleted, faces } = opts;

  let progress = 0;
  const studioPart = studioCompleted ? 40 : 0;
  progress += studioPart;

  let completedFaces = 0;
  let partialFaces = 0;

  for (let i = 1; i <= 6; i++) {
    const face = faces[i];
    if (!face) continue;

    const covered = isFaceCovered(face);
    const universal = hasUniversalContent(face);

    if (universal) {
      progress += 10;          // 5% couverture + 5% contenu
      completedFaces++;
    } else if (covered) {
      progress += 5;           // seulement couverture
      partialFaces++;
    }
  }

  const clamped = Math.min(100, Math.max(0, progress));

  return {
    percent: clamped,
    studioPart,
    displayPart: clamped - studioPart,
    completedFaces,
    partialFaces,
  };
}
