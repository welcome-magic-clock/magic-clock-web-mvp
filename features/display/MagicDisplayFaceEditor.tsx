"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, Clapperboard, FileText, ChevronLeft } from "lucide-react";
import MagicDisplayFaceDialBase from "./MagicDisplayFaceDialBase";

type SegmentStatus = "empty" | "in-progress" | "complete";
type MediaType = "photo" | "video" | "file";

type MagicDisplayFaceEditorProps = {
  creatorName?: string;
  creatorAvatar?: string | null;
  creatorInitials?: string;
  faceId?: number;
  faceLabel?: string;
  onBack?: () => void;

  /**
   * 🔁 Callback pour remonter l'état de la face vers le parent
   * afin d'alimenter display.faces[...] (MagicDisplay).
   */
  onFaceChange?: (payload: {
    faceId: number;
    faceLabel?: string;
    segmentCount: number;
    segments: {
      id: number;
      title: string;
      description?: string;
      notes?: string;
      media?: {
        type: MediaType;
        url: string;
        filename?: string;
      }[];
    }[];
    /** ➕ Nouveauté : état des aiguilles pour cette face */
    needles: FaceNeedles;
  }) => void;
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

function getOppositeSegmentId(segmentId: number, count: number): number | null {
  // symétrie seulement si on a au moins 2 segments et un nombre pair
  if (count < 2 || count % 2 !== 0) return null;

  const offset = count / 2; // 4 segments → +2 ; 6 segments → +3, etc.
  const idx0 = ((segmentId ?? 1) - 1 + offset) % count; // travail en 0..count-1
  return idx0 + 1; // on revient à 1..count
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
          background: "rgba(51,65,85,0.95)", // slate-700
          borderRadius: 9999,
          clipPath: "polygon(0 40%, 92% 0, 100% 50%, 92% 100%, 0 60%)",
          boxShadow: "0 2px 4px rgba(15,23,42,0.30)",
        }}
      />
    </div>
  );
}

/* 🧠 Persistance locale par faceId (localStorage) */

const STORAGE_PREFIX = "mc-face-editor-v1";

type PersistedFaceState = {
  faceId: number;
  segmentCount: number;
  segments: Segment[];
  needles: FaceNeedles;
};

function getStorageKey(faceId: number) {
  return `${STORAGE_PREFIX}-${faceId}`;
}

function persistFaceState(faceId: number, state: FaceState) {
  try {
    if (typeof window === "undefined") return;
    const payload: PersistedFaceState = {
      faceId: state.faceId,
      segmentCount: state.segmentCount,
      segments: state.segments,
      needles: state.needles,
    };
    window.localStorage.setItem(getStorageKey(faceId), JSON.stringify(payload));
  } catch {
    // no-op
  }
}

function loadFaceState(faceId: number): FaceState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(getStorageKey(faceId));
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedFaceState;

    const baseSegments = INITIAL_SEGMENTS.map((s) => ({ ...s }));
    const mergedSegments = baseSegments.map((s) => {
      const override =
        data.segments.find((p) => p.id === s.id) ?? data.segments[s.id - 1];
      return override ? { ...s, ...override } : s;
    });

    return {
      faceId,
      segmentCount: data.segmentCount ?? DEFAULT_SEGMENTS,
      segments: mergedSegments,
      needles: data.needles ?? defaultNeedles(),
    };
  } catch {
    return null;
  }
}

export default function MagicDisplayFaceEditor({
  creatorName = "Aiko Tanaka",
  creatorAvatar,
  creatorInitials = "AT",
  faceId = 1,
  faceLabel = "Face 1",
  onBack,
  onFaceChange,
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

  const fallbackFace: FaceState = {
    faceId,
    segmentCount: DEFAULT_SEGMENTS,
    segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
    needles: defaultNeedles(),
  };

  /**
   * 🔁 Transforme l'état interne de la face en payload simplifié
   * utilisable pour display.faces[...] (MagicDisplayPreview).
   */
  function emitFaceChangeFromState(state: FaceState) {
    if (!onFaceChange) return;

    const segmentsForDisplay = state.segments
      .slice(0, state.segmentCount)
      .map((seg) => {
        const hasMedia = !!seg.mediaUrl;
        const media = hasMedia
          ? [
              {
                type: (seg.mediaType ?? "photo") as MediaType,
                url: seg.mediaUrl as string,
                filename: undefined,
              },
            ]
          : [];

        return {
          id: seg.id,
          title: seg.label,
          description: "",
          notes: seg.notes,
          media,
        };
      });

    onFaceChange({
      faceId: state.faceId,
      faceLabel,
      segmentCount: state.segmentCount,
      segments: segmentsForDisplay,
      needles: state.needles,
    });
  }

  // 🧷 Initialisation / changement de faceId : on recharge depuis localStorage si dispo
  useEffect(() => {
    setFaces((prev) => {
      const fromStorage = loadFaceState(faceId);
      if (fromStorage) {
        emitFaceChangeFromState(fromStorage);
        return { ...prev, [faceId]: fromStorage };
      }

      if (prev[faceId]) {
        emitFaceChangeFromState(prev[faceId]);
        return prev;
      }

      const initial: FaceState = {
        faceId,
        segmentCount: DEFAULT_SEGMENTS,
        segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
        needles: defaultNeedles(),
      };
      persistFaceState(faceId, initial);
      emitFaceChangeFromState(initial);
      return { ...prev, [faceId]: initial };
    });
    setSelectedId(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceId]);

         const currentFace = faces[faceId] ?? fallbackFace;
  const segments = currentFace.segments;

  // 🧠 Titre affiché dans le header
  // 👉 Même logique que la preview 3D, mais avec les données dispo côté éditeur
  const defaultSystemLabel = `Face ${faceId}`;

  // 1️⃣ Titre de face venant du Display (prop faceLabel)
  const rawTitle = (faceLabel ?? "").trim();

  // 2️⃣ Fallback : label du Segment 1 (ex. "Diagnostic / observation")
  const rawFromSegment =
    ((segments?.[0]?.label as string | undefined) ?? "").trim();

  let computedFaceLabel: string | null = null;

  // On prend d’abord le titre de face s’il est différent de "Face X"
  if (
    rawTitle &&
    rawTitle.toLowerCase() !== defaultSystemLabel.toLowerCase()
  ) {
    computedFaceLabel = rawTitle;
  }
  // Sinon, on retombe sur le label du Segment 1, en évitant aussi "Face X"
  else if (
    rawFromSegment &&
    rawFromSegment.toLowerCase() !== defaultSystemLabel.toLowerCase()
  ) {
    computedFaceLabel = rawFromSegment;
  }

  // Faut-il afficher "• Titre" dans le header ?
  const showHeaderDescription = !!computedFaceLabel;

  const segmentCount = Math.min(
    MAX_SEGMENTS,
    Math.max(1, currentFace.segmentCount || DEFAULT_SEGMENTS),
  );

  const selectedSegment =
    segments.find((s) => s.id === selectedId) ?? segments[0];

  const needles = currentFace.needles ?? defaultNeedles();
  const isEven = segmentCount % 2 === 0;

  const oppositeId =
    needles.needle2Enabled && isEven
      ? getOppositeSegmentId(selectedId, segmentCount)
      : null;

  const oppositeSegment =
    oppositeId != null
      ? segments.find((s) => s.id === oppositeId) ?? null
      : null;
  // Pour la carte Avant / Après
  const leftHasMedia = !!selectedSegment.mediaUrl;
  const rightHasMedia = !!(oppositeSegment && oppositeSegment.mediaUrl);

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

  function updateFace(updater: (prev: FaceState) => FaceState) {
    setFaces((prev) => {
      const existing = prev[faceId] ?? fallbackFace;
      const updated = updater(existing);

      // 🔔 À CHAQUE MISE À JOUR → remonter au parent + persister
      emitFaceChangeFromState(updated);
      persistFaceState(faceId, updated);

      return { ...prev, [faceId]: updated };
    });
  }

  function updateSegment(
    segmentId: number,
    updater: (prev: Segment) => Segment,
  ) {
    updateFace((existing) => {
      const updatedSegments = existing.segments.map((s) =>
        s.id === segmentId ? updater(s) : s,
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
    type: MediaType,
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

  function handleNotesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    if (!selectedSegment) return;
    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      notes: value,
      status:
        prev.status === "empty" && !prev.mediaUrl ? "in-progress" : prev.status,
    }));
  }

  // ✏️ Édition du texte court du segment (affiché sur le cube)
  function handleLabelChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value ?? "";
    const value = raw.slice(0, 27); // limite dure, comme sur le cube

    if (!selectedSegment) return;

    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      label: value,
      status:
        prev.status === "empty" && !prev.mediaUrl && !prev.notes
          ? "in-progress"
          : prev.status,
    }));
  }

  // (au cas où, si nécessaire ailleurs)
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

  // 🎯 Clic sur une bulle autour du cercle → sélection + upload photo si vide
  function handleSegmentBubbleClick(seg: Segment) {
    setSelectedId(seg.id);
    if (!seg.mediaUrl && photoInputRef.current) {
      photoInputRef.current.click();
    }
  }

  return (
    <section className="h-full w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      {/* Ligne 1 — Back + Face + titre + bouton réglages */}
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

          {/* ⬇️ Ligne unique : Face X • Titre */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-slate-900">
              Face {faceId}
            </span>
            {showHeaderDescription && (
              <>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-[11px] font-medium text-slate-500">
                  {computedFaceLabel}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
          aria-label="Options de la face"
        >
          {/* petit engrenage moderne */}
          <span className="inline-block h-4 w-4 rounded-full border border-slate-400" />
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
            onChange={(e) => handleSegmentCountChange(Number(e.target.value))}
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
              <span className="text-xs font-semibold">{creatorInitials}</span>
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
          <MagicDisplayFaceDialBase
            creatorName={creatorName}
            creatorAvatar={creatorAvatar}
            creatorInitials={creatorInitials}
            segmentCount={segmentCount}
            segments={segments}
            selectedId={selectedId}
            needles={needles}
            mode="editor"
            onSegmentClick={(seg) => handleSegmentBubbleClick(seg as Segment)}
          />
        </div>

        {/* Liste + détail */}
        <div className="space-y-4">
          {/* Liste des segments */}
          <div className="space-y-2">
            {segments.slice(0, segmentCount).map((seg) => {
              const isSelected = seg.id === selectedId;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedId(seg.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition ${
                    isSelected
                      ? "border-brand-500 bg-brand-50/70"
                      : "border-transparent bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800">
                      Segment {seg.id}
                    </p>
                    {seg.label && (
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {seg.label}
                      </p>
                    )}
                  </div>
                  <span
                    className={`ml-2 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${statusDotClass(
                      seg.status,
                    )}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Détail du segment sélectionné */}
          {needles.needle2Enabled && isEven && oppositeSegment ? (
            /* MODE DUO : segment sélectionné + segment opposé avec une seule carte Avant / Après */
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-3">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Duo symétrique — comme un Avant / Après
                </p>
                <p className="text-xs text-slate-600">
                  Tu édites le segment{" "}
                  <span className="font-semibold">{selectedSegment.id}</span>{" "}
                  et tu vois en miroir son opposé{" "}
                  <span className="font-semibold">{oppositeSegment.id}</span>.
                  Clique la bulle de l&apos;autre côté du cercle pour inverser.
                </p>
              </div>

              {/* 🌟 Carte unique Avant / Après avec avatar au centre */}
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-3">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
                    <div className="grid h-full w-full grid-cols-2">
                      {/* Avant = segment sélectionné */}
                      {leftHasMedia ? (
                        selectedSegment.mediaType === "video" ? (
                          <video
                            src={selectedSegment.mediaUrl as string}
                            className="h-full w-full object-cover"
                            autoPlay
                            loop
                            muted
                          />
                        ) : (
                          <img
                            src={selectedSegment.mediaUrl as string}
                            alt="Avant"
                            className="h-full w-full object-cover"
                          />
                        )
                      ) : (
                        <div className="h-full w-full bg-slate-200" />
                      )}

                      {/* Après = segment opposé */}
                      {rightHasMedia && oppositeSegment ? (
                        oppositeSegment.mediaType === "video" ? (
                          <video
                            src={oppositeSegment.mediaUrl as string}
                            className="h-full w-full object-cover"
                            autoPlay
                            loop
                            muted
                          />
                        ) : (
                          <img
                            src={oppositeSegment.mediaUrl as string}
                            alt="Après"
                            className="h-full w-full object-cover"
                          />
                        )
                      ) : (
                        <div className="h-full w-full bg-slate-200" />
                      )}
                    </div>

                  {/* Trait central fin comme dans Studio */}
<div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-200" />
                    
                   {/* Avatar centre – même style que Magic Studio */}
<div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 shadow-sm">
  {creatorAvatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={creatorAvatar}
      alt={creatorName}
      className="h-[72px] w-[72px] rounded-full object-cover"
    />
  ) : (
    <span className="text-base font-semibold text-white">
      {creatorInitials}
    </span>
  )}
</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 📝 Formulaires sous la carte : gauche = segment sélectionné, droite = opposé en lecture seule */}
              <div className="grid gap-3 md:grid-cols-2">
                {/* Colonne gauche : segment sélectionné (éditable) */}
                <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                  <p className="text-[11px] font-semibold text-slate-700">
                    Segment {selectedSegment.id}
                  </p>

                  <input
                    type="text"
                    maxLength={27}
                    value={selectedSegment.label}
                    onChange={handleLabelChange}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-800 outline-none ring-0 focus:border-brand-500 focus:bg-white"
                    placeholder="Diagnostic / observation"
                  />

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-600">
                      Notes pédagogiques
                    </p>
                    <textarea
                      rows={3}
                      value={selectedSegment.notes}
                      onChange={handleNotesChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none ring-0 focus:border-brand-500 focus:bg-white"
                      placeholder="Décris ce côté : point de départ, problème, symptôme…"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Statut :{" "}
                    <span className="font-semibold">
                      {statusLabel(selectedSegment.status)}
                    </span>
                  </p>

                  <div className="mt-1 flex flex-wrap gap-2">
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
                </div>

                {/* Colonne droite : segment opposé (lecture seule) */}
                <div className="space-y-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-3">
                  <p className="text-[11px] font-semibold text-slate-700">
                    Segment {oppositeSegment.id} (opposé)
                  </p>

                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-500">Titre</p>
                    <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] text-slate-700">
                      {oppositeSegment.label || "Titre non renseigné"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-500">Notes</p>
                    <div className="min-h-[60px] rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-[11px] text-slate-700">
                      {oppositeSegment.notes ||
                        "Pas encore de notes. Clique la bulle de ce segment sur le cercle pour l’éditer en détail."}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Astuce : cette colonne est en lecture seule. Pour modifier ce
                    côté du duo, clique sa bulle sur le cercle pour le passer en
                    « segment sélectionné ».
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* MODE SIMPLE : panneau d’origine */
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-3">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Segment sélectionné
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Segment {selectedSegment.id}
                </p>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  maxLength={27}
                  value={selectedSegment.label}
                  onChange={handleLabelChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-800 outline-none ring-0 focus:border-brand-500 focus:bg-white"
                  placeholder="Diagnostic / observation"
                />
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-600">
                  Notes pédagogiques
                </p>
                <textarea
                  rows={3}
                  value={selectedSegment.notes}
                  onChange={handleNotesChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none ring-0 focus:border-brand-500 focus:bg-white"
                  placeholder="Décris cette étape : produits, temps de pose, astuces, erreurs à éviter…"
                />
              </div>

              <p className="text-[10px] text-slate-400">
                Statut :{" "}
                <span className="font-semibold">
                  {statusLabel(selectedSegment.status)}
                </span>
              </p>

              <div className="mt-1 flex flex-wrap gap-2">
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
                <div className="mt-2 w-full">
                  {selectedSegment.mediaType === "photo" ? (
                    <img
                      src={selectedSegment.mediaUrl}
                      alt="Prévisualisation"
                      className="h-40 w-full rounded-2xl object-cover"
                    />
                  ) : selectedSegment.mediaType === "video" ? (
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
            </div>
          )}
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
