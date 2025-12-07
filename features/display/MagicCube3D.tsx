"use client";

import type React from "react";
import { Camera, Clapperboard, FileText } from "lucide-react";

type MediaType = "photo" | "video" | "file";

type CubeSegment = {
  id: number;
  label: string;
  description: string;
  hasMedia: boolean;
  mediaType?: MediaType;
  mediaUrl?: string | null;
};

type MagicCube3DProps = {
  segments: CubeSegment[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
};

function mediaLabel(type?: MediaType) {
  if (type === "photo") return "Photo";
  if (type === "video") return "Vidéo";
  if (type === "file") return "Fichier";
  return "";
}

function FaceMediaIcon({ mediaType }: { mediaType?: MediaType }) {
  if (mediaType === "photo") {
    return <Camera className="h-4 w-4" />;
  }
  if (mediaType === "video") {
    return <Clapperboard className="h-4 w-4" />;
  }
  if (mediaType === "file") {
    return <FileText className="h-4 w-4" />;
  }
  // même esprit que les segments vides
  return <span className="text-sm leading-none">＋</span>;
}

const MagicCube3D: React.FC<MagicCube3DProps> = ({
  segments,
  selectedId,
  onSelect,
}) => {
  const fallback = segments[0];
  const selected = segments.find((s) => s.id === selectedId) ?? fallback;

  const hasMedia = Boolean(selected?.hasMedia && selected.mediaType);
  const label = mediaLabel(selected.mediaType);

  return (
    <section className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        VUE 3D DU CUBE (PROTO REACT)
      </p>

      {/* conteneur qui centre une vraie face carrée */}
      <div className="flex w-full justify-center">
        <button
          type="button"
          onClick={() => onSelect(selected?.id ?? null)}
          className="relative w-full max-w-md overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-b from-slate-50/90 to-slate-100/80 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.18)]"
        >
          {/* grand halo derrière la face */}
          <div className="pointer-events-none absolute -top-1/2 left-1/2 h-[220%] w-[220%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_20%_0%,#ffffff,transparent_55%),radial-gradient(circle_at_80%_100%,#e0e7ff,#e5e7eb_55%)]" />

          {/* vraie face carrée */}
          <div className="relative mx-auto aspect-square w-full max-w-xs rounded-[32px] bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
            {/* image / vidéo de fond si dispo */}
            {selected?.mediaUrl && selected.mediaType !== "file" && (
              <>
                {selected.mediaType === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.mediaUrl}
                    alt={label || "Média associé à cette face"}
                    className="pointer-events-none absolute inset-0 h-full w-full rounded-[32px] object-cover"
                  />
                ) : (
                  <video
                    src={selected.mediaUrl}
                    className="pointer-events-none absolute inset-0 h-full w-full rounded-[32px] object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
                {/* voile pour la lisibilité */}
                <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/80 via-white/78 to-white/88" />
              </>
            )}

            {/* contour “cube” violet fin */}
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border-[1.5px] border-brand-400" />
            <div className="pointer-events-none absolute inset-[3px] rounded-[28px] border border-brand-200/70" />

            {/* contenu central */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
              {/* badge circulaire comme sur la sphère */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
                <div className="absolute inset-0 rounded-full border-[1.5px] border-brand-400" />
                <div className="absolute inset-[4px] rounded-full border border-brand-200 bg-gradient-to-b from-white to-slate-50" />
                <div className="relative flex items-center justify-center text-brand-600">
                  <FaceMediaIcon mediaType={selected.mediaType} />
                </div>
                {hasMedia && (
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-white bg-emerald-500" />
                )}
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-slate-400">
                  FACE {selected?.id ?? 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selected?.description ?? "Diagnostic / point de départ"}
                </p>
                <p
                  className={`mt-1 text-[11px] font-medium ${
                    hasMedia ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {hasMedia
                    ? "Média associé"
                    : "Aucun média associé pour l’instant"}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default MagicCube3D;
