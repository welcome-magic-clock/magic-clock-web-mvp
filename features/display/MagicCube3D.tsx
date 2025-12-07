// features/display/MagicCube3D.tsx
"use client";

import { useEffect, useState } from "react";
import { Camera, Clapperboard, FileText, Plus } from "lucide-react";

type MediaType = "photo" | "video" | "file" | undefined;

type FaceLike = {
  id: number;
  label: string;
  description: string;
  hasMedia: boolean;
  mediaType?: MediaType;
};

type MagicCube3DProps = {
  segments: FaceLike[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

// --- helpers visuels alignés sur Face universelle -------------------------

function statusDotClass(hasMedia: boolean) {
  return hasMedia ? "bg-emerald-500" : "bg-slate-300";
}

function chipClasses(mediaType: MediaType, isActive: boolean) {
  const baseActive = isActive ? "ring-2 ring-brand-500 ring-offset-2" : "";

  if (mediaType === "photo") {
    return (
      "border-violet-200 bg-violet-50 text-violet-700 " + baseActive
    );
  }
  if (mediaType === "video") {
    return (
      "border-indigo-200 bg-indigo-50 text-indigo-700 " + baseActive
    );
  }
  if (mediaType === "file") {
    return (
      "border-slate-200 bg-slate-50 text-slate-700 " + baseActive
    );
  }
  // aucun média
  return (
    "border-slate-300 bg-white/90 text-slate-700 " +
    (isActive ? "ring-2 ring-brand-500 ring-offset-2" : "")
  );
}

function renderIcon(mediaType: MediaType) {
  if (mediaType === "photo") {
    return <Camera className="h-3.5 w-3.5" />;
  }
  if (mediaType === "video") {
    return <Clapperboard className="h-3.5 w-3.5" />;
  }
  if (mediaType === "file") {
    return <FileText className="h-3.5 w-3.5" />;
  }
  return <Plus className="h-3.5 w-3.5" />;
}

// -------------------------------------------------------------------------

export default function MagicCube3D({
  segments,
  selectedId,
  onSelect,
}: MagicCube3DProps) {
  const [rotation, setRotation] = useState({ x: -18, y: 28 });

  // orientation auto en fonction de la face sélectionnée
  useEffect(() => {
    if (selectedId == null) return;
    const index = segments.findIndex((s) => s.id === selectedId);
    if (index === -1) return;

    const presets = [
      { x: -90, y: 0 }, // Face 1 = top
      { x: 0, y: 0 }, // Face 2 = front
      { x: 0, y: -90 }, // Face 3 = right
      { x: 0, y: -180 }, // Face 4 = back
      { x: 0, y: -270 }, // Face 5 = left
      { x: 90, y: 0 }, // Face 6 = bottom
    ] as const;

    setRotation(presets[index] ?? presets[1]);
  }, [selectedId, segments]);

  const handleFaceClick = (id: number) => {
    onSelect(id);
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Vue 3D du cube (proto React)
      </p>

      <div className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm [perspective:1100px]">
        <div
          className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {segments.slice(0, 6).map((seg, index) => {
            const isActive = seg.id === selectedId;
            const hasMedia = seg.hasMedia;

            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => handleFaceClick(seg.id)}
                className={[
                  "absolute inset-[14%] flex items-center justify-center rounded-3xl border bg-white/90 px-3 text-center shadow-md backdrop-blur-sm transition-colors",
                  isActive
                    ? "border-brand-500 shadow-[0_0_0_1px_rgba(129,140,248,0.4)]"
                    : "border-slate-200 hover:border-brand-400",
                ].join(" ")}
                style={{ transform: faceTransform(index) }}
              >
                <div className="relative w-full space-y-1">
                  {/* chip média en haut-centre, même design que Face universelle */}
                  <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <div
                      className={
                        "flex h-7 w-7 items-center justify-center rounded-full border text-[10px] shadow-sm " +
                        chipClasses(seg.mediaType, isActive)
                      }
                    >
                      {renderIcon(seg.mediaType)}
                    </div>
                    <span
                      className={
                        "absolute -right-1 -bottom-1 h-2 w-2 rounded-full border border-white " +
                        statusDotClass(hasMedia)
                      }
                    />
                  </div>

                  <div className="pt-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      Face {seg.id}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-900">
                      {seg.description}
                    </p>
                    {hasMedia && (
                      <p className="mt-0.5 text-[11px] text-emerald-600">
                        Média associé
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* halo comme sur le disque de la face universelle */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_60%)]" />
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-500">
        Clique sur une face du cube pour la sélectionner. La liste et le
        cercle se synchronisent automatiquement.
      </p>
    </div>
  );
}

// placement physique des faces dans l’espace 3D
function faceTransform(index: number): string {
  const depth = "6.5rem";

  switch (index) {
    case 0: // top
      return `rotateX(90deg) translateZ(${depth})`;
    case 1: // front
      return `translateZ(${depth})`;
    case 2: // right
      return `rotateY(90deg) translateZ(${depth})`;
    case 3: // back
      return `rotateY(180deg) translateZ(${depth})`;
    case 4: // left
      return `rotateY(-90deg) translateZ(${depth})`;
    case 5: // bottom
      return `rotateX(-90deg) translateZ(${depth})`;
    default:
      return `translateZ(${depth})`;
  }
}
