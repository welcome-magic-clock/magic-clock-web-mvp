"use client";

import { Camera, Clapperboard, FileText, Plus } from "lucide-react";

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

type MagicCube3DProps = {
  segments: Segment[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
};

// Icône centrale dans le petit cercle
function mediaIcon(seg?: Segment) {
  if (!seg || !seg.hasMedia || !seg.mediaType) {
    return <Plus className="h-4 w-4" />;
  }
  if (seg.mediaType === "photo") return <Camera className="h-4 w-4" />;
  if (seg.mediaType === "video") return <Clapperboard className="h-4 w-4" />;
  if (seg.mediaType === "file") return <FileText className="h-4 w-4" />;
  return <Plus className="h-4 w-4" />;
}

function mediaLabel(seg?: Segment) {
  if (!seg || !seg.hasMedia || !seg.mediaType) return null;
  if (seg.mediaType === "photo") return "Photo";
  if (seg.mediaType === "video") return "Vidéo";
  if (seg.mediaType === "file") return "Fichier";
  return null;
}

export default function MagicCube3D({
  segments,
  selectedId,
  onSelect,
}: MagicCube3DProps) {
  const active =
    segments.find((s) => s.id === selectedId) ?? segments[0] ?? null;

  const hasMedia = !!active?.hasMedia;
  const mLabel = mediaLabel(active);

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 px-4 py-5 shadow-sm">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Vue 3D du cube (proto React)
      </p>

      <div className="relative mx-auto flex max-w-xl flex-col items-center justify-center">
        {/* Demi-disque arrière pour le volume du cube */}
        <div className="pointer-events-none absolute inset-x-4 -top-20 bottom-4 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_50%_0%,#e5e7eb,transparent_60%)]" />

        {/* Face du cube */}
        <button
          type="button"
          onClick={() => active && onSelect(active.id)}
          className="relative flex w-full flex-col items-center justify-center rounded-[32px] border border-brand-300/70 bg-[radial-gradient(circle_at_50%_0%,#f9fafb,#eef2ff)] px-6 py-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:border-brand-400 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]"
        >
          {/* Double cercle + icône média */}
          <div className="relative mb-4 h-16 w-16">
            {/* Anneau externe */}
            <div className="absolute inset-0 rounded-full border-[2px] border-brand-500/80 bg-white/40 backdrop-blur-sm" />
            {/* Anneau interne */}
            <div className="absolute inset-1 rounded-full border border-brand-200/70 bg-[radial-gradient(circle_at_30%_20%,#ffffff,#e5e7eb)]" />
            {/* Icône */}
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="text-brand-600">{mediaIcon(active)}</div>
            </div>
            {/* Pastille verte si média */}
            {hasMedia && (
              <span className="absolute -right-1 bottom-1 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
            )}
          </div>

          {/* Label face */}
          {active && (
            <>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400">
                FACE {active.id}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {active.description}
              </p>
            </>
          )}

          {/* État média */}
          <p
            className={`mt-1 text-[11px] ${
              hasMedia ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {hasMedia
              ? mLabel
                ? `Média associé · ${mLabel}`
                : "Média associé"
              : "Aucun média associé pour l'instant"}
          </p>
        </button>
      </div>
    </section>
  );
}
