// features/display/MagicDisplayNeedles.tsx
"use client";

export type FaceNeedles = {
  needle2Enabled: boolean;
};

export const defaultNeedles = (): FaceNeedles => ({
  needle2Enabled: false,
});

/**
 * Calcule l’angle (centre du segment) pour un id de segment (1-based).
 */
export function segmentAngleForId(segmentId: number, count: number) {
  const c = Math.max(1, count);
  const step = 360 / c;
  const start = -90; // 12h = segment 1
  const idx = Math.max(0, Math.min(c - 1, (segmentId ?? 1) - 1));
  return start + step * idx;
}

/**
 * Aiguille 1 (modèle simple, une seule direction).
 * On lui donne un angle + une longueur en pixels.
 */
export function WatchHandOneWayRefined({
  angleDeg,
  frontLenPx,
}: {
  angleDeg: number;
  frontLenPx: number;
}) {
  const width = Math.max(40, frontLenPx);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ transform: `translate(-50%, -50%) rotate(${angleDeg}deg)` }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: `${width}px`,
          height: "3px",
          background: "rgba(51,65,85,0.95)", // slate-700
          borderRadius: 9999,
          clipPath:
            "polygon(0 40%, 92% 0, 100% 50%, 92% 100%, 0 60%)",
          boxShadow: "0 2px 4px rgba(15,23,42,0.30)",
        }}
      />
    </div>
  );
}
