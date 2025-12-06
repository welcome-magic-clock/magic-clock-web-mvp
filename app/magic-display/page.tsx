"use client";

import { useState } from "react";
import { listCreators } from "@/core/domain/repository";
import MagicDisplayFaceEditor from "@/features/display/MagicDisplayFaceEditor";
import MagicCube3D from "@/features/display/MagicCube3D";

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

export default function MagicDisplayPage() {
  // On réutilise la même logique que MyMagic : Aiko par défaut
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const initials = currentCreator.name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  const handleSelectFace = (id: number | null) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Header général Magic Display */}
      <header className="mb-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          Magic Display · Prototype cube + face universelle
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Construction pédagogique de ton Magic Clock
        </h1>
        <p className="text-sm text-slate-600">
          Le cube représente l&apos;œuvre complète (6 faces). Chaque face contient
          plusieurs segments pédagogiques (diagnostic, application, patine,
          routine maison, etc.).
        </p>
      </header>

      {/* 🟣 Carte principale : vue cercle + cube 3D + liste de faces */}
      <section className="mb-6 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {/* Disque central = vue 2D du cube + avatar Aiko */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-72 w-72 flex-shrink-0 items-center justify-center">
              {/* Fond circulaire */}
              <div
                className="relative h-72 w-72 rounded-full border border-slate-200 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb 45%, #e2e8f0 75%)",
                }}
              >
                {/* Noyau central : avatar créateur */}
                <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-900 shadow-inner shadow-slate-400/70">
                  {currentCreator.avatar ? (
                    <img
                      src={currentCreator.avatar}
                      alt={currentCreator.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-50">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Boutons segments (faces) */}
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
                      onClick={() => handleSelectFace(seg.id)}
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
          </div>

          {/* Colonne droite : cube 3D + liste des 6 faces */}
          <div className="flex-1 space-y-4">
            <MagicCube3D
  segments={segments}
  selectedId={selectedId}
  onSelect={(id) => handleSelectFace(id)}
/>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Faces de ce cube Magic Clock
              </h2>
              <p className="text-xs text-slate-500">
                Chaque ligne représente une face du cube. On reste volontairement
                neutre : les créatrices peuvent renommer les faces comme elles
                le souhaitent (diagnostic, patine, routine, etc.).
              </p>
              <div className="space-y-2">
                {segments.map((seg) => {
                  const isSelected = seg.id === selectedId;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => handleSelectFace(seg.id)}
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
              Clique sur un point autour du cercle, sur le cube 3D ou dans la
              liste pour sélectionner une face du cube, puis choisis si tu veux
              y associer une photo ou une vidéo. (MVP local, aucune donnée n&apos;est
              sauvegardée pour l&apos;instant.)
            </p>
          )}
        </div>
      </section>

           {/* 🆕 Face universelle v1 – reliée à la face sélectionnée du cube */}
      <section className="mt-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">
          Face universelle – Prototype v1
        </h2>
        <p className="text-xs text-slate-500">
          Ici on teste l&apos;éditeur d&apos;une seule face : segments,
          notes pédagogiques et futur lien avec Studio, pour{" "}
          <span className="font-semibold">{currentCreator.name}</span>.
          {" "}La face active est{" "}
          <span className="font-semibold">
            {selectedSegment?.label ?? "Face 1"}
          </span>.
        </p>
       <MagicDisplayFaceEditor
  creatorName={currentCreator.name}
  creatorAvatar={currentCreator.avatar}
  creatorInitials={initials}
  faceId={selectedSegment?.id ?? 1}
  faceLabel={selectedSegment?.label ?? "Face 1"}
/>
      </section>
    </main>
  );
}
