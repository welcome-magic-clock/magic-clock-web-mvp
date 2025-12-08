"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Clapperboard, FileText, Plus } from "lucide-react";
import { listCreators } from "@/core/domain/repository";
import MagicDisplayFaceEditor from "@/features/display/MagicDisplayFaceEditor";
import MagicCube3D from "@/features/display/MagicCube3D";

type MediaType = "photo" | "video" | "file";

type Segment = {
  id: number;
  label: string;
  description: string;
  angleDeg: number; // angle du centre du segment (en degrés)
  hasMedia: boolean;
  mediaType?: MediaType;
  mediaUrl?: string | null; // URL locale pour prévisualiser le fichier
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

// petit helper pour le dot de statut (comme Face universelle)
function statusDotClass(hasMedia: boolean) {
  return hasMedia ? "bg-emerald-500" : "bg-slate-300";
}

// label affiché dans la liste
function mediaTypeLabel(type?: MediaType) {
  if (type === "photo") return "Photo";
  if (type === "video") return "Vidéo";
  if (type === "file") return "Fichier";
  return "";
}

// même logique que segmentIcon dans MagicDisplayFaceEditor
function renderSegmentIcon(seg: Segment) {
  if (seg.mediaType === "photo") {
    return <Camera className="h-3.5 w-3.5" />;
  }
  if (seg.mediaType === "video") {
    return <Clapperboard className="h-3.5 w-3.5" />;
  }
  if (seg.mediaType === "file") {
    return <FileText className="h-3.5 w-3.5" />;
  }
  return <Plus className="h-3.5 w-3.5" />;
}

export default function MagicDisplayClient() {
  // 🔍 lecture des params envoyés depuis Magic Studio
  const searchParams = useSearchParams();

  const titleFromStudio = searchParams.get("title") ?? "";
  const modeFromStudio = searchParams.get("mode") ?? "FREE";
  const ppvPriceFromStudio = searchParams.get("ppvPrice");
  // formatFromStudio est lu mais plus affiché (on garde pour plus tard)
  // const formatFromStudio = searchParams.get("format") ?? "portrait";
  const hashtagFromStudio = searchParams.get("hashtag") ?? "";

  const subscriptionPriceMock = 19.9; // CHF / mois (MVP)

  const modeLabel =
    modeFromStudio === "SUB"
      ? "Abonnement"
      : modeFromStudio === "PPV"
      ? "PayPerView"
      : "FREE";

  // Avatar créateur (Aiko par défaut, comme My Magic)
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

  // Inputs cachés pour upload par face
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Gestion média sur les FACES (cube) -----------------------------------

  function handleSelectFace(id: number | null) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleChooseMedia(type: MediaType) {
    if (!selectedSegment) return;

    if (type === "photo") {
      photoInputRef.current?.click();
    } else if (type === "video") {
      videoInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  }

  function handleMediaFileChange(
    event: ChangeEvent<HTMLInputElement>,
    type: MediaType
  ) {
    const file = event.target.files?.[0];
    if (!file || !selectedSegment) return;

    const url = URL.createObjectURL(file); // prévisu locale

    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === selectedSegment.id
          ? {
              ...seg,
              hasMedia: true,
              mediaType: type,
              mediaUrl: url,
            }
          : seg
      )
    );

    // reset pour pouvoir ré-uploader le même fichier si besoin
    event.target.value = "";
  }

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

      {/* Panneau venant de Magic Studio */}
     {titleFromStudio && (
  <section className="mb-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-[11px] text-slate-700">
    <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
      <span className="font-semibold">Magic Studio</span>
      <span>✅</span>

      <span className="text-slate-300">·</span>

      <span className="font-medium truncate max-w-[11rem] sm:max-w-[18rem]">
        {titleFromStudio}
      </span>

      <span className="text-slate-300">·</span>

      <span className="font-medium">{modeLabel}</span>

      {modeFromStudio === "PPV" && ppvPriceFromStudio && (
        <>
          <span className="text-slate-300">·</span>
          <span className="font-mono">
            {Number(ppvPriceFromStudio).toFixed(2)} CHF
          </span>
        </>
      )}

      {modeFromStudio === "SUB" && (
        <>
          <span className="text-slate-300">·</span>
          <span className="font-mono">
            {subscriptionPriceMock.toFixed(2)} CHF / mois
          </span>
        </>
      )}

      {/* 👇 ICI le hashtag, à l’intérieur du même <p> */}
      {hashtagFromStudio && (
        <>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-slate-600">
            {hashtagFromStudio.startsWith("#")
              ? hashtagFromStudio
              : `#${hashtagFromStudio}`}
          </span>
        </>
      )}
    </p>
  </section>
)}
      
      {/* 🟣 Carte principale : cercle + cube 3D + liste de faces */}
      <section className="mb-6 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {/* Disque central (style aligné sur Face universelle) */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-72 w-72 flex-shrink-0 items-center justify-center">
              <div
                className="relative h-72 w-72 rounded-full border border-slate-200 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb 45%, #e2e8f0 75%)",
                }}
              >
                {/* Avatar central */}
                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-slate-900 shadow-xl shadow-slate-900/50">
                  {currentCreator.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
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

                {/* Boutons segments (faces) – même logique que Face universelle */}
                {segments.map((seg) => {
                  const radiusPercent = 40;
                  const rad = (seg.angleDeg * Math.PI) / 180;
                  const top = 50 + Math.sin(rad) * radiusPercent;
                  const left = 50 + Math.cos(rad) * radiusPercent;

                  const isSelected = seg.id === selectedId;

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => handleSelectFace(seg.id)}
                      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition
                        ${
                          isSelected
                            ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                            : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
                        }`}
                      style={{ top: `${top}%`, left: `${left}%` }}
                      aria-label={`Face ${seg.label}`}
                    >
                      {renderSegmentIcon(seg)}
                      <span
                        className={`absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border border-white ${statusDotClass(
                          seg.hasMedia
                        )}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne droite : cube + liste */}
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
                neutre : les créatrices peuvent renommer les faces comme elles le
                souhaitent (diagnostic, patine, routine, etc.).
              </p>
              <div className="space-y-2">
                {segments.map((seg) => {
                  const isSelected = seg.id === selectedId;
                  const label = mediaTypeLabel(seg.mediaType);

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => handleSelectFace(seg.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition
                        ${
                          isSelected
                            ? "border-brand-500 bg-brand-50/70"
                            : "border-transparent bg-slate-50 hover:border-slate-200"
                        }`}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">
                          {seg.label}
                          {seg.hasMedia && label ? ` · ${label}` : ""}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                          {seg.description}
                        </p>
                      </div>
                      <span
                        className={`ml-2 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${statusDotClass(
                          seg.hasMedia
                        )}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Panneau d’action face sélectionnée – même style que Face universelle */}
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 sm:px-4">
          {selectedSegment ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Clique sur une face du cube pour la sélectionner, puis ajoute une
              photo, une vidéo ou un fichier pour documenter cette face. (MVP
              local, aucune donnée n&apos;est encore sauvegardée côté serveur.)
            </p>
          )}
        </div>
      </section>

      {/* Face universelle reliée à la face sélectionnée */}
      <section className="mt-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">
          Face universelle – Prototype v1
        </h2>
        <p className="text-xs text-slate-500">
          Ici on teste l&apos;éditeur d&apos;une seule face : segments, notes
          pédagogiques et futur lien avec Studio, pour{" "}
          <span className="font-semibold">{currentCreator.name}</span>. La face
          active est{" "}
          <span className="font-semibold">
            {selectedSegment?.label ?? "Face 1"}
          </span>
          .
        </p>
        <MagicDisplayFaceEditor
          creatorName={currentCreator.name}
          creatorAvatar={currentCreator.avatar}
          creatorInitials={initials}
          faceId={selectedSegment?.id ?? 1}
          faceLabel={selectedSegment?.label ?? "Face 1"}
        />
      </section>

      {/* Inputs cachés pour upload local des médias de face */}
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
        // on accepte tout, mais l’usage typique sera PDF / docs
        accept="*/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "file")}
      />
    </main>
  );
}
