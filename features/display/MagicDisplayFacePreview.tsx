// features/display/MagicDisplayFacePreview.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type {
  PreviewFace,
  PreviewSegment,
} from "./MagicDisplayPreviewShell";

// Statut calculé à partir du contenu (notes / médias)
type SegmentStatus = "empty" | "in-progress" | "complete";

type MagicDisplayFacePreviewProps = {
  face: PreviewFace;
  faceIndex: number; // 0-based
  creatorName?: string;
  creatorAvatar?: string | null;
  creatorInitials?: string;
  openedSegmentId: string | number | null;
  onSegmentChange?: (id: string | number) => void;
  /** 
   * variant = "card" (par défaut) pour l’affichage complet,
   * "circle-only" pour la version compacte à coller derrière le cube.
   */
  variant?: "card" | "circle-only";
};

const MAX_SEGMENTS = 12;

const statusDotClass = (status: SegmentStatus) => {
  if (status === "complete") return "bg-emerald-500";
  if (status === "in-progress") return "bg-amber-400";
  return "bg-slate-300";
};

const statusLabel = (status: SegmentStatus) => {
  if (status === "complete") return "terminé";
  if (status === "in-progress") return "en cours";
  return "vide";
};

const segmentIcon = (seg: PreviewSegment) => {
  const m = seg.media?.[0];
  const type = m?.type;
  if (type === "photo") return "📷";
  if (type === "video") return "🎬";
  if (type === "file") return "📄";
  return "＋";
};

// Calcul d’un « statut » à partir du contenu du segment
function computeStatus(seg: PreviewSegment): SegmentStatus {
  const hasMedia = !!(seg.media && seg.media.length > 0);
  const hasNotes = !!seg.notes && seg.notes.trim().length > 0;
  const hasDesc = !!seg.description && seg.description.trim().length > 0;

  if (hasMedia && (hasNotes || hasDesc)) return "complete";
  if (hasMedia || hasNotes || hasDesc) return "in-progress";
  return "empty";
}

// angle = centre du segment sélectionné
function segmentAngleForId(segmentId: number, count: number) {
  const c = Math.max(1, count);
  const step = 360 / c;
  const start = -90;
  const idx = Math.max(0, Math.min(c - 1, (segmentId ?? 1) - 1));
  return start + step * idx;
}

/**
 * Aiguille 1 (simple) – version raffinée.
 */
function WatchHandOneWayRefined({
  angleDeg,
  frontLenPx,
}: {
  angleDeg: number;
  frontLenPx: number;
  tailLenPx: number; // ignoré mais conservé pour compat éventuelle
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

export default function MagicDisplayFacePreview({
  face,
  faceIndex,
  creatorName = "Créateur",
  creatorAvatar = null,
  creatorInitials = "MC",
  openedSegmentId,
  onSegmentChange,
  variant = "card",
}: MagicDisplayFacePreviewProps) {
  const segments = (face?.segments ?? []) as PreviewSegment[];
  const segmentCount = segments.length
    ? Math.min(MAX_SEGMENTS, segments.length)
    : 1;

  const circleRef = useRef<HTMLDivElement | null>(null);
  const [frontLenPx, setFrontLenPx] = useState<number>(92);

  const isCompact = variant === "circle-only";

  // Calcul de la longueur de l’aiguille en fonction du cercle
  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;

    const compute = () => {
      const size = el.getBoundingClientRect().width;
      const radiusToBubbleCenter = 0.42 * size;
      const bubbleRadius = 20;
      const gap = 8;

      const len = radiusToBubbleCenter - bubbleRadius - gap;
      setFrontLenPx(Math.max(40, Math.round(len)));
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [segmentCount]);

  const firstSeg = segments[0];
  const defaultId = (firstSeg?.id as number | undefined) ?? 1;
  const selectedId =
    typeof openedSegmentId === "number" ? openedSegmentId : defaultId;

  const angle1 = segmentAngleForId(selectedId, segmentCount);
  const isEven = segmentCount % 2 === 0;
  const TAIL_LEN = 0;

  function getSegmentPositionStyle(index: number) {
    const count = segmentCount || 1;
    const radiusPercent = 42;
    const angleStep = 360 / count;
    const startAngleDeg = -90;
    const angleDeg = startAngleDeg + angleStep * index;
    const rad = (angleDeg * Math.PI) / 180;

    const top = 50 + Math.sin(rad) * radiusPercent;
    const left = 50 + Math.cos(rad) * radiusPercent;

    return { top: `${top}%`, left: `${left}%` };
  }

  function handleSegmentBubbleClick(seg: PreviewSegment, index: number) {
    const id = (seg.id as any) ?? index;
    onSegmentChange?.(id);
  }

  return (
    <section
      className={
        isCompact
          ? "flex h-full w-full items-center justify-center"
          : "w-full rounded-3xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm sm:px-5 sm:py-5"
      }
    >
      {/* Ligne titre (seulement en mode carte) */}
      {!isCompact && (
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
                <span className="text-xs font-semibold">
                  {creatorInitials}
                </span>
              )}
            </span>
            <span className="max-w-[120px] truncate font-medium sm:max-w-[180px]">
              {creatorName}
            </span>
          </div>
        </div>
      )}

      {/* Cercle + bulles (read-only) */}
      <div className="flex items-center justify-center">
        <div ref={circleRef} className="relative h-64 w-64 max-w-full">
          {/* Décor z-10 */}
          <div className="absolute inset-0 z-10 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(241,245,249,0.45),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(129,140,248,0.45),transparent_55%)]" />
          <div className="absolute inset-4 z-10 rounded-full border border-slate-200 bg-[radial-gradient(circle_at_30%_20%,#f9fafb,#e5e7eb)] shadow-inner" />
          <div className="absolute inset-16 z-10 rounded-full border border-slate-300/70" />

          {/* Demi-segments depuis le centre */}
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 15 }}>
            {Array.from({ length: segmentCount }, (_, index) => {
              const count = segmentCount || 1;
              if (count <= 1) return null;

              const step = 360 / count;
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
            {isEven && (
              <WatchHandOneWayRefined
                angleDeg={angle1 + 180}
                frontLenPx={frontLenPx}
                tailLenPx={TAIL_LEN}
              />
            )}
          </div>

          {/* Avatar centre z-30 */}
          <div className="absolute left-1/2 top-1/2 z-30 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-slate-900 shadow-xl shadow-slate-900/50">
            {creatorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-slate-50">
                {creatorInitials}
              </span>
            )}
          </div>

          {/* Bulles segments z-40 */}
          {segments.slice(0, segmentCount).map((seg, index) => {
            const isSelected =
              seg.id === selectedId || String(seg.id) === String(selectedId);

            const status = computeStatus(seg);

            return (
              <button
                key={seg.id ?? index}
                type="button"
                onClick={() => handleSegmentBubbleClick(seg, index)}
                className={`absolute z-40 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition ${
                  isSelected
                    ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                    : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
                }`}
                style={getSegmentPositionStyle(index)}
                aria-label={`Segment ${seg.id ?? index + 1} – ${statusLabel(
                  status,
                )}`}
              >
                <span className="text-[13px] leading-none">
                  {segmentIcon(seg)}
                </span>
                <span
                  className={`absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border border-white ${statusDotClass(
                    status,
                  )}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Petite légende sous le cercle – uniquement en mode carte */}
      {!isCompact && (
        <p className="mt-3 text-center text-[10px] text-slate-500">
          Tap sur une bulle pour explorer le segment associé à cette étape.
        </p>
      )}
    </section>
  );
}
