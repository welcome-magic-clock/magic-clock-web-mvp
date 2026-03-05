// app/studio/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Hash, ArrowUpRight } from "lucide-react";
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import { processAndUpload } from "@/lib/mediaCompressor";

type MediaKind = "image" | "video";

type MediaState = {
  kind: MediaKind | null;
  url: string | null;         // blob: local — uniquement pour la preview UI
  cdnUrl: string | null;      // ⚡️ URL R2 CDN permanente — seule URL persistée en base
  duration: number | null;
  coverTime: number | null;
  thumbnailUrl: string | null;      // blob: local ou CDN thumbnail pour la preview
  thumbnailCdnUrl: string | null;   // ⚡️ URL R2 CDN du thumbnail — pour la base
};

type PublishMode = "FREE" | "SUB" | "PPV";
type Side = "before" | "after";
type CanvasFormat = "portrait" | "horizontal";

type StudioDraft = {
  canvasFormat: CanvasFormat;
  before: MediaState;
  after: MediaState;
  title: string;
  hashtags: string;
  mode: PublishMode;
  ppvPrice: number;
};

const EMPTY_MEDIA: MediaState = {
  kind: null,
  url: null,
  cdnUrl: null,
  duration: null,
  coverTime: null,
  thumbnailUrl: null,
  thumbnailCdnUrl: null,
};

const STUDIO_DRAFT_KEY = "mc-studio-draft-v2";
const OLD_STUDIO_DRAFT_KEY = "mc-studio-draft-v1";

const MAX_TITLE_LENGTH = 30;
const MAX_HASHTAGS_LENGTH = 30;

export default function MagicStudioPage() {
  const router = useRouter();

  const [canvasFormat, setCanvasFormat] = useState<CanvasFormat>("portrait");
  const [before, setBefore] = useState<MediaState>(EMPTY_MEDIA);
  const [after, setAfter] = useState<MediaState>(EMPTY_MEDIA);
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mode, setMode] = useState<PublishMode>("FREE");
  const [ppvPrice, setPpvPrice] = useState<number>(0.99);
  const [ppvPriceInput, setPpvPriceInput] = useState("0.99");
  const [selectingCoverFor, setSelectingCoverFor] = useState<Side | null>(null);

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const beforeVideoRef = useRef<HTMLVideoElement | null>(null);
  const afterVideoRef = useRef<HTMLVideoElement | null>(null);

  // ── Charger le draft ─────────────────────────────────────────
  useEffect(() => {
    try {
      const legacyRaw = window.localStorage.getItem(OLD_STUDIO_DRAFT_KEY);
      const v2Raw = window.localStorage.getItem(STUDIO_DRAFT_KEY);
      if (!v2Raw && legacyRaw) {
        window.localStorage.setItem(STUDIO_DRAFT_KEY, legacyRaw);
        window.localStorage.removeItem(OLD_STUDIO_DRAFT_KEY);
      }
      const raw = window.localStorage.getItem(STUDIO_DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StudioDraft;
      if (!parsed) return;
      setCanvasFormat(parsed.canvasFormat ?? "portrait");
      // ⚠️ On ne restaure PAS les blob: — invalides après rechargement
      // On restaure uniquement les cdnUrls permanentes
      setBefore({
        ...EMPTY_MEDIA,
        ...parsed.before,
        url: parsed.before?.cdnUrl ?? null,           // afficher la CDN si dispo
        thumbnailUrl: parsed.before?.thumbnailCdnUrl ?? parsed.before?.cdnUrl ?? null,
      });
      setAfter({
        ...EMPTY_MEDIA,
        ...parsed.after,
        url: parsed.after?.cdnUrl ?? null,
        thumbnailUrl: parsed.after?.thumbnailCdnUrl ?? parsed.after?.cdnUrl ?? null,
      });
      setTitle((parsed.title ?? "").slice(0, MAX_TITLE_LENGTH));
      setHashtags((parsed.hashtags ?? "").slice(0, MAX_HASHTAGS_LENGTH));
      setMode(parsed.mode ?? "FREE");
      setPpvPrice(typeof parsed.ppvPrice === "number" ? parsed.ppvPrice : 0.99);
    } catch (error) {
      console.error("Failed to load Magic Studio draft", error);
    }
  }, []);

  // ── Sauvegarder le draft ──────────────────────────────────────
  useEffect(() => {
    try {
      // ⚡️ On ne persiste que les cdnUrls — jamais les blob: (invalides après reload)
      const draftBefore: MediaState = {
        ...before,
        url: before.cdnUrl,           // URL de preview = CDN
        thumbnailUrl: before.thumbnailCdnUrl ?? before.cdnUrl,
      };
      const draftAfter: MediaState = {
        ...after,
        url: after.cdnUrl,
        thumbnailUrl: after.thumbnailCdnUrl ?? after.cdnUrl,
      };
      const draft: StudioDraft = {
        canvasFormat, before: draftBefore, after: draftAfter,
        title, hashtags, mode, ppvPrice,
      };
      window.localStorage.setItem(STUDIO_DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error("Failed to save Magic Studio draft", error);
    }
  }, [canvasFormat, before, after, title, hashtags, mode, ppvPrice]);

  useEffect(() => {
    setPpvPriceInput(ppvPrice.toFixed(2));
  }, [ppvPrice]);

  // ── Gestion médias ────────────────────────────────────────────

  function updateMedia(side: Side, updater: (prev: MediaState) => MediaState) {
    if (side === "before") setBefore((prev) => updater(prev));
    else setAfter((prev) => updater(prev));
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    side: Side,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1) Preview locale immédiate — blob: uniquement pour l'UI
    const localBlob = URL.createObjectURL(file);
    updateMedia(side, (prev) => ({
      ...prev,
      url: localBlob,
      cdnUrl: null,                    // pas encore uploadé
      kind: file.type.startsWith("video") ? "video" : "image",
    }));

    // 2) Compression + upload R2 en arrière-plan
    try {
      const result = await processAndUpload(file, "studio", undefined, (phase) => {
        console.log("[Studio] Upload phase:", phase);
      });

      if (result.kind === "image") {
        updateMedia(side, (prev) => ({
          ...prev,
          // ⚡️ cdnUrl = URL R2 permanente — c'est elle qui sera persistée
          cdnUrl: result.cdnUrl,
          thumbnailCdnUrl: result.cdnUrl,
          // url reste le blob local pour la preview fluide
          thumbnailUrl: result.cdnUrl,
        }));
      } else {
        updateMedia(side, (prev) => ({
          ...prev,
          cdnUrl: result.cdnUrl,
          thumbnailCdnUrl: result.thumbnailCdnUrl ?? result.cdnUrl,
          duration: result.durationSeconds,
          thumbnailUrl: result.thumbnailCdnUrl ?? result.cdnUrl,
        }));
      }
    } catch (err) {
      console.error("[Studio] Upload R2 failed:", err);
      // Garde le blob local en fallback UI — mais cdnUrl reste null
      // → le bouton "Passer au Display" pourra avertir si cdnUrl est manquant
    }

    event.target.value = "";
  }

  function handleLoadedMetadata(side: Side, event: React.SyntheticEvent<HTMLVideoElement>) {
    const duration = event.currentTarget.duration || 0;
    updateMedia(side, (prev) => ({
      ...prev,
      duration,
      coverTime: prev.coverTime ?? (duration > 0 ? duration / 2 : null),
    }));
  }

  // ── Pont vers Magic Display ───────────────────────────────────

  function handleGoToDisplay() {
    const params = new URLSearchParams();
    const cleanTitle = title.trim().slice(0, MAX_TITLE_LENGTH);
    const rawHashtags = hashtags.trim().slice(0, MAX_HASHTAGS_LENGTH);

    const hashtagArray = rawHashtags.length === 0 ? [] :
      rawHashtags.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

    // ⚡️ mapMedia utilise cdnUrl pour l'URL persistée — jamais le blob:
    // Si l'upload R2 n'est pas encore terminé, on attend (cdnUrl = null = pas prêt)
    const mapMedia = (media: MediaState): StudioForwardPayload["before"] => {
      if (!media.kind) return null;
      // ⚡️ On utilise cdnUrl en priorité — c'est l'URL permanente R2
      // On garde url (blob) uniquement comme preview locale si cdnUrl pas encore dispo
      const permanentUrl = media.cdnUrl ?? null;
      const previewUrl = media.url ?? null;

      return {
        type: media.kind === "video" ? "video" : "photo",
        // ⚡️ url = CDN permanent (sera sauvegardé en base via STUDIO_FORWARD_KEY)
        url: permanentUrl ?? previewUrl ?? "",
        // cdnUrl est déjà dans url (permanentUrl) — pas dans le type StudioForwardMedia
        coverTime: media.coverTime ?? null,
        thumbnailUrl: media.thumbnailCdnUrl ?? media.thumbnailUrl ?? null,
      };
    };

    const payload: StudioForwardPayload = {
      title: cleanTitle,
      mode,
      ppvPrice: mode === "PPV" ? Number(ppvPrice.toFixed(2)) : undefined,
      hashtags: hashtagArray,
      before: mapMedia(before),
      after: mapMedia(after),
    };

    try {
      window.localStorage.setItem(STUDIO_FORWARD_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to persist Magic Studio payload", error);
    }

    if (cleanTitle) params.set("title", cleanTitle);
    if (rawHashtags) params.set("hashtags", rawHashtags);
    params.set("mode", mode);
    params.set("format", canvasFormat);
    if (mode === "PPV") params.set("ppvPrice", ppvPrice.toFixed(2));

    router.push(`/magic-display?${params.toString()}`);
  }

  // ── Couverture vidéo ──────────────────────────────────────────

  function openCoverSelection(side: Side, event?: React.MouseEvent) {
    if (event) event.stopPropagation();
    const media = side === "before" ? before : after;
    if (media.kind !== "video" || !media.url) return;
    setSelectingCoverFor(side);
  }

  function currentMediaForCover() {
    if (selectingCoverFor === "before") return { media: before, videoRef: beforeVideoRef };
    if (selectingCoverFor === "after")  return { media: after,  videoRef: afterVideoRef };
    return { media: null, videoRef: beforeVideoRef };
  }

  function handleCoverSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selectingCoverFor) return;
    const percent = Number(event.target.value);
    const { media, videoRef } = currentMediaForCover();
    const videoEl = videoRef.current;
    if (!media || media.kind !== "video" || !videoEl) return;
    const duration = media.duration ?? videoEl.duration;
    if (!duration || Number.isNaN(duration) || duration === Infinity) return;
    const time = (duration * percent) / 100;
    try { videoEl.pause(); videoEl.currentTime = time; } catch {}
    updateMedia(selectingCoverFor, (prev) => ({ ...prev, coverTime: time }));
  }

  function captureCoverThumbnail(side: Side) {
    const { videoRef } = currentMediaForCover();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth || 720;
    canvas.height = videoEl.videoHeight || 1280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    // thumbnail locale uniquement pour la preview — la thumbnailCdnUrl reste celle de R2
    updateMedia(side, (prev) => ({ ...prev, thumbnailUrl: dataUrl }));
  }

  const coverSliderValue = (() => {
    if (!selectingCoverFor) return 0;
    const { media } = currentMediaForCover();
    if (!media?.duration || !media?.coverTime) return 0;
    return (media.coverTime / media.duration) * 100;
  })();

  // ── PPV helpers ───────────────────────────────────────────────

  const minPpvIndex = 0;
  const maxPpvIndex = 1998;
  const ppvSliderValue = Math.max(minPpvIndex, Math.min(maxPpvIndex, Math.round((ppvPrice - 0.99) / 0.5)));

  function commitPpvPriceFromInput(rawInput: string) {
    const normalized = rawInput.replace(",", ".");
    let value = Number(normalized);
    if (Number.isNaN(value)) { setPpvPriceInput(ppvPrice.toFixed(2)); return; }
    if (value < 0.99) value = 0.99;
    if (value > 999.99) value = 999.99;
    const idx = Math.max(minPpvIndex, Math.min(maxPpvIndex, Math.round((value - 0.99) / 0.5)));
    const finalPrice = Number((0.99 + 0.5 * idx).toFixed(2));
    setPpvPrice(finalPrice);
    setPpvPriceInput(finalPrice.toFixed(2));
  }

  const publishModes: { value: PublishMode; label: string }[] = [
    { value: "FREE", label: "FREE" },
    { value: "SUB", label: "Abonnement" },
    { value: "PPV", label: "PayPerView" },
  ];

  const modeDescription = mode === "FREE"
    ? "Accessible à tous les utilisateurs."
    : mode === "SUB" ? "Réservé à tes abonnés payants."
    : "Débloqué à l'achat pour chaque spectateur (PayPerView).";

  const isPortrait = canvasFormat === "portrait";

  // ⚡️ Upload en cours si une des deux images a un blob mais pas encore de cdnUrl
  const isUploading =
    (before.url?.startsWith("blob:") && !before.cdnUrl) ||
    (after.url?.startsWith("blob:") && !after.cdnUrl);

  return (
    <main className="container max-w-4xl py-8 space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6 space-y-4">
        <header className="mb-2 sm:mb-3">
          <h1 className="text-2xl font-semibold">Magic Studio — Avant / Après</h1>
        </header>

        {/* Toggle Portrait / Horizontal */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-medium">
            <button type="button" onClick={() => setCanvasFormat("portrait")}
              className={`rounded-full px-4 py-1 transition ${isPortrait ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              Portrait
            </button>
            <button type="button" onClick={() => setCanvasFormat("horizontal")}
              className={`rounded-full px-4 py-1 transition ${!isPortrait ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              Horizontal
            </button>
          </div>
        </div>

        {/* CANEVAS AVANT / APRÈS */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className={`relative mx-auto w-full max-w-xl ${isPortrait ? "aspect-[4/5]" : "aspect-[16/9]"}`}>
            <div className={`absolute inset-0 ${isPortrait ? "grid grid-cols-2 divide-x divide-slate-200" : "grid grid-rows-2 divide-y divide-slate-200"}`}>

              {/* AVANT */}
              <button type="button"
                className="relative flex h-full w-full flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                onClick={() => beforeInputRef.current?.click()}>
                {before.url ? (
                  before.kind === "video"
                    ? <video ref={beforeVideoRef} src={before.url} className="h-full w-full object-cover" controls onLoadedMetadata={(e) => handleLoadedMetadata("before", e)} />
                    : <img src={before.url} alt="Avant" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                    <Upload className="h-6 w-6" />
                    <span>Importer photo / vidéo</span>
                    <span className="text-[10px] text-slate-400">AVANT</span>
                  </div>
                )}
                <input ref={beforeInputRef} type="file" accept="image/*,video/*" className="hidden"
                  onChange={(e) => handleFileChange(e, "before")} />
                {/* Indicateur upload en cours */}
                {before.url?.startsWith("blob:") && !before.cdnUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-medium">
                    ⬆️ Upload R2…
                  </div>
                )}
                {before.kind === "video" && before.url && (
                  <button type="button" onClick={(e) => openCoverSelection("before", e)}
                    className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white shadow-sm">
                    Couverture
                  </button>
                )}
              </button>

              {/* APRÈS */}
              <button type="button"
                className="relative flex h-full w-full flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                onClick={() => afterInputRef.current?.click()}>
                {after.url ? (
                  after.kind === "video"
                    ? <video ref={afterVideoRef} src={after.url} className="h-full w-full object-cover" controls onLoadedMetadata={(e) => handleLoadedMetadata("after", e)} />
                    : <img src={after.url} alt="Après" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                    <Upload className="h-6 w-6" />
                    <span>Importer photo / vidéo</span>
                    <span className="text-[10px] text-slate-400">APRÈS</span>
                  </div>
                )}
                <input ref={afterInputRef} type="file" accept="image/*,video/*" className="hidden"
                  onChange={(e) => handleFileChange(e, "after")} />
                {/* Indicateur upload en cours */}
                {after.url?.startsWith("blob:") && !after.cdnUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-medium">
                    ⬆️ Upload R2…
                  </div>
                )}
                {after.kind === "video" && after.url && (
                  <button type="button" onClick={(e) => openCoverSelection("after", e)}
                    className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white shadow-sm">
                    Couverture
                  </button>
                )}
              </button>
            </div>

            {/* Avatar centre neutre */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white shadow-sm">
              <svg viewBox="0 0 100 100" className="h-[72px] w-[72px]" aria-hidden="true">
                <circle cx="50" cy="50" r="48" fill="#E5E7EB" />
                <circle cx="50" cy="38" r="16" fill="#9CA3AF" />
                <path d="M25 74C28 58 37 50 50 50C63 50 72 58 75 74" fill="#9CA3AF" />
              </svg>
            </div>
          </div>
        </div>

        {/* Panneau couverture vidéo */}
        {selectingCoverFor && (
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] text-slate-600">
            <p className="font-medium text-slate-700">
              Choisir la couverture vidéo ({selectingCoverFor === "before" ? "Avant" : "Après"})
            </p>
            <p>Fais glisser le curseur pour choisir l&apos;image qui servira de couverture dans le flux Amazing.</p>
            <div className="mt-1 flex items-center gap-3">
              <input type="range" min={0} max={100} step={1} value={coverSliderValue}
                onChange={handleCoverSliderChange} className="flex-1 accent-brand-500" />
            </div>
            <button type="button"
              onClick={() => { if (selectingCoverFor) captureCoverThumbnail(selectingCoverFor); setSelectingCoverFor(null); }}
              className="mt-2 inline-flex rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-white">
              Terminer le choix de couverture
            </button>
          </div>
        )}

        {/* TITRE, HASHTAGS & MODE */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Titre du Magic Clock</label>
            <input type="text" value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
              placeholder="Balayage caramel lumineux, cheveux longs"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-medium text-slate-700">
              <Hash className="h-3 w-3" /> Hashtags
            </label>
            <input type="text" value={hashtags}
              onChange={(e) => setHashtags(e.target.value.slice(0, MAX_HASHTAGS_LENGTH))}
              placeholder="#balayage #cheveuxblonds #magicclock"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-medium text-slate-700">Mode de publication</label>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium">
                  {publishModes.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setMode(opt.value)}
                      className={`rounded-full px-3 py-1 transition ${mode === opt.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">{modeDescription}</p>
              </div>

              {/* ⚡️ Bouton désactivé si upload R2 encore en cours */}
              <button type="button" onClick={handleGoToDisplay}
                disabled={isUploading}
                title={isUploading ? "Upload en cours, patiente…" : "Passer à Magic Display"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Avertissement upload en cours */}
            {isUploading && (
              <p className="text-[11px] text-amber-600 font-medium">
                ⏳ Upload des médias vers R2 en cours… Patiente avant de passer au Display.
              </p>
            )}
          </div>

          {/* Sélecteur prix PPV */}
          {mode === "PPV" && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-700">Prix PayPerView</label>
              <div className="flex items-center gap-3">
                <input type="range" min={minPpvIndex} max={maxPpvIndex} step={1} value={ppvSliderValue}
                  onChange={(e) => { const idx = Number(e.target.value); setPpvPrice(Number((0.99 + 0.5 * idx).toFixed(2))); }}
                  className="flex-1 accent-brand-500" />
                <div className="w-20 text-right text-xs font-semibold text-slate-700">{ppvPrice.toFixed(2)} CHF</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Ou entre le prix exact :</span>
                <input type="number" min={0.99} max={999.99} step={0.1} value={ppvPriceInput}
                  onChange={(e) => setPpvPriceInput(e.target.value.replace(",", "."))}
                  onBlur={() => commitPpvPriceFromInput(ppvPriceInput)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitPpvPriceFromInput(ppvPriceInput); } }}
                  className="w-24 rounded-full border border-slate-200 px-2 py-1 text-xs text-right shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
                <span className="text-[11px] text-slate-500">CHF</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
