"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowUpRight, Lock, Unlock, Loader2 } from "lucide-react";
import type { FeedCard } from "@/core/domain/types";
import { CREATORS } from "@/features/meet/creators";

type Props = {
  item: FeedCard;
};

type AccessKind = "FREE" | "ABO" | "PPV";

function isVideo(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

function MediaSlot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/5]">
      {isVideo(src) ? (
        <video
          src={src}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image src={src} alt={alt} fill className="object-cover" />
      )}
    </div>
  );
}

export default function MediaCard({ item }: Props) {
  // Avatar depuis Meet me
  const creator = CREATORS.find((c) => c.handle === item.user);
  const avatar = creator?.avatar ?? item.image;

  // Pour plus tard : Magic Studio fournira vraiment beforeUrl / afterUrl
  const beforeUrl = (item as any).beforeUrl ?? item.image;
  const afterUrl = (item as any).afterUrl ?? item.image;

  // État d’accès local (simulation UI)
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<AccessKind | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(item.access === "FREE");
  const [lastDecision, setLastDecision] = useState<string | null>(null);

  async function handleAccess(kind: AccessKind) {
    setIsLoading(kind);
    try {
      let url: string;
      let body: any;

      if (kind === "FREE") {
        url = "/api/access/free";
        body = { contentId: item.id, creatorHandle: item.user };
      } else if (kind === "ABO") {
        url = "/api/access/subscription";
        body = { creatorHandle: item.user, contentId: item.id };
      } else {
        url = "/api/access/ppv";
        body = { contentId: item.id, creatorHandle: item.user };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Access API error", await res.text());
        setLastDecision("ERROR");
        return;
      }

      const data = await res.json();
      setLastDecision(data.decision ?? null);

      if (data.decision === "ALLOWED") {
        setIsUnlocked(true);
      }
    } catch (err) {
      console.error(err);
      setLastDecision("ERROR");
    } finally {
      setIsLoading(null);
      setMenuOpen(false);
    }
  }

  const accessLabelBase =
    item.access === "FREE"
      ? "FREE"
      : item.access === "ABO"
      ? "Abonnement"
      : item.access === "PPV"
      ? "Pay Per View"
      : "";

  const accessLabel = isUnlocked
    ? item.access === "FREE"
      ? "FREE"
      : item.access === "ABO"
      ? "Abonnement actif"
      : "PPV débloqué"
    : accessLabelBase;

  const isLocked = !isUnlocked && item.access !== "FREE";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Canevas Magic Studio : Avant / Après */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        {/* 2 colonnes Avant / Après */}
        <div className="grid grid-cols-2">
          <MediaSlot src={beforeUrl} alt={`${item.title} - Avant`} />
          <MediaSlot src={afterUrl} alt={`${item.title} - Après`} />
        </div>

        {/* Fine ligne blanche au centre */}
        <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />

        {/* Avatar centré (clic → Meet me) */}
        <Link
          href="/meet"
          className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-label={`Voir le profil de ${creator?.name ?? item.user}`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-white/10 shadow-sm">
            <Image
              src={avatar}
              alt={creator?.name ?? item.user}
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          </div>
        </Link>

        {/* Flèche + menu FREE / Abo / PPV (ultra épuré) */}
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center text-white drop-shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label="Options d’accès"
          >
            <ArrowUpRight className="h-5 w-5" />
          </button>

          {menuOpen && (
            <div className="mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 text-xs shadow-lg">
              {/* Meet me */}
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false);
                  window.location.href = "/meet";
                }}
              >
                Meet me (profil créateur)
              </button>

              {/* FREE (si contenu marqué FREE) */}
              {item.access === "FREE" && (
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left hover:bg-slate-50"
                  onClick={() => handleAccess("FREE")}
                  disabled={isLoading === "FREE"}
                >
                  {isLoading === "FREE" ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Vérification FREE…</span>
                    </span>
                  ) : (
                    "Débloquer (FREE)"
                  )}
                </button>
              )}

              {/* Abo */}
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => handleAccess("ABO")}
                disabled={isLoading === "ABO"}
              >
                {isLoading === "ABO" ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Activation Abo…</span>
                  </span>
                ) : (
                  "Activer l’abonnement créateur"
                )}
              </button>

              {/* PPV */}
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => handleAccess("PPV")}
                disabled={isLoading === "PPV"}
              >
                {isLoading === "PPV" ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Déblocage PPV…</span>
                  </span>
                ) : (
                  "Débloquer ce contenu en PPV"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bas de carte : 2 lignes ultra épurées */}
      <div className="mt-3 space-y-1 text-xs">
        {/* Ligne 1 : créateur · vues · likes · statut accès */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
          <span className="font-medium">
            {creator?.name ?? item.user}
          </span>
          <span className="text-slate-400">@{item.user}</span>

          <span className="h-[3px] w-[3px] rounded-full bg-slate-300" />

          <span>
            <span className="font-medium">
              {item.views.toLocaleString()}
            </span>{" "}
            vues
          </span>

          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>60</span>
          </span>

          <span className="flex items-center gap-1">
            {isLocked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
            <span>{accessLabel}</span>
          </span>
        </div>

        {/* Ligne 2 : titre + hashtags */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          {item.title && (
            <span className="font-medium text-slate-800">
              {item.title}
            </span>
          )}
          <span className="text-brand-600">#coiffure</span>
          <span className="text-brand-600">#color</span>
        </div>
      </div>

      {/* Debug léger : décision access renvoyée par le backend */}
      {lastDecision && (
        <p className="mt-1 text-[10px] text-slate-400">
          Décision accès : {lastDecision}
        </p>
      )}
    </article>
  );
}
