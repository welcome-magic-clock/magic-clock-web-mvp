// app/magic-display/page.tsx
"use client";

import { useState } from "react";

type MediaType = "photo" | "video";

type Segment = {
  id: number;
  label: string;
  description: string;
  angleDeg: number; // angle du centre du segment (en degrés)
  hasMedia: boolean;
  mediaType?: MediaType;
};

const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 1,
    label: "Face 1",
    description: "Diagnostic / point de départ",
    angleDeg: -90,
    hasMedia: false,
  },
  {
    id: 2,
    label: "Face 2",
    description: "Préparation / sectionnement",
    angleDeg: -30,
    hasMedia: false,
  },
  {
    id: 3,
    label: "Face 3",
    description: "Application principale",
    angleDeg: 30,
    hasMedia: false,
  },
  {
    id: 4,
    label: "Face 4",
    description: "Patine / correction",
    angleDeg: 90,
    hasMedia: false,
  },
  {
    id: 5,
    label: "Face 5",
    description: "Finition / coiffage",
    angleDeg: 150,
    hasMedia: false,
  },
  {
    id: 6,
    label: "Face 6",
    description: "Résultat / conseils maison",
    angleDeg: 210,
    hasMedia: false,
  },
];

export default function MagicDisplayFacePage() {
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedSegment = segments.find((s) => s.id === selectedId) ?? null;

  const handleChooseMedia = (type: MediaType) => {
    if (!selectedSegment) return;

    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === selectedSegment.id
          ? { ...seg, hasMedia: true, mediaType: type }
          : seg
      )
    );
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* Header simple – on reste neutre, pas de logique métier figée */}
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-500">
          Magic Display · Vue cube 2D (prototype v1)
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Cube Magic Clock – 6 faces libres
        </h1>
        <p className="text-sm text-slate-500">
          Chaque point autour du cercle représente une face du cube. Tu peux lui
          associer une photo ou une vidéo (MVP purement visuel, pas d&apos;upload
          réel pour l&apos;instant).
        </p>
      </header>

      {/* Carte principale */}
      <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
        {/* Zone cercle + segments */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch">
          {/* Disque central */}
          <div className="relative flex h-72 w-72 flex-shrink-0 items-center justify-center">
            {/* Fond circulaire : prêt à recevoir un vrai cercle chromatique (image) */}
            <div
              className="relative h-72 w-72 rounded-full border border-slate-200 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]"
              style={{
                // Pour l'instant : gradient neutre. Plus tard :
                // backgroundImage: "url('/mon-cercle-chromatique.png')",
                background:
                  "radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb 45%, #e2e8f0 75%)",
              }}
            >
              {/* Trou central pour rappeler Magic Clock physique */}
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-inner shadow-slate-300" />

              {/* Boutons segments (photo / vidéo) */}
              {segments.map((seg) => {
                const radiusPercent = 40; // distance du centre pour les pictos
                const rad = (seg.angleDeg * Math.PI) / 180;
                const top = 50 + Math.sin(rad) * radiusPercent;
                const left = 50 + Math.cos(rad) * radiusPercent;

                const isSelected = seg.id === selectedId;

                let icon = "＋";
                if (seg.hasMedia && seg.mediaType === "photo") icon = "📷";
                if (seg.hasMedia && seg.mediaType === "video") icon = "🎬";

                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() =>
                      setSelectedId((prev) => (prev === seg.id ? null : seg.id))
                    }
                    className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-semibold shadow-sm transition
                    ${
                      seg.hasMedia
                        ? seg.mediaType === "photo"
                          ? "border-violet-200 bg-violet-50 text-violet-700"
                          : "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-500"
                    }
                    ${isSelected ? "ring-2 ring-violet-400 ring-offset-2" : ""}
                    `}
                    style={{
                      top: `${top}%`,
                      left: `${left}%`,
                    }}
                    aria-label={`Face ${seg.label}`}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Légende / liste des 6 faces */}
          <div className="flex-1 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Faces de ce cube
            </h2>
            <div className="space-y-2">
              {segments.map((seg) => {
                const isSelected = seg.id === selectedId;
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() =>
                      setSelectedId((prev) => (prev === seg.id ? null : seg.id))
                    }
                    className={`flex w-full items-start justify-between gap-2 rounded-2xl px-3 py-2 text-left text-xs transition
                    ${
                      isSelected
                        ? "bg-violet-50 text-slate-900"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {seg.label}
                        {seg.hasMedia &&
                          (seg.mediaType === "photo"
                            ? " · Photo"
                            : " · Vidéo")}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {seg.description}
                      </p>
                    </div>
                    {seg.hasMedia && (
                      <span className="ml-2 mt-0.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panneau d’action face sélectionnée */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-xs text-slate-700 sm:px-4">
          {selectedSegment ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Face sélectionnée
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedSegment.label}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedSegment.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleChooseMedia("photo")}
                  className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-medium text-violet-700 hover:bg-violet-50"
                >
                  📷 Ajouter une photo
                </button>
                <button
                  type="button"
                  onClick={() => handleChooseMedia("video")}
                  className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-[11px] font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  🎬 Ajouter une vidéo
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Clique sur un rond autour du cercle pour sélectionner une face du
              cube, puis choisis si tu veux y associer une photo ou une vidéo.
              (MVP local, aucune donnée n&apos;est sauvegardée pour l&apos;instant.)
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
