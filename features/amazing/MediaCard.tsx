"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ArrowUpRight,
  Lock,
  Unlock,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import type { FeedCard } from "@/core/domain/types";
import { CREATORS } from "@/features/meet/creators";
import { useRouter } from "next/navigation";

type PublishMode = "FREE" | "SUB" | "PPV";
type AccessKind = "FREE" | "ABO" | "PPV";

type Props = {
  item: FeedCard;
};

const FALLBACK_BEFORE = "/images/examples/balayage-before.jpg";
const FALLBACK_AFTER  = "/images/examples/balayage-after.jpg";

function isVideo(url: string | null | undefined) {
  if (!url) return false;
  if (url.startsWith("data:video/")) return true;
  if (url.startsWith("blob:"))       return true;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg")
  );
}

type AutoPlayVideoProps = { src: string; poster?: string; alt?: string };

function AutoPlayVideo({ src, poster, alt }: AutoPlayVideoProps) {
  const videoRef     = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const videoEl     = videoRef.current;
    const containerEl = containerRef.current;
    if (!videoEl || !containerEl) return;

    videoEl.muted      = true;
    videoEl.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoEl) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
            try { videoEl.currentTime = 0; } catch { /* ignore */ }
          }
        });
      },
      { threshold: [0.6] },
    );
    observer.observe(containerEl);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        loop muted playsInline
      >
        {alt ? <track kind="descriptions" label={alt} /> : null}
      </video>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helper : lancer le checkout Stripe et rediriger
// ─────────────────────────────────────────────────────────────

async function launchStripeCheckout({
  contentId,
  contentType,
  amountValue,
  currency,
  creatorId,
  creatorHandle,
}: {
  contentId: string;
  contentType: "ppv" | "subscription";
  amountValue: number;
  currency: string;
  creatorId: string;
  creatorHandle: string;
}): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentId,
      contentType,
      amountValue,
      currency: currency.toLowerCase(),
      buyerId: "guest-buyer", // remplacé par Supabase auth en prod
      creatorId,
      buyerCountryCode: "CH",
      returnUrl: `${window.location.origin}/payment/result?contentId=${contentId}&creator=${creatorHandle}&contentType=${contentType}`,
    }),
  });

  const data = await response.json() as {
    ok: boolean;
    clientSecret?: string;
    status?: string;
    error?: string;
  };

  if (!data.ok) return { ok: false, error: data.error ?? "Erreur paiement" };

  // Mode mock → redirection directe vers /payment/result
  if (data.status === "mock" || !data.clientSecret) {
    window.location.href =
      `/payment/result?status=authorized&mock=true` +
      `&contentId=${contentId}` +
      `&creator=${creatorHandle}` +
      `&contentType=${contentType}`;
    return { ok: true };
  }

  // Mode prod → stocker clientSecret et aller sur /payment/checkout
  sessionStorage.setItem("stripe_client_secret", data.clientSecret);
  sessionStorage.setItem("stripe_content_id", contentId);
  sessionStorage.setItem("stripe_content_type", contentType);
  sessionStorage.setItem("stripe_creator", creatorHandle);
  window.location.href = `/payment/checkout?contentId=${contentId}`;
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

export default function MediaCard({ item }: Props) {
  const router = useRouter();

  // ---------- Créateur & avatar ----------
  const cleanUserHandle = item.user.startsWith("@")
    ? item.user.slice(1)
    : item.user;
  const creator = CREATORS.find((c) => {
    const cleanCreatorHandle = c.handle.startsWith("@")
      ? c.handle.slice(1)
      : c.handle;
    return cleanCreatorHandle === cleanUserHandle;
  }) ?? null;

  const creatorName   = creator?.name   ?? item.user;
  const creatorHandle = creator?.handle ?? `@${cleanUserHandle}`;
  const meetHref      = `/meet?creator=${encodeURIComponent(creatorHandle)}`;

  // ---------- Flags système ----------
  const isSystemUnlockedForAll =
    (item as any).isSystemUnlockedForAll === true;
  const isSystemCard =
    (item as any).isSystemFeatured === true || isSystemUnlockedForAll;

  // ---------- Mode, prix, hashtags ----------
  const modeFromItem = (item as any).mode as PublishMode | undefined;
  const mode: PublishMode =
    modeFromItem ??
    (item.access === "PPV" ? "PPV" : item.access === "ABO" ? "SUB" : "FREE");

  const ppvPrice: number | null =
    typeof (item as any).ppvPrice === "number"
      ? ((item as any).ppvPrice as number)
      : null;

  // Prix en centimes pour Stripe
  const ppvAmountValue  = ppvPrice != null ? Math.round(ppvPrice * 100) : 299;
  const aboAmountValue  = 1490; // 14.90 CHF — à connecter Supabase en prod
  const currency        = "CHF";

  const rawHashtags =
    (item as any).hashtags && Array.isArray((item as any).hashtags)
      ? ((item as any).hashtags as string[])
      : [];
  const displayHashtags =
    rawHashtags.length > 0 ? rawHashtags : ["#coiffure", "#magicclock"];

  const title  = item.title ?? "Magic Clock";
  const views  =
    typeof item.views === "number"
      ? item.views
      : typeof (item as any).stats?.views === "number"
        ? ((item as any).stats.views as number)
        : 0;
  const likes  =
    typeof (item as any).likes === "number"
      ? ((item as any).likes as number)
      : typeof (item as any).stats?.likes === "number"
        ? ((item as any).stats.likes as number)
        : 0;

  // ---------- Médias ----------
  const beforeThumb: string =
    ((item as any).beforeThumbnail as string | undefined) ??
    ((item as any).beforeThumb   as string | undefined) ??
    (item.beforeUrl              as string | undefined) ??
    item.image ?? FALLBACK_BEFORE;

  const afterThumb: string =
    ((item as any).afterThumbnail as string | undefined) ??
    ((item as any).afterThumb    as string | undefined) ??
    (item.afterUrl               as string | undefined) ??
    item.image ?? FALLBACK_AFTER;

  const beforeUrl    = item.beforeUrl;
  const afterUrl     = item.afterUrl;
  const heroVideoSrc = isVideo(afterUrl)
    ? (afterUrl as string)
    : isVideo(beforeUrl)
      ? (beforeUrl as string)
      : null;

  // ---------- Avatar ----------
  const systemAvatar = "/images/magic-clock-bear/avatar.png";
  const avatar: string = isSystemCard
    ? systemAvatar
    : creator?.avatar ?? item.image ?? afterThumb ?? beforeThumb;

  const isCertified =
    (item as any).isCertified === true ||
    (creator && (creator as any).isCertified === true);

  // ---------- État local ----------
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [isLoading,   setIsLoading]   = useState<AccessKind | null>(null);
  const [isUnlocked,  setIsUnlocked]  = useState(
    mode === "FREE" || isSystemUnlockedForAll,
  );
  const [lastDecision, setLastDecision] = useState<string | null>(null);

  const accessLabelBase =
    mode === "FREE" ? "FREE" : mode === "SUB" ? "Abonnement" : "Pay Per View";
  const accessLabel = isUnlocked
    ? mode === "FREE"
      ? "FREE"
      : mode === "SUB"
        ? "Abonnement actif"
        : "PPV débloqué"
    : accessLabelBase;
  const isLocked = !isUnlocked && mode !== "FREE";

  // ---------- Handlers ----------

  async function handleFreeAccess() {
    setIsLoading("FREE");
    setMenuOpen(false);
    try {
      // La route /api/access/free attend un GET avec ?magicClockId=
      const params = new URLSearchParams({ magicClockId: String(item.id) });
      const res = await fetch(`/api/access/free?${params.toString()}`, {
        method: "GET",
      });
      if (res.ok) {
        setIsUnlocked(true);
        window.location.href =
          `/access/result?status=ok` +
          `&contentId=${encodeURIComponent(String(item.id))}` +
          `&creator=${encodeURIComponent(creatorHandle)}`;
      } else {
        window.location.href = `/access/result?status=error`;
      }
    } catch {
      window.location.href = `/access/result?status=error`;
    } finally {
      setIsLoading(null);
    }
  }

  async function handlePPV() {
    setIsLoading("PPV");
    setMenuOpen(false);
    try {
      const result = await launchStripeCheckout({
        contentId:   String(item.id),
        contentType: "ppv",
        amountValue: ppvAmountValue,
        currency,
        creatorId:   cleanUserHandle,
        creatorHandle,
      });
      if (!result.ok) setLastDecision("ERROR");
    } catch {
      setLastDecision("ERROR");
    } finally {
      setIsLoading(null);
    }
  }

  async function handleSubscription() {
    setIsLoading("ABO");
    setMenuOpen(false);
    try {
      const result = await launchStripeCheckout({
        contentId:   String(item.id),
        contentType: "subscription",
        amountValue: aboAmountValue,
        currency,
        creatorId:   cleanUserHandle,
        creatorHandle,
      });
      if (!result.ok) setLastDecision("ERROR");
    } catch {
      setLastDecision("ERROR");
    } finally {
      setIsLoading(null);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Rendu
  // ─────────────────────────────────────────────────────────────

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm transition-shadow hover:shadow-md">

      {/* Zone média */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">

          {heroVideoSrc ? (
            <AutoPlayVideo
              src={heroVideoSrc}
              poster={afterThumb || beforeThumb}
              alt={title}
            />
          ) : (
            <div className="grid h-full w-full grid-cols-2">
              {/* Avant */}
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beforeThumb}
                  alt={`${title} - Avant`}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Après */}
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={afterThumb}
                  alt={`${title} - Après`}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Ligne centrale */}
              <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />
            </div>
          )}

          {/* Avatar centré */}
          <Link
            href={meetHref}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            aria-label={`Voir le profil de ${creatorName}`}
            data-interactive="true"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-white/10 shadow-sm">
              <Image
                src={avatar}
                alt={creatorName}
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            </div>
          </Link>

          {/* ── Flèche + menu ── */}
          <div className="absolute right-3 top-3 z-10 text-right text-[11px] text-white">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center drop-shadow-md"
              data-interactive="true"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              aria-label="Options d'accès"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </button>

            {menuOpen && (
              <div className="mt-1 space-y-1 [text-shadow:0_0_8px_rgba(0,0,0,0.85)]">
                {isSystemCard && isSystemUnlockedForAll ? (
                  <>
                    <button
                      type="button"
                      className="block w-full bg-transparent px-0 py-0 hover:underline"
                      data-interactive="true"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(false);
                        router.push(meetHref);
                      }}
                    >
                      Meet me (profil créateur)
                    </button>
                    <button
                      type="button"
                      className="block w-full bg-transparent px-0 py-0 hover:underline"
                      data-interactive="true"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(false);
                        window.location.href =
                          "/mymagic?tab=bibliotheque&open=mcw-onboarding-bear-001";
                      }}
                    >
                      Voir dans My Magic Clock
                    </button>
                  </>
                ) : (
                  <>
                    {/* Meet me */}
                    <button
                      type="button"
                      className="block w-full bg-transparent px-0 py-0 hover:underline"
                      data-interactive="true"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(false);
                        router.push(meetHref);
                      }}
                    >
                      Meet me (profil créateur)
                    </button>

                    {/* FREE */}
                    {mode === "FREE" && (
                      <button
                        type="button"
                        className="block w-full bg-transparent px-0 py-0 hover:underline"
                        data-interactive="true"
                        disabled={isLoading === "FREE"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFreeAccess();
                        }}
                      >
                        {isLoading === "FREE"
                          ? "Vérification…"
                          : "Débloquer (FREE)"}
                      </button>
                    )}

                    {/* ABONNEMENT → Stripe */}
                    <button
                      type="button"
                      className="block w-full bg-transparent px-0 py-0 hover:underline"
                      data-interactive="true"
                      disabled={isLoading === "ABO"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubscription();
                      }}
                    >
                      {isLoading === "ABO"
                        ? "Redirection Stripe…"
                        : "Activer l'abonnement créateur"}
                    </button>

                    {/* PPV → Stripe */}
                    <button
                      type="button"
                      className="block w-full bg-transparent px-0 py-0 hover:underline"
                      data-interactive="true"
                      disabled={isLoading === "PPV"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePPV();
                      }}
                    >
                      {isLoading === "PPV"
                        ? "Redirection Stripe…"
                        : ppvPrice != null
                          ? `Débloquer en PPV — ${ppvPrice.toFixed(2)} CHF`
                          : "Débloquer ce contenu en PPV"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bas de carte */}
      <div className="mt-3 space-y-1 text-xs">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
          <Link
            href={meetHref}
            className="font-medium hover:underline"
            data-interactive="true"
          >
            {creatorName}
          </Link>
          <Link
            href={meetHref}
            className="text-slate-400 hover:underline"
            data-interactive="true"
          >
            {creatorHandle}
          </Link>
          {isCertified && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              <span>Certifié</span>
            </span>
          )}
          <span className="h-[3px] w-[3px] rounded-full bg-slate-300" />
          <span>
            <span className="font-medium">{views.toLocaleString("fr-CH")}</span>{" "}vues
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{likes.toLocaleString("fr-CH")}</span>
          </span>
          {mode && (
            <span className="flex items-center gap-1">
              {isLocked ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Unlock className="h-3 w-3" />
              )}
              <span>{accessLabel}</span>
              {mode === "PPV" && ppvPrice != null && (
                <span className="ml-1 text-[11px] text-slate-500">
                  · {ppvPrice.toFixed(2)} CHF
                </span>
              )}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          {title && (
            <span className="font-medium text-slate-800 line-clamp-2">
              {title}
            </span>
          )}
          {displayHashtags.map((tag) => (
            <span key={tag} className="text-brand-600">
              {tag}
            </span>
          ))}
        </div>

        {lastDecision && (
          <p className="mt-1 text-[10px] text-slate-400">
            Décision accès : {lastDecision}
          </p>
        )}
      </div>
    </article>
  );
}
