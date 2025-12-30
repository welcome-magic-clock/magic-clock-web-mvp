// app/magic-display/MagicDisplayClient.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
} from "react";

import {
  Camera,
  Clapperboard,
  FileText,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Lock,
  Unlock,
  Heart,
} from "lucide-react";
import { listCreators } from "@/core/domain/repository";
import BackButton from "@/components/navigation/BackButton";
import MagicDisplayFaceEditor from "@/features/display/MagicDisplayFaceEditor";
import MagicCube3D from "@/features/display/MagicCube3D";
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import { computeMagicClockPublishProgress } from "@/features/display/progress";

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

type TemplateId = "BALAYAGE_4" | "COULEUR_3" | "BLOND_6";
type PublishMode = "FREE" | "SUB" | "PPV";

const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 1,
    label: "Face 1",
    description: "Diagnostic / point de départ",
    angleDeg: -90,
    hasMedia: false,
  },
  {
    id: 2,
    label: "Face 2",
    description: "Préparation / sectionnement",
    angleDeg: -30,
    hasMedia: false,
  },
  {
    id: 3,
    label: "Face 3",
    description: "Application principale",
    angleDeg: 30,
    hasMedia: false,
  },
  {
    id: 4,
    label: "Face 4",
    description: "Patine / correction",
    angleDeg: 90,
    hasMedia: false,
  },
  {
    id: 5,
    label: "Face 5",
    description: "Finition / coiffage",
    angleDeg: 150,
    hasMedia: false,
  },
  {
    id: 6,
    label: "Face 6",
    description: "Résultat / conseils maison",
    angleDeg: 210,
    hasMedia: false,
  },
];

const STORAGE_KEY = "mc-display-draft-v1";
const FACE_PROGRESS_KEY = "mc-display-face-progress-v1";

const FALLBACK_BEFORE = "/images/examples/balayage-before.jpg";
const FALLBACK_AFTER = "/images/examples/balayage-after.jpg";

function buildTemplateSegments(template: TemplateId): Segment[] {
  switch (template) {
    case "BALAYAGE_4":
      return [
        {
          id: 1,
          label: "Face 1",
          description: "Diagnostic",
          angleDeg: -90,
          hasMedia: false,
        },
        {
          id: 2,
          label: "Face 2",
          description: "Préparation / sectionnement",
          angleDeg: -30,
          hasMedia: false,
        },
        {
          id: 3,
          label: "Face 3",
          description: "Application",
          angleDeg: 30,
          hasMedia: false,
        },
        {
          id: 4,
          label: "Face 4",
          description: "Patine / finition",
          angleDeg: 90,
          hasMedia: false,
        },
        {
          id: 5,
          label: "Face 5",
          description: "—",
          angleDeg: 150,
          hasMedia: false,
        },
        {
          id: 6,
          label: "Face 6",
          description: "Conseils maison",
          angleDeg: 210,
          hasMedia: false,
        },
      ];
    case "COULEUR_3":
      return [
        {
          id: 1,
          label: "Face 1",
          description: "Diagnostic & choix de la teinte",
          angleDeg: -90,
          hasMedia: false,
        },
        {
          id: 2,
          label: "Face 2",
          description: "Application racines",
          angleDeg: -30,
          hasMedia: false,
        },
        {
          id: 3,
          label: "Face 3",
          description: "Longueurs / pointes",
          angleDeg: 30,
          hasMedia: false,
        },
        {
          id: 4,
          label: "Face 4",
          description: "Finition & gloss",
          angleDeg: 90,
          hasMedia: false,
        },
        {
          id: 5,
          label: "Face 5",
          description: "Photo finale",
          angleDeg: 150,
          hasMedia: false,
        },
        {
          id: 6,
          label: "Face 6",
          description: "Conseils maison",
          angleDeg: 210,
          hasMedia: false,
        },
      ];
    case "BLOND_6":
      return [
        {
          id: 1,
          label: "Face 1",
          description: "Diagnostic & historique",
          angleDeg: -90,
          hasMedia: false,
        },
        {
          id: 2,
          label: "Face 2",
          description: "Pré-lightening / éclaircissement",
          angleDeg: -30,
          hasMedia: false,
        },
        {
          id: 3,
          label: "Face 3",
          description: "Neutralisation / patine",
          angleDeg: 30,
          hasMedia: false,
        },
        {
          id: 4,
          label: "Face 4",
          description: "Finition coiffage",
          angleDeg: 90,
          hasMedia: false,
        },
        {
          id: 5,
          label: "Face 5",
          description: "Résultat final",
          angleDeg: 150,
          hasMedia: false,
        },
        {
          id: 6,
          label: "Face 6",
          description: "Routine maison & entretien",
          angleDeg: 210,
          hasMedia: false,
        },
      ];
  }
}

function statusDotClass(hasMedia: boolean) {
  return hasMedia ? "bg-emerald-500" : "bg-slate-300";
}

function mediaTypeLabel(type?: MediaType) {
  if (type === "photo") return "Photo";
  if (type === "video") return "Vidéo";
  if (type === "file") return "Fichier";
  return "";
}

function renderSegmentIcon(seg: Segment) {
  if (seg.mediaType === "photo") {
    return <Camera className="h-3.5 w-3.5" />;
  }
  if (seg.mediaType === "video") {
    return <Clapperboard className="h-3.5 w-3.5" />;
  }
  if (seg.mediaType === "file") {
    return <FileText className="h-3.5 w-3.5" />;
  }
  return <Plus className="h-3.5 w-3.5" />;
}

function isVideo(url: string) {
  if (!url) return false;

  if (url.startsWith("data:video/")) return true;
  if (url.startsWith("blob:")) return true;

  const clean = url.split("?")[0].toLowerCase();

  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg")
  );
}

function StudioMediaSlot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

// 🔹 Mocks de “vrais” Magic Clock (sera branché sur My Magic Clock plus tard)
const MOCK_CUBES: {
  id: TemplateId;
  title: string;
  subtitle: string;
  meta: string;
}[] = [
  {
    id: "BALAYAGE_4",
    title: "MC — Balayage caramel (4 étapes)",
    subtitle: "Diagnostic, préparation, application, patine / finition.",
    meta: "4/6 faces structurées",
  },
  {
    id: "COULEUR_3",
    title: "MC — Couleur complète",
    subtitle: "Racines, longueurs / pointes, gloss & conseils maison.",
    meta: "3 étapes clés",
  },
  {
    id: "BLOND_6",
    title: "MC — Blond signature",
    subtitle: "Diagnostic, éclaircissement, patine, résultat & entretien.",
    meta: "6/6 faces structurées",
  },
];

export default function MagicDisplayClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔍 Infos texte venant de Magic Studio (query params)
  const titleFromStudio = searchParams.get("title") ?? "";
  const modeFromStudioParam =
    (searchParams.get("mode") as PublishMode | null) ?? null;
  const ppvPriceFromStudio = searchParams.get("ppvPrice");
  const hashtagsParam =
    searchParams.get("hashtags") ?? searchParams.get("hashtag") ?? "";

  // 🔗 Hashtags depuis l’URL
  const hashtagTokensFromQuery = hashtagsParam
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
    .filter((tag) => tag.length > 0)
    .map((tag) => `#${tag}`);

  // 👩‍🎨 créateur (Aiko par défaut)
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];
  const initials = currentCreator.name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const creatorAvatar = currentCreator.avatar;
  const creatorHandleRaw = (currentCreator as any).handle ?? "@aiko_tanaka";
  const creatorHandle = creatorHandleRaw.startsWith("@")
    ? creatorHandleRaw
    : `@${creatorHandleRaw}`;

  // 🔁 Payload complet Magic Studio (localStorage)
  const [studioBeforeUrl, setStudioBeforeUrl] = useState<string | null>(null);
  const [studioAfterUrl, setStudioAfterUrl] = useState<string | null>(null);
  const [studioBeforeCover, setStudioBeforeCover] =
    useState<number | null>(null);
  const [studioAfterCover, setStudioAfterCover] =
    useState<number | null>(null);
  const [studioBeforeThumb, setStudioBeforeThumb] = useState<string | null>(
    null,
  );
  const [studioAfterThumb, setStudioAfterThumb] = useState<string | null>(null);

  const [bridgeTitle, setBridgeTitle] = useState("");
  const [bridgeMode, setBridgeMode] = useState<PublishMode | null>(null);
  const [bridgePpvPrice, setBridgePpvPrice] = useState<number | null>(null);
  const [bridgeHashtags, setBridgeHashtags] = useState<string[]>([]);

  // 🔵 Progrès détaillé par face (pastilles internes vertes)
  const [faceUniversalProgress, setFaceUniversalProgress] = useState<
    Record<
      string,
      {
        coveredFromDetails?: boolean;
        universalContentCompleted?: boolean;
      }
    >
  >({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_FORWARD_KEY);
      if (!raw) return;

      const payload = JSON.parse(raw) as StudioForwardPayload;

      if (payload.before?.url) {
        setStudioBeforeUrl(payload.before.url);
        if (typeof payload.before.coverTime === "number") {
          setStudioBeforeCover(payload.before.coverTime);
        }
      }
      if (payload.before?.thumbnailUrl) {
        setStudioBeforeThumb(payload.before.thumbnailUrl);
      }

      if (payload.after?.url) {
        setStudioAfterUrl(payload.after.url);
        if (typeof payload.after.coverTime === "number") {
          setStudioAfterCover(payload.after.coverTime);
        }
      }
      if (payload.after?.thumbnailUrl) {
        setStudioAfterThumb(payload.after.thumbnailUrl);
      }

      if (payload.title) setBridgeTitle(payload.title);
      if (payload.mode) setBridgeMode(payload.mode as PublishMode);
      if (typeof payload.ppvPrice === "number") {
        setBridgePpvPrice(payload.ppvPrice);
      }
      if (Array.isArray(payload.hashtags)) {
        setBridgeHashtags(payload.hashtags);
      }
    } catch (error) {
      console.error("Failed to read Magic Studio payload", error);
    }
  }, []);

  // Charger les infos de progression des faces (pastilles internes)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FACE_PROGRESS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setFaceUniversalProgress(parsed);
      }
    } catch (error) {
      console.error("Failed to read face universal progress", error);
    }
  }, []);

  // 🎯 Valeurs “effectives” (URL + localStorage)
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
    effectiveMode === "FREE"
      ? "FREE"
      : effectiveMode === "SUB"
      ? "Abonnement"
      : "PayPerView";
  const isLockedPreview = effectiveMode !== "FREE";

  // 🧠 état local des faces & menus
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isFaceDetailOpen, setIsFaceDetailOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);

  const selectedSegment = segments.find((s) => s.id === selectedId) ?? null;

  // 🔵 État de publication (bouton sous le cube)
  const [isPublishing, setIsPublishing] = useState(false);

  // 📥 inputs cachés pour les médias
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🧬 Charger le draft du cube depuis localStorage (structure uniquement)
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

  // 💾 Sauvegarder la structure du cube à chaque modification
  useEffect(() => {
    try {
      const toPersist = segments.map((seg) => ({
        id: seg.id,
        label: seg.label,
        description: seg.description,
        angleDeg: seg.angleDeg,
        hasMedia: seg.hasMedia,
        mediaType: seg.mediaType ?? undefined,
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch (error) {
      console.error("Failed to save Magic Display draft to storage", error);
    }
  }, [segments]);

  // 🎯 Sélection depuis le cube 3D → ouvre directement la Face universelle
  function handleCubeFaceSelect(id: number | null) {
    if (id == null) {
      setSelectedId(null);
      setIsFaceDetailOpen(false);
      return;
    }
    setSelectedId(id);
    setIsFaceDetailOpen(true);
  }

  // 🎯 Sélection depuis la liste → juste sélectionner
  function handleListFaceSelect(id: number | null) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  // 🎯 Clic sur le cercle → sélection + éventuel upload
  function handleCircleFaceClick(seg: Segment) {
    setSelectedId(seg.id);
    if (!seg.hasMedia && photoInputRef.current) {
      photoInputRef.current.click();
    }
  }

  function handleChooseMedia(type: MediaType) {
    if (!selectedSegment) return;

    if (type === "photo") {
      photoInputRef.current?.click();
    } else if (type === "video") {
      videoInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  }

  function handleMediaFileChange(
    event: ChangeEvent<HTMLInputElement>,
    type: MediaType,
  ) {
    const file = event.target.files?.[0];
    if (!file || !selectedSegment) return;

    const url = URL.createObjectURL(file);

    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === selectedSegment.id
          ? {
              ...seg,
              hasMedia: true,
              mediaType: type,
              mediaUrl: url,
            }
          : seg,
      ),
    );

    event.target.value = "";
  }

  function handleOpenFaceDetail() {
    if (!selectedSegment) return;
    setIsFaceDetailOpen(true);
  }

  function handleCloseFaceDetail() {
    setIsFaceDetailOpen(false);
  }

  // 🎛 Appliquer un modèle pré-conçu (ou un cube mock) depuis le menu Options
  function handleApplyTemplate(template: TemplateId) {
    const next = buildTemplateSegments(template);
    setSegments(next);
    setSelectedId(null);
    setIsDuplicateOpen(false);
    setIsOptionsOpen(false);
  }

  // ♻️ Réinitialiser entièrement le cube
  function handleResetCube() {
    setSegments(INITIAL_SEGMENTS);
    setSelectedId(null);
    setIsDuplicateOpen(false);
    setIsOptionsOpen(false);
  }

  // 🔄 Quand la Face universelle est ouverte, on affiche UNIQUEMENT l'éditeur
  if (isFaceDetailOpen && selectedSegment) {
    return (
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
        <MagicDisplayFaceEditor
          creatorName={currentCreator.name}
          creatorAvatar={creatorAvatar}
          creatorInitials={initials}
          faceId={selectedSegment.id}
          faceLabel={selectedSegment.label}
          onBack={handleCloseFaceDetail}
        />
      </main>
    );
  }

  // Fallback images si rien venant du Studio
  const beforePreview =
    studioBeforeThumb ??
    studioAfterThumb ??
    studioBeforeUrl ??
    studioAfterUrl ??
    FALLBACK_BEFORE;

  const afterPreview =
    studioAfterThumb ??
    studioBeforeThumb ??
    studioAfterUrl ??
    studioBeforeUrl ??
    FALLBACK_AFTER;

  // Stats mock pour l’aperçu public
  const mockViews = 0;
  const mockLikes = 0;

    // 🧮 Progression de publication (Studio + Display)
  const faceProgressInput = segments.map((seg) => {
    const meta = faceUniversalProgress[String(seg.id)] ?? {};

    const covered =
      seg.hasMedia ||
      Boolean(meta.coveredFromDetails || meta.universalContentCompleted);

    const universalContent =
      covered && Boolean(meta.universalContentCompleted);

    return {
      id: seg.id,
      covered,
      universalContent,
    };
  });

  // Studio complété = payload Magic Studio présent (MVP)
  const hasStudioPayload =
    // Médias réels ou miniatures
    studioBeforeUrl ||
    studioAfterUrl ||
    studioBeforeThumb ||
    studioAfterThumb ||
    // Données bridgées (localStorage)
    bridgeTitle ||
    bridgeMode ||
    (Array.isArray(bridgeHashtags) && bridgeHashtags.length > 0) ||
    // Données arrivant directement par l'URL (query params)
    titleFromStudio ||
    modeFromStudioParam ||
    (hashtagsParam && hashtagsParam.trim().length > 0) ||
    (hashtagTokensFromQuery.length > 0);

  // 🔢 On calcule combien de faces Studio sont vraiment complétées (Avant / Après)
  const studioFacesCompleted = [
    studioBeforeUrl || studioBeforeThumb,
    studioAfterUrl || studioAfterThumb,
  ].filter(Boolean).length;

  // 0% si aucune face, 20% par face complétée, max 40%
  const studioPartDisplay = Math.min(40, studioFacesCompleted * 20);

  const studioCompleted = studioFacesCompleted === 2;

  const {
    percent: _percent,          // on ne l’utilise plus
    studioPart: _studioPart,    // idem
    displayPart,
    completedFaces,
    partialFaces,
  } = computeMagicClockPublishProgress({
    studioCompleted,
    faces: faceProgressInput,
  });

  const totalPercentDisplay = studioPartDisplay + displayPart;

  // 🔒 Barre = Studio (0/20/40) + Display (0 → 60)
  const clampedPublishPercent = Math.max(
    0,
    Math.min(100, totalPercentDisplay),
  );
  const canPublish = clampedPublishPercent >= 100;

  const studioStatusLabel =
    studioFacesCompleted === 2 ? "Studio complété" : "Studio incomplet";

  let publishHelperText: string;
  if (canPublish) {
    publishHelperText = "Tout est prêt, tu peux publier ton Magic Clock ✨";
  } else {
    // Nouveau texte demandé
    publishHelperText = `${studioStatusLabel} · Termine ton Display pour publier.`;
  }

  const handleFinalPublish = () => {
    if (!canPublish || isPublishing) return;
    setIsPublishing(true);
    try {
      router.push("/mymagic?tab=created&source=magic-display");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* ⭐️ Une seule grande carte Magic Display */}
      <section className="mb-6 flex min-h-[calc(100vh-7rem)] flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">
        {/* Ligne 1 : Back + titre + Options */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BackButton fallbackHref="/studio" label="Retour" />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
                Magic Display
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOptionsOpen(true);
              setIsDuplicateOpen(false);
            }}
            aria-label="Ouvrir les options du cube"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* 🔎 Carte d’aperçu Magic Studio */}
        <section className="mb-2">
          <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm">
            <button
              type="button"
              onClick={() =>
                router.push("/mymagic?tab=created&source=magic-display")
              }
              className="block w-full text-left"
            >
              {/* Canevas Avant / Après */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
                  <div className="grid h-full w-full grid-cols-2">
                    <StudioMediaSlot
                      src={beforePreview}
                      alt={`${effectiveTitle || "Magic Studio"} - Avant`}
                    />
                    <StudioMediaSlot
                      src={afterPreview}
                      alt={`${effectiveTitle || "Magic Studio"} - Après`}
                    />
                  </div>

                  {/* Ligne centrale */}
                  <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />

                  {/* Avatar centré */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-white/10 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={creatorAvatar}
                        alt={currentCreator.name}
                        className="h-[72px] w-[72px] rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Flèche en haut à droite */}
                  <div className="pointer-events-none absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Bas de carte : créateur + vues + likes + accès + titre + hashtags */}
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
                  <span className="font-medium">{currentCreator.name}</span>
                  <span className="text-slate-400">{creatorHandle}</span>

                  <span className="h-[3px] w-[3px] rounded-full bg-slate-300" />

                  <span>
                    <span className="font-medium">
                      {mockViews.toLocaleString("fr-CH")}
                    </span>{" "}
                    vues
                  </span>

                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{mockLikes}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    {isLockedPreview ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                    <span>{accessLabel}</span>
                    {effectiveMode === "PPV" && effectivePpvPrice != null && (
                      <span className="ml-1 text-[11px] text-slate-500">
                        · {effectivePpvPrice.toFixed(2)} CHF
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                  {effectiveTitle && (
                    <span className="font-medium text-slate-800">
                      {effectiveTitle}
                    </span>
                  )}

                  {effectiveHashtags.length > 0 ? (
                    effectiveHashtags.map((tag) => (
                      <span key={tag} className="text-brand-600">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="text-brand-600">#coiffure</span>
                      <span className="text-brand-600">#color</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          </article>
        </section>

        {/* Bloc cercle + cube + liste */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {/* Cercle de contrôle des faces */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-72 w-72 flex-shrink-0 items-center justify-center">
              <div
                className="relative h-72 w-72 rounded-full border border-slate-200 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb 45%, #e2e8f0 75%)",
                }}
              >
                {/* Avatar central */}
                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-slate-900 shadow-xl shadow-slate-900/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={creatorAvatar}
                    alt={currentCreator.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Boutons-faces autour du cercle */}
                {segments.map((seg) => {
                  const radiusPercent = 40;
                  const rad = (seg.angleDeg * Math.PI) / 180;
                  const top = 50 + Math.sin(rad) * radiusPercent;
                  const left = 50 + Math.cos(rad) * radiusPercent;
                  const isSelected = seg.id === selectedId;

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => handleCircleFaceClick(seg)}
                      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                          : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
                      }`}
                      style={{ top: `${top}%`, left: `${left}%` }}
                      aria-label={`Face ${seg.label}`}
                    >
                      {renderSegmentIcon(seg)}
                      <span
                        className={`absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border border-white ${statusDotClass(
                          seg.hasMedia,
                        )}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne droite : cube 3D + bouton + liste */}
          <div className="flex-1 space-y-4">
            <MagicCube3D
              segments={segments}
              selectedId={selectedId}
              onSelect={handleCubeFaceSelect}
            />

                        {/* Bouton de publication global – ultra épuré & brand */}
<div className="mt-2">
  <button
    type="button"
    onClick={handleFinalPublish}
    disabled={!canPublish || isPublishing}
    className="flex w-full flex-col items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-slate-50 shadow-md shadow-slate-900/40 transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
  >
    <span className="whitespace-nowrap">
      Publier sur Amazing + My Magic Clock
    </span>

    {/* Ligne de progression ultra fine */}
    <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-slate-700/40">
      <div
        className="h-full rounded-full bg-emerald-400 transition-[width]"
        style={{ width: `${clampedPublishPercent}%` }}
      />
    </div>
  </button>

  <div className="mt-2 text-[11px] text-slate-500">
    <p>{publishHelperText}</p>
    <p className="mt-0.5 text-[10px] text-slate-400">
      Studio : {studioPartDisplay}% · Display : {displayPart}% · Total :{" "}
      {Math.round(totalPercentDisplay)}%
    </p>
  </div>
</div>

            {/* Liste des faces */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Faces de ce cube Magic Clock
              </h2>
              <p className="text-xs text-slate-500">
                Chaque ligne correspond à une face. Sélectionne une face pour
                compléter son contenu.
              </p>
              <div className="space-y-2">
                {segments.map((seg) => {
                  const isSelected = seg.id === selectedId;
                  const label = mediaTypeLabel(seg.mediaType);

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => handleListFaceSelect(seg.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition ${
                        isSelected
                          ? "border-brand-500 bg-brand-50/70"
                          : "border-transparent bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">
                          {seg.label}
                          {seg.hasMedia && label ? ` · ${label}` : ""}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                          {seg.description}
                        </p>
                      </div>
                      <span
                        className={`ml-2 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${statusDotClass(
                          seg.hasMedia,
                        )}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Panneau d’action face sélectionnée */}
        {selectedSegment && (
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 sm:px-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Face sélectionnée
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedSegment.label}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedSegment.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleChooseMedia("photo")}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Ajouter une photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChooseMedia("video")}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
                >
                  <Clapperboard className="h-3.5 w-3.5" />
                  <span>Ajouter une vidéo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChooseMedia("file")}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Ajouter un fichier</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenFaceDetail}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-500 bg-brand-50 px-3 py-1.5 text-[11px] font-medium text-brand-700 hover:bg-brand-100"
                >
                  <span>Ouvrir la face en détail</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Options (bottom sheet) */}
        {isOptionsOpen && (
          <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
            {/* Overlay */}
            <button
              type="button"
              aria-label="Fermer le menu Options"
              onClick={() => {
                setIsOptionsOpen(false);
                setIsDuplicateOpen(false);
              }}
              className="absolute inset-0 bg-slate-900/40"
            />

            {/* Bottom sheet */}
            <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-4 shadow-xl sm:rounded-3xl sm:p-6">
              {/* En-tête */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Options du cube
                  </p>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Magic Clock affichage &amp; structure
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsOpen(false);
                    setIsDuplicateOpen(false);
                  }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>

              <div className="space-y-5 text-xs text-slate-700">
                {/* Bloc 1 – Modèles pré-conçus */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Modèles pré-conçus
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Applique une structure prête pour gagner du temps. Tu pourras
                    toujours modifier les titres et descriptions de chaque face.
                  </p>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate("BALAYAGE_4")}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Balayage en 4 étapes
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Diagnostic, préparation, application, patine / finition.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate("COULEUR_3")}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Couleur complète en 3 étapes
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Racines, longueurs / pointes, finition &amp; conseils maison.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate("BLOND_6")}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Blond signature (6 faces)
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Idéal pour les transformations premium et contenus pédagogiques.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bloc 2 – Gestion du cube */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Gestion du cube
                  </p>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setIsDuplicateOpen((prev) => !prev)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Dupliquer depuis un autre Magic Clock
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Reprend la structure d’un cube existant (faces &amp; titres).
                        </p>
                      </div>
                    </button>

                    {isDuplicateOpen && (
                      <div className="mt-2 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[11px] font-semibold text-slate-600">
                          Choisis un Magic Clock d&apos;exemple
                        </p>

                        {MOCK_CUBES.map((cube) => (
                          <button
                            key={cube.id}
                            type="button"
                            onClick={() => handleApplyTemplate(cube.id)}
                            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-50"
                          >
                            <div>
                              <p className="font-medium text-slate-900">
                                {cube.title}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {cube.subtitle}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              {cube.meta}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleResetCube}
                      className="flex w-full items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-rose-700 hover:border-rose-300 hover:bg-rose-100"
                    >
                      <div>
                        <p className="font-medium">Réinitialiser ce cube</p>
                        <p className="text-[11px]">
                          Effacer tous les médias et le contenu des faces. Action définitive.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bloc 3 – Astuce */}
                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <p className="text-[11px] text-slate-500">
                    Astuce : commence par préparer un modèle, puis ajoute les photos / vidéos
                    face par face. Tu peux ensuite affiner chaque face en détail depuis le
                    panneau “Face sélectionnée”.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Inputs cachés upload */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "photo")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "video")}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        className="hidden"
        onChange={(e) => handleMediaFileChange(e, "file")}
      />
    </main>
  );
}
