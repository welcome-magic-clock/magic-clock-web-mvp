"use client";
// features/amazing/MediaCard.tsx — V3
// ✅ Avatar → Meet me · Bouton Stripe labellisé (FREE / Abo / PPV Magic Clock)
//    Badge FREE/ABO/PPV → système 5 étoiles · Lock/Unlock restent sur le bouton secondaire

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Heart, Lock, Unlock,
  Loader2, BadgeCheck, Star,
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

// ── Étoiles ──────────────────────────────────────────────────
function StarRating({ value }: { value: number }) {
  const full  = Math.floor(value);
  const half  = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
      ))}
      {half && (
        <span className="relative inline-block h-2.5 w-2.5">
          <Star className="absolute inset-0 h-2.5 w-2.5 fill-slate-200 text-slate-200" />
          <span className="absolute inset-0 w-1/2 overflow-hidden">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          </span>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-2.5 w-2.5 fill-slate-200 text-slate-200" />
      ))}
      <span className="ml-0.5 text-[9px] font-bold text-slate-500">{value.toFixed(1)}</span>
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

  // Étoiles
  const starsValue: number =
    typeof (item as any).stars === "number"
      ? (item as any).stars
      : creator && typeof (creator as any).stars === "number"
        ? (creator as any).stars
        : 4.8;

  const rawHashtags = Array.isArray((item as any).hashtags) ? (item as any).hashtags as string[] : [];
  const displayHashtags = rawHashtags.length > 0 ? rawHashtags : ["#coiffure", "#magicclock"];

  const title = item.title ?? "Magic Clock";
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

  // Avatar
  const systemAvatar = "/images/magic-clock-bear/avatar.png";
  const avatar: string = isSystemCard
    ? systemAvatar
    : creator?.avatar ?? item.image ?? afterThumb ?? beforeThumb;
  const isCertified =
    (item as any).isCertified === true ||
    (creator && (creator as any).isCertified === true);

  // État
  const [isLoading, setIsLoading] = useState<AccessKind | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(mode === "FREE" || isSystemUnlockedForAll);
  const isLocked = !isUnlocked && mode !== "FREE";

  // Config bouton principal selon mode
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

      {/* ── Zone média ── */}
      <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/5" }}>

        {heroVideoSrc ? (
          <AutoPlayVideo src={heroVideoSrc} poster={afterThumb || beforeThumb} alt={title} />
        ) : (
          <div className="grid h-full w-full grid-cols-2">
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeThumb} alt={`${title} - Avant`} className="h-full w-full object-cover object-top" />
              <span
                className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white"
                style={{ background: "rgba(0,0,0,.35)", backdropFilter: "blur(4px)" }}
              >
                Avant
              </span>
            </div>
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterThumb} alt={`${title} - Après`} className="h-full w-full object-cover object-top" />
              <span
                className="absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white"
                style={{ background: "rgba(0,0,0,.35)", backdropFilter: "blur(4px)" }}
              >
                Après
              </span>
            </div>
            <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/85" />
          </div>
        )}

        {/* Gradient bas */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "35%", background: "linear-gradient(to top,rgba(10,15,30,.5),transparent)" }}
        />

        {/* ── Avatar centré — clic = Meet me ── */}
        <Link
          href={meetHref}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-label={`Meet me — ${creatorName}`}
        >
          <div
            className="overflow-hidden rounded-full bg-white transition-transform active:scale-95"
            style={{
              width: 56, height: 56,
              border: "3px solid white",
              boxShadow: "0 2px 16px rgba(0,0,0,.25)",
            }}
          >
            <Image src={avatar} alt={creatorName} width={56} height={56} className="h-full w-full object-cover" />
          </div>
        </Link>

      </div>{/* /media-zone */}

      {/* ── Footer ── */}
      <div className="px-3 py-3">

        {/* Créateur + étoiles */}
        <div className="mb-2 flex items-center justify-between">
          <Link href={meetHref} className="flex min-w-0 items-center gap-2">
            <div
              className="flex-shrink-0 overflow-hidden rounded-full bg-slate-100"
              style={{ width: 28, height: 28, border: "1.5px solid rgba(226,232,240,.8)" }}
            >
              <Image src={avatar} alt={creatorName} width={28} height={28} className="h-full w-full object-cover" />
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1">
                <span className="truncate text-[11px] font-bold text-slate-900">{creatorName}</span>
                {isCertified && <BadgeCheck className="h-3 w-3 flex-shrink-0 text-violet-500" />}
              </div>
              <span className="text-[9px] text-slate-400">{creatorHandle}</span>
            </div>
          </Link>
          <StarRating value={starsValue} />
        </div>

        {/* Stats */}
        <div className="mb-2 flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Eye className="h-3 w-3" />
            {views > 0 ? views.toLocaleString("fr-CH") : "0"}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Heart className="h-3 w-3" />
            {likes > 0 ? likes.toLocaleString("fr-CH") : "0"}
          </span>
        </div>

        {/* Titre */}
        {title && (
          <p className="mb-2 text-[12px] font-semibold leading-snug text-slate-800 line-clamp-2">
            {title}
          </p>
        )}

        {/* Hashtags */}
        {displayHashtags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {displayHashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                style={{
                  background: "rgba(123,75,245,.07)",
                  color: "#7B4BF5",
                  border: "1px solid rgba(123,75,245,.14)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="flex gap-2">

          {/* Bouton principal Stripe labellisé */}
          <button
            type="button"
            onClick={handleMainAction}
            disabled={isLoading !== null}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[11px] font-bold text-white transition-all active:scale-95 disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
              boxShadow: "0 2px 10px rgba(123,75,245,.3)",
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

          {/* Bouton Lock / Unlock */}
          <button
            type="button"
            onClick={handleMainAction}
            disabled={isLoading !== null}
            className="flex flex-shrink-0 items-center justify-center rounded-2xl px-3 py-2.5 transition-all active:scale-95"
            style={
              isUnlocked
                ? { background: "rgba(22,163,74,.07)", border: "1px solid rgba(22,163,74,.2)", color: "#16a34a" }
                : mode === "PPV"
                  ? { background: "rgba(245,75,143,.07)", border: "1px solid rgba(245,75,143,.2)", color: "#e11d48" }
                  : { background: "rgba(123,75,245,.07)", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }
            }
          >
            {isUnlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          </button>

        </div>
      </div>
    </article>
  );
}
