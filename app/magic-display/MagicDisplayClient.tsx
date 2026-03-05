// app/magic-display/MagicDisplayClient.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Camera, Clapperboard, FileText, Plus, ArrowUpRight, Lock, Unlock, Heart, MoreHorizontal } from "lucide-react";

import { useMagicDisplay }            from "./useMagicDisplay";
import { MagicDisplayFacePanel }      from "./MagicDisplayFacePanel";
import { MagicDisplayOptionsMenu }    from "./MagicDisplayOptionsMenu";
import { MagicDisplayPublishBar }     from "./MagicDisplayPublishBar";
import { statusDotClass, mediaTypeLabel } from "./magicDisplayConstants";
import type { Segment, FaceStatus }   from "./magicDisplayTypes";

import BackButton               from "@/components/navigation/BackButton";
import MagicDisplayFaceEditor   from "@/features/display/MagicDisplayFaceEditor";
import MagicCube3D              from "@/features/display/MagicCube3D";
import MagicDisplayPreviewShell from "@/features/display/MagicDisplayPreviewShell";

// ─────────────────────────────────────────────────────────────
// Helpers UI locaux
// ─────────────────────────────────────────────────────────────

function renderSegmentIcon(seg: Segment) {
  if (seg.mediaType === "photo")  return <Camera      className="h-3.5 w-3.5" />;
  if (seg.mediaType === "video")  return <Clapperboard className="h-3.5 w-3.5" />;
  if (seg.mediaType === "file")   return <FileText     className="h-3.5 w-3.5" />;
  return <Plus className="h-3.5 w-3.5" />;
}

function StudioMediaSlot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

export default function MagicDisplayClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const d = useMagicDisplay(searchParams);

  // ── Mode Preview 3D ─────────────────────────────────────────
  if (d.showPreview) {
    return (
      <MagicDisplayPreviewShell
        display={d.displayState}
        onBack={() => d.setShowPreview(false)}
        onOpenFace={(faceIndex) => {
          const seg = d.segments[faceIndex];
          if (!seg) return;
          d.handleCubeFaceSelect(seg.id);
          d.setShowPreview(false);
        }}
      />
    );
  }

  // ── Mode Face en détail ──────────────────────────────────────
  if (d.isFaceDetailOpen && d.selectedSegment) {
    const faceTitleForEditor =
      d.selectedSegment.description?.trim() || d.selectedSegment.label;

    return (
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        <MagicDisplayFaceEditor
          creatorName={d.currentCreator.name}
          creatorAvatar={d.creatorAvatar}
          creatorInitials={d.initials}
          faceId={d.selectedSegment.id}
          faceLabel={faceTitleForEditor}
          onBack={d.handleCloseFaceDetail}
          onFaceChange={d.handleFaceEditorChange}
        />
      </main>
    );
  }

  // ── Mode Principal ───────────────────────────────────────────
  const mockViews = 0;
  const mockLikes = 0;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <section className="mb-6 flex min-h-[calc(100vh-7rem)] flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">

        {/* ── Ligne 1 : Back + titre + Options ── */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BackButton fallbackHref="/studio" label="Retour" />
            <h1 className="text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
              Magic Display
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => d.setShowPreview(true)}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50"
            >
              Visualiser mon Magic Clock
            </button>
            <button
              type="button"
              onClick={() => { d.setIsOptionsOpen(true); d.setIsDuplicateOpen(false); }}
              aria-label="Ouvrir les options du cube"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Carte aperçu Magic Studio ── */}
        <section className="mb-2">
          <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm">
            <button
              type="button"
              onClick={() => router.push("/mymagic?tab=created&source=magic-display")}
              className="block w-full text-left"
            >
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
                  <div className="grid h-full w-full grid-cols-2">
                    <StudioMediaSlot src={d.beforePreview} alt={`${d.effectiveTitle || "Studio"} - Avant`} />
                    <StudioMediaSlot src={d.afterPreview}  alt={`${d.effectiveTitle || "Studio"} - Après`} />
                  </div>

                  {/* Ligne centrale */}
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-200" />

                  {/* Avatar neutre */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white shadow-sm">
                    <svg viewBox="0 0 100 100" className="h-[72px] w-[72px]" aria-hidden="true">
                      <circle cx="50" cy="50" r="48" fill="#E5E7EB" />
                      <circle cx="50" cy="38" r="16" fill="#9CA3AF" />
                      <path d="M25 74C28 58 37 50 50 50C63 50 72 58 75 74" fill="#9CA3AF" />
                    </svg>
                  </div>

                  {/* Flèche */}
                  <div className="pointer-events-none absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Infos bas de carte */}
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
                  <span className="font-medium">User</span>
                  <span className="text-slate-400">@user</span>
                  <span className="h-[3px] w-[3px] rounded-full bg-slate-300" />
                  <span><span className="font-medium">{mockViews.toLocaleString("fr-CH")}</span> vues</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /><span>{mockLikes}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    {d.isLockedPreview ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    <span>{d.accessLabel}</span>
                    {d.effectiveMode === "PPV" && d.effectivePpvPrice != null && (
                      <span className="ml-1 text-[11px] text-slate-500">· {d.effectivePpvPrice.toFixed(2)} CHF</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                  {d.effectiveTitle && <span className="font-medium text-slate-800">{d.effectiveTitle}</span>}
                  {d.effectiveHashtags.length > 0
                    ? d.effectiveHashtags.map((tag) => <span key={tag} className="text-brand-600">{tag}</span>)
                    : <><span className="text-brand-600">#coiffure</span><span className="text-brand-600">#color</span></>
                  }
                </div>
              </div>
            </button>
          </article>
        </section>

        {/* ── Cercle + Cube + Liste ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">

          {/* Cercle de contrôle */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-72 w-72 flex-shrink-0 items-center justify-center">
              <div
                className="relative h-72 w-72 rounded-full border border-slate-200 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]"
                style={{ background: "radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb 45%, #e2e8f0 75%)" }}
              >
                {/* Avatar central */}
                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl shadow-slate-900/20">
                  <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
                    <circle cx="50" cy="50" r="48" fill="#E5E7EB" />
                    <circle cx="50" cy="38" r="16" fill="#9CA3AF" />
                    <path d="M25 74C28 58 37 50 50 50C63 50 72 58 75 74" fill="#9CA3AF" />
                  </svg>
                </div>

                {/* Boutons faces */}
                {d.segments.map((seg) => {
                  const radiusPercent = 40;
                  const rad  = (seg.angleDeg * Math.PI) / 180;
                  const top  = 50 + Math.sin(rad) * radiusPercent;
                  const left = 50 + Math.cos(rad) * radiusPercent;
                  const isSelected = seg.id === d.selectedId;
                  const meta = d.faceUniversalProgress[String(seg.id)] ?? {};
                  const hasSomething = seg.hasMedia || Boolean(meta.coveredFromDetails || meta.universalContentCompleted);
                  const status: FaceStatus = hasSomething
                    ? (meta.universalContentCompleted ? "full" : "partial")
                    : "empty";

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => d.handleCircleFaceClick(seg)}
                      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                          : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
                      }`}
                      style={{ top: `${top}%`, left: `${left}%` }}
                      aria-label={`Face ${seg.label}`}
                    >
                      {renderSegmentIcon(seg)}
                      <span className={`absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border border-white ${statusDotClass(status)}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne droite : cube + publish + liste */}
          <div className="flex-1 space-y-4">
            <MagicCube3D
              segments={d.segments}
              selectedId={d.selectedId}
              onSelect={d.handleCubeFaceSelect}
            />

            <MagicDisplayPublishBar
              canPublish={d.canPublish}
              isPublishing={d.isPublishing}
              clampedPercent={d.clampedPublishPercent}
              studioPartDisplay={d.studioPartDisplay}
              displayPart={d.displayPart}
              totalPercentDisplay={d.totalPercentDisplay}
              publishHelperText={d.publishHelperText}
              onPublish={d.handleFinalPublish}
            />

            {/* Liste des faces */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">Faces de ce cube Magic Clock</h2>
              <p className="text-xs text-slate-500">
                Chaque ligne correspond à une face. Sélectionne une face pour compléter son contenu.
              </p>
              <div className="space-y-2">
                {d.segments.map((seg) => {
                  const isSelected = seg.id === d.selectedId;
                  const label = mediaTypeLabel(seg.mediaType);
                  const meta  = d.faceUniversalProgress[String(seg.id)] ?? {};
                  const hasSomething = seg.hasMedia || Boolean(meta.coveredFromDetails || meta.universalContentCompleted);
                  const status: FaceStatus = hasSomething
                    ? (meta.universalContentCompleted ? "full" : "partial")
                    : "empty";

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => d.handleListFaceSelect(seg.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition ${
                        isSelected
                          ? "border-brand-500 bg-brand-50/70"
                          : "border-transparent bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">
                          {seg.label}{seg.hasMedia && label ? ` · ${label}` : ""}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">{seg.description}</p>
                      </div>
                      <span className={`ml-2 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${statusDotClass(status)}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Panneau face sélectionnée ── */}
        {d.selectedSegment && (
          <MagicDisplayFacePanel
            segment={d.selectedSegment}
            onDescriptionChange={d.handleSelectedDescriptionChange}
            onNotesChange={d.handleSelectedNotesChange}
            onChooseMedia={d.handleChooseMedia}
            onOpenDetail={d.handleOpenFaceDetail}
          />
        )}

        {/* ── Menu Options ── */}
        {d.isOptionsOpen && (
          <MagicDisplayOptionsMenu
            isDuplicateOpen={d.isDuplicateOpen}
            onClose={() => { d.setIsOptionsOpen(false); d.setIsDuplicateOpen(false); }}
            onApplyTemplate={d.handleApplyTemplate}
            onReset={d.handleResetCube}
            onToggleDuplicate={() => d.setIsDuplicateOpen((prev) => !prev)}
          />
        )}
      </section>

      {/* ── Inputs cachés upload ── */}
      <input ref={d.photoInputRef} type="file" accept="image/*"  className="hidden" onChange={(e) => d.handleMediaFileChange(e, "photo")} />
      <input ref={d.videoInputRef} type="file" accept="video/*"  className="hidden" onChange={(e) => d.handleMediaFileChange(e, "video")} />
      <input ref={d.fileInputRef}  type="file" accept="*/*"      className="hidden" onChange={(e) => d.handleMediaFileChange(e, "file")} />
    </main>
  );
}
