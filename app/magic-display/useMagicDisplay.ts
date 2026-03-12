// app/magic-display/useMagicDisplay.ts
// ✅ v2.2 — Zéro mock : créateur depuis useAuth+Supabase, validation CDN, erreurs visibles
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
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import { computeMagicClockPublishProgress } from "@/features/display/progress";
import { addCreatedWork } from "@/core/domain/magicClockWorkStore";
import { processAndUpload } from "@/lib/mediaCompressor";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import type {
  PreviewDisplay,
  PreviewFace,
  PreviewMedia,
  MediaKind,
} from "@/features/display/MagicDisplayPreviewShell";

// ─────────────────────────────────────────────────────────────
// Type profil créateur (depuis Supabase profiles)
// ─────────────────────────────────────────────────────────────
type CreatorProfile = {
  handle: string;        // ex: "welcome_julien"
  displayName: string;   // ex: "Julien Magic Clock"
  avatarUrl: string | null;
  initials: string;      // ex: "JM"
};

// ─────────────────────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────────────────────
export function useMagicDisplay(searchParams: URLSearchParams) {
  const router = useRouter();
  const { user } = useAuth();

  // ── Params URL ──────────────────────────────────────────────
  const titleFromStudio = searchParams.get("title") ?? "";
  const modeFromStudioParam =
    (searchParams.get("mode") as PublishMode | null) ?? null;
  const ppvPriceFromStudio = searchParams.get("ppvPrice");
  const hashtagsParam =
    searchParams.get("hashtags") ?? searchParams.get("hashtag") ?? "";
  const hashtagTokensFromQuery = hashtagsParam
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
    .filter((tag) => tag.length > 0)
    .map((tag) => `#${tag}`);

  // ── Profil créateur depuis Supabase ─────────────────────────
  // ✅ Zéro mock — on charge le vrai profil du user connecté
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>({
    handle: "",
    displayName: "",
    avatarUrl: null,
    initials: "MC",
  });

  useEffect(() => {
    if (!user?.id) return;
    const sb = getSupabaseBrowser();
    sb.from("profiles")
      .select("handle, display_name, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const handle = (data.handle ?? "").replace(/^@/, "");
        const name = data.display_name ?? handle ?? "Créateur";
        const parts = name.split(" ").filter(Boolean);
        const initials = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : name.slice(0, 2).toUpperCase();
        setCreatorProfile({
          handle,
          displayName: name,
          avatarUrl: data.avatar_url ?? null,
          initials,
        });
      });
  }, [user?.id]);

  // Exposer les valeurs dans le même format qu'avant pour ne pas casser les consumers
  const currentCreator = {
    name: creatorProfile.displayName || "Créateur",
    handle: `@${creatorProfile.handle}`,
    avatar: creatorProfile.avatarUrl ?? "",
  };
  const initials = creatorProfile.initials;
  const creatorAvatar = creatorProfile.avatarUrl ?? "";
  const creatorHandle = `@${creatorProfile.handle}`;

  // ── Studio Bridge ────────────────────────────────────────────
  const [studioBeforeUrl, setStudioBeforeUrl] = useState<string | null>(null);
  const [studioAfterUrl, setStudioAfterUrl] = useState<string | null>(null);
  const [studioBeforeCover, setStudioBeforeCover] = useState<number | null>(null);
  const [studioAfterCover, setStudioAfterCover] = useState<number | null>(null);
  const [studioBeforeThumb, setStudioBeforeThumb] = useState<string | null>(null);
  const [studioAfterThumb, setStudioAfterThumb] = useState<string | null>(null);
  const [bridgeTitle, setBridgeTitle] = useState("");
  const [bridgeMode, setBridgeMode] = useState<PublishMode | null>(null);
  const [bridgePpvPrice, setBridgePpvPrice] = useState<number | null>(null);
  const [bridgeHashtags, setBridgeHashtags] = useState<string[]>([]);

  // ── État publication ─────────────────────────────────────────
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // ── Progrès faces ────────────────────────────────────────────
  const [faceUniversalProgress, setFaceUniversalProgress] =
    useState<FaceUniversalProgress>({});
  const [faceDetails, setFaceDetails] = useState<
    Record<number, FaceDetailsPayload>
  >({});

  // ── État UI ──────────────────────────────────────────────────
  const [showPreview, setShowPreview] = useState(false);
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isFaceDetailOpen, setIsFaceDetailOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const selectedSegment = segments.find((s) => s.id === selectedId) ?? null;

  // ── Refs upload ──────────────────────────────────────────────
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadFaceIdRef = useRef<number | null>(null);

  // ── useEffect : Studio Bridge ────────────────────────────────
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_FORWARD_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw) as StudioForwardPayload;

      // ✅ Rejeter les URLs base64/blob — CDN uniquement
      const isCdnUrl = (url: string | null | undefined) =>
        typeof url === "string" &&
        url.length > 0 &&
        !url.startsWith("data:") &&
        !url.startsWith("blob:");

      // ✅ Détection payload corrompu : before ou after en base64
      // → Nettoyer le localStorage et afficher un message d'erreur clair
      const beforeIsCorrupt = payload.before?.url
        ? !isCdnUrl(payload.before.url)
        : false;
      const afterIsCorrupt = payload.after?.url
        ? !isCdnUrl(payload.after.url)
        : false;

      if (beforeIsCorrupt || afterIsCorrupt) {
        // Supprimer le payload corrompu pour éviter qu'il bloque les prochaines sessions
        try { window.localStorage.removeItem(STUDIO_FORWARD_KEY); } catch {}
        setPublishError(
          "⚠️ Les photos du Studio n'ont pas été envoyées sur le CDN. " +
          "Retourne dans le Studio, réimporte tes photos et attends que l'upload soit terminé avant de continuer."
        );
        // Charger quand même le mode/prix/titre pour ne pas tout perdre
        if (payload.title) setBridgeTitle(payload.title);
        if (payload.mode) setBridgeMode(payload.mode as PublishMode);
        if (typeof payload.ppvPrice === "number") setBridgePpvPrice(payload.ppvPrice);
        if (Array.isArray(payload.hashtags)) setBridgeHashtags(payload.hashtags);
        return;
      }

      if (payload.before?.url && isCdnUrl(payload.before.url))
        setStudioBeforeUrl(payload.before.url);
      if (typeof payload.before?.coverTime === "number")
        setStudioBeforeCover(payload.before.coverTime);
      if (payload.before?.thumbnailUrl && isCdnUrl(payload.before.thumbnailUrl))
        setStudioBeforeThumb(payload.before.thumbnailUrl);
      if (payload.after?.url && isCdnUrl(payload.after.url))
        setStudioAfterUrl(payload.after.url);
      if (typeof payload.after?.coverTime === "number")
        setStudioAfterCover(payload.after.coverTime);
      if (payload.after?.thumbnailUrl && isCdnUrl(payload.after.thumbnailUrl))
        setStudioAfterThumb(payload.after.thumbnailUrl);
      if (payload.title) setBridgeTitle(payload.title);
      if (payload.mode) setBridgeMode(payload.mode as PublishMode);
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
        return {
          ...defaultSeg,
          label: fromStore.label ?? defaultSeg.label,
          description: fromStore.description ?? defaultSeg.description,
          notes: fromStore.notes,
          hasMedia: false,
          mediaType: undefined,
          mediaUrl: null,
        };
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
        id: seg.id,
        label: seg.label,
        description: seg.description,
        angleDeg: seg.angleDeg,
        hasMedia: seg.hasMedia,
        mediaType: seg.mediaType ?? undefined,
        notes: seg.notes ?? undefined,
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch (error) {
      console.error("Failed to save Magic Display draft to storage", error);
    }
  }, [segments]);

  // ── Valeurs effectives ───────────────────────────────────────
  const effectiveTitle = (titleFromStudio || bridgeTitle).trim();
  const effectiveMode: PublishMode = modeFromStudioParam ?? bridgeMode ?? "FREE";
  const effectivePpvPrice =
    ppvPriceFromStudio != null ? Number(ppvPriceFromStudio) : bridgePpvPrice;
  const effectiveHashtags =
    hashtagTokensFromQuery.length > 0
      ? hashtagTokensFromQuery
      : bridgeHashtags
          .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
          .filter(Boolean)
          .map((tag) => `#${tag}`);
  const accessLabel =
    effectiveMode === "FREE" ? "FREE" : effectiveMode === "SUB" ? "Abonnement" : "PayPerView";
  const isLockedPreview = effectiveMode !== "FREE";

  // ── Calcul progrès publication ───────────────────────────────
  const isCdnValid = (url: string | null) =>
    typeof url === "string" &&
    url.length > 0 &&
    !url.startsWith("data:") &&
    !url.startsWith("blob:");

  const studioBeforeReady = isCdnValid(studioBeforeUrl) || isCdnValid(studioBeforeThumb);
  const studioAfterReady = isCdnValid(studioAfterUrl) || isCdnValid(studioAfterThumb);
  const studioFacesCompleted = [studioBeforeReady, studioAfterReady].filter(Boolean).length;
  const studioPartDisplay = Math.min(40, studioFacesCompleted * 20);
  const studioCompleted = studioFacesCompleted === 2;

  const faceProgressInput = segments.map((seg) => {
    const meta = faceUniversalProgress[String(seg.id)] ?? {};
    const covered =
      seg.hasMedia || Boolean(meta.coveredFromDetails || meta.universalContentCompleted);
    return {
      id: seg.id,
      covered,
      universalContent: covered && Boolean(meta.universalContentCompleted),
    };
  });

  const { displayPart, completedFaces, partialFaces } =
    computeMagicClockPublishProgress({ studioCompleted, faces: faceProgressInput });
  const totalPercentDisplay = studioPartDisplay + displayPart;
  const clampedPublishPercent = Math.max(0, Math.min(100, totalPercentDisplay));
  // ✅ Logique originale conservée : Studio (40%) + Display (60%) = 100% pour publier
  // Les pastilles orange/vert du Display doivent toutes être vertes
  const canPublish = clampedPublishPercent >= 100;

  const studioStatusLabel =
    !studioBeforeReady && !studioAfterReady
      ? "Photos AVANT et APRÈS manquantes ou non uploadées sur le CDN"
      : !studioBeforeReady
      ? "Photo AVANT manquante ou non uploadée sur le CDN"
      : !studioAfterReady
      ? "Photo APRÈS manquante ou non uploadée sur le CDN"
      : "Studio complété";

  // Message d'aide contextuel — guide le créateur vers la prochaine action
  const studioNotUploadedMsg =
    !isCdnValid(studioBeforeUrl) && !isCdnValid(studioAfterUrl)
      ? "⚠️ Photos AVANT/APRÈS non reçues du Studio — retourne dans le Studio et vérifie que l'upload est terminé."
      : !isCdnValid(studioBeforeUrl)
      ? "⚠️ Photo AVANT non reçue — retourne dans le Studio."
      : !isCdnValid(studioAfterUrl)
      ? "⚠️ Photo APRÈS non reçue — retourne dans le Studio."
      : null;

  const publishHelperText = canPublish
    ? "Studio ✅ · Display ✅ · Tu peux publier ton Magic Clock ! ✨"
    : studioNotUploadedMsg
    ? studioNotUploadedMsg
    : `${studioStatusLabel} · Complete les faces du Display pour publier.`;

  // ── Previews avant/après ─────────────────────────────────────
  const beforePreview =
    studioBeforeThumb ??
    studioAfterThumb ??
    studioBeforeUrl ??
    studioAfterUrl ??
    "/images/magic-clock-bear/before.jpg";
  const afterPreview =
    studioAfterThumb ??
    studioBeforeThumb ??
    studioAfterUrl ??
    studioBeforeUrl ??
    "/images/magic-clock-bear/after.jpg";

  // ── Construction displayState ────────────────────────────────
  const displayState: PreviewDisplay = {
    creatorName: currentCreator.name,
    creatorInitials: initials,
    creatorAvatarUrl: creatorProfile.avatarUrl ?? undefined,
    faces: segments.map((seg): PreviewFace => {
      const details = faceDetails[seg.id];
      const coverFromCube =
        seg.mediaUrl && seg.mediaType
          ? ({
              type: seg.mediaType as MediaKind,
              url: seg.mediaUrl,
              thumbnailUrl: seg.thumbnailUrl ?? null,
            } satisfies PreviewMedia)
          : undefined;
      const faceTitle = seg.description?.trim() || seg.label;
      if (details) {
        const allNotes = details.segments
          .map((s) => (s.notes ?? "").trim())
          .filter(Boolean)
          .join("\n\n");
        const firstFromDetails = (() => {
          const firstWithMedia = details.segments.find(
            (s) => (s.media?.length ?? 0) > 0
          );
          const m = firstWithMedia?.media?.[0];
          return m
            ? ({ type: m.type as MediaKind, url: m.url } satisfies PreviewMedia)
            : undefined;
        })();
        return {
          title: faceTitle,
          notes: allNotes,
          coverMedia: coverFromCube ?? firstFromDetails,
          segments: details.segments.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description ?? "",
            notes: s.notes ?? "",
            media: (s.media ?? []).map((m) => ({
              type: m.type as MediaKind,
              url: m.url,
            })),
          })),
        };
      }
      const mediaArray: PreviewMedia[] =
        seg.mediaUrl && seg.mediaType
          ? [{ type: seg.mediaType as MediaKind, url: seg.mediaUrl, thumbnailUrl: seg.thumbnailUrl ?? null }]
          : [];
      return {
        title: faceTitle,
        notes: seg.notes ?? "",
        coverMedia: coverFromCube ?? mediaArray[0],
        segments: [{
          id: seg.id,
          title: seg.label,
          description: seg.description,
          notes: seg.notes ?? "",
          media: mediaArray,
        }],
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
          hasMedia: hasExistingMedia || !!media,
          mediaType: hasExistingMedia ? seg.mediaType : ((media?.type as MediaType | undefined) ?? seg.mediaType),
          mediaUrl: hasExistingMedia ? seg.mediaUrl : media?.url ?? seg.mediaUrl,
        };
      })
    );
    setFaceDetails((prev) => ({ ...prev, [faceId]: payload }));
    const coveredFromDetails = faceSegments.some(
      (s) => (s.notes?.trim().length ?? 0) > 0 || (s.media?.length ?? 0) > 0
    );
    const universalContentCompleted =
      coveredFromDetails &&
      faceSegments.slice(0, segmentCount).every(
        (s) => (s.notes?.trim().length ?? 0) > 0 || (s.media?.length ?? 0) > 0
      );
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

  async function handleMediaFileChange(event: ChangeEvent<HTMLInputElement>, type: MediaType) {
    const file = event.target.files?.[0];
    if (!file) return;
    const targetFaceId = uploadFaceIdRef.current ?? selectedSegment?.id ?? null;
    if (!targetFaceId) { event.target.value = ""; return; }
    const localUrl = URL.createObjectURL(file);
    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === targetFaceId ? { ...seg, hasMedia: true, mediaType: type, mediaUrl: localUrl } : seg
      )
    );
    if (type === "file") { uploadFaceIdRef.current = null; event.target.value = ""; return; }
    try {
      const result = await processAndUpload(file, "display", String(targetFaceId), (phase) => {
        console.log(`[Display] Face ${targetFaceId} — Upload phase:`, phase);
      });
      if (result.kind === "video") {
        setSegments((prev) =>
          prev.map((seg) =>
            seg.id === targetFaceId ? { ...seg, mediaUrl: result.cdnUrl, thumbnailUrl: result.thumbnailCdnUrl } : seg
          )
        );
      } else {
        setSegments((prev) =>
          prev.map((seg) =>
            seg.id === targetFaceId ? { ...seg, mediaUrl: result.cdnUrl, thumbnailUrl: null } : seg
          )
        );
      }
    } catch (err) {
      console.error("[Display] Upload R2 failed:", err);
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

  // ── Publication ───────────────────────────────────────────────
  const handleFinalPublish = async () => {
    if (!canPublish || isPublishing) return;

    // ✅ Validation CDN URLs avant envoi
    const finalBeforeUrl = sanitizeMediaUrl(studioBeforeUrl);
    const finalAfterUrl = sanitizeMediaUrl(studioAfterUrl);

    if (!finalBeforeUrl || !finalAfterUrl) {
      const msg =
        !finalBeforeUrl && !finalAfterUrl
          ? "Les photos AVANT et APRÈS doivent être uploadées avant de publier. Retourne dans le Studio."
          : !finalBeforeUrl
          ? "La photo AVANT n'est pas encore uploadée. Retourne dans le Studio."
          : "La photo APRÈS n'est pas encore uploadée. Retourne dans le Studio.";
      setPublishError(msg);
      return;
    }

    // ✅ Validation PPV
    if (effectiveMode === "PPV") {
      const price = effectivePpvPrice ?? 0;
      if (price <= 0) {
        setPublishError("Le prix PayPerView doit être supérieur à 0 CHF.");
        return;
      }
    }

    setPublishError(null);
    setIsPublishing(true);

    try {
      const workId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`;

      addCreatedWork({ id: workId, title: effectiveTitle || "Magic Clock", hashtags: effectiveHashtags, mode: effectiveMode });

      const titleForWork = effectiveTitle || "Magic Clock";

      const lightDisplay = {
        faces: displayState.faces.map((face) => ({
          title: face.title,
          notes: face.notes ?? "",
          coverUrl: face.coverMedia?.url && !face.coverMedia.url.startsWith("blob:") && !face.coverMedia.url.startsWith("data:") ? face.coverMedia.url : null,
          coverType: face.coverMedia?.type ?? null,
          segments: face.segments.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description ?? "",
            notes: s.notes ?? "",
            media: (s.media ?? [])
              .filter((m) => m.url && !m.url.startsWith("blob:") && !m.url.startsWith("data:"))
              .map((m) => ({ type: m.type, url: m.url, filename: (m as any).filename ?? undefined })),
            mediaCount: (s.media ?? []).filter((m) => m.url && !m.url.startsWith("blob:") && !m.url.startsWith("data:")).length,
          })),
        })),
      };

      const workPayload = {
        id: workId,
        title: titleForWork,
        mode: effectiveMode,
        hashtags: effectiveHashtags,
        studio: {
          title: titleForWork,
          mode: effectiveMode,
          ppvPrice: effectiveMode === "PPV" ? (effectivePpvPrice ?? null) : null,
          hashtags: effectiveHashtags,
          beforeUrl: finalBeforeUrl,
          afterUrl: finalAfterUrl,
          beforeCoverTime: studioBeforeCover,
          afterCoverTime: studioAfterCover,
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

        const json = await res.json().catch(() => ({}));

        if (res.ok) {
          slug = json?.slug ?? generatedSlug;
          console.log("[MagicClock] ✅ Publié en Supabase :", json?.id);
          setPublishSuccess(true);
        } else {
          // ✅ Erreur visible — jamais silencieuse
          const errMsg = json?.error ?? `Erreur serveur (${res.status}). Ton Magic Clock n'a pas été sauvegardé. Réessaie.`;
          console.error("[MagicClock] ❌ Erreur publication :", errMsg);
          setPublishError(errMsg);
          setIsPublishing(false);
          return; // ✅ Pas de redirect si échec
        }
      } catch (publishErr) {
        const errMsg = "Connexion impossible. Vérifie ta connexion et réessaie.";
        console.error("[MagicClock] ❌ Network error :", publishErr);
        setPublishError(errMsg);
        setIsPublishing(false);
        return;
      }

      // ✅ Nettoyer localStorage uniquement si succès
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

  // ── Retour public ─────────────────────────────────────────────
  return {
    currentCreator,
    initials,
    creatorAvatar,
    creatorHandle,
    studioBeforeUrl,
    studioAfterUrl,
    beforePreview,
    afterPreview,
    effectiveTitle,
    effectiveMode,
    effectivePpvPrice,
    effectiveHashtags,
    accessLabel,
    isLockedPreview,
    segments,
    selectedId,
    selectedSegment,
    faceUniversalProgress,
    faceDetails,
    showPreview,
    setShowPreview,
    isFaceDetailOpen,
    setIsFaceDetailOpen,
    isOptionsOpen,
    setIsOptionsOpen,
    isDuplicateOpen,
    setIsDuplicateOpen,
    isPublishing,
    publishError,
    setPublishError,
    publishSuccess,
    studioFacesCompleted,
    studioPartDisplay,
    displayPart,
    clampedPublishPercent,
    canPublish,
    publishHelperText,
    totalPercentDisplay,
    displayState,
    photoInputRef,
    videoInputRef,
    fileInputRef,
    handleFaceEditorChange,
    handleCubeFaceSelect,
    handleListFaceSelect,
    handleCircleFaceClick,
    handleChooseMedia,
    handleMediaFileChange,
    handleApplyTemplate,
    handleResetCube,
    handleFinalPublish,
    handleOpenFaceDetail: () => { if (selectedSegment) setIsFaceDetailOpen(true); },
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
