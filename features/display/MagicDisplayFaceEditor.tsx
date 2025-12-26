"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import {
  Camera,
  Clapperboard,
  FileText,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";

type SegmentStatus = "empty" | "in-progress" | "complete";
type MediaType = "photo" | "video" | "file";

type MagicDisplayFaceEditorProps = {
  creatorName?: string;
  creatorAvatar?: string | null;
  creatorInitials?: string;
  faceId?: number;
  faceLabel?: string;
  onBack?: () => void;
};

type Segment = {
  id: number;
  label: string;
  status: SegmentStatus;
  mediaType?: MediaType | null;
  mediaUrl?: string | null;
  notes: string;
};

type FaceNeedles = {
  needle1Angle: number; // deg (snapped)
  needle1Length: number; // 0..100 (%)
  needle2Enabled: boolean; // optional
  needle2Length: number; // 0..100 (%)
};

type FaceState = {
  faceId: number;
  segmentCount: number; // 1 → 12
  segments: Segment[];
  needles: FaceNeedles;
};

const MAX_SEGMENTS = 12;
const DEFAULT_SEGMENTS = 4;

const INITIAL_SEGMENTS: Segment[] = [
  { id: 1, label: "Diagnostic / observation", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 2, label: "Préparation / sectionnement", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 3, label: "Application principale", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 4, label: "Patine / correction", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 5, label: "Finition / coiffage", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 6, label: "Routine maison", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 7, label: "Astuces pro", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 8, label: "Erreurs à éviter", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 9, label: "Produits utilisés", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 10, label: "Temps / timing", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 11, label: "Variantes possibles", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
  { id: 12, label: "Résumé final", status: "empty", mediaType: null, mediaUrl: null, notes: "" },
];

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

const segmentIcon = (mediaType?: MediaType | null) => {
  if (mediaType === "photo") return <Camera className="h-3.5 w-3.5" />;
  if (mediaType === "video") return <Clapperboard className="h-3.5 w-3.5" />;
  if (mediaType === "file") return <FileText className="h-3.5 w-3.5" />;
  return <span className="text-xs">＋</span>;
};

const defaultNeedles = (_count: number): FaceNeedles => ({
  needle1Angle: -90,
  needle1Length: 78,
  needle2Enabled: false,
  needle2Length: 78,
});

// ---- Aiguilles: snap au centre des segments ----
function segmentCenterAngles(count: number) {
  const c = Math.max(1, count);
  const step = 360 / c;
  const start = -90;
  return Array.from({ length: c }, (_, i) => start + step * i);
}

function snapAngleToNearestSegment(angle: number, count: number) {
  const centers = segmentCenterAngles(count);
  let best = centers[0];
  let bestDist = Infinity;

  for (const c of centers) {
    const d = Math.abs(((angle - c + 540) % 360) - 180); // circular distance
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

function angleToSegmentIndex(angle: number, count: number) {
  const centers = segmentCenterAngles(count);
  const snapped = snapAngleToNearestSegment(angle, count);
  return Math.max(0, centers.findIndex((c) => c === snapped));
}

export default function MagicDisplayFaceEditor({
  creatorName = "Aiko Tanaka",
  creatorAvatar,
  creatorInitials = "AT",
  faceId = 1,
  faceLabel = "Face 1",
  onBack,
}: MagicDisplayFaceEditorProps) {
  const [faces, setFaces] = useState<Record<number, FaceState>>(() => ({
    [faceId]: {
      faceId,
      segmentCount: DEFAULT_SEGMENTS,
      segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
      needles: defaultNeedles(DEFAULT_SEGMENTS),
    },
  }));

  const [selectedId, setSelectedId] = useState<number>(1);
  const [showOptions, setShowOptions] = useState(false);

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFaces((prev) => {
      if (prev[faceId]) return prev;
      return {
        ...prev,
        [faceId]: {
          faceId,
          segmentCount: DEFAULT_SEGMENTS,
          segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
          needles: defaultNeedles(DEFAULT_SEGMENTS),
        },
      };
    });
    setSelectedId(1);
  }, [faceId]);

  const fallbackFace: FaceState = {
    faceId,
    segmentCount: DEFAULT_SEGMENTS,
    segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
    needles: defaultNeedles(DEFAULT_SEGMENTS),
  };

  const currentFace = faces[faceId] ?? fallbackFace;
  const segments = currentFace.segments;
  const segmentCount = Math.min(
    MAX_SEGMENTS,
    Math.max(1, currentFace.segmentCount || DEFAULT_SEGMENTS)
  );

  const selectedSegment = segments.find((s) => s.id === selectedId) ?? segments[0];

  function updateFace(updater: (prev: FaceState) => FaceState) {
    setFaces((prev) => {
      const existing = prev[faceId] ?? fallbackFace;
      const updated = updater(existing);
      return { ...prev, [faceId]: updated };
    });
  }

  function updateSegment(segmentId: number, updater: (prev: Segment) => Segment) {
    updateFace((existing) => {
      const updatedSegments = existing.segments.map((s) =>
        s.id === segmentId ? updater(s) : s
      );
      return { ...existing, segments: updatedSegments };
    });
  }

  function handleSegmentCountChange(count: number) {
    const clamped = Math.min(MAX_SEGMENTS, Math.max(1, count));
    updateFace((existing) => {
      const existingNeedles = existing.needles ?? defaultNeedles(existing.segmentCount);
      // On resnap l'aiguille 1 si on change le nombre de segments
      const snapped = snapAngleToNearestSegment(existingNeedles.needle1Angle, clamped);
      return {
        ...existing,
        segmentCount: clamped,
        needles: {
          ...existingNeedles,
          needle1Angle: snapped,
        },
      };
    });

    setSelectedId((prevId) => (prevId > clamped ? 1 : prevId));
  }

  function handleChooseMedia(type: MediaType) {
    if (!selectedSegment) return;
    if (type === "photo") photoInputRef.current?.click();
    else if (type === "video") videoInputRef.current?.click();
    else fileInputRef.current?.click();
  }

  function handleMediaFileChange(event: ChangeEvent<HTMLInputElement>, type: MediaType) {
    const file = event.target.files?.[0];
    if (!file || !selectedSegment) return;

    const url = URL.createObjectURL(file);

    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      mediaType: type,
      mediaUrl: url,
      status: "complete",
    }));

    event.target.value = "";
  }

  function handleNotesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    if (!selectedSegment) return;
    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      notes: value,
      status: prev.status === "empty" && !prev.mediaUrl ? "in-progress" : prev.status,
    }));
  }

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

  const needles = currentFace.needles ?? defaultNeedles(segmentCount);

  return (
    <section className="h-full w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      {/* Ligne 1 : Back + Face x/6 + titre + bouton options */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              aria-label="Revenir au cube"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Face {faceId} / 6
            </span>
            <span className="text-sm font-semibold text-slate-900">{faceLabel}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 shadow-sm"
        >
          <MoreHorizontal className="mr-1 h-3.5 w-3.5" />
          Options
        </button>
      </div>

      {/* Panel Options (Aiguilles) */}
      {showOptions && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-3 text-[11px] text-slate-700">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold">Aiguilles</span>

            <label className="inline-flex items-center gap-2">
              <span className="text-slate-600">Aiguille 2 (symétrique)</span>
              <input
                type="checkbox"
                checked={needles.needle2Enabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  updateFace((existing) => ({
                    ...existing,
                    needles: {
                      ...(existing.needles ?? defaultNeedles(existing.segmentCount)),
                      needle2Enabled: enabled,
                    },
                  }));
                }}
              />
            </label>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">Segment ciblé</span>
              <input
                type="range"
                min={1}
                max={segmentCount}
                value={angleToSegmentIndex(needles.needle1Angle, segmentCount) + 1}
                onChange={(e) => {
                  const idx = Number(e.target.value) - 1;
                  const centers = segmentCenterAngles(segmentCount);
                  const angle = centers[idx] ?? -90;

                  updateFace((existing) => ({
                    ...existing,
                    needles: {
                      ...(existing.needles ?? defaultNeedles(existing.segmentCount)),
                      needle1Angle: angle,
                    },
                  }));
                }}
                className="w-36 accent-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">Longueur</span>
              <input
                type="range"
                min={30}
                max={95}
                value={needles.needle1Length}
                onChange={(e) => {
                  const len = Number(e.target.value);
                  updateFace((existing) => ({
                    ...existing,
                    needles: {
                      ...(existing.needles ?? defaultNeedles(existing.segmentCount)),
                      needle1Length: len,
                    },
                  }));
                }}
                className="w-28 accent-brand-500"
              />
            </div>

            {needles.needle2Enabled && (
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Longueur aiguille 2</span>
                <input
                  type="range"
                  min={30}
                  max={95}
                  value={needles.needle2Length}
                  onChange={(e) => {
                    const len = Number(e.target.value);
                    updateFace((existing) => ({
                      ...existing,
                      needles: {
                        ...(existing.needles ?? defaultNeedles(existing.segmentCount)),
                        needle2Length: len,
                      },
                    }));
                  }}
                  className="w-28 accent-brand-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ligne 2 : Segments + slider + avatar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
          <span>Segments sur cette face</span>
          <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-800">
            {segmentCount}
          </span>
          <input
            type="range"
            min={1}
            max={MAX_SEGMENTS}
            value={segmentCount}
            onChange={(e) => handleSegmentCountChange(Number(e.target.value))}
            className="w-28 accent-brand-500"
          />
       
