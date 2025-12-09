"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Clapperboard, FileText, Plus, ArrowLeft } from "lucide-react";
import { listCreators } from "@/core/domain/repository";
import BackButton from "@/components/navigation/BackButton";
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

  // Hashtags envoyés par Magic Studio (ex: "#1 #2 #3" ou "balayage blond")
  const hashtagsParam =
    searchParams.get("hashtags") ?? searchParams.get("hashtag") ?? "";

  // On découpe en plusieurs tags : espaces / virgules, on nettoie et on remet un # propre
  const hashtagTokens = hashtagsParam
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
    .filter((tag) => tag.length > 0)
    .map((tag) => `#${tag}`);

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
  // ✅ Face 1 active par défaut
  const [selectedId, setSelectedId] = useState<number | null>(1);
  // ✅ Face universelle cachée au départ
  const [isFaceDetailOpen, setIsFaceDetailOpen] = useState(false);

  const selectedSegment =
    segments.find((s) => s.id === selectedId) ?? segments[0] ?? null;

  // Inputs cachés pour upload par face
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Panneau "Face sélectionnée"
  const facePanelRef = useRef<HTMLDivElement | null>(null);

  // --- Gestion sélection de face (cercle + liste) --------------------------

  function handleSelectFace(id: number | null) {
    if (id === null) return;
    setSelectedId(id);

    // Sur mobile : on scrolle vers le panneau "Face sélectionnée"
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      if (facePanelRef.current) {
        facePanelRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }

  // 🔹 Clic sur une face du cercle
  // Cercle = gère le cube, mais ne force pas l'ouverture de la Face universelle
  function handleCircleFaceClick(seg: Segment) {
    handleSelectFace(seg.id);
  }

  // 🔹 Clic sur une face du cube
  // Cube = ouvre la Face universelle pour cette face
  function handleCubeFaceClick(id: number | null) {
    if (id === null) return;
    setSelectedId(id);
    setIsFaceDetailOpen(true);
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
      {/* Header Magic Display ultra minimal */}
      <header className="mb-4 space-y-3">
        {/* Ligne 1 : BackButton + slot actions */}
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/studio" label="Retour au Studio" />
          {/* Slot pour actions futures (Publier, etc.) */}
          {/* <button className="text-xs font-medium text-brand-600">Publier</button> */}
        </div>

        {/* Ligne 2 & 3 : Magic Display + titre venant du Studio */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Magic Display
          </h1>

          {titleFromStudio && (
            <p className="truncate text-sm font-medium text-slate-700">
              {titleFromStudio}
            </p>
          )}
        </div>
      </header>

      {/* Banderole venant de Magic Studio */}
      {titleFromStudio && (
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-[11px] text-slate-700">
          <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            <span className="font-semibold text-slate-900">Magic Studio</span>
            <span>✅</span>

            <span className="text-slate-300">·</span>

            <span className="font-semibold text-slate-900 truncate max-w-[11rem] sm:max-w-[18rem]">
              {titleFromStudio}
            </span>

            <span className="text-slate-300">·</span>

            <span className="font-semibold text-slate-900">{modeLabel}</span>

            {modeFromStudio === "PPV" && ppvPriceFromStudio && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-mono font-semibold text-slate-900">
                  {Number(ppvPriceFromStudio).toFixed(2)} CHF
                </span>
              </>
            )}

            {modeFromStudio === "SUB" && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-mono font-semibold text-slate-900">
                  {subscriptionPriceMock.toFixed(2)} CHF / mois
                </span>
              </>
            )}

            {hashtagTokens.map((tag) => (
              <span key={tag} className="flex items-center gap-x-1">
                <span className="text-slate-300">·</span>
                <span className="font-mono font-semibold text-slate-900">
                  {tag}
                </span>
              </span>
            ))}
          </p>
        </section>
      )}

      {/* 🟣 Carte principale : cercle + cube 3D + liste de faces */}
      <section className="mb-6 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {/* Disque central (contrôle des faces) */}
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

                {/* Boutons segments (faces) */}
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
                      onClick={() => handleCircleFaceClick(seg)}
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
              onSelect={handleCubeFaceClick}
            />

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Faces de ce cube Magic Clock
              </h2>
              <p className="text-xs text-slate-500">
                Chaque ligne correspond à une face. Sélectionne une face pour
                compléter son contenu.
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

        {/* Panneau d’action face sélectionnée */}
        <div
          ref={facePanelRef}
          className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 sm:px-4"
        >
          {selectedSegment ? (
            <div className="space-y-3">
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

              {/* Bouton pour ouvrir la face universelle */}
              <button
                type="button"
                onClick={() => setIsFaceDetailOpen(true)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100"
              >
                <span>Ouvrir la face universelle</span>
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Sélectionne une face via le cercle ou la liste, puis ajoute une
              photo, une vidéo ou un fichier. (MVP local, aucune donnée n&apos;est
              encore sauvegardée côté serveur.)
            </p>
          )}
        </div>
      </section>

      {/* 📚 Face universelle en plein écran */}
      {isFaceDetailOpen && selectedSegment && (
        <section className="fixed inset-0 z-40 flex items-stretch justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-5xl flex-col bg-white/98 pb-6 pt-3 shadow-[0_10px_40px_rgba(15,23,42,0.45)] sm:my-6 sm:rounded-3xl">
            <div className="flex h-full flex-col gap-3 px-4 sm:px-6">
              {/* Header de l'overlay */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsFaceDetailOpen(false)}
                  className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/80 shadow-sm">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                  <span className="hidden sm:inline">Retour au cube</span>
                </button>

                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Magic Display · Face {selectedSegment.id} / {segments.length}
                </p>
              </div>

              {/* Sous-titre + méta face */}
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedSegment.label}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedSegment.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  {/* Mini avatar créateur */}
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-[10px] font-semibold text-slate-50">
                    {currentCreator.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentCreator.avatar}
                        alt={currentCreator.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="truncate max-w-[10rem] sm:max-w-xs">
                    {currentCreator.name}
                  </span>
                </div>
              </div>

              {/* Editeur détaillé : prend tout le reste de la hauteur */}
              <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 px-1 py-2 sm:px-2">
                <MagicDisplayFaceEditor
                  creatorName={currentCreator.name}
                  creatorAvatar={currentCreator.avatar}
                  creatorInitials={initials}
                  faceId={selectedSegment.id}
                  faceLabel={selectedSegment.label}
                />
              </div>
            </div>
          </div>
        </section>
      )}

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
        accept="*/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "file")}
      />
    </main>
  );
}
