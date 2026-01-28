"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Clapperboard, FileText } from "lucide-react";

export type SegmentStatus = "empty" | "in-progress" | "complete";
export type MediaType = "photo" | "video" | "file";

export type FaceNeedles = {
  needle2Enabled: boolean;
};

export type DialSegmentLike = {
  id: number;
  status?: SegmentStatus;
  mediaType?: MediaType | null;
};

export type MagicDisplayFaceDialMode = "editor" | "preview";

type MagicDisplayFaceDialBaseProps<
  TSegment extends DialSegmentLike = DialSegmentLike,
> = {
  creatorName: string;
  creatorAvatar?: string | null;
  creatorInitials: string;
  segmentCount: number;
  segments: TSegment[];
  selectedId: number;
  needles: FaceNeedles;
  mode?: MagicDisplayFaceDialMode;
  onSegmentClick?: (segment: TSegment) => void;
};

const statusDotClass = (status?: SegmentStatus) => {
  if (status === "complete") return "bg-emerald-500";
  if (status === "in-progress") return "bg-amber-400";
  return "bg-slate-300";
};

const segmentIcon = (mediaType?: MediaType | null) => {
  if (mediaType === "photo") return <Camera className="h-3.5 w-3.5" />;
  if (mediaType === "video") return <Clapperboard className="h-3.5 w-3.5" />;
  if (mediaType === "file") return <FileText className="h-3.5 w-3.5" />;
  return <span className="text-xs">＋</span>;
};

// angle = centre du segment sélectionné
function segmentAngleForId(segmentId: number, count: number) {
  const c = Math.max(1, count);
  const step = 360 / c;
  const start = -90;
  const idx = Math.max(0, Math.min(c - 1, (segmentId ?? 1) - 1));
  return start + step * idx;
}

/**
 * Aiguille 1 (simple)
 * – corps plus fin au centre, qui s’élargit vers la pointe
 */
function WatchHandOneWayRefined({
  angleDeg,
  frontLenPx,
}: {
  angleDeg: number;
  frontLenPx: number;
  tailLenPx?: number; // gardé pour compatibilité d'appel
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
          clipPath: "polygon(0 40%, 92% 0, 100% 50%, 92% 100%, 0 60%)",
          boxShadow: "0 2px 4px rgba(15,23,42,0.30)",
        }}
      />
    </div>
  );
}

export default function MagicDisplayFaceDialBase<
  TSegment extends DialSegmentLike = DialSegmentLike,
>({
  creatorName,
  creatorAvatar,
  creatorInitials,
  segmentCount,
  segments,
  selectedId,
  needles,
  mode = "editor",
  onSegmentClick,
}: MagicDisplayFaceDialBaseProps<TSegment>) {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [frontLenPx, setFrontLenPx] = useState<number>(92);

  // calc longueur avant-bulle (dépend du cercle et du radiusPercent=42)
  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;

    const compute = () => {
      const size = el.getBoundingClientRect().width; // ex: 256
      const radiusToBubbleCenter = 0.42 * size;
      const bubbleRadius = 20; // rayon approximatif des bulles
      const gap = 8; // petit espace avant la bulle

      const len = radiusToBubbleCenter - bubbleRadius - gap;
      setFrontLenPx(Math.max(40, Math.round(len)));
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [segmentCount]);

  const SAFE_COUNT = Math.max(1, segmentCount || 1);
  const angle1 = segmentAngleForId(selectedId || 1, SAFE_COUNT);
  const isEven = SAFE_COUNT % 2 === 0;
  const TAIL_LEN = 0;

  function getSegmentPositionStyle(index: number) {
    const radiusPercent = 42;
    const angleStep = 360 / SAFE_COUNT;
    const startAngleDeg = -90;
    const angleDeg = startAngleDeg + angleStep * index;
    const rad = (angleDeg * Math.PI) / 180;

    const top = 50 + Math.sin(rad) * radiusPercent;
    const left = 50 + Math.cos(rad) * radiusPercent;

    return { top: `${top}%`, left: `${left}%` };
  }

  const visibleSegments = segments.slice(0, SAFE_COUNT);

  return (
    <div ref={circleRef} className="relative h-64 w-64 max-w-full">
      {/* Décor z-10 */}
      <div className="absolute inset-0 z-10 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(241,245,249,0.45),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(129,140,248,0.45),transparent_55%)]" />
      <div className="absolute inset-4 z-10 rounded-full border border-slate-200 bg-[radial-gradient(circle_at_30%_20%,#f9fafb,#e5e7eb)] shadow-inner" />
      <div className="absolute inset-16 z-10 rounded-full border border-slate-300/70" />

      {/* Demi-segments depuis le centre, toujours entre 2 bulles */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 15 }}
      >
        {Array.from({ length: SAFE_COUNT }, (_, index) => {
          if (SAFE_COUNT <= 1) return null;

          const step = 360 / SAFE_COUNT;
          const startAngleDeg = -90;
          const angleDeg = startAngleDeg + step * index + step / 2;

          return (
            <div key={index} className="absolute inset-0">
              <div
                className="absolute left-1/2 top-1/2"
                style={{
                  width: "42%",
                  height: "1px",
                  transformOrigin: "left center",
                  transform: `translateY(-50%) rotate(${angleDeg}deg)`,
                  background: "rgba(148,163,184,0.75)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Aiguilles z-20 */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <WatchHandOneWayRefined
          angleDeg={angle1}
          frontLenPx={frontLenPx}
          tailLenPx={TAIL_LEN}
        />
        {isEven && needles.needle2Enabled && (
          <WatchHandOneWayRefined
            angleDeg={angle1 + 180}
            frontLenPx={frontLenPx}
            tailLenPx={TAIL_LEN}
          />
        )}
      </div>

      {/* Avatar centre – même style que Magic Studio / carte Studio */}
<div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/90 bg-white shadow-sm">
  {creatorAvatar ? (
    // Photo réelle si un jour tu l'utilises
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={creatorAvatar}
      alt={creatorName}
      className="h-16 w-16 rounded-full object-cover"
    />
  ) : (
    // Avatar neutre gris (comme sur les autres écrans)
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-9 w-9 text-slate-400"
      >
        {/* tête */}
        <path
          fill="currentColor"
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
        />
        {/* épaules */}
        <path
          fill="currentColor"
          d="M6 18c0-2.21 2.69-4 6-4s6 1.79 6 4v1H6v-1z"
        />
      </svg>
    </div>
  )}
</div>

      {/* Bulles z-40 */}
      {visibleSegments.map((seg, index) => {
        const isSelected = seg.id === selectedId;
        const status = seg.status ?? "empty";

        return (
          <button
            key={seg.id}
            type="button"
            onClick={() => {
              if (onSegmentClick) onSegmentClick(seg);
            }}
            className={`absolute z-40 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition ${
              isSelected
                ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
            }`}
            style={getSegmentPositionStyle(index)}
            aria-label={`Segment ${seg.id}`}
          >
            {segmentIcon(seg.mediaType as MediaType | null)}
            {mode === "editor" && (
              <span
                className={`absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border border-white ${statusDotClass(
                  status,
                )}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
