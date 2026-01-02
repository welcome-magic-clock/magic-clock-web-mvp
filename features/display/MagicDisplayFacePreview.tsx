"use client";

import React from "react";

type MagicDisplayFacePreviewProps = {
  face: any;
  faceIndex: number; // 0-based
  creatorName?: string;
  creatorAvatar?: string | null;
  creatorInitials?: string;
  openedSegmentId: string | number | null;
  onSegmentChange?: (id: string | number) => void;
  // "full" = carte complète, "circle-only" = juste le cercle (pour l'arrière du cube)
  variant?: "circle-only" | "full";
};

type DialProps = {
  face: any;
  creatorName: string;
  creatorAvatar: string | null;
  creatorInitials: string;
  activeSegmentId: string | number | null;
  onSegmentChange?: (id: string | number) => void;
};

/**
 * Noyau commun : le cercle (dial) avec avatar, aiguille et bulles de segments.
 * Utilisé dans toutes les variantes (plein écran, cube, etc.).
 */
function MagicDisplayFaceDialBase({
  face,
  creatorAvatar,
  creatorInitials,
  activeSegmentId,
  onSegmentChange,
}: DialProps) {
  const segments: any[] = Array.isArray(face?.segments) ? face.segments : [];

  const effectiveActiveId =
    activeSegmentId ??
    (segments.length > 0
      ? segments[0]?.id ?? segments[0]?.key ?? 0
      : null);

  const activeIndex = segments.findIndex((seg, index) => {
    const id = seg?.id ?? seg?.key ?? index;
    return id === effectiveActiveId;
  });

  const clampedActiveIndex =
    activeIndex >= 0 ? activeIndex : segments.length > 0 ? 0 : -1;

  const segmentCount = segments.length || 1;

  // Angle de l'aiguille : 0 = en haut, tourne dans le sens horaire
  const activeAngleDeg =
    clampedActiveIndex >= 0
      ? (clampedActiveIndex / segmentCount) * 360 - 90
      : -90;

  return (
    <div className="relative h-full w-full">
      {/* Disque principal avec halo */}
      <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.35)]" />
      <div className="absolute inset-[18%] rounded-full border border-slate-200/70 bg-white/80" />
      <div className="absolute inset-[32%] rounded-full border border-slate-200/60" />

      {/* Aiguille (part du centre vers le haut) */}
      <div
        className="absolute left-1/2 top-1/2 h-[26%] w-[2px] -translate-x-1/2 rounded-full bg-slate-900"
        style={{
          transform: `translate(-50%, -100%) rotate(${activeAngleDeg}deg)`,
          transformOrigin: "50% 100%",
        }}
      />

      {/* Bulles de segments autour du cercle */}
      {segments.map((seg, index) => {
        const id = seg?.id ?? seg?.key ?? index;
        const angle = (index / segmentCount) * 360 - 90; // 0° = haut
        const rad = (angle * Math.PI) / 180;

        const radius = 46; // pourcentage du demi-côté
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);

        const isActive = id === effectiveActiveId;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSegmentChange?.(id)}
            className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] shadow-sm transition
              ${
                isActive
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:bg-slate-50"
              }`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/* Pas de "+" (édition) ici -> juste un point indicateur */}
            <span className={isActive ? "text-xs" : "text-[10px]"}>
              {isActive ? "●" : "○"}
            </span>
          </button>
        );
      })}

      {/* Avatar au centre */}
      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900 text-base font-semibold text-white shadow-xl shadow-slate-900/40">
        {creatorAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={creatorAvatar}
            alt={creatorInitials}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span>{creatorInitials}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Composant principal :
 * - variant="full"  → carte complète, avec titres et texte
 * - variant="circle-only" → seulement le cercle (pour l'arrière du cube)
 */
export default function MagicDisplayFacePreview({
  face,
  faceIndex,
  creatorName = "Créateur Magic Clock",
  creatorAvatar = null,
  creatorInitials = "MC",
  openedSegmentId,
  onSegmentChange,
  variant = "full",
}: MagicDisplayFacePreviewProps) {
  const faceNumber = faceIndex + 1;
  const faceTitle =
    (face?.title as string | undefined)?.trim() || `Face ${faceNumber}`;

  if (variant === "circle-only") {
    // 👉 Mode utilisé par l'arrière des faces du cube :
    // fond transparent, le cercle prend toute la place disponible.
    return (
      <div className="flex h-full w-full items-center justify-center bg-transparent">
        <div className="relative aspect-square w-[88%] max-w-[320px]">
          <MagicDisplayFaceDialBase
            face={face}
            creatorName={creatorName}
            creatorAvatar={creatorAvatar}
            creatorInitials={creatorInitials ?? "MC"}
            activeSegmentId={openedSegmentId}
            onSegmentChange={onSegmentChange}
          />
        </div>
      </div>
    );
  }

  // 👉 Variante "full" (carte complète), au cas où on en aurait besoin ailleurs.
  return (
    <div className="flex w-full max-w-xl flex-col rounded-3xl border border-slate-200 bg-white/95 px-4 py-4 text-slate-900 shadow-lg shadow-slate-900/10">
      {/* En-tête : face + créateur */}
      <div className="mb-3 flex items-center justify-between gap-3 text-xs">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
            Face {faceNumber} / 6
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {faceTitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
            {creatorInitials}
          </div>
          <span className="text-[11px] text-slate-600 truncate max-w-[120px]">
            {creatorName}
          </span>
        </div>
      </div>

      {/* Cercle */}
      <div className="relative mx-auto mt-2 aspect-square w-full max-w-[360px]">
        <MagicDisplayFaceDialBase
          face={face}
          creatorName={creatorName}
          creatorAvatar={creatorAvatar}
          creatorInitials={creatorInitials ?? "MC"}
          activeSegmentId={openedSegmentId}
          onSegmentChange={onSegmentChange}
        />
      </div>

      {/* Texte d'aide */}
      <p className="mt-4 text-center text-[11px] text-slate-500">
        Tap sur une bulle pour explorer le segment associé à cette étape.
      </p>
    </div>
  );
}
