"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowUpRight, Lock, Check, Loader2 } from "lucide-react";
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

      // Si le serveur dit OUI, on simule le déblocage côté UI
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

  const statusLabel = (() => {
    if (isUnlocked) return "Débloqué";
    if (item.access === "FREE") return "Gratuit";
    if (item.access === "ABO") return "Abonnement requis";
    if (item.access === "PPV") return "PPV requis";
    return null;
  })();

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Canevas Magic Studio : Avant / Après */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        {/* 2 colonnes Avant / Après */}
        <div className="grid grid-cols-2">
          <MediaSlot src={beforeUrl} alt={`${item.title} - Avant`} />
          <MediaSlot src={afterUrl} alt={`${item.title} - Après`} />
        </div>

        {/* Fine ligne blanche au centre */}
        <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />

        {/* Badge d’état (lock / débloqué) en haut à gauche */}
        {statusLabel && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/65 px-3 py-1 text-xs text-white">
            {isUnlocked ? (
              <Check className="h-3 w-3" />
            ) : (
              <Lock className="h-3 w-3" />
            )}
            <span>{statusLabel}</span>
          </div>
        )}

        {/* Avatar + handle au centre (clic → Meet me) */}
        <Link
          href="/meet"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-1 rounded-full bg-white/95 px-4 py-2 shadow">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
              <Image
                src={avatar}
                alt={creator?.name ?? item.user}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-slate-800">
              @{item.user}
            </span>
          </div>
        </Link>

        {/* Flèche + menu FREE / Abo / PPV */}
        <div className="absolute right-2 top-2">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            <ArrowUpRight className="h-4 w-4 text-slate-700" />
          </button>

          {menuOpen && (
            <div className="mt-2 w-44 rounded-2xl bg-white/95 shadow-lg border border-slate-200 text-xs overflow-hidden">
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

        {/* Handle en bas à gauche (→ Meet me) */}
        <Link
          href="/meet"
          className="absolute bottom-2 left-2 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white hover:bg-black"
        >
          @{item.user}
        </Link>

        {/* Like en bas à droite */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          <Heart className="h-3 w-3" />
          <span>60</span>
        </div>
      </div>

      {/* Bas de carte : vues + hashtags */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="font-medium">{item.views.toLocaleString()}</span>
          <span>vues</span>
        </div>
        <div className="flex gap-2 text-[11px]">
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
