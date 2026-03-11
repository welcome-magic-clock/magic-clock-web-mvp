"use client";
// features/amazing/MediaCard.tsx — V5
// ✅ Étoiles dorées amber-400 · Avatar Supabase en priorité · stars depuis rating_avg · Zéro mock
// ✅ Footer compact 3 lignes · Sans labels Avant/Après
//    Cadenas gris · Hashtags gris sans bulles · Titres/hashtags tronqués

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Heart, Lock, Unlock,
  Loader2, BadgeCheck,
  Sparkles, CreditCard, Gift,
} from "lucide-react";
import type { FeedCard } from "@/core/domain/types";
import { CREATORS } from "@/features/meet/creators";
import { useRouter } from "next/navigation";

type PublishMode = "FREE" | "SUB" | "PPV";
type AccessKind  = "FREE" | "ABO" | "PPV";
type Props = { item: FeedCard };

const FALLBACK_BEFORE = "/images/examples/balayage-before.jpg";
const FALLBACK_AFTER  = "/images/examples/balayage-after.jpg";

// Longueurs max pour éviter abus
const MAX_TITLE   = 60;
const MAX_TAG_LEN = 20;
const MAX_TAGS    = 3;

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// ── Étoiles ──────────────────────────────────────────────────
// Étoile SVG avec gradient Magic Clock 5 couleurs intégré — identique Meet me
// Technique : defs inline dans chaque SVG pour garantir résolution cross-context

const GRAD_STOPS = [
  { offset: "0%",   color: "#4B7BF5" },
  { offset: "25%",  color: "#7B4BF5" },
  { offset: "55%",  color: "#C44BDA" },
  { offset: "80%",  color: "#F54B8F" },
  { offset: "100%", color: "#F5834B" },
];

function StarSvg({ size = 10, gradient = true }: { size?: number; gradient?: boolean }) {
  const id = "sg" + size; // id unique par taille
  if (!gradient) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon fill="#e2e8f0" points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          {GRAD_STOPS.map(s => <stop key={s.offset} offset={s.offset} stopColor={s.color} />)}
        </linearGradient>
      </defs>
      <polygon fill={`url(#${id})`} points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function StarRating({ value }: { value: number }) {
  const full  = Math.floor(value);
  const half  = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const SIZE  = 10;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <StarSvg key={`f${i}`} size={SIZE} gradient />
      ))}
      {half && (
        <span className="relative inline-block" style={{ width: SIZE, height: SIZE }}>
          {/* Fond gris */}
          <StarSvg size={SIZE} gradient={false} />
          {/* Moitié gauche gradient */}
          <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <StarSvg size={SIZE} gradient />
          </span>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <StarSvg key={`e${i}`} size={SIZE} gradient={false} />
      ))}
      <span
        className="ml-0.5 text-[9px] font-bold"
        style={{
          background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value.toFixed(1)}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
function isVideo(url: string | null | undefined) {
  if (!url) return false;
  if (url.startsWith("data:video/") || url.startsWith("blob:")) return true;
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg");
}

function AutoPlayVideo({ src, poster, alt }: { src: string; poster?: string; alt?: string }) {
  const videoRef     = useRef<HTMLVideoElement | null>(null);
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
      <video ref={videoRef} src={src} poster={poster}
        className="h-full w-full object-cover" loop muted playsInline>
        {alt ? <track kind="descriptions" label={alt} /> : null}
      </video>
    </div>
  );
}

async function launchStripeCheckout({
  contentId, contentType, amountValue, currency, creatorId, creatorHandle,
}: {
  contentId: string; contentType: "ppv" | "subscription";
  amountValue: number; currency: string; creatorId: string; creatorHandle: string;
}): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentId, contentType,
      amountValue, currency: currency.toLowerCase(),
      buyerId: "guest-buyer", creatorId, buyerCountryCode: "CH",
      returnUrl:
        `${window.location.origin}/payment/result` +
        `?contentId=${contentId}&creator=${creatorHandle}&contentType=${contentType}`,
    }),
  });
  const data = await response.json() as {
    ok: boolean; clientSecret?: string; status?: string; error?: string;
  };
  if (!data.ok) return { ok: false, error: data.error ?? "Erreur paiement" };
  if (data.status === "mock" || !data.clientSecret) {
    window.location.href =
      `/payment/result?status=authorized&mock=true` +
      `&contentId=${contentId}&creator=${creatorHandle}&contentType=${contentType}`;
    return { ok: true };
  }
  sessionStorage.setItem("stripe_client_secret", data.clientSecret);
  sessionStorage.setItem("stripe_content_id", contentId);
  sessionStorage.setItem("stripe_content_type", contentType);
  sessionStorage.setItem("stripe_creator", creatorHandle);
  window.location.href = `/payment/checkout?contentId=${contentId}`;
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
export default function MediaCard({ item }: Props) {
  const router = useRouter();

  // Créateur
  const cleanUserHandle = item.user.startsWith("@") ? item.user.slice(1) : item.user;
  const creator = CREATORS.find((c) => {
    const h = c.handle.startsWith("@") ? c.handle.slice(1) : c.handle;
    return h === cleanUserHandle;
  }) ?? null;
  const creatorName   = creator?.name   ?? item.user;
  const creatorHandle = creator?.handle ?? `@${cleanUserHandle}`;
  const meetHref      = `/meet?creator=${encodeURIComponent(creatorHandle)}`;

  // Flags
  const isSystemUnlockedForAll = (item as any).isSystemUnlockedForAll === true;
  const isSystemCard = (item as any).isSystemFeatured === true || isSystemUnlockedForAll;

  // Mode / prix
  const modeFromItem = (item as any).mode as PublishMode | undefined;
  const mode: PublishMode =
    modeFromItem ?? (item.access === "PPV" ? "PPV" : item.access === "ABO" ? "SUB" : "FREE");
  const ppvPrice: number | null =
    typeof (item as any).ppvPrice === "number" ? (item as any).ppvPrice : null;
  const ppvAmountValue = ppvPrice != null ? Math.round(ppvPrice * 100) : 299;
  const aboAmountValue = 1490;
  const currency = "CHF";

  // Étoiles — depuis Supabase (item.stars = rating_avg) ou profil statique, jamais de défaut mock
  const starsValue: number | undefined =
    typeof (item as any).stars === "number"
      ? (item as any).stars
      : creator && typeof (creator as any).stars === "number"
        ? (creator as any).stars
        : undefined;

  // Titre & hashtags — tronqués + sécurisés
  const rawTitle    = item.title ?? "Magic Clock";
  const title       = truncate(rawTitle, MAX_TITLE);
  const rawHashtags = Array.isArray((item as any).hashtags) ? (item as any).hashtags as string[] : [];
  const safeHashtags = rawHashtags
    .slice(0, MAX_TAGS)
    .map((t) => truncate(t, MAX_TAG_LEN));

  const views = typeof item.views === "number" ? item.views : 0;
  const likes = typeof (item as any).likes === "number" ? (item as any).likes : 0;

  // Médias
  const beforeThumb: string =
    (item as any).beforeThumbnail ?? (item as any).beforeThumb ??
    item.beforeUrl ?? item.image ?? FALLBACK_BEFORE;
  const afterThumb: string =
    (item as any).afterThumbnail ?? (item as any).afterThumb ??
    item.afterUrl ?? item.image ?? FALLBACK_AFTER;
  const heroVideoSrc = isVideo(item.afterUrl)
    ? (item.afterUrl as string)
    : isVideo(item.beforeUrl) ? (item.beforeUrl as string) : null;

  // Avatar — priorité : creatorAvatar Supabase → CREATORS statique → fallback image
  const systemAvatar = "/images/magic-clock-bear/avatar.png";
  const avatar: string = isSystemCard
    ? systemAvatar
    : (item as any).creatorAvatar ?? creator?.avatar ?? afterThumb ?? beforeThumb;
  const isCertified =
    (item as any).isCertified === true ||
    (creator && (creator as any).isCertified === true);

  // État
  const [isLoading, setIsLoading] = useState<AccessKind | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(mode === "FREE" || isSystemUnlockedForAll);

  // Config bouton principal
  const btnCfg = mode === "FREE"
    ? { label: "FREE Magic Clock",  Icon: Gift       }
    : mode === "SUB"
      ? { label: "Abo Magic Clock",   Icon: Sparkles   }
      : { label: "PPV Magic Clock",   Icon: CreditCard };

  // Handlers
  async function handleFreeAccess() {
    setIsLoading("FREE");
    try {
      const params = new URLSearchParams({ magicClockId: String(item.id) });
      const res = await fetch(`/api/access/free?${params}`, { method: "GET" });
      if (res.ok) {
        setIsUnlocked(true);
        window.location.href =
          `/access/result?status=ok` +
          `&contentId=${encodeURIComponent(String(item.id))}` +
          `&creator=${encodeURIComponent(creatorHandle)}`;
      } else window.location.href = `/access/result?status=error`;
    } catch { window.location.href = `/access/result?status=error`; }
    finally { setIsLoading(null); }
  }

  async function handlePPV() {
    setIsLoading("PPV");
    try {
      await launchStripeCheckout({
        contentId: String(item.id), contentType: "ppv",
        amountValue: ppvAmountValue, currency,
        creatorId: cleanUserHandle, creatorHandle,
      });
    } catch { /* noop */ }
    finally { setIsLoading(null); }
  }

  async function handleSubscription() {
    setIsLoading("ABO");
    try {
      await launchStripeCheckout({
        contentId: String(item.id), contentType: "subscription",
        amountValue: aboAmountValue, currency,
        creatorId: cleanUserHandle, creatorHandle,
      });
    } catch { /* noop */ }
    finally { setIsLoading(null); }
  }

  function handleMainAction() {
    if (mode === "FREE") handleFreeAccess();
    else if (mode === "SUB") handleSubscription();
    else handlePPV();
  }

  // ─────────────────────────────────────────────────────────────
  return (
    <article
      className="w-full overflow-hidden rounded-3xl bg-white"
      style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}
    >

      {/* ── Zone média — sans labels Avant/Après ── */}
      <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/5" }}>

        {heroVideoSrc ? (
          <AutoPlayVideo src={heroVideoSrc} poster={afterThumb || beforeThumb} alt={title} />
        ) : (
          <div className="grid h-full w-full grid-cols-2">
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeThumb} alt={`${title} - Avant`}
                className="h-full w-full object-cover object-top" />
            </div>
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterThumb} alt={`${title} - Après`}
                className="h-full w-full object-cover object-top" />
            </div>
            {/* Ligne centrale */}
            <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/85" />
          </div>
        )}

        {/* Gradient bas */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "30%", background: "linear-gradient(to top,rgba(10,15,30,.45),transparent)" }}
        />

        {/* ── Avatar centré → Meet me ── */}
        <Link
          href={meetHref}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-label={`Meet me — ${creatorName}`}
        >
          <div
            className="overflow-hidden rounded-full bg-white transition-transform active:scale-95"
            style={{ width: 52, height: 52, border: "3px solid white", boxShadow: "0 2px 14px rgba(0,0,0,.22)" }}
          >
            <Image src={avatar} alt={creatorName} width={52} height={52}
              className="h-full w-full object-cover" />
          </div>
        </Link>

      </div>{/* /media */}

      {/* ── Footer compact ── */}
      <div className="px-3 pt-2.5 pb-3 space-y-1.5">

        {/* ── Ligne 1 : avatar · nom · handle · vues · likes · étoiles ── */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Mini avatar */}
          <Link href={meetHref} className="flex-shrink-0">
            <div
              className="overflow-hidden rounded-full bg-slate-100"
              style={{ width: 24, height: 24, border: "1.5px solid rgba(226,232,240,.8)" }}
            >
              <Image src={avatar} alt={creatorName} width={24} height={24}
                className="h-full w-full object-cover" />
            </div>
          </Link>

          {/* Nom + handle */}
          <Link href={meetHref} className="flex items-center gap-1 min-w-0 flex-shrink">
            <span className="text-[11px] font-bold text-slate-800 truncate max-w-[90px]">
              {creatorName}
            </span>
            {isCertified && <BadgeCheck className="h-3 w-3 flex-shrink-0 text-violet-400" />}
            <span className="text-[9px] text-slate-400 truncate">@{cleanUserHandle}</span>
          </Link>

          {/* Séparateur */}
          <span className="h-[3px] w-[3px] rounded-full bg-slate-200 flex-shrink-0" />

          {/* Stats */}
          <span className="flex items-center gap-0.5 text-[9px] text-slate-400 flex-shrink-0">
            <Eye className="h-2.5 w-2.5" />
            {views > 0 ? views.toLocaleString("fr-CH") : "0"}
          </span>
          <span className="flex items-center gap-0.5 text-[9px] text-slate-400 flex-shrink-0">
            <Heart className="h-2.5 w-2.5" />
            {likes > 0 ? likes.toLocaleString("fr-CH") : "0"}
          </span>

          {/* Spacer + étoiles à droite */}
          <span className="flex-1" />
          {starsValue !== undefined && <StarRating value={starsValue} />}
        </div>

        {/* ── Ligne 2 : titre + hashtags gris (inline, sans bulles) ── */}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 min-w-0">
          {title && (
            <span className="text-[11px] font-semibold text-slate-800 leading-snug">
              {title}
            </span>
          )}
          {safeHashtags.map((tag) => (
            <span key={tag} className="text-[10px] text-slate-400 font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* ── Ligne 3 : bouton CTA + cadenas gris ── */}
        <div className="flex gap-2 pt-0.5">

          {/* Bouton principal Stripe */}
          <button
            type="button"
            onClick={handleMainAction}
            disabled={isLoading !== null}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[11px] font-bold text-white transition-all active:scale-95 disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
              boxShadow: "0 2px 10px rgba(123,75,245,.25)",
            }}
          >
            {isLoading !== null ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <btnCfg.Icon className="h-3 w-3" />
                {btnCfg.label}
              </>
            )}
          </button>

          {/* Cadenas — gris, sans code couleur */}
          <button
            type="button"
            onClick={handleMainAction}
            disabled={isLoading !== null}
            className="flex flex-shrink-0 items-center justify-center rounded-2xl px-3 py-2.5 transition-all active:scale-95"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#94a3b8",
            }}
          >
            {isUnlocked
              ? <Unlock className="h-3.5 w-3.5" />
              : <Lock className="h-3.5 w-3.5" />
            }
          </button>

        </div>
      </div>
    </article>
  );
}
