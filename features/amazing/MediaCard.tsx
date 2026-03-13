"use client";
// features/amazing/MediaCard.tsx
// ✅ v11 — Bouton Partager (Share2) ajouté dans le footer de chaque carte
// ✅ ShareCardModal inline — même charte que MyMagic, Magic Clock en 1ère position
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Heart, Lock, Unlock, Loader2, BadgeCheck,
  Sparkles, CreditCard, Gift, Share2, Copy, Check, X,
} from "lucide-react";
import type { FeedCard } from "@/core/domain/types";

type PublishMode = "FREE" | "SUB" | "PPV";
type AccessKind  = "FREE" | "ABO" | "PPV";
type Props = { item: FeedCard };

const FALLBACK_BEFORE = "/images/examples/balayage-before.jpg";
const FALLBACK_AFTER  = "/images/examples/balayage-after.jpg";
const MAX_TITLE   = 60;
const MAX_TAG_LEN = 20;
const MAX_TAGS    = 3;

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// ── Étoiles ──────────────────────────────────────────────────
const GRAD_BG_STARS = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";
const STAR_GRAD: React.CSSProperties = {
  background: GRAD_BG_STARS,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
function StarRating({ value }: { value?: number }) {
  const filled = value !== undefined ? Math.round(value) : 0;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className="text-[9px] font-black leading-none"
          style={s <= filled
            ? { background: GRAD_BG_STARS, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
            : { color: "#cbd5e1" }}
        >★</span>
      ))}
      {value !== undefined && (
        <span className="ml-0.5 text-[9px] font-bold" style={STAR_GRAD}>{value.toFixed(1)}</span>
      )}
    </span>
  );
}

// ── Vidéo auto-play ──────────────────────────────────────────
function isVideo(url: string | null | undefined) {
  if (!url) return false;
  if (url.startsWith("data:video/") || url.startsWith("blob:")) return true;
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg");
}

function AutoPlayVideo({ src, poster, alt }: { src: string; poster?: string; alt?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const v = videoRef.current;
    const c = containerRef.current;
    if (!v || !c) return;
    v.muted = true; v.playsInline = true;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!v) return;
        if (e.isIntersecting && e.intersectionRatio >= 0.6) v.play().catch(() => {});
        else { v.pause(); try { v.currentTime = 0; } catch { /* ignore */ } }
      }),
      { threshold: [0.6] }
    );
    obs.observe(c);
    return () => obs.disconnect();
  }, [src]);
  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoRef} src={src} poster={poster} className="h-full w-full object-cover" loop muted playsInline>
        {alt ? <track kind="descriptions" label={alt} /> : null}
      </video>
    </div>
  );
}

// ── Stripe checkout ──────────────────────────────────────────
async function launchStripeCheckout({
  contentId, contentType, amountValue, currency, creatorId, creatorHandle,
}: {
  contentId: string; contentType: "ppv" | "subscription";
  amountValue: number; currency: string;
  creatorId: string; creatorHandle: string;
}): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentId, contentType, amountValue,
      currency: currency.toLowerCase(),
      buyerId: "guest-buyer", creatorId,
      buyerCountryCode: "CH",
      returnUrl: `${window.location.origin}/payment/result`
        + `?contentId=${contentId}&creator=${creatorHandle}&contentType=${contentType}`,
    }),
  });
  const data = (await response.json()) as {
    ok: boolean; clientSecret?: string; status?: string; error?: string;
  };
  if (!data.ok) return { ok: false, error: data.error ?? "Erreur paiement" };
  if (data.status === "mock" || !data.clientSecret) {
    window.location.href = `/payment/result?status=authorized&mock=true`
      + `&contentId=${contentId}&creator=${creatorHandle}&contentType=${contentType}`;
    return { ok: true };
  }
  sessionStorage.setItem("stripe_client_secret", data.clientSecret);
  sessionStorage.setItem("stripe_content_id", contentId);
  sessionStorage.setItem("stripe_content_type", contentType);
  sessionStorage.setItem("stripe_creator", creatorHandle);
  window.location.href = `/payment/checkout?contentId=${contentId}`;
  return { ok: true };
}

// ── ConditionalLink ──────────────────────────────────────────
function ConditionalLink({ href, children, className, style }: {
  href: string | null; children: React.ReactNode;
  className?: string; style?: React.CSSProperties;
}) {
  if (href) return <Link href={href} className={className} style={style}>{children}</Link>;
  return <div className={className} style={style}>{children}</div>;
}

// ── ShareCardModal ────────────────────────────────────────────────────────
const GRAD_MC = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";

function ShareCardModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [toastNet, setToastNet] = useState<string | null>(null);
  const copyLink = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {} };
  const copyAndToast = async (label: string) => { try { await navigator.clipboard.writeText(url); } catch {} setToastNet(label); setTimeout(() => setToastNet(null), 2500); };
  const nets: { label: string; logo: string; href: string | null; toast?: string }[] = [
    { label: "Magic Clock", logo: "/magic-clock-social-monet.png",        href: null, toast: "Lien copié ! Partage-le sur Magic Clock." },
    { label: "TikTok",      logo: "/magic-clock-social-tiktok.png",       href: null, toast: "Lien copié ! Colle-le dans ta bio TikTok." },
    { label: "Instagram",   logo: "/magic-clock-social-instagram.png",    href: null, toast: "Lien copié ! Colle-le dans ta story ou ta bio Instagram." },
    { label: "WhatsApp",    logo: "/magic-clock-social-whatsapp.png?v=2", href: `https://wa.me/?text=${encodeURIComponent(`✨ Découvre ce Magic Clock : ${url}`)}` },
    { label: "X",           logo: "/magic-clock-social-x.png",            href: `https://x.com/intent/tweet?text=${encodeURIComponent(`✨ Magic Clock :`)}&url=${encodeURIComponent(url)}` },
    { label: "Snapchat",    logo: "/magic-clock-social-snapchat.png",     href: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}` },
    { label: "Facebook",    logo: "/magic-clock-social-facebook.png",     href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "BeReal",      logo: "/magic-clock-social-bereal.png",       href: null, toast: "Lien copié ! Partage-le sur BeReal." },
    { label: "Twitch",      logo: "/magic-clock-social-twitch.png",       href: null, toast: "Lien copié ! Colle-le dans ta bio Twitch." },
    { label: "YouTube",     logo: "/magic-clock-social-youtube.png",      href: null, toast: "Lien copié ! Ajoute-le à ta description YouTube." },
    { label: "LinkedIn",    logo: "/magic-clock-social-linkedin.png",     href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "Pinterest",   logo: "/magic-clock-social-pinterest.png",    href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(`✨ Magic Clock`)}` },
    { label: "Threads",     logo: "/magic-clock-social-threads.png",      href: `https://www.threads.net/intent/post?text=${encodeURIComponent(`✨ Magic Clock : ${url}`)}` },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-3xl bg-white pt-4 pb-10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between px-5 mb-4">
          <h3 className="text-base font-bold text-slate-900">Partager ce Magic Clock</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"><X className="h-4 w-4" /></button>
        </div>
        <div className="mx-5 mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="flex-1 truncate text-xs text-slate-500">{url}</span>
          <button onClick={copyLink} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${copied ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}>
            {copied ? <><Check className="h-3 w-3" /> Copié</> : <><Copy className="h-3 w-3" /> Copier</>}
          </button>
        </div>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button onClick={() => navigator.share({ title: `Magic Clock — ${title}`, url }).catch(() => {})}
            className="mx-5 mb-5 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
            style={{ background: GRAD_MC }}>
            <Share2 className="h-4 w-4" /> Partager via…
          </button>
        )}
        <div style={{ overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ display: "flex", gap: 12, width: "max-content" }}>
            {nets.map(n => (
              <button key={n.label} onClick={n.href ? () => window.open(n.href!, "_blank") : () => copyAndToast(n.label)}
                className="flex flex-col items-center gap-1.5 transition-transform active:scale-95" style={{ width: 60 }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm" style={{ border: "1px solid rgba(226,232,240,.9)", flexShrink: 0 }}>
                  <img src={n.logo} alt={n.label} style={{ width: 32, height: 32, objectFit: "contain" }} />
                </div>
                <span className="text-[10px] font-medium text-slate-600 text-center leading-tight w-full">{n.label}</span>
              </button>
            ))}
          </div>
        </div>
        {toastNet && (
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-xs text-emerald-700 font-medium">
            <Check className="h-3.5 w-3.5 flex-shrink-0" />{nets.find(n => n.label === toastNet)?.toast ?? "Lien copié !"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Composant principal ──────────────────────────────────────
export default function MediaCard({ item }: Props) {
  const cleanUserHandle = item.user.startsWith("@") ? item.user.slice(1) : item.user;
  const creatorName    = (item as any).creatorName ?? item.user;
  const creatorHandle  = `@${cleanUserHandle}`;
  const meetHref       = `/meet?creator=${encodeURIComponent(creatorHandle)}`;
  const clockSlug      = item.slug ?? null;
  const clockHref      = clockSlug ? `/magic-clock/${clockSlug}` : null;

  const isSystemUnlockedForAll = (item as any).isSystemUnlockedForAll === true;
  const isSystemCard  = (item as any).isSystemFeatured === true || isSystemUnlockedForAll;
  const modeFromItem  = (item as any).mode as PublishMode | undefined;
  const mode: PublishMode = modeFromItem ?? (item.access === "PPV" ? "PPV" : item.access === "ABO" ? "SUB" : "FREE");
  const ppvPrice: number | null = typeof (item as any).ppvPrice === "number" ? (item as any).ppvPrice : null;
  const ppvAmountValue = ppvPrice != null ? Math.round(ppvPrice * 100) : 299;
  const aboAmountValue = 1490;
  const currency = "CHF";

  const starsValue: number | undefined = typeof (item as any).stars === "number" ? (item as any).stars : undefined;

  const rawTitle    = item.title ?? "Magic Clock";
  const title       = truncate(rawTitle, MAX_TITLE);
  const rawHashtags = Array.isArray((item as any).hashtags) ? ((item as any).hashtags as string[]) : [];
  const safeHashtags = rawHashtags.slice(0, MAX_TAGS).map((t) => truncate(t, MAX_TAG_LEN));
  const views = typeof item.views === "number" ? item.views : 0;

  const beforeThumb: string = (item as any).beforeThumbnail ?? (item as any).beforeThumb ?? item.beforeUrl ?? item.image ?? FALLBACK_BEFORE;
  const afterThumb:  string = (item as any).afterThumbnail  ?? (item as any).afterThumb  ?? item.afterUrl  ?? item.image ?? FALLBACK_AFTER;
  const heroVideoSrc = isVideo(item.afterUrl) ? (item.afterUrl as string) : isVideo(item.beforeUrl) ? (item.beforeUrl as string) : null;

  const systemAvatar = "/images/magic-clock-bear/avatar.png";
  const avatar: string = isSystemCard ? systemAvatar : (item as any).creatorAvatar ?? afterThumb ?? beforeThumb;
  const isCertified   = (item as any).isCertified === true;

  const [isLoading,   setIsLoading]   = useState<AccessKind | null>(null);
  const [isUnlocked,  setIsUnlocked]  = useState(mode === "FREE" || isSystemUnlockedForAll);
  const magicClockId  = item.magicClockId ?? String(item.id);
  const [likesCount,  setLikesCount]  = useState(typeof (item as any).likes === "number" ? (item as any).likes : 0);
  const [liked,       setLiked]       = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showShare,   setShowShare]   = useState(false);
  const shareUrl = clockSlug ? `https://magic-clock.com/magic-clock/${clockSlug}` : `https://magic-clock.com`;

  useEffect(() => {
    fetch(`/api/magic-clocks/${magicClockId}/liked`)
      .then((r) => r.json())
      .then((data) => { if (data?.liked === true) setLiked(true); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magicClockId]);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((c: number) => (wasLiked ? Math.max(0, c - 1) : c + 1));
    try {
      const res = await fetch(`/api/magic-clocks/${magicClockId}/like`, { method: "POST" });
      if (!res.ok) {
        setLiked(wasLiked);
        setLikesCount((c: number) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
      } else {
        const data = await res.json();
        setLiked(data.liked === true);
        if (data.liked === wasLiked) {
          setLikesCount((c: number) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
        }
      }
    } catch {
      setLiked(wasLiked);
      setLikesCount((c: number) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
    } finally { setLikeLoading(false); }
  }

  const btnCfg = mode === "FREE"
    ? { label: "FREE Magic Clock",  Icon: Gift }
    : mode === "SUB"
    ? { label: "Abo Magic Clock",   Icon: Sparkles }
    : { label: "PPV Magic Clock",   Icon: CreditCard };

  async function handleFreeAccess() {
    setIsLoading("FREE");
    try {
      const params = new URLSearchParams({ magicClockId });
      const res = await fetch(`/api/access/free?${params}`, { method: "GET" });
      if (res.ok) {
        setIsUnlocked(true);
        window.location.href = `/access/result?status=ok`
          + `&contentId=${encodeURIComponent(magicClockId)}`
          + `&creator=${encodeURIComponent(creatorHandle)}`;
      } else window.location.href = `/access/result?status=error`;
    } catch { window.location.href = `/access/result?status=error`; }
    finally  { setIsLoading(null); }
  }
  async function handlePPV() {
    setIsLoading("PPV");
    try { await launchStripeCheckout({ contentId: magicClockId, contentType: "ppv", amountValue: ppvAmountValue, currency, creatorId: cleanUserHandle, creatorHandle }); }
    catch { /* noop */ } finally { setIsLoading(null); }
  }
  async function handleSubscription() {
    setIsLoading("ABO");
    try { await launchStripeCheckout({ contentId: magicClockId, contentType: "subscription", amountValue: aboAmountValue, currency, creatorId: cleanUserHandle, creatorHandle }); }
    catch { /* noop */ } finally { setIsLoading(null); }
  }
  function handleMainAction() {
    if (mode === "FREE") handleFreeAccess();
    else if (mode === "SUB") handleSubscription();
    else handlePPV();
  }

  return (
    <article
      className="w-full overflow-hidden rounded-3xl bg-white"
      style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}
    >
      {showShare && <ShareCardModal url={shareUrl} title={title} onClose={() => setShowShare(false)} />}
      {/* ── Zone média ── */}
      <ConditionalLink
        href={clockHref}
        className="relative block w-full overflow-hidden bg-slate-100"
        style={{ aspectRatio: "4/5" }}
      >
        {heroVideoSrc ? (
          <AutoPlayVideo src={heroVideoSrc} poster={afterThumb || beforeThumb} alt={title} />
        ) : (
          <div className="grid h-full w-full grid-cols-2">
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeThumb} alt={`${title} - Avant`} className="h-full w-full object-cover object-top" />
            </div>
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterThumb}  alt={`${title} - Après`} className="h-full w-full object-cover object-top" />
            </div>
            <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/85" />
          </div>
        )}

        {/* Gradient bas */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "30%", background: "linear-gradient(to top,rgba(10,15,30,.45),transparent)" }}
        />

        {/* Avatar centré → Meet me — cercle blanc fin, pas d'anneau sur les cartes contenu */}
        <Link
          href={meetHref}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-label={`Meet me — ${creatorName}`}
        >
          <div
            className="overflow-hidden rounded-full bg-white transition-transform active:scale-95"
            style={{ width: 52, height: 52, border: "2.5px solid white", boxShadow: "0 2px 14px rgba(0,0,0,.22)" }}
          >
            <Image src={avatar} alt={creatorName} width={52} height={52} className="h-full w-full object-cover" />
          </div>
        </Link>
      </ConditionalLink>

      {/* ── Footer compact ── */}
      <div className="px-3 pt-2.5 pb-3 space-y-1.5">
        {/* Ligne 1 : mini avatar · nom · handle · vues · ❤️ · étoiles */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Mini avatar 24px — pas d'anneau à cette taille */}
          <Link href={meetHref} className="flex-shrink-0">
            <div className="overflow-hidden rounded-full bg-slate-100"
              style={{ width: 24, height: 24, border: "1.5px solid rgba(226,232,240,.8)" }}
            >
              <Image src={avatar} alt={creatorName} width={24} height={24} className="h-full w-full object-cover" />
            </div>
          </Link>
          <Link href={meetHref} className="flex items-center gap-1 min-w-0 flex-shrink">
            <span className="text-[11px] font-bold text-slate-800 truncate max-w-[90px]">{creatorName}</span>
            {isCertified && <BadgeCheck className="h-3 w-3 flex-shrink-0 text-violet-400" />}
            <span className="text-[9px] text-slate-400 truncate">@{cleanUserHandle}</span>
          </Link>
          <span className="h-[3px] w-[3px] rounded-full bg-slate-200 flex-shrink-0" />
          <span className="flex items-center gap-0.5 text-[9px] text-slate-400 flex-shrink-0">
            <Eye className="h-2.5 w-2.5" />
            {views > 0 ? views.toLocaleString("fr-CH") : "0"}
          </span>
          <button
            type="button" onClick={handleLike} disabled={likeLoading}
            aria-label={liked ? "Je n'aime plus" : "J'aime"}
            className="flex items-center gap-0.5 text-[9px] flex-shrink-0 transition-transform active:scale-110 disabled:opacity-60"
            style={{ color: liked ? "#F54B8F" : "#94a3b8" }}
          >
            <Heart className="h-2.5 w-2.5 transition-all"
              style={liked ? { fill: "#F54B8F", color: "#F54B8F", filter: "drop-shadow(0 0 2px #F54B8F88)" } : {}}
            />
            {likesCount > 0 ? likesCount.toLocaleString("fr-CH") : "0"}
          </button>
          <span className="flex-1" />
          <StarRating value={starsValue} />
        </div>

        {/* Ligne 2 : titre + hashtags */}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 min-w-0">
          {title && <span className="text-[11px] font-semibold text-slate-800 leading-snug">{title}</span>}
          {safeHashtags.map((tag) => (
            <span key={tag} className="text-[10px] text-slate-400 font-medium">{tag}</span>
          ))}
        </div>

        {/* Ligne 3 : CTA + partager + cadenas */}
        <div className="flex gap-2 pt-0.5">
          <button
            type="button" onClick={handleMainAction} disabled={isLoading !== null}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[11px] font-bold text-white transition-all active:scale-95 disabled:opacity-70"
            style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)", boxShadow: "0 2px 10px rgba(123,75,245,.25)" }}
          >
            {isLoading !== null
              ? <Loader2 className="h-3 w-3 animate-spin" />
              : <><btnCfg.Icon className="h-3 w-3" />{btnCfg.label}</>
            }
          </button>
          <button
            type="button" onClick={() => setShowShare(true)}
            className="flex flex-shrink-0 items-center justify-center rounded-2xl px-3 py-2.5 transition-all active:scale-95"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#94a3b8" }}
            aria-label="Partager"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button" onClick={handleMainAction} disabled={isLoading !== null}
            className="flex flex-shrink-0 items-center justify-center rounded-2xl px-3 py-2.5 transition-all active:scale-95"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#94a3b8" }}
          >
            {isUnlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
}
