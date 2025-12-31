"use client";

import { useMemo, useState } from "react";

type MagicDisplayFacePreviewProps = {
  face: any;        // face unique du Display
  faceIndex: number;
  onBack: () => void;
};

export default function MagicDisplayFacePreview({
  face,
  faceIndex,
  onBack,
}: MagicDisplayFacePreviewProps) {
  const segments = (face?.segments ?? []) as any[];

  const initialSegmentId =
    segments[0]?.id ?? (segments.length > 0 ? 0 : null);

  const [activeSegmentId, setActiveSegmentId] = useState<
    string | number | null
  >(initialSegmentId);

  const activeSegment = useMemo(() => {
    if (!segments.length) return null;

    const found = segments.find(
      (seg: any) =>
        seg.id === activeSegmentId || seg.key === activeSegmentId
    );
    return found ?? segments[0];
  }, [segments, activeSegmentId]);

  const activeIndex = segments.findIndex(
    (seg: any) => seg === activeSegment
  );

  const segmentTitle =
    (activeSegment?.title as string | undefined)?.trim() ||
    (activeIndex >= 0 ? `Segment ${activeIndex + 1}` : "Segment");

  const segmentNotes = (
    (activeSegment?.notes as string | undefined) ??
    (activeSegment?.description as string | undefined) ??
    ""
  ).trim();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium hover:bg-slate-800/60"
        >
          ← Cube
        </button>
        <div className="text-xs font-medium text-slate-100">
          Face {faceIndex + 1} ·{" "}
          {((face?.title as string | undefined)?.trim() ??
            "") || "Sans titre"}
        </div>
      </header>

      {/* Corps */}
      <main className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 md:flex-row">
        {/* Liste de segments */}
        <aside className="flex flex-row gap-2 overflow-x-auto pb-2 md:w-56 md:flex-col md:overflow-y-auto md:border-r md:border-slate-800 md:pb-0">
          {segments.map((seg: any, index: number) => {
            const id = seg.id ?? seg.key ?? index;
            const label =
              (seg.title as string | undefined)?.trim() ||
              `Segment ${index + 1}`;
            const selected =
              activeSegmentId === id || activeIndex === index;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSegmentId(id)}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition ${
                  selected
                    ? "border-brand-400 bg-brand-500/10 text-brand-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-900"
                }`}
              >
                {label}
              </button>
            );
          })}

          {!segments.length && (
            <div className="text-[11px] text-slate-500">
              Aucun segment défini pour cette face.
            </div>
          )}
        </aside>

        {/* Zone principale : média + notes */}
        <section className="flex min-h-0 flex-1 flex-col gap-4">
          {/* Média principal */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            {renderSegmentMedia(activeSegment)}
          </div>

          {/* Notes du segment */}
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {segmentTitle}
            </p>
            <p className="whitespace-pre-line text-sm text-slate-100">
              {segmentNotes ||
                "Pas de notes pédagogiques tout est dit dans le titre."}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * Affiche le premier média du segment en grand.
 * On reste volontairement tolérant sur la structure.
 */
function renderSegmentMedia(segment: any) {
  if (!segment) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
        Aucun segment sélectionné.
      </div>
    );
  }

  const mediaList =
    (segment.media as any[]) ??
    (segment.medias as any[]) ??
    [];

  if (!mediaList.length) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
        Aucun média pour ce segment.
      </div>
    );
  }

  const media = mediaList[0];
  const url = (media?.url as string | undefined) ?? "";
  const type =
    (media?.type as string | undefined) ??
    (media?.kind as string | undefined) ??
    "";

  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
        Média non disponible.
      </div>
    );
  }

  if (type === "video") {
    return (
      <video
        src={url}
        controls
        className="h-full w-full object-cover"
      />
    );
  }

  if (type === "photo" || type === "image") {
    return (
      <img
        src={url}
        alt={segment?.title ?? "Média"}
        className="h-full w-full object-cover"
      />
    );
  }

  // Fichiers / autres types
  const filename =
    (media?.filename as string | undefined) ??
    (media?.name as string | undefined) ??
    "Fichier";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-100">
      <div className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
        {filename}
      </div>
      <p className="max-w-xs text-center text-[11px] text-slate-400">
        Ce type de fichier sera téléchargeable dans la version
        utilisateur finale.
      </p>
    </div>
  );
}
