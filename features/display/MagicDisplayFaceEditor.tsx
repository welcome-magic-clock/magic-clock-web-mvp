"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
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
  needle2Enabled: boolean;
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
  {
    id: 1,
    label: "Diagnostic / observation",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 2,
    label: "Préparation / sectionnement",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 3,
    label: "Application principale",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 4,
    label: "Patine / correction",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 5,
    label: "Finition / coiffage",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 6,
    label: "Routine maison",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 7,
    label: "Astuces pro",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 8,
    label: "Erreurs à éviter",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 9,
    label: "Produits utilisés",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 10,
    label: "Temps / timing",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 11,
    label: "Variantes possibles",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
  {
    id: 12,
    label: "Résumé final",
    status: "empty",
    mediaType: null,
    mediaUrl: null,
    notes: "",
  },
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

const defaultNeedles = (): FaceNeedles => ({
  needle2Enabled: false,
});

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
  tailLenPx: number; // ignoré mais gardé pour compatibilité
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
          // gris profond légèrement bleuté (cohérent avec les cercles)
          background: "rgba(51,65,85,0.95)", // ~ slate-700
          borderRadius: 9999,
          clipPath:
            "polygon(0 40%, 92% 0, 100% 50%, 92% 100%, 0 60%)",
          boxShadow: "0 2px 4px rgba(15,23,42,0.30)",
        }}
      />
    </div>
  );
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
      needles: defaultNeedles(),
    },
  }));

  const [selectedId, setSelectedId] = useState<number>(1);
  const [showOptions, setShowOptions] = useState(false);

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const circleRef = useRef<HTMLDivElement | null>(null);
  const [frontLenPx, setFrontLenPx] = useState<number>(92);

  useEffect(() => {
    setFaces((prev) => {
      if (prev[faceId]) return prev;
      return {
        ...prev,
        [faceId]: {
          faceId,
          segmentCount: DEFAULT_SEGMENTS,
          segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
          needles: defaultNeedles(),
        },
      };
    });
    setSelectedId(1);
  }, [faceId]);

  const fallbackFace: FaceState = {
    faceId,
    segmentCount: DEFAULT_SEGMENTS,
    segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
    needles: defaultNeedles(),
  };

  const currentFace = faces[faceId] ?? fallbackFace;
  const segments = currentFace.segments;

  const segmentCount = Math.min(
    MAX_SEGMENTS,
    Math.max(1, currentFace.segmentCount || DEFAULT_SEGMENTS)
  );

  const selectedSegment =
    segments.find((s) => s.id === selectedId) ?? segments[0];

  const needles = currentFace.needles ?? defaultNeedles();
  const isEven = segmentCount % 2 === 0;

  // si impair -> aiguille symétrique forcée OFF
  useEffect(() => {
    if (!isEven && needles.needle2Enabled) {
      updateFace((existing) => ({
        ...existing,
        needles: {
          ...(existing.needles ?? defaultNeedles()),
          needle2Enabled: false,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEven, segmentCount]);

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

  function updateFace(updater: (prev: FaceState) => FaceState) {
    setFaces((prev) => {
      const existing = prev[faceId] ?? fallbackFace;
      const updated = updater(existing);
      return { ...prev, [faceId]: updated };
    });
  }

  function updateSegment(
    segmentId: number,
    updater: (prev: Segment) => Segment
  ) {
    updateFace((existing) => {
      const updatedSegments = existing.segments.map((s) =>
        s.id === segmentId ? updater(s) : s
      );
      return { ...existing, segments: updatedSegments };
    });
  }

  function handleSegmentCountChange(count: number) {
    const clamped = Math.min(MAX_SEGMENTS, Math.max(1, count));
    updateFace((existing) => ({ ...existing, segmentCount: clamped }));
    setSelectedId((prevId) => (prevId > clamped ? 1 : prevId));
  }

  function handleChooseMedia(type: MediaType) {
    if (!selectedSegment) return;
    if (type === "photo") photoInputRef.current?.click();
    else if (type === "video") videoInputRef.current?.click();
    else fileInputRef.current?.click();
  }

  function handleMediaFileChange(
    event: ChangeEvent<HTMLInputElement>,
    type: MediaType
  ) {
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

  function handleNotesChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const value = event.target.value;
    if (!selectedSegment) return;
    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      notes: value,
      status:
        prev.status === "empty" && !prev.mediaUrl
          ? "in-progress"
          : prev.status,
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

  const angle1 = segmentAngleForId(selectedId, segmentCount);
  const TAIL_LEN = 0; // on ne dessine pas de queue, mais on garde l’argument

  return (
    <section className="h-full w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      {/* Ligne 1 */}
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
            <span className="text-sm font-semibold text-slate-900">
              {faceLabel}
            </span>
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

      {showOptions && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-3 text-[11px] text-slate-700">
          <p className="font-semibold">Options</p>
          <p className="mt-1 text-slate-500">
            (À venir) Modèles préconçus, presets, styles…
          </p>
        </div>
      )}

      {/* Ligne 2 */}
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            onChange={(e) =>
              handleSegmentCountChange(Number(e.target.value))
            }
            className="w-28 accent-brand-500"
          />
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
          <span className="font-medium">{creatorName}</span>
        </div>
      </div>

      {/* Toggle symétrique (uniquement pair) */}
      <div className="mb-4 mt-2 flex items-center gap-2 text-[11px] text-slate-600">
        <label
          className={`inline-flex items-center gap-2 ${
            !isEven ? "opacity-60" : ""
          }`}
        >
          <input
            type="checkbox"
            disabled={!isEven}
            checked={isEven ? needles.needle2Enabled : false}
            onChange={(e) => {
              const enabled = e.target.checked;
              updateFace((existing) => ({
                ...existing,
                needles: {
                  ...(existing.needles ?? defaultNeedles()),
                  needle2Enabled: enabled,
                },
              }));
            }}
            className="h-4 w-4 accent-brand-500"
          />
          <span className="font-medium text-slate-700">
            Aiguille symétrique{" "}
            {!isEven && (
              <span className="ml-1 text-slate-500">
                (Disponible uniquement avec un nombre pair de segments)
              </span>
            )}
          </span>
        </label>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Cercle */}
        <div className="flex items-center justify-center">
          <div ref={circleRef} className="relative h-64 w-64 max-w-full">
            {/* Décor z-10 */}
            <div className="absolute inset-0 z-10 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(241,245,249,0.45),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(129,140,248,0.45),transparent_55%)]" />
            <div className="absolute inset-4 z-10 rounded-full border border-slate-200 bg-[radial-gradient(circle_at_30%_20%,#f9fafb,#e5e7eb)] shadow-inner" />
            <div className="absolute inset-16 z-10 rounded-full border border-slate-300/70" />

                {/* Demi-segments depuis le centre, toujours entre 2 bulles */}
<div
  className="absolute inset-0 pointer-events-none"
  style={{ zIndex: 15 }}
>
  {Array.from({ length: segmentCount }, (_, index) => {
    const count = segmentCount || 1;

    // 0 ou 1 segment → aucun trait
    if (count <= 1) return null;

    const step = 360 / count;
    const startAngleDeg = -90;

    // 🔁 angle AU MILIEU entre deux bulles
    const angleDeg = startAngleDeg + step * index + step / 2;

    return (
      <div key={index} className="absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            // demi-segment : du centre vers l'extérieur
            width: "42%",              // longueur du trait
            height: "1px",
            transformOrigin: "left center",
            transform: `translateY(-50%) rotate(${angleDeg}deg)`,
            // gris doux bien visible
            background: "rgba(148,163,184,0.75)",
          }}
        />
      </div>
    );
  })}
</div>
            
            {/* Aiguilles z-20 */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Aiguille principale */}
              <WatchHandOneWayRefined
                angleDeg={angle1}
                frontLenPx={frontLenPx}
                tailLenPx={TAIL_LEN}
              />
              {/* Aiguille symétrique : même composant, angle + 180° */}
              {isEven && needles.needle2Enabled && (
                <WatchHandOneWayRefined
                  angleDeg={angle1 + 180}
                  frontLenPx={frontLenPx}
                  tailLenPx={TAIL_LEN}
                />
              )}
            </div>

            {/* Avatar z-30 */}
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

            {/* Bulles z-40 */}
            {segments.slice(0, segmentCount).map((seg, index) => {
              const isSelected = seg.id === selectedId;

              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedId(seg.id)}
                  className={`absolute z-40 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition
                    ${
                      isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                        : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
                    }`}
                  style={getSegmentPositionStyle(index)}
                >
                  {segmentIcon(seg.mediaType)}
                  <span
                    className={`absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border border-white ${statusDotClass(
                      seg.status
                    )}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste + détail */}
        <div className="space-y-4">
          <div className="space-y-2">
            {segments.slice(0, segmentCount).map((seg) => {
              const isSelected = seg.id === selectedId;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedId(seg.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition
                    ${
                      isSelected
                        ? "border-brand-500 bg-brand-50/70"
                        : "border-transparent bg-slate-50 hover:border-slate-200"
                    }`}
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      Segment {seg.id} – {seg.label}
                      {seg.mediaType === "photo" && " · Photo"}
                      {seg.mediaType === "video" && " · Vidéo"}
                      {seg.mediaType === "file" && " · Fichier"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Chapitre de cette face (diagnostic, application,
                      etc.).
                    </p>
                  </div>
                  <span
                    className={`ml-2 inline-flex h-2.5 w-2.5 rounded-full ${statusDotClass(
                      seg.status
                    )}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Segment {selectedSegment.id} – {selectedSegment.label}
              </p>
              <p className="text-[11px] text-slate-500">
                Ajoute un média et des notes pour expliquer précisément
                cette étape.
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Statut :{" "}
                <span className="font-semibold">
                  {statusLabel(selectedSegment.status)}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleChooseMedia("photo")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Ajouter une photo</span>
              </button>
              <button
                type="button"
                onClick={() => handleChooseMedia("video")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                <Clapperboard className="h-3.5 w-3.5" />
                <span>Ajouter une vidéo</span>
              </button>
              <button
                type="button"
                onClick={() => handleChooseMedia("file")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Ajouter un fichier</span>
              </button>
            </div>

            {selectedSegment.mediaUrl && (
              <div className="mt-1 w-full">
                {selectedSegment.mediaType === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedSegment.mediaUrl}
                    alt="Prévisualisation"
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                ) : selectedSegment.mediaType === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={selectedSegment.mediaUrl}
                    className="h-40 w-full rounded-2xl object-cover"
                    controls
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                    <FileText className="h-4 w-4" />
                    <span>Fichier ajouté pour ce segment.</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                Notes pédagogiques
              </label>
              <textarea
                rows={3}
                value={selectedSegment.notes}
                onChange={handleNotesChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none ring-0 focus:border-brand-500"
                placeholder="Décris cette étape : produits, temps de pose, astuces, erreurs à éviter…"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inputs cachés */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "photo")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "video")}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,application/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "file")}
      />
    </section>
  );
}
