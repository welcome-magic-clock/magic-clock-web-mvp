"use client";

import { useEffect, useState } from "react";
import { Camera, Clapperboard, FileText, Plus, Sparkles } from "lucide-react";

type MediaType = "photo" | "video" | "file";

type FaceLike = {
  id: number;
  label: string;
  description: string;
  hasMedia: boolean;
  mediaType?: MediaType;
  mediaUrl?: string | null;
};

type MagicCube3DProps = {
  segments: FaceLike[];
  selectedId: number | null;
  onSelect: (id: number) => void;

  /**
   * Optionnel : callback appelé quand on clique sur
   * « Publier sur Amazing + My Magic Clock ».
   * Le parent (page Display) décide quoi faire :
   * - écrire en localStorage
   * - router vers /mymagic
   * - etc.
   */
  onPublish?: () => void;
  isPublishing?: boolean;
};

export default function MagicCube3D({
  segments,
  selectedId,
  onSelect,
  onPublish,
  isPublishing,
}: MagicCube3DProps) {
  const [rotation, setRotation] = useState({ x: -18, y: 28 });

  // 🔁 Orientation auto selon la face sélectionnée
  useEffect(() => {
    if (selectedId == null) return;
    const index = segments.findIndex((s) => s.id === selectedId);
    if (index === -1) return;

    const presets = [
      { x: -90, y: 0 }, // Face 1 (top)
      { x: 0, y: 0 }, // Face 2 (front)
      { x: 0, y: -90 }, // Face 3 (right)
      { x: 0, y: -180 }, // Face 4 (back)
      { x: 0, y: -270 }, // Face 5 (left)
      { x: 90, y: 0 }, // Face 6 (bottom)
    ] as const;

    setRotation(presets[index] ?? presets[1]);
  }, [selectedId, segments]);

  const handleFaceClick = (id: number) => {
    onSelect(id);
  };

  return (
    <div className="w-full">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
        VUE 3D DE MAGIC CLOCK
      </p>

      {/* Bloc 3D */}
      <div className="relative mx-auto mt-2 aspect-square w-full max-w-xs [perspective:1100px] sm:max-w-sm">
        <div
          className="absolute inset-0 transition-transform duration-150 ease-out [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {segments.slice(0, 6).map((seg, index) => {
            const isActive = seg.id === selectedId;

            const isVisualMedia =
              seg.hasMedia &&
              !!seg.mediaUrl &&
              (seg.mediaType === "photo" || seg.mediaType === "video");

            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => handleFaceClick(seg.id)}
                style={{ transform: faceTransform(index) }}
                className="absolute inset-[14%] [transform-style:preserve-3d]"
              >
                {/* 🧊 Carte de la face */}
                <div
                  className={[
                    "relative h-full w-full rounded-[2.4rem] border bg-white/90 text-xs shadow-md backdrop-blur-sm transition",
                    isActive
                      ? "border-violet-400 shadow-violet-200"
                      : "border-slate-200 hover:border-violet-200",
                    seg.hasMedia ? "ring-1 ring-emerald-300/80" : "",
                    isVisualMedia
                      ? "overflow-hidden"
                      : "flex items-center justify-center px-3 text-center",
                  ].join(" ")}
                >
                  {/* 🎥 / 📸 FULL MEDIA : la face entière devient l’image / la vidéo */}
                  {isVisualMedia ? (
                    <>
                      {seg.mediaType === "photo" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={seg.mediaUrl!}
                          alt={seg.description}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video
                          src={seg.mediaUrl!}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                          loop
                          autoPlay
                        />
                      )}

                      {/* Pastille complété en bas à droite */}
                      <span className="absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
                    </>
                  ) : (
                    /* 🧾 Variante texte (fichier ou aucun média) */
                    <div className="relative z-10 space-y-1">
                      {/* Pastille complété en haut à droite si fichier */}
                      {seg.hasMedia && seg.mediaType === "file" && (
                        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-500" />
                      )}

                      {/* Petit cercle + icône comme sur Face universelle */}
                      <div
                        className={[
                          "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white/95",
                          isActive
                            ? "border-brand-500 text-slate-900"
                            : "border-slate-300 text-slate-700",
                        ].join(" ")}
                      >
                        {faceMediaIcon(seg)}
                      </div>

                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Face {seg.id}
                      </p>
                      <p className="text-xs font-semibold text-slate-900">
                        {seg.description}
                      </p>

                      {seg.hasMedia && seg.mediaType === "file" && (
                        <p className="text-[11px] text-emerald-600">
                          Média associé
                        </p>
                      )}

                      {!seg.hasMedia && (
                        <p className="text-[11px] text-slate-400">
                          Aucun média associé pour l’instant
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Halo global */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_60%)]" />
      </div>

      {/* Barre d’action sous le cube */}
      {onPublish && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isPublishing
              ? "Publication en cours…"
              : "Publier sur Amazing + My Magic Clock"}
          </button>
          <p className="max-w-xs text-center text-[10px] text-slate-500">
            MVP : ce bouton enverra ton Magic Clock en public sur{" "}
            <span className="font-semibold">Amazing</span> et le retrouvera en
            privé dans{" "}
            <span className="font-semibold">
              Mes Magic Clock créés · Publiés sur Amazing
            </span>
            .
          </p>
        </div>
      )}
    </div>
  );
}

// Placement des faces dans l'espace 3D
function faceTransform(index: number): string {
  const depth = "6.5rem";

  switch (index) {
    case 0: // Face 1 = TOP
      return `rotateX(90deg) translateZ(${depth})`;
    case 1: // Face 2 = FRONT
      return `translateZ(${depth})`;
    case 2: // Face 3 = RIGHT
      return `rotateY(90deg) translateZ(${depth})`;
    case 3: // Face 4 = BACK
      return `rotateY(180deg) translateZ(${depth})`;
    case 4: // Face 5 = LEFT
      return `rotateY(-90deg) translateZ(${depth})`;
    case 5: // Face 6 = BOTTOM
      return `rotateX(-90deg) translateZ(${depth})`;
    default:
      return `translateZ(${depth})`;
  }
}

// Icône centrale quand on n’est pas en full photo / vidéo
function faceMediaIcon(face: FaceLike) {
  if (!face.hasMedia || !face.mediaType) {
    return <Plus className="h-3.5 w-3.5" />;
  }
  if (face.mediaType === "photo") {
    return <Camera className="h-3.5 w-3.5" />;
  }
  if (face.mediaType === "video") {
    return <Clapperboard className="h-3.5 w-3.5" />;
  }
  return <FileText className="h-3.5 w-3.5" />;
}
