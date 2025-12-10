"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Clapperboard,
  FileText,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { listCreators } from "@/core/domain/repository";
import BackButton from "@/components/navigation/BackButton";
import MagicDisplayFaceEditor from "@/features/display/MagicDisplayFaceEditor";
import MagicCube3D from "@/features/display/MagicCube3D";

type MediaType = "photo" | "video" | "file";

type Segment = {
  id: number;
  label: string;
  description: string;
  angleDeg: number;
  hasMedia: boolean;
  mediaType?: MediaType;
  mediaUrl?: string | null;
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

function statusDotClass(hasMedia: boolean) {
  return hasMedia ? "bg-emerald-500" : "bg-slate-300";
}

function mediaTypeLabel(type?: MediaType) {
  if (type === "photo") return "Photo";
  if (type === "video") return "Vidéo";
  if (type === "file") return "Fichier";
  return "";
}

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
  // 🔍 paramètres envoyés par Magic Studio
  const searchParams = useSearchParams();

  const titleFromStudio = searchParams.get("title") ?? "";
  const modeFromStudio = searchParams.get("mode") ?? "FREE";
  const ppvPriceFromStudio = searchParams.get("ppvPrice");

  const hashtagsParam =
    searchParams.get("hashtags") ?? searchParams.get("hashtag") ?? "";

  const hashtagTokens = hashtagsParam
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
    .filter((tag) => tag.length > 0)
    .map((tag) => `#${tag}`);

  const subscriptionPriceMock = 19.9;

  const modeLabel =
    modeFromStudio === "SUB"
      ? "Abonnement"
      : modeFromStudio === "PPV"
      ? "PayPerView"
      : "FREE";

  // 👩‍🎨 créateur (Aiko par défaut)
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const initials = currentCreator.name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // 🧠 état local des faces
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isFaceDetailOpen, setIsFaceDetailOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const selectedSegment = segments.find((s) => s.id === selectedId) ?? null;

  // inputs cachés pour les médias
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🎯 Sélection depuis le cube 3D → ouvre directement la Face universelle
  function handleCubeFaceSelect(id: number | null) {
    if (id == null) {
      setSelectedId(null);
      setIsFaceDetailOpen(false);
      return;
    }
    setSelectedId(id);
    setIsFaceDetailOpen(true);
  }

  // 🎯 Sélection depuis la liste → juste sélectionner
  function handleListFaceSelect(id: number | null) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  // 🎯 Clic sur le cercle → sélection + éventuel upload
  function handleCircleFaceClick(seg: Segment) {
    setSelectedId(seg.id);
    if (!seg.hasMedia && photoInputRef.current) {
      photoInputRef.current.click();
    }
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

    const url = URL.createObjectURL(file);

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

    event.target.value = "";
  }

  function handleOpenFaceDetail() {
    if (!selectedSegment) return;
    setIsFaceDetailOpen(true);
  }

  function handleCloseFaceDetail() {
    setIsFaceDetailOpen(false);
  }

  // 🔄 Quand la Face universelle est ouverte, on affiche UNIQUEMENT l'éditeur
  if (isFaceDetailOpen && selectedSegment) {
    return (
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        <MagicDisplayFaceEditor
          creatorName={currentCreator.name}
          creatorAvatar={currentCreator.avatar}
          creatorInitials={initials}
          faceId={selectedSegment.id}
          faceLabel={selectedSegment.label}
          onBack={handleCloseFaceDetail}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* ⭐️ Une seule grande carte Magic Display */}
      <section className="mb-6 flex min-h-[calc(100vh-7rem)] flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">
        {/* Ligne 1 : Back + titre + Options */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BackButton fallbackHref="/studio" label="Retour" />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
                Magic Display
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOptionsOpen(true)}
            aria-label="Ouvrir les options du cube"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Bandeau Magic Studio – style “hashtags Instagram” */}
        {titleFromStudio && (
          <div className="mb-4 space-y-0.5">
            {/* Ligne 1 : titre principal */}
            <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[12px] font-semibold text-slate-900">
              <span>Magic Studio</span>
              <span>✅</span>
              <span className="text-slate-300">·</span>
              <span className="max-w-[14rem] truncate sm:max-w-[22rem]">
                {titleFromStudio}
              </span>
            </p>

            {/* Ligne 2 : mode + prix + hashtags */}
            <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] text-slate-500">
              <span>{modeLabel}</span>

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

              {hashtagTokens.length > 0 && (
                <>
                  <span className="text-slate-300">·</span>
                  {hashtagTokens.map((tag, index) => (
                    <span key={tag} className="flex items-center gap-x-1">
                      {index > 0 && (
                        <span className="text-slate-300">·</span>
                      )}
                      <span className="font-medium text-slate-600">
                        {tag}
                      </span>
                    </span>
                  ))}
                </>
              )}
            </p>
          </div>
        )}

        {/* Bloc cercle + cube + liste */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {/* Cercle de contrôle des faces */}
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

                {/* Boutons-faces autour du cercle */}
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
                      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition ${
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

          {/* Colonne droite : cube 3D + liste */}
          <div className="flex-1 space-y-4">
            {/* Cube 3D : clic = ouvre directement la Face universelle */}
            <MagicCube3D
              segments={segments}
              selectedId={selectedId}
              onSelect={(id) => handleCubeFaceSelect(id)}
            />

            {/* Liste : clic = sélection seulement */}
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
                      onClick={() => handleListFaceSelect(seg.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition ${
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

        {/* Panneau d’action face sélectionnée (uniquement si une face est choisie) */}
        {selectedSegment && (
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 sm:px-4">
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
                <button
                  type="button"
                  onClick={handleOpenFaceDetail}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-500 bg-brand-50 px-3 py-1.5 text-[11px] font-medium text-brand-700 hover:bg-brand-100"
                >
                  <span>Ouvrir la face en détail</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Options (bottom sheet, contenu seulement) */}
        {isOptionsOpen && (
          <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
            {/* Overlay */}
            <button
              type="button"
              aria-label="Fermer le menu Options"
              onClick={() => setIsOptionsOpen(false)}
              className="absolute inset-0 bg-slate-900/40"
            />

            {/* Bottom sheet */}
            <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-4 shadow-xl sm:rounded-3xl sm:p-6">
              {/* En-tête */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Options du cube
                  </p>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Magic Clock affichage &amp; structure
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOptionsOpen(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>

              <div className="space-y-5 text-xs text-slate-700">
                {/* Bloc 1 – Modèles pré-conçus */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Modèles pré-conçus
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Applique une structure prête pour gagner du temps. Tu pourras
                    toujours modifier les titres et descriptions de chaque face.
                  </p>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Balayage en 4 étapes
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Diagnostic, préparation, application, patine / finition.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Couleur complète en 3 étapes
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Racines, longueurs / pointes, finition &amp; conseils maison.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Blond signature (6 faces)
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Idéal pour les transformations premium et contenus pédagogiques.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bloc 2 – Gestion du cube */}
                <div className="space-y-2 border-top border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Gestion du cube
                  </p>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Dupliquer depuis un autre Magic Clock
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Reprend la structure d’un cube existant (faces &amp; titres).
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-rose-700 hover:border-rose-300 hover:bg-rose-100"
                    >
                      <div>
                        <p className="font-medium">Réinitialiser ce cube</p>
                        <p className="text-[11px]">
                          Effacer tous les médias et le contenu des faces. Action
                          définitive.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bloc 3 – Astuce */}
                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <p className="text-[11px] text-slate-500">
                    Astuce : commence par préparer un modèle, puis ajoute les photos /
                    vidéos face par face. Tu peux ensuite affiner chaque face en détail
                    depuis le panneau “Face sélectionnée”.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Inputs cachés upload */}
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
