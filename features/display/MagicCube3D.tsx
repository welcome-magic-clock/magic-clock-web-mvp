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
  // même feeling que les + des segments
  return <span className="text-sm leading-none">＋</span>;
}

const MagicCube3D: React.FC<MagicCube3DProps> = ({
  segments,
  selectedId,
  onSelect,
}) => {
  // on garde toujours une face active pour le rendu
  const fallback = segments[0];
  const selected = segments.find((s) => s.id === selectedId) ?? fallback;

  const hasMedia = Boolean(selected?.hasMedia && selected.mediaType);
  const label = mediaLabel(selected.mediaType);

  return (
    <section className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        VUE 3D DU CUBE (PROTO REACT)
      </p>

      <button
        type="button"
        onClick={() => onSelect(selected?.id ?? null)}
        className="relative flex w-full items-center justify-center overflow-hidden rounded-[32px] border border-brand-300/70 bg-slate-50/90 py-10 shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:border-brand-400 hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)]"
      >
        {/* Grand halo circulaire derrière le cube */}
        <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[160%] w-[160%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_30%_0%,#f9fafb,transparent_55%),radial-gradient(circle_at_80%_100%,#dbeafe,#e0e7ff_55%)]" />

        {/* Photo / vidéo en fond si dispo */}
        {selected?.mediaUrl && selected.mediaType !== "file" && (
          <>
            {selected.mediaType === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.mediaUrl}
                alt={label || "Média associé à cette face"}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
              />
            ) : (
              <video
                src={selected.mediaUrl}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
                autoPlay
                muted
                loop
                playsInline
              />
            )}
            {/* voile pour garder la lisibilité du texte */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/85 via-white/80 to-white/90" />
          </>
        )}

        {/* Contenu central */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          {/* Badge circulaire – même esprit que les ronds sur la sphère */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
            {/* anneau extérieur fin */}
            <div className="absolute inset-0 rounded-full border-[1.5px] border-brand-400" />
            {/* anneau intérieur */}
            <div className="absolute inset-[4px] rounded-full border border-brand-200 bg-gradient-to-b from-white to-slate-50" />

            {/* icône */}
            <div className="relative flex items-center justify-center text-brand-600">
              <FaceMediaIcon mediaType={selected.mediaType} />
            </div>

            {/* pastille verte */}
            {hasMedia && (
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-white bg-emerald-500" />
            )}
          </div>

          {/* Texte face */}
          <div className="text-center">
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
              {hasMedia ? "Média associé" : "Aucun média associé pour l’instant"}
            </p>
          </div>
        </div>
      </button>
    </section>
  );
};

export default MagicCube3D;
