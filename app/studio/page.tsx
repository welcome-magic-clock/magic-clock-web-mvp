// app/studio/page.tsx
// ✅ v2.4 — Turnstile anti-bot intégré
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, Hash, ArrowUpRight, X, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { STUDIO_FORWARD_KEY, type StudioForwardPayload } from "@/core/domain/magicStudioBridge";
import { processAndUpload } from "@/lib/mediaCompressor";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";

// ── Avatar créateur au centre du canevas ─────────────────────
function StudioAvatarCenter({ userId }: { userId: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Magic Clock");
  useEffect(() => {
    const sb = getSupabaseBrowser();
    sb.from("profiles")
      .select("avatar_url, display_name, handle")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.display_name) setDisplayName(data.display_name);
        else if (data.handle) setDisplayName(data.handle);
      });
  }, [userId]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <div className="overflow-hidden rounded-full bg-white/20 shadow-md backdrop-blur-sm"
      style={{ width: 80, height: 80, border: "2.5px solid white" }}>
      <img src={avatarUrl ?? "/images/magic-clock-bear/avatar.png"} alt="Mon profil" className="h-full w-full object-cover" />
    </div>
  );
}

type MediaKind = "image" | "video";
type MediaState = {
  kind: MediaKind | null; url: string | null; cdnUrl: string | null;
  duration: number | null; coverTime: number | null;
  thumbnailUrl: string | null; thumbnailCdnUrl: string | null;
};
type PublishMode = "FREE" | "SUB" | "PPV";
type Side = "before" | "after";
type CanvasFormat = "portrait" | "horizontal";
type StudioDraft = {
  canvasFormat: CanvasFormat; before: MediaState; after: MediaState;
  title: string; hashtags: string; mode: PublishMode; ppvPrice: number;
};

const EMPTY_MEDIA: MediaState = { kind: null, url: null, cdnUrl: null, duration: null, coverTime: null, thumbnailUrl: null, thumbnailCdnUrl: null };
const STUDIO_DRAFT_KEY = "mc-studio-draft-v2";
const OLD_STUDIO_DRAFT_KEY = "mc-studio-draft-v1";
const MAX_TITLE_LENGTH = 30;
const MAX_HASHTAGS_LENGTH = 30;

function isCdnUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.length > 0 && !url.startsWith("data:") && !url.startsWith("blob:");
}
function sanitizeMediaState(m: Partial<MediaState>): MediaState {
  const cdnUrl = isCdnUrl(m.cdnUrl) ? m.cdnUrl : null;
  const thumbnailCdnUrl = isCdnUrl(m.thumbnailCdnUrl) ? m.thumbnailCdnUrl : null;
  const thumbnailUrl = thumbnailCdnUrl ?? (isCdnUrl(m.thumbnailUrl) ? m.thumbnailUrl : null);
  return { kind: m.kind ?? null, url: cdnUrl, cdnUrl, thumbnailUrl, thumbnailCdnUrl, duration: m.duration ?? null, coverTime: m.coverTime ?? null };
}

// ── Modale visiteur ──────────────────────────────────────────
function PublishAuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" onClick={e => e.stopPropagation()}>
        <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <div className="px-6 pb-10 pt-6">
          <div className="mb-5 flex justify-end">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"><X className="h-4 w-4" /></button>
          </div>
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 shadow-lg"><Sparkles className="h-8 w-8 text-white" /></div>
          </div>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-900">Publie ton Magic Clock ✨</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">Connecte-toi ou crée un compte pour publier ta transformation sur Amazing.</p>
          </div>
          <div className="mb-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
            {[
              "Ton Magic Clock en cours sera sauvegardé sur ton profil",
              "Publie gratuitement — MODE FREE sans engagement",
              "Accès à ta bibliothèque, tes stats et ta monétisation",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <p className="text-[13px] text-slate-600 leading-snug">{point}</p>
              </div>
            ))}
          </div>
          <Link href="/auth?next=/studio" className="mc-btn-primary flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold">
            <Sparkles className="h-4 w-4" /> Se connecter pour publier
          </Link>
          <p className="mt-4 text-center text-[12px] text-slate-400">Nouveau ? Un compte est créé automatiquement. ✨</p>
          <p className="mt-6 text-center text-[11px] text-slate-300">Magic Clock — It&apos;s time to smile</p>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ──────────────────────────────────────────
export default function MagicStudioPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [canvasFormat, setCanvasFormat] = useState<CanvasFormat>("portrait");
  const [before, setBefore] = useState<MediaState>(EMPTY_MEDIA);
  const [after, setAfter] = useState<MediaState>(EMPTY_MEDIA);
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mode, setMode] = useState<PublishMode>("FREE");
  const [ppvPrice, setPpvPrice] = useState<number>(0.99);
  const [ppvPriceInput, setPpvPriceInput] = useState("0.99");
  // ── Turnstile anti-bot ────────────────────────────────────
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [selectingCoverFor, setSelectingCoverFor] = useState<Side | null>(null);
  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const beforeVideoRef = useRef<HTMLVideoElement | null>(null);
  const afterVideoRef = useRef<HTMLVideoElement | null>(null);

  // ── Draft load ───────────────────────────────────────────
  useEffect(() => {
    try {
      const legacyRaw = window.localStorage.getItem(OLD_STUDIO_DRAFT_KEY);
      if (legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw) as StudioDraft;
          const cleanBefore = sanitizeMediaState(legacy.before ?? {});
          const cleanAfter = sanitizeMediaState(legacy.after ?? {});
          if (isCdnUrl(cleanBefore.cdnUrl) || isCdnUrl(cleanAfter.cdnUrl)) {
            window.localStorage.setItem(STUDIO_DRAFT_KEY, JSON.stringify({ ...legacy, before: cleanBefore, after: cleanAfter }));
          }
        } catch {}
        window.localStorage.removeItem(OLD_STUDIO_DRAFT_KEY);
      }
      const raw = window.localStorage.getItem(STUDIO_DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StudioDraft;
      if (!parsed) return;
      setCanvasFormat(parsed.canvasFormat ?? "portrait");
      setBefore(sanitizeMediaState(parsed.before ?? {}));
      setAfter(sanitizeMediaState(parsed.after ?? {}));
      setTitle((parsed.title ?? "").slice(0, MAX_TITLE_LENGTH));
      setHashtags((parsed.hashtags ?? "").slice(0, MAX_HASHTAGS_LENGTH));
      setMode(parsed.mode ?? "FREE");
      setPpvPrice(typeof parsed.ppvPrice === "number" ? parsed.ppvPrice : 0.99);
    } catch (e) { console.error("Failed to load Magic Studio draft", e); }
  }, []);

  // ── Draft save ───────────────────────────────────────────
  useEffect(() => {
    try {
      const draft: StudioDraft = {
        canvasFormat,
        before: { ...EMPTY_MEDIA, kind: before.kind, cdnUrl: before.cdnUrl, url: before.cdnUrl, thumbnailCdnUrl: before.thumbnailCdnUrl, thumbnailUrl: before.thumbnailCdnUrl, duration: before.duration, coverTime: before.coverTime },
        after: { ...EMPTY_MEDIA, kind: after.kind, cdnUrl: after.cdnUrl, url: after.cdnUrl, thumbnailCdnUrl: after.thumbnailCdnUrl, thumbnailUrl: after.thumbnailCdnUrl, duration: after.duration, coverTime: after.coverTime },
        title, hashtags, mode, ppvPrice,
      };
      window.localStorage.setItem(STUDIO_DRAFT_KEY, JSON.stringify(draft));
    } catch (e) { console.error("Failed to save Magic Studio draft", e); }
  }, [canvasFormat, before, after, title, hashtags, mode, ppvPrice]);

  useEffect(() => { setPpvPriceInput(ppvPrice.toFixed(2)); }, [ppvPrice]);

  function updateMedia(side: Side, updater: (prev: MediaState) => MediaState) {
    if (side === "before") setBefore(p => updater(p));
    else setAfter(p => updater(p));
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>, side: Side) {
    const file = event.target.files?.[0];
    if (!file) return;
    const localBlob = URL.createObjectURL(file);
    updateMedia(side, prev => ({ ...prev, url: localBlob, cdnUrl: null, kind: file.type.startsWith("video") ? "video" : "image" }));
    try {
      const result = await processAndUpload(file, "studio", undefined, phase => console.log("[Studio] Upload phase:", phase));
      if (result.kind === "image") {
        updateMedia(side, prev => ({ ...prev, url: result.cdnUrl, cdnUrl: result.cdnUrl, thumbnailCdnUrl: result.cdnUrl, thumbnailUrl: result.cdnUrl }));
      } else {
        updateMedia(side, prev => ({ ...prev, url: result.cdnUrl, cdnUrl: result.cdnUrl, thumbnailCdnUrl: result.thumbnailCdnUrl ?? result.cdnUrl, duration: result.durationSeconds, thumbnailUrl: result.thumbnailCdnUrl ?? result.cdnUrl }));
      }
    } catch (err) {
      console.error("[Studio] Upload R2 failed:", err);
      updateMedia(side, prev => ({ ...prev, url: null, cdnUrl: null }));
    }
    event.target.value = "";
  }

  function handleLoadedMetadata(side: Side, event: React.SyntheticEvent<HTMLVideoElement>) {
    const duration = event.currentTarget.duration || 0;
    updateMedia(side, prev => ({ ...prev, duration, coverTime: prev.coverTime ?? (duration > 0 ? duration / 2 : null) }));
  }

  function handleGoToDisplay() {
    if (!isLoggedIn) { setShowPublishModal(true); return; }
    const params = new URLSearchParams();
    const cleanTitle = title.trim().slice(0, MAX_TITLE_LENGTH);
    const rawHashtags = hashtags.trim().slice(0, MAX_HASHTAGS_LENGTH);
    const hashtagArray = rawHashtags.length === 0 ? [] : rawHashtags.split(/[,\s]+/).map(t => t.trim()).filter(Boolean).map(tag => tag.startsWith("#") ? tag : `#${tag}`);
    const mapMedia = (media: MediaState): StudioForwardPayload["before"] => {
      if (!media.kind) return null;
      const permanentUrl = isCdnUrl(media.cdnUrl) ? media.cdnUrl : null;
      const thumbnailUrl = isCdnUrl(media.thumbnailCdnUrl) ? media.thumbnailCdnUrl : isCdnUrl(media.thumbnailUrl) ? media.thumbnailUrl : null;
      if (!permanentUrl) return null;
      return { type: media.kind === "video" ? "video" : "photo", url: permanentUrl, coverTime: media.coverTime ?? null, thumbnailUrl };
    };
    const payload: StudioForwardPayload = {
      title: cleanTitle, mode,
      ppvPrice: mode === "PPV" ? Number(ppvPrice.toFixed(2)) : undefined,
      hashtags: hashtagArray, before: mapMedia(before), after: mapMedia(after),
    };
    // ── Ajout token Turnstile pour validation server-side ─
    if (turnstileToken) { (payload as any).turnstileToken = turnstileToken; }
    try { window.localStorage.setItem(STUDIO_FORWARD_KEY, JSON.stringify(payload)); } catch (e) { console.error("Failed to persist Magic Studio payload", e); }
    if (cleanTitle) params.set("title", cleanTitle);
    if (rawHashtags) params.set("hashtags", rawHashtags);
    params.set("mode", mode);
    params.set("format", canvasFormat);
    if (mode === "PPV") params.set("ppvPrice", ppvPrice.toFixed(2));
    router.push(`/magic-display?${params.toString()}`);
  }

  function openCoverSelection(side: Side, event?: React.MouseEvent) {
    if (event) event.stopPropagation();
    const media = side === "before" ? before : after;
    if (media.kind !== "video" || !media.url) return;
    setSelectingCoverFor(side);
  }

  function currentMediaForCover() {
    if (selectingCoverFor === "before") return { media: before, videoRef: beforeVideoRef };
    if (selectingCoverFor === "after") return { media: after, videoRef: afterVideoRef };
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
    updateMedia(selectingCoverFor, prev => ({ ...prev, coverTime: time }));
  }

  function captureCoverThumbnail(side: Side) {
    const { videoRef } = currentMediaForCover();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth || 720; canvas.height = videoEl.videoHeight || 1280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    updateMedia(side, prev => ({ ...prev, thumbnailUrl: dataUrl }));
  }

  const coverSliderValue = (() => {
    if (!selectingCoverFor) return 0;
    const { media } = currentMediaForCover();
    if (!media?.duration || !media?.coverTime) return 0;
    return (media.coverTime / media.duration) * 100;
  })();

  const minPpvIndex = 0; const maxPpvIndex = 1998;
  const ppvSliderValue = Math.max(minPpvIndex, Math.min(maxPpvIndex, Math.round((ppvPrice - 0.99) / 0.5)));

  function commitPpvPriceFromInput(rawInput: string) {
    const normalized = rawInput.replace(",", ".");
    let value = Number(normalized);
    if (Number.isNaN(value)) { setPpvPriceInput(ppvPrice.toFixed(2)); return; }
    if (value < 0.99) value = 0.99;
    if (value > 999.99) value = 999.99;
    const idx = Math.max(minPpvIndex, Math.min(maxPpvIndex, Math.round((value - 0.99) / 0.5)));
    const finalPrice = Number((0.99 + 0.5 * idx).toFixed(2));
    setPpvPrice(finalPrice); setPpvPriceInput(finalPrice.toFixed(2));
  }

  const publishModes: { value: PublishMode; label: string }[] = [
    { value: "FREE", label: "FREE" },
    { value: "SUB", label: "Abonnement" },
    { value: "PPV", label: "PayPerView" },
  ];
  const modeDescription = mode === "FREE" ? "Accessible à tous les utilisateurs."
    : mode === "SUB" ? "Réservé à tes abonnés payants."
    : "Débloqué à l'achat pour chaque spectateur (PayPerView).";

  const isPortrait = canvasFormat === "portrait";
  const isUploading = (before.url?.startsWith("blob:") && !before.cdnUrl) || (after.url?.startsWith("blob:") && !after.cdnUrl);
  const hasUploadError = (!before.url && !before.cdnUrl && before.kind !== null) || (!after.url && !after.cdnUrl && after.kind !== null);
  const canGoToDisplay = !isUploading && isCdnUrl(before.cdnUrl) && isCdnUrl(after.cdnUrl);

  return (
    <>
      {showPublishModal && <PublishAuthModal onClose={() => setShowPublishModal(false)} />}
      <main className="container max-w-4xl py-8 space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6 space-y-4">
          <header className="mb-2 sm:mb-3">
            <h1 className="text-2xl font-semibold">Magic Studio — Avant / Après</h1>
          </header>

          {/* Toggle Portrait / Horizontal */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-medium">
              <button type="button" onClick={() => setCanvasFormat("portrait")} className={`rounded-full px-4 py-1 transition ${isPortrait ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Portrait</button>
              <button type="button" onClick={() => setCanvasFormat("horizontal")} className={`rounded-full px-4 py-1 transition ${!isPortrait ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Horizontal</button>
            </div>
          </div>

          {/* CANEVAS AVANT / APRÈS */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className={`relative mx-auto w-full max-w-xl ${isPortrait ? "aspect-[4/5]" : "aspect-[16/9]"}`}>
              <div className={`absolute inset-0 ${isPortrait ? "grid grid-cols-2 divide-x divide-slate-200" : "grid grid-rows-2 divide-y divide-slate-200"}`}>
                {/* AVANT */}
                <button type="button" className="relative flex h-full w-full flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" onClick={() => beforeInputRef.current?.click()}>
                  {before.url ? (
                    before.kind === "video"
                      ? <video ref={beforeVideoRef} src={before.url} className="h-full w-full object-cover" controls onLoadedMetadata={e => handleLoadedMetadata("before", e)} />
                      : <img src={before.url} alt="Avant" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <Upload className="h-6 w-6" /><span>Importer photo / vidéo</span><span className="text-[10px] text-slate-400">AVANT</span>
                    </div>
                  )}
                  <input ref={beforeInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => handleFileChange(e, "before")} />
                  {before.url?.startsWith("blob:") && !before.cdnUrl && (<div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-medium">⬆️ Upload R2…</div>)}
                  {before.kind === "video" && before.url && (<button type="button" onClick={e => openCoverSelection("before", e)} className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white shadow-sm">Couverture</button>)}
                </button>
                {/* APRÈS */}
                <button type="button" className="relative flex h-full w-full flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" onClick={() => afterInputRef.current?.click()}>
                  {after.url ? (
                    after.kind === "video"
                      ? <video ref={afterVideoRef} src={after.url} className="h-full w-full object-cover" controls onLoadedMetadata={e => handleLoadedMetadata("after", e)} />
                      : <img src={after.url} alt="Après" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <Upload className="h-6 w-6" /><span>Importer photo / vidéo</span><span className="text-[10px] text-slate-400">APRÈS</span>
                    </div>
                  )}
                  <input ref={afterInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => handleFileChange(e, "after")} />
                  {after.url?.startsWith("blob:") && !after.cdnUrl && (<div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-medium">⬆️ Upload R2…</div>)}
                  {after.kind === "video" && after.url && (<button type="button" onClick={e => openCoverSelection("after", e)} className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white shadow-sm">Couverture</button>)}
                </button>
              </div>
              {/* Avatar centré */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                {user ? (<StudioAvatarCenter userId={user.id} />) : (
                  <div className="overflow-hidden rounded-full bg-white/20 shadow-md backdrop-blur-sm" style={{ width: 80, height: 80, border: "2.5px solid white" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/magic-clock-bear/avatar.png" alt="Magic Clock" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {hasUploadError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-[12px] text-red-700 leading-snug">L&apos;upload a échoué pour une ou plusieurs photos. Clique sur le cadre pour réimporter ta photo.</p>
            </div>
          )}

          {selectingCoverFor && (
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] text-slate-600">
              <p className="font-medium text-slate-700">Choisir la couverture vidéo ({selectingCoverFor === "before" ? "Avant" : "Après"})</p>
              <p>Fais glisser le curseur pour choisir l&apos;image qui servira de couverture dans le flux Amazing.</p>
              <div className="mt-1 flex items-center gap-3">
                <input type="range" min={0} max={100} step={1} value={coverSliderValue} onChange={handleCoverSliderChange} className="flex-1 accent-brand-500" />
              </div>
              <button type="button" onClick={() => { if (selectingCoverFor) captureCoverThumbnail(selectingCoverFor); setSelectingCoverFor(null); }} className="mt-2 inline-flex rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-white">Terminer le choix de couverture</button>
            </div>
          )}

          {/* TITRE, HASHTAGS & MODE */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Titre du Magic Clock</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))} placeholder="Balayage caramel lumineux, cheveux longs" className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs font-medium text-slate-700"><Hash className="h-3 w-3" /> Hashtags</label>
              <input type="text" value={hashtags} onChange={e => setHashtags(e.target.value.slice(0, MAX_HASHTAGS_LENGTH))} placeholder="#balayage #cheveuxblonds #magicclock" className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div className="space-y-1 pt-1">
              <label className="text-xs font-medium text-slate-700">Mode de publication</label>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium">
                    {publishModes.map(opt => (
                      <button key={opt.value} type="button" onClick={() => setMode(opt.value)} className={`rounded-full px-3 py-1 transition ${mode === opt.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>{opt.label}</button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">{modeDescription}</p>
                </div>
                <button type="button" onClick={handleGoToDisplay}
                  disabled={!canGoToDisplay && isLoggedIn}
                  title={isUploading ? "Upload en cours, patiente…" : !isCdnUrl(before.cdnUrl) || !isCdnUrl(after.cdnUrl) ? "Importe tes photos AVANT et APRÈS d'abord" : isLoggedIn ? "Passer à Magic Display" : "Connecte-toi pour publier"}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {isUploading && <p className="text-[11px] text-amber-600 font-medium">⏳ Upload des médias vers R2 en cours… Patiente avant de passer au Display.</p>}
              {!isUploading && isLoggedIn && (!isCdnUrl(before.cdnUrl) || !isCdnUrl(after.cdnUrl)) && (before.kind || after.kind) && (
                <p className="text-[11px] text-amber-600 font-medium">⚠️ Upload non confirmé — attends la fin de l&apos;upload avant de passer au Display.</p>
              )}
              {!isLoggedIn && !loading && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1"><span>🔐</span><span>Connecte-toi pour publier ton Magic Clock sur Amazing.</span></p>
              )}
            </div>
            {mode === "PPV" && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-slate-700">Prix PayPerView</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={minPpvIndex} max={maxPpvIndex} step={1} value={ppvSliderValue} onChange={e => { const idx = Number(e.target.value); setPpvPrice(Number((0.99 + 0.5 * idx).toFixed(2))); }} className="flex-1 accent-brand-500" />
                  <div className="w-20 text-right text-xs font-semibold text-slate-700">{ppvPrice.toFixed(2)} CHF</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Ou entre le prix exact :</span>
                  <input type="number" min={0.99} max={999.99} step={0.1} value={ppvPriceInput}
                    onChange={e => setPpvPriceInput(e.target.value.replace(",", "."))}
                    onBlur={() => commitPpvPriceFromInput(ppvPriceInput)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commitPpvPriceFromInput(ppvPriceInput); } }}
                    className="w-24 rounded-full border border-slate-200 px-2 py-1 text-xs text-right shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
                  <span className="text-[11px] text-slate-500">CHF</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Turnstile anti-bot invisible ─────────────────── */}
          <TurnstileWidget
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken("")}
          />

        </section>
      </main>
    </>
  );
}
