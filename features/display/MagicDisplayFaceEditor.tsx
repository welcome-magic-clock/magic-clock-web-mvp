"use client";

import { useState, useEffect } from "react";

type SegmentStatus = "empty" | "in-progress" | "complete";
type MediaType = "photo" | "video";

type MagicDisplayFaceEditorProps = {
  creatorName?: string;
  creatorAvatar?: string | null;
  creatorInitials?: string;
  faceId?: number;
  faceLabel?: string;
};

type Segment = {
  id: number;
  label: string;
  status: SegmentStatus;
  mediaType?: MediaType | null;
  notes: string;
};

type FaceState = {
  faceId: number;
  segments: Segment[];
};

const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 1,
    label: "Diagnostic / observation",
    status: "empty",
    mediaType: null,
    notes: "",
  },
  {
    id: 2,
    label: "Préparation / sectionnement",
    status: "empty",
    mediaType: null,
    notes: "",
  },
  {
    id: 3,
    label: "Application principale",
    status: "empty",
    mediaType: null,
    notes: "",
  },
  {
    id: 4,
    label: "Patine / correction",
    status: "empty",
    mediaType: null,
    notes: "",
  },
];

// Même positions que ton ancien code (haut, droite, bas, gauche)
const positionClasses = [
  "top-3 left-1/2 -translate-x-1/2", // segment 1
  "top-1/2 right-3 -translate-y-1/2", // segment 2
  "bottom-3 left-1/2 -translate-x-1/2", // segment 3
  "top-1/2 left-3 -translate-y-1/2", // segment 4
];

const statusDotClass = (status: SegmentStatus) => {
  if (status === "complete") return "bg-emerald-500";
  if (status === "in-progress") return "bg-amber-400";
  return "bg-slate-300";
};

const segmentIcon = (status: SegmentStatus, mediaType?: MediaType | null) => {
  if (status === "complete") return "✅";
  if (mediaType === "photo") return "📷";
  if (mediaType === "video") return "🎬";
  if (status === "in-progress") return "✏️";
  return "＋";
};

export default function MagicDisplayFaceEditor({
  creatorName = "Aiko Tanaka",
  creatorAvatar,
  creatorInitials = "AT",
  faceId = 1,
  faceLabel = "Face 1",
}: MagicDisplayFaceEditorProps) {
  // 🧠 1 état par face (cube) : {
  //   1: { faceId: 1, segments: [...] },
  //   2: { faceId: 2, segments: [...] },
  //   ...
  // }
  const [faces, setFaces] = useState<Record<number, FaceState>>(() => ({
    [faceId]: {
      faceId,
      segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
    },
  }));

  const [selectedId, setSelectedId] = useState<number>(INITIAL_SEGMENTS[0].id);

  // Quand la face active change (clic dans Magic Display), on s’assure qu’elle a un état
  useEffect(() => {
    setFaces((prev) => {
      if (prev[faceId]) return prev;
      return {
        ...prev,
        [faceId]: {
          faceId,
          segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
        },
      };
    });
    setSelectedId(INITIAL_SEGMENTS[0].id);
  }, [faceId]);

  const currentFace =
    faces[faceId] ?? { faceId, segments: INITIAL_SEGMENTS.map((s) => ({ ...s })) };
  const segments = currentFace.segments;
  const selectedSegment =
    segments.find((s) => s.id === selectedId) ?? segments[0];

  function updateSegment(
    segmentId: number,
    updater: (prev: Segment) => Segment
  ) {
    setFaces((prev) => {
      const existing =
        prev[faceId] ?? ({
          faceId,
          segments: INITIAL_SEGMENTS.map((s) => ({ ...s })),
        } as FaceState);

      const updatedSegments = existing.segments.map((s) =>
        s.id === segmentId ? updater(s) : s
      );

      return {
        ...prev,
        [faceId]: {
          faceId,
          segments: updatedSegments,
        },
      };
    });
  }

  function handleChooseMedia(type: MediaType) {
    if (!selectedSegment) return;
    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      mediaType: type,
      // on considère qu’un média choisi = étape en cours
      status: prev.status === "empty" ? "in-progress" : prev.status,
    }));
  }

  function handleNotesChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const value = event.target.value;
    if (!selectedSegment) return;
    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      notes: value,
      status: prev.status === "empty" ? "in-progress" : prev.status,
    }));
  }

  function markSegmentComplete() {
    if (!selectedSegment) return;
    updateSegment(selectedSegment.id, (prev) => ({
      ...prev,
      status: "complete",
    }));
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
      {/* En-tête face */}
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            Magic Display · Face {faceId} / 6
          </p>
          <h2 className="text-lg font-semibold sm:text-xl">
            Face universelle – Étapes pédagogiques
          </h2>
          <p className="text-xs text-slate-500">
            Chaque point autour du cercle est un segment (chapitre) de cette
            face : diagnostic, application, patine, etc.
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Face active :{" "}
            <span className="font-semibold">
              Face {faceId} – {faceLabel}
            </span>
          </p>
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
      </header>

      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Cercle principal (on garde EXACTEMENT ton halo + disque + avatar) */}
        <div className="flex items-center justify-center">
          <div className="relative h-64 w-64 max-w-full">
            {/* Halo */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(241,245,249,0.45),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(129,140,248,0.45),transparent_55%)]" />
            {/* Disque principal */}
            <div className="absolute inset-4 rounded-full border border-slate-200 bg-[radial-gradient(circle_at_30%_20%,#f9fafb,#e5e7eb)] shadow-inner" />
            {/* Anneau interne */}
            <div className="absolute inset-16 rounded-full border border-slate-300/70" />

            {/* Noyau central : avatar créateur */}
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-slate-900 shadow-xl shadow-slate-900/50">
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

            {/* Points de segments (positionClasses + statut + média) */}
            {segments.map((seg, index) => {
              const isSelected = seg.id === selectedId;
              const pos =
                positionClasses[index] ??
                "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedId(seg.id)}
                  className={`absolute ${pos} flex h-10 w-10 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition
                    ${
                      isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                        : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
                    }`}
                >
                  <span>{segmentIcon(seg.status, seg.mediaType)}</span>
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

        {/* Liste des segments + détail du segment sélectionné */}
        <div className="space-y-4">
          {/* Liste */}
          <div className="space-y-2">
            {segments.map((seg) => {
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
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Chapitre de cette face (diagnostic, application, etc.).
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

          {/* Détail segment sélectionné */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Segment {selectedSegment.id} – {selectedSegment.label}
              </p>
              <p className="text-[11px] text-slate-500">
                Ajoute un média et des notes pour expliquer précisément cette
                étape.
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Statut :{" "}
                <span className="font-semibold">{selectedSegment.status}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleChooseMedia("photo")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                📷 Ajouter une photo
              </button>
              <button
                type="button"
                onClick={() => handleChooseMedia("video")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                🎬 Ajouter une vidéo
              </button>
              <button
                type="button"
                onClick={markSegmentComplete}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100"
              >
                ✅ Marquer comme terminé
              </button>
            </div>

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

            <p className="text-[11px] text-slate-500">
              MVP local : les données restent dans la mémoire de la page. Plus
              tard, elles seront reliées à ton Magic Studio et à My Magic
              Clock.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
