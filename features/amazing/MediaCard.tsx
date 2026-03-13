"use client";
// features/amazing/MediaCard.tsx
// ✅ v10 — Avatar centré : cercle blanc fin (pas d'anneau gradient sur les cartes contenu)
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Heart, Lock, Unlock, Loader2, BadgeCheck,
  Sparkles, CreditCard, Gift,
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

        {/* Ligne 3 : CTA + cadenas */}
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
