// app/magic-display/useMagicDisplay.ts
"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  type Segment,
  type MediaType,
  type PublishMode,
  type FaceDetailsPayload,
  type FaceUniversalProgress,
} from "./magicDisplayTypes";
import {
  INITIAL_SEGMENTS,
  STORAGE_KEY,
  FACE_PROGRESS_KEY,
  buildTemplateSegments,
  sanitizeMediaUrl,
} from "./magicDisplayConstants";
import type { TemplateId } from "./magicDisplayTypes";
import { listCreators } from "@/core/domain/repository";
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import { computeMagicClockPublishProgress } from "@/features/display/progress";
import { addCreatedWork } from "@/core/domain/magicClockWorkStore";
import { processAndUpload } from "@/lib/mediaCompressor";
import type {
  PreviewDisplay,
  PreviewFace,
  PreviewMedia,
  MediaKind,
} from "@/features/display/MagicDisplayPreviewShell";

// ─────────────────────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────────────────────

export function useMagicDisplay(searchParams: URLSearchParams) {
  const router = useRouter();

  // ── Params URL ──────────────────────────────────────────────
  const titleFromStudio     = searchParams.get("title") ?? "";
  const modeFromStudioParam = (searchParams.get("mode") as PublishMode | null) ?? null;
  const ppvPriceFromStudio  = searchParams.get("ppvPrice");
  const hashtagsParam       = searchParams.get("hashtags") ?? searchParams.get("hashtag") ?? "";

  const hashtagTokensFromQuery = hashtagsParam
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
    .filter((tag) => tag.length > 0)
    .map((tag) => `#${tag}`);

  // ── Créateur ────────────────────────────────────────────────
  const creators = listCreators();
  const currentCreator = creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];
  const initials = currentCreator.name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const creatorAvatar    = currentCreator.avatar;
  const creatorHandleRaw = (currentCreator as any).handle ?? "@aiko_tanaka";
  const creatorHandle    = creatorHandleRaw.startsWith("@") ? creatorHandleRaw : `@${creatorHandleRaw}`;

  // ── Studio Bridge ───────────────────────────────────────────
  const [studioBeforeUrl,   setStudioBeforeUrl]   = useState<string | null>(null);
  const [studioAfterUrl,    setStudioAfterUrl]     = useState<string | null>(null);
  const [studioBeforeCover, setStudioBeforeCover] = useState<number | null>(null);
  const [studioAfterCover,  setStudioAfterCover]  = useState<number | null>(null);
  const [studioBeforeThumb, setStudioBeforeThumb] = useState<string | null>(null);
  const [studioAfterThumb,  setStudioAfterThumb]  = useState<string | null>(null);
  const [bridgeTitle,    setBridgeTitle]    = useState("");
  const [bridgeMode,     setBridgeMode]     = useState<PublishMode | null>(null);
  const [bridgePpvPrice, setBridgePpvPrice] = useState<number | null>(null);
  const [bridgeHashtags, setBridgeHashtags] = useState<string[]>([]);

  // ── Progrès faces ───────────────────────────────────────────
  const [faceUniversalProgress, setFaceUniversalProgress] = useState<FaceUniversalProgress>({});
  const [faceDetails, setFaceDetails] = useState<Record<number, FaceDetailsPayload>>({});

  // ── État UI ─────────────────────────────────────────────────
  const [showPreview,       setShowPreview]       = useState(false);
  const [segments,          setSegments]          = useState<Segment[]>(INITIAL_SEGMENTS);
  const [selectedId,        setSelectedId]        = useState<number | null>(null);
  const [isFaceDetailOpen,  setIsFaceDetailOpen]  = useState(false);
  const [isOptionsOpen,     setIsOptionsOpen]     = useState(false);
  const [isDuplicateOpen,   setIsDuplicateOpen]   = useState(false);
  const [isPublishing,      setIsPublishing]      = useState(false);

  const selectedSegment = segments.find((s) => s.id === selectedId) ?? null;

  // ── Refs upload ─────────────────────────────────────────────
  const photoInputRef    = useRef<HTMLInputElement | null>(null);
  const videoInputRef    = useRef<HTMLInputElement | null>(null);
  const fileInputRef     = useRef<HTMLInputElement | null>(null);
  const uploadFaceIdRef  = useRef<number | null>(null);

  // ── useEffect : Studio Bridge ────────────────────────────────
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_FORWARD_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw) as StudioForwardPayload;
      if (payload.before?.url)          { setStudioBeforeUrl(payload.before.url); }
      if (typeof payload.before?.coverTime === "number") { setStudioBeforeCover(payload.before.coverTime); }
      if (payload.before?.thumbnailUrl) { setStudioBeforeThumb(payload.before.thumbnailUrl); }
      if (payload.after?.url)           { setStudioAfterUrl(payload.after.url); }
      if (typeof payload.after?.coverTime === "number")  { setStudioAfterCover(payload.after.coverTime); }
      if (payload.after?.thumbnailUrl)  { setStudioAfterThumb(payload.after.thumbnailUrl); }
      if (payload.title)    setBridgeTitle(payload.title);
      if (payload.mode)     setBridgeMode(payload.mode as PublishMode);
      if (typeof payload.ppvPrice === "number") setBridgePpvPrice(payload.ppvPrice);
      if (Array.isArray(payload.hashtags)) setBridgeHashtags(payload.hashtags);
    } catch (error) {
      console.error("Failed to read Magic Studio payload", error);
    }
  }, []);

  // ── useEffect : Face progress ────────────────────────────────
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FACE_PROGRESS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") setFaceUniversalProgress(parsed);
    } catch (error) {
      console.error("Failed to read face universal progress", error);
    }
  }, []);

  // ── useEffect : Charger draft cube ───────────────────────────
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Segment>[];
      if (!Array.isArray(parsed)) return;
      const merged: Segment[] = INITIAL_SEGMENTS.map((defaultSeg) => {
        const fromStore = parsed.find((s) => s.id === defaultSeg.id);
        if (!fromStore) return defaultSeg;
        return { ...defaultSeg, label: fromStore.label ?? defaultSeg.label, description: fromStore.description ?? defaultSeg.description, notes: fromStore.notes, hasMedia: false, mediaType: undefined, mediaUrl: null };
      });
      setSegments(merged);
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to load Magic Display draft from storage", error);
    }
  }, []);

  // ── useEffect : Sauvegarder draft ────────────────────────────
  useEffect(() => {
    try {
      const toPersist = segments.map((seg) => ({
        id: seg.id, label: seg.label, description: seg.description,
        angleDeg: seg.angleDeg, hasMedia: seg.hasMedia,
        mediaType: seg.mediaType ?? undefined, notes: seg.notes ?? undefined,
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch (error) {
      console.error("Failed to save Magic Display draft to storage", error);
    }
  }, [segments]);

  // ── Valeurs effectives ───────────────────────────────────────
  const effectiveTitle   = (titleFromStudio || bridgeTitle).trim();
  const effectiveMode: PublishMode = modeFromStudioParam ?? bridgeMode ?? "FREE";
  const effectivePpvPrice = ppvPriceFromStudio != null ? Number(ppvPriceFromStudio) : bridgePpvPrice;
  const effectiveHashtags = hashtagTokensFromQuery.length > 0
    ? hashtagTokensFromQuery
    : bridgeHashtags.map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag)).filter(Boolean).map((tag) => `#${tag}`);

  const accessLabel    = effectiveMode === "FREE" ? "FREE" : effectiveMode === "SUB" ? "Abonnement" : "PayPerView";
  const isLockedPreview = effectiveMode !== "FREE";

  // ── Calcul progrès publication ───────────────────────────────
  const studioFacesCompleted = [studioBeforeUrl || studioBeforeThumb, studioAfterUrl || studioAfterThumb].filter(Boolean).length;
  const studioPartDisplay    = Math.min(40, studioFacesCompleted * 20);
  const studioCompleted      = studioFacesCompleted === 2;

  const faceProgressInput = segments.map((seg) => {
    const meta = faceUniversalProgress[String(seg.id)] ?? {};
    const covered = seg.hasMedia || Boolean(meta.coveredFromDetails || meta.universalContentCompleted);
    return { id: seg.id, covered, universalContent: covered && Boolean(meta.universalContentCompleted) };
  });

  const { displayPart, completedFaces, partialFaces } = computeMagicClockPublishProgress({ studioCompleted, faces: faceProgressInput });

  const totalPercentDisplay    = studioPartDisplay + displayPart;
  const clampedPublishPercent  = Math.max(0, Math.min(100, totalPercentDisplay));
  const canPublish             = clampedPublishPercent >= 100;
  const studioStatusLabel      = studioFacesCompleted === 2 ? "Studio complété" : "Studio incomplet";
  const publishHelperText      = canPublish
    ? "Studio complété · Display complété · Tu peux publier ton Magic Clock ✨"
    : `${studioStatusLabel} · Termine ton Display pour publier.`;

  // ── Previews avant/après ─────────────────────────────────────
  const beforePreview = studioBeforeThumb ?? studioAfterThumb ?? studioBeforeUrl ?? studioAfterUrl ?? "/images/magic-clock-bear/before.jpg";
  const afterPreview  = studioAfterThumb  ?? studioBeforeThumb ?? studioAfterUrl  ?? studioBeforeUrl ?? "/images/magic-clock-bear/after.jpg";

  // ── Construction displayState ────────────────────────────────
  const displayState: PreviewDisplay = {
    creatorName:      currentCreator.name,
    creatorInitials:  initials,
    creatorAvatarUrl: undefined,
    faces: segments.map((seg): PreviewFace => {
      const details = faceDetails[seg.id];
      const coverFromCube = seg.mediaUrl && seg.mediaType
        ? ({
            type: seg.mediaType as MediaKind,
            url: seg.mediaUrl,
            thumbnailUrl: seg.thumbnailUrl ?? null,
          } satisfies PreviewMedia)
        : undefined;
      const faceTitle = seg.description?.trim() || seg.label;

      if (details) {
        const allNotes = details.segments.map((s) => (s.notes ?? "").trim()).filter(Boolean).join("\n\n");
        const firstFromDetails = (() => {
          const firstWithMedia = details.segments.find((s) => (s.media?.length ?? 0) > 0);
          const m = firstWithMedia?.media?.[0];
          return m ? ({ type: m.type as MediaKind, url: m.url } satisfies PreviewMedia) : undefined;
        })();
        return {
          title: faceTitle, notes: allNotes,
          coverMedia: coverFromCube ?? firstFromDetails,
          segments: details.segments.map((s) => ({
            id: s.id, title: s.title, description: s.description ?? "", notes: s.notes ?? "",
            media: (s.media ?? []).map((m) => ({ type: m.type as MediaKind, url: m.url })),
          })),
        };
      }

      const mediaArray: PreviewMedia[] = seg.mediaUrl && seg.mediaType
        ? [{ type: seg.mediaType as MediaKind, url: seg.mediaUrl, thumbnailUrl: seg.thumbnailUrl ?? null }]
        : [];

      return {
        title: faceTitle, notes: seg.notes ?? "",
        coverMedia: coverFromCube ?? mediaArray[0],
        segments: [{ id: seg.id, title: seg.label, description: seg.description, notes: seg.notes ?? "", media: mediaArray }],
      };
    }),
  };

  // ── Handlers ─────────────────────────────────────────────────

  function handleFaceEditorChange(payload: FaceDetailsPayload) {
    const { faceId, segmentCount, segments: faceSegments } = payload;
    setSegments((prev) =>
      prev.map((seg) => {
        if (seg.id !== faceId) return seg;
        const firstWithMedia = faceSegments.find((s) => (s.media?.length ?? 0) > 0);
        const media = firstWithMedia?.media?.[0];
        const hasExistingMedia = seg.hasMedia && !!seg.mediaUrl;
        return {
          ...seg,
          hasMedia:  hasExistingMedia || !!media,
          mediaType: hasExistingMedia ? seg.mediaType : ((media?.type as MediaType | undefined) ?? seg.mediaType),
          mediaUrl:  hasExistingMedia ? seg.mediaUrl  : media?.url ?? seg.mediaUrl,
        };
      }),
    );
    setFaceDetails((prev) => ({ ...prev, [faceId]: payload }));

    const coveredFromDetails = faceSegments.some((s) => (s.notes?.trim().length ?? 0) > 0 || (s.media?.length ?? 0) > 0);
    const universalContentCompleted = coveredFromDetails && faceSegments.slice(0, segmentCount).every((s) => (s.notes?.trim().length ?? 0) > 0 || (s.media?.length ?? 0) > 0);

    setFaceUniversalProgress((prev) => {
      const next = { ...prev, [String(faceId)]: { coveredFromDetails, universalContentCompleted } };
      try { window.localStorage.setItem(FACE_PROGRESS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function handleCubeFaceSelect(id: number | null) {
    if (id == null) { setSelectedId(null); setIsFaceDetailOpen(false); return; }
    setSelectedId(id);
    setIsFaceDetailOpen(true);
  }

  function handleListFaceSelect(id: number | null) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleCircleFaceClick(seg: Segment) {
    setSelectedId(seg.id);
    uploadFaceIdRef.current = seg.id;
    if (!seg.hasMedia && photoInputRef.current) photoInputRef.current.click();
  }

  function handleChooseMedia(type: MediaType) {
    if (!selectedSegment) return;
    uploadFaceIdRef.current = selectedSegment.id;
    if (type === "photo") photoInputRef.current?.click();
    else if (type === "video") videoInputRef.current?.click();
    else fileInputRef.current?.click();
  }

  // ⚡️ Upload vers R2 via processAndUpload — jamais via Supabase Storage
  async function handleMediaFileChange(event: ChangeEvent<HTMLInputElement>, type: MediaType) {
    const file = event.target.files?.[0];
    if (!file) return;
    const targetFaceId = uploadFaceIdRef.current ?? selectedSegment?.id ?? null;
    if (!targetFaceId) { event.target.value = ""; return; }

    // 1) Preview locale immédiate — zéro latence UX
    const localUrl = URL.createObjectURL(file);
    setSegments((prev) => prev.map((seg) => seg.id === targetFaceId ? { ...seg, hasMedia: true, mediaType: type, mediaUrl: localUrl } : seg));

    if (type === "file") { uploadFaceIdRef.current = null; event.target.value = ""; return; }

    // 2) Compression + upload R2 (cdn.magic-clock.com/display/{faceId}/...)
    try {
      const result = await processAndUpload(file, "display", String(targetFaceId), (phase) => {
        console.log(`[Display] Face ${targetFaceId} — Upload phase:`, phase);
      });

      if (result.kind === "video") {
        // Vidéo : persister cdnUrl + thumbnailCdnUrl pour le cube et le viewer
        setSegments((prev) => prev.map((seg) =>
          seg.id === targetFaceId
            ? { ...seg, mediaUrl: result.cdnUrl, thumbnailUrl: result.thumbnailCdnUrl }
            : seg
        ));
      } else {
        // Image : pas de thumbnail
        setSegments((prev) => prev.map((seg) =>
          seg.id === targetFaceId
            ? { ...seg, mediaUrl: result.cdnUrl, thumbnailUrl: null }
            : seg
        ));
      }
    } catch (err) {
      console.error("[Display] Upload R2 failed:", err);
      // Garde le blob local en fallback — pas de régression UX
    }

    uploadFaceIdRef.current = null;
    event.target.value = "";
  }

  function handleApplyTemplate(template: TemplateId) {
    setSegments(buildTemplateSegments(template));
    setSelectedId(null);
    setIsDuplicateOpen(false);
    setIsOptionsOpen(false);
  }

  function handleResetCube() {
    setSegments(INITIAL_SEGMENTS);
    setSelectedId(null);
    setIsDuplicateOpen(false);
    setIsOptionsOpen(false);
  }

  // ── Publication ──────────────────────────────────────────────
  const handleFinalPublish = async () => {
    if (!canPublish || isPublishing) return;
    setIsPublishing(true);

    try {
      const workId = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;

      addCreatedWork({ id: workId, title: effectiveTitle || "Magic Clock", hashtags: effectiveHashtags, mode: effectiveMode });

      const titleForWork = effectiveTitle || "Magic Clock";

      // ⚡️ Sauvegarde les URLs R2 directes dans work.display
      // Les médias pointent vers cdn.magic-clock.com — jamais via Supabase Storage
      // → 0 coût double sur 1M users × 72 médias par Magic Clock
      const lightDisplay = {
        faces: displayState.faces.map((face) => ({
          title:     face.title,
          notes:     face.notes ?? "",
          // URL de couverture R2 directe
          coverUrl:  face.coverMedia?.url && !face.coverMedia.url.startsWith("blob:") && !face.coverMedia.url.startsWith("data:")
            ? face.coverMedia.url : null,
          coverType: face.coverMedia?.type ?? null,
          segments: face.segments.map((s) => ({
            id:          s.id,
            title:       s.title,
            description: s.description ?? "",
            notes:       s.notes ?? "",
            // URLs R2 complètes — blob: et data: filtrés (temporaires locaux)
            media: (s.media ?? [])
              .filter((m) => m.url && !m.url.startsWith("blob:") && !m.url.startsWith("data:"))
              .map((m) => ({ type: m.type, url: m.url, filename: (m as any).filename ?? undefined })),
            mediaCount: (s.media ?? []).filter((m) => m.url && !m.url.startsWith("blob:") && !m.url.startsWith("data:")).length,
          })),
        })),
      };

      const workPayload = {
        id: workId, title: titleForWork, mode: effectiveMode, hashtags: effectiveHashtags,
        studio: {
          title: titleForWork, mode: effectiveMode,
          ppvPrice:       effectiveMode === "PPV" ? effectivePpvPrice ?? null : null,
          hashtags:       effectiveHashtags,
          beforeUrl:      sanitizeMediaUrl(studioBeforeUrl),
          afterUrl:       sanitizeMediaUrl(studioAfterUrl),
          beforeCoverTime: studioBeforeCover,
          afterCoverTime:  studioAfterCover,
        },
        display: lightDisplay,
        progress: { studioFacesCompleted, displayPart, completedFaces, partialFaces, totalPercent: clampedPublishPercent },
        createdAt: new Date().toISOString(),
      };

      let slug: string | null = null;

      try {
        const baseSlug = titleForWork.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        const generatedSlug = `${baseSlug || "magic-clock"}-${workId.slice(0, 8)}`;

        const res = await fetch("/api/magic-clocks/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: titleForWork, slug: generatedSlug, gatingMode: effectiveMode, work: workPayload }),
        });

        if (res.ok) {
          const json = (await res.json()) as { id?: string; slug?: string };
          slug = json?.slug ?? generatedSlug;
          console.log("[MagicClock] Publié en Supabase :", json?.id);
        } else {
          console.warn("[MagicClock] Supabase warning:", res.status, await res.text());
        }
      } catch (publishErr) {
        console.warn("[MagicClock] Supabase error (non bloquant):", publishErr);
      }

      try {
        window.localStorage.removeItem(STUDIO_FORWARD_KEY);
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(FACE_PROGRESS_KEY);
      } catch {}

      const baseMyMagicUrl = "/mymagic?tab=creations&source=magic-display";
      router.push(slug ? `${baseMyMagicUrl}&open=${encodeURIComponent(slug)}` : baseMyMagicUrl);

    } finally {
      setIsPublishing(false);
    }
  };

  // ── Retour public ────────────────────────────────────────────
  return {
    // Créateur
    currentCreator, initials, creatorAvatar, creatorHandle,
    // Studio
    studioBeforeUrl, studioAfterUrl, beforePreview, afterPreview,
    // Valeurs effectives
    effectiveTitle, effectiveMode, effectivePpvPrice, effectiveHashtags,
    accessLabel, isLockedPreview,
    // Segments & sélection
    segments, selectedId, selectedSegment,
    faceUniversalProgress, faceDetails,
    // UI
    showPreview, setShowPreview,
    isFaceDetailOpen, setIsFaceDetailOpen,
    isOptionsOpen, setIsOptionsOpen,
    isDuplicateOpen, setIsDuplicateOpen,
    isPublishing,
    // Progression publication
    studioFacesCompleted, studioPartDisplay, displayPart,
    clampedPublishPercent, canPublish, publishHelperText,
    totalPercentDisplay,
    // Display state (pour la preview 3D)
    displayState,
    // Refs input
    photoInputRef, videoInputRef, fileInputRef,
    // Handlers
    handleFaceEditorChange,
    handleCubeFaceSelect,
    handleListFaceSelect,
    handleCircleFaceClick,
    handleChooseMedia,
    handleMediaFileChange,
    handleApplyTemplate,
    handleResetCube,
    handleFinalPublish,
    handleOpenFaceDetail:  () => { if (selectedSegment) setIsFaceDetailOpen(true); },
    handleCloseFaceDetail: () => setIsFaceDetailOpen(false),
    handleSelectedDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value.slice(0, 27);
      setSegments((prev) => prev.map((seg) => seg.id === selectedId ? { ...seg, description: value } : seg));
    },
    handleSelectedNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSegments((prev) => prev.map((seg) => seg.id === selectedId ? { ...seg, notes: e.target.value } : seg));
    },
  };
}
