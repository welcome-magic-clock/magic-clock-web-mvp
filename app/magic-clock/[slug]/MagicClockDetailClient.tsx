"use client";
// app/magic-clock/[slug]/MagicClockDetailClient.tsx
// ✅ v4.0 — Étoiles 5 grises par défaut → gradient + chiffre quand noté
//           Bloc créateur : 5 étoiles grises si creatorRatingAvg null
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Eye, Heart, Star, Gift, Sparkles, CreditCard,
  BadgeCheck, Loader2, Users,
} from "lucide-react";

const GRAD: React.CSSProperties = {
  background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const GRAD_BG = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";
const STAR_GRAD: React.CSSProperties = {
  background: GRAD_BG,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

interface ClockData {
  id: string;
  slug: string;
  title: string;
  gatingMode: "FREE" | "SUB" | "PPV";
  ppvPrice: number | null;
  creatorHandle: string;
  creatorName: string;
  creatorAvatar: string | null;
  creatorBio: string | null;
  creatorFollowers: number;
  beforeUrl: string | null;
  afterUrl: string | null;
  thumbnailUrl: string | null;
  ratingAvg: number | null;
  ratingCount: number;
  creatorRatingAvg: number | null;
  viewsCount: number;
  likesCount: number;
  hashtags: string[];
}

function formatN(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

// ── 5 étoiles universelles : grises si value=undefined, gradient si value renseigné ──
function StarRow({ value, count, size = 11 }: { value?: number; count?: number; size?: number }) {
  const filled = value !== undefined ? Math.round(value) : 0;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: size,
            lineHeight: 1,
            fontWeight: 900,
            ...(s <= filled
              ? { background: GRAD_BG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
              : { color: "#cbd5e1" }),
          }}
        >
          ★
        </span>
      ))}
      {value !== undefined && (
        <>
          <span className="ml-0.5 font-bold" style={{ fontSize: size - 1, ...STAR_GRAD }}>
            {value.toFixed(1)}
          </span>
          {count !== undefined && count > 0 && (
            <span className="ml-0.5 text-slate-300" style={{ fontSize: size - 2 }}>
              ({count})
            </span>
          )}
        </>
      )}
    </span>
  );
}

export default function MagicClockDetailClient({ clock }: { clock: ClockData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showBefore, setShowBefore] = useState(false);

  const [likesCount, setLikesCount] = useState(clock.likesCount);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [viewsCount, setViewsCount] = useState(clock.viewsCount);

  useEffect(() => {
    fetch(`/api/magic-clocks/${clock.id}/view`, { method: "POST" })
      .then(() => setViewsCount((v: number) => v + 1))
      .catch(() => {});

    fetch(`/api/magic-clocks/${clock.id}/liked`)
      .then((r) => r.json())
      .then((data) => { if (data?.liked === true) setLiked(true); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock.id]);

  async function handleLike() {
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((c: number) => (wasLiked ? Math.max(0, c - 1) : c + 1));
    try {
      const res = await fetch(`/api/magic-clocks/${clock.id}/like`, { method: "POST" });
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
    } finally {
      setLikeLoading(false);
    }
  }

  const ppvAmountValue = clock.ppvPrice != null ? Math.round(clock.ppvPrice * 100) : 299;
  const aboAmountValue = 1490;

  const btnCfg =
    clock.gatingMode === "FREE"
      ? { label: "Débloquer gratuitement", Icon: Gift, color: GRAD_BG }
      : clock.gatingMode === "SUB"
      ? { label: "S'abonner pour accéder", Icon: Sparkles, color: GRAD_BG }
      : { label: `Acheter · CHF ${clock.ppvPrice?.toFixed(2) ?? "2.99"}`, Icon: CreditCard, color: GRAD_BG };

  async function handleCTA() {
    setLoading(true);
    try {
      if (clock.gatingMode === "FREE") {
        const params = new URLSearchParams({ magicClockId: clock.id });
        const res = await fetch(`/api/access/free?${params}`);
        if (res.ok) {
          router.push(
            `/access/result?status=ok&contentId=${encodeURIComponent(clock.id)}&creator=${encodeURIComponent("@" + clock.creatorHandle)}&slug=${clock.slug}&title=${encodeURIComponent(clock.title)}&thumb=${encodeURIComponent(clock.thumbnailUrl ?? "")}`
          );
        } else {
          router.push("/access/result?status=error");
        }
      } else {
        const res = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: clock.id,
            contentType: clock.gatingMode === "SUB" ? "subscription" : "ppv",
            amountValue: clock.gatingMode === "SUB" ? aboAmountValue : ppvAmountValue,
            currency: "chf",
            creatorId: clock.creatorHandle,
            buyerCountryCode: "CH",
            studioImageUrl: clock.thumbnailUrl ?? clock.afterUrl ?? "",
            returnUrl: `${window.location.origin}/access/result?contentId=${clock.id}&creator=${encodeURIComponent("@" + clock.creatorHandle)}`,
          }),
        });
        const data = await res.json();
        if (data.status === "mock" || !data.clientSecret) {
          router.push(
            `/access/result?status=ok&contentId=${encodeURIComponent(clock.id)}&creator=${encodeURIComponent("@" + clock.creatorHandle)}`
          );
        } else {
          sessionStorage.setItem("stripe_client_secret", data.clientSecret);
          sessionStorage.setItem("stripe_content_id", clock.id);
          sessionStorage.setItem("stripe_content_type", clock.gatingMode === "SUB" ? "subscription" : "ppv");
          sessionStorage.setItem("stripe_creator", clock.creatorHandle);
          sessionStorage.setItem("stripe_studio_image", clock.thumbnailUrl ?? clock.afterUrl ?? "");
          router.push(`/payment/checkout?contentId=${clock.id}`);
        }
      }
    } catch {
      router.push("/access/result?status=error");
    } finally {
      setLoading(false);
    }
  }

  const displayImg = showBefore ? clock.beforeUrl : clock.afterUrl;

  return (
    <main className="mx-auto max-w-lg pb-32 pt-0 min-h-screen bg-[#f8fafc]">
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{ background: "rgba(248,250,252,0.95)", backdropFilter: "blur(12px)" }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white transition-colors"
          style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </button>
        <h1 className="flex-1 truncate text-[13px] font-bold text-slate-800">{clock.title}</h1>
      </div>

      {/* ── Image Before / After ── */}
      <div className="relative w-full overflow-hidden bg-slate-200" style={{ aspectRatio: "4/5" }}>
        {displayImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayImg}
            alt={clock.title}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Star className="h-16 w-16" />
          </div>
        )}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "35%", background: "linear-gradient(to top,rgba(10,15,30,.6),transparent)" }}
        />
        {clock.beforeUrl && clock.afterUrl && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex rounded-full overflow-hidden"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,.3)" }}
          >
            <button
              type="button"
              onClick={() => setShowBefore(true)}
              className="px-4 py-1.5 text-[11px] font-bold transition-colors"
              style={{ background: showBefore ? "white" : "rgba(255,255,255,.25)", color: showBefore ? "#1e293b" : "white" }}
            >
              Avant
            </button>
            <button
              type="button"
              onClick={() => setShowBefore(false)}
              className="px-4 py-1.5 text-[11px] font-bold transition-colors"
              style={{ background: !showBefore ? "white" : "rgba(255,255,255,.25)", color: !showBefore ? "#1e293b" : "white" }}
            >
              Après
            </button>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
            style={{ background: clock.gatingMode === "FREE" ? "#10b981" : GRAD_BG }}
          >
            {clock.gatingMode === "FREE" ? "FREE" : clock.gatingMode === "SUB" ? "Abonnement" : "PPV"}
          </span>
        </div>
      </div>

      {/* ── Infos ── */}
      <div className="px-4 pt-4 space-y-4">
        {/* Titre + hashtags */}
        <div>
          <h2 className="text-[17px] font-bold text-slate-900">{clock.title}</h2>
          {clock.hashtags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {clock.hashtags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-slate-400">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Stats — étoiles MC + vues + cœur */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {/* ⭐ Étoiles du Magic Clock — 5 grises si pas encore noté */}
          <StarRow
            value={clock.ratingAvg ?? undefined}
            count={clock.ratingCount}
            size={11}
          />
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatN(viewsCount)}
          </span>
          <button
            type="button"
            onClick={handleLike}
            disabled={likeLoading}
            className="flex items-center gap-1 transition-transform active:scale-110 disabled:opacity-60"
            aria-label={liked ? "Je n'aime plus" : "J'aime"}
          >
            <Heart
              className="h-3.5 w-3.5 transition-all"
              style={liked ? { fill: "#F54B8F", color: "#F54B8F", filter: "drop-shadow(0 0 3px #F54B8F88)" } : {}}
            />
            <span style={liked ? { color: "#F54B8F" } : {}}>{formatN(likesCount)}</span>
          </button>
        </div>

        {/* Carte créateur */}
        <Link
          href={`/meet?creator=${encodeURIComponent("@" + clock.creatorHandle)}`}
          className="flex items-center gap-3 rounded-2xl bg-white p-3 transition-colors hover:bg-slate-50"
          style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 1px 6px rgba(0,0,0,.04)" }}
        >
          <div className="relative flex-shrink-0">
            {/* Anneau gradient Magic Clock signature */}
            <div
              className="rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
                padding: 2,
              }}
            >
              <div className="overflow-hidden rounded-full bg-slate-100 flex items-center justify-center"
                style={{ width: 44, height: 44 }}
              >
                {clock.creatorAvatar ? (
                  <Image
                    src={clock.creatorAvatar}
                    alt={clock.creatorName}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[16px] font-bold text-violet-400">
                    {clock.creatorName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold text-slate-800 truncate">{clock.creatorName}</span>
              <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
            </div>
            <span className="text-[11px] text-slate-400">@{clock.creatorHandle}</span>
            {clock.creatorBio && (
              <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{clock.creatorBio}</p>
            )}
          </div>

          {/* Colonne droite : étoiles créateur + followers */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {/* ⭐ Étoiles CRÉATEUR — 5 grises si aucune note, gradient + chiffre si noté */}
            <StarRow
              value={clock.creatorRatingAvg ?? undefined}
              size={10}
            />
            <span className="text-[11px] font-bold" style={GRAD}>{formatN(clock.creatorFollowers)}</span>
            <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
              <Users className="h-2.5 w-2.5" />followers
            </span>
          </div>
        </Link>
      </div>

      {/* ── CTA fixe en bas ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top,rgba(248,250,252,1) 70%,rgba(248,250,252,0))" }}
      >
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={handleCTA}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold text-white transition-all active:scale-[.98] disabled:opacity-70"
            style={{ background: GRAD_BG, boxShadow: "0 4px 20px rgba(123,75,245,.35)" }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <btnCfg.Icon className="h-4 w-4" />
                {btnCfg.label}
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
