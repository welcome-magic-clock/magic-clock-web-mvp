// app/mymagic/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MyMagicToolbar from "@/components/mymagic/MyMagicToolbar";
import MediaCard from "@/features/amazing/MediaCard";
import { listFeed, listCreators } from "@/core/domain/repository";
import Cockpit from "@/features/monet/Cockpit";
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import { Heart, Lock, Unlock, ArrowUpRight } from "lucide-react";
import type { FeedCard } from "@/core/domain/types";
import {
  getCreatedWorks,
  type StoredMagicClockWork,
} from "@/core/domain/magicClockWorkStore";


type PublishMode = "FREE" | "SUB" | "PPV";
type MyMagicTab = "creations" | "bibliotheque";

const FALLBACK_BEFORE = "/images/examples/balayage-before.jpg";
const FALLBACK_AFTER = "/images/examples/balayage-after.jpg";

function isVideo(url: string) {
  if (!url) return false;
  if (url.startsWith("data:video/")) return true;
  if (url.startsWith("blob:")) return true;

  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg");
}

function StudioMediaSlot({
  src,
  alt,
  coverTime,
}: {
  src: string;
  alt: string;
  coverTime?: number | null;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isVideo(src)) return;
    if (coverTime == null) return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const seekToCover = () => {
      const duration = videoEl.duration;
      let target = coverTime;

      if (Number.isFinite(duration) && duration > 0) {
        target = Math.max(0, Math.min(coverTime, duration));
      }

      try {
        videoEl.currentTime = target;
        videoEl.pause();
      } catch (error) {
        console.error("Failed to seek cover frame", error);
      }
    };

    if (videoEl.readyState >= 1) {
      seekToCover();
    } else {
      videoEl.addEventListener("loadedmetadata", seekToCover);
      return () => {
        videoEl.removeEventListener("loadedmetadata", seekToCover);
      };
    }
  }, [src, coverTime]);

  return (
    <div className="relative h-full w-full">
      {isVideo(src) ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          muted
          playsInline
          autoPlay={!coverTime}
          loop={!coverTime}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  );
}

function normalizeTab(raw: string | null): MyMagicTab {
  const v = (raw ?? "").trim().toLowerCase();
  if (v === "bibliotheque" || v === "bibliothèque" || v === "library" || v === "acquis") return "bibliotheque";
  return "creations";
}

export default function MyMagicClient() {

  const router = useRouter();
  const searchParams = useSearchParams();

    // 🔹 Magic Clock publiés (stockés en localStorage)
  const [createdWorks, setCreatedWorks] = useState<StoredMagicClockWork[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCreatedWorks(getCreatedWorks());
  }, []);

  // ✅ Query params
  const tabParam = searchParams.get("tab");
  const openParam = searchParams.get("open");

  // ✅ State onglets
  const [activeTab, setActiveTab] = useState<MyMagicTab>(() => normalizeTab(tabParam));

  // 🔁 Si l’URL change (ex: /mymagic?tab=bibliotheque&open=...), on sync le state
  useEffect(() => {
    setActiveTab(normalizeTab(tabParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  const creators = listCreators();
  const currentCreator = creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];
  const followerLabel = currentCreator.followers.toLocaleString("fr-CH");

  const all: FeedCard[] = listFeed();

  const normalize = (value?: string | null) =>
    (value ?? "").trim().replace(/^@/, "").toLowerCase();

  const targetHandle = normalize((currentCreator as any).handle);

  const isOwnedByCurrent = (item: any) => {
    const candidates = [(item as any).user, (item as any).handle, (item as any).creatorHandle];
    return candidates.map((v) => normalize(v)).includes(targetHandle);
  };

  const created = all.filter((item) => isOwnedByCurrent(item));
  const purchased = all.filter((item) => !isOwnedByCurrent(item));

  // ✅ Refs pour scroll sur item “open”
  const purchasedRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!openParam) return;
    // on force Bibliothèque si open est présent
    setActiveTab("bibliotheque");

    // petit délai pour laisser le DOM rendre la grille
    const t = window.setTimeout(() => {
      const key = String(openParam);
      const el = purchasedRefs.current[key];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);

    return () => window.clearTimeout(t);
  }, [openParam]);

  const setTabInUrl = (tab: MyMagicTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    // on garde open uniquement si on est en bibliothèque
    if (tab !== "bibliotheque") params.delete("open");
    router.replace(`/mymagic?${params.toString()}`);
  };

  // -------- Draft venant de Magic Studio / Magic Display ----------
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftBefore, setDraftBefore] = useState<string | null>(null);
  const [draftAfter, setDraftAfter] = useState<string | null>(null);
  const [draftBeforeCover, setDraftBeforeCover] = useState<number | null>(null);
  const [draftAfterCover, setDraftAfterCover] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftMode, setDraftMode] = useState<PublishMode>("FREE");
  const [draftPpvPrice, setDraftPpvPrice] = useState<number | null>(null);
  const [draftHashtags, setDraftHashtags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_FORWARD_KEY);
      if (!raw) {
        setDraftLoaded(true);
        return;
      }

      const payload = JSON.parse(raw) as StudioForwardPayload;

      if (payload.before?.url) setDraftBefore(payload.before.url);
      if (payload.after?.url) setDraftAfter(payload.after.url);
      if (typeof payload.before?.coverTime === "number") setDraftBeforeCover(payload.before.coverTime);
      if (typeof payload.after?.coverTime === "number") setDraftAfterCover(payload.after.coverTime);

      if (payload.title) setDraftTitle(payload.title);
      if (payload.mode) setDraftMode((payload.mode as PublishMode) ?? "FREE");
      if (typeof payload.ppvPrice === "number") setDraftPpvPrice(payload.ppvPrice);

      if (Array.isArray(payload.hashtags)) {
        const tags = payload.hashtags
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
        setDraftHashtags(tags);
      }
    } catch (error) {
      console.error("Failed to read Magic Studio payload in My Magic", error);
    } finally {
      setDraftLoaded(true);
    }
  }, []);

  const beforePreview = draftBefore ?? draftAfter ?? FALLBACK_BEFORE;
  const afterPreview = draftAfter ?? draftBefore ?? FALLBACK_AFTER;
  const effectiveTitle = draftTitle.trim();

  const beforeCoverTime =
    draftBefore && beforePreview === draftBefore
      ? draftBeforeCover
      : draftAfter && beforePreview === draftAfter
      ? draftAfterCover
      : null;

  const afterCoverTime =
    draftAfter && afterPreview === draftAfter
      ? draftAfterCover
      : draftBefore && afterPreview === draftBefore
      ? draftBeforeCover
      : null;

  const accessLabel =
    draftMode === "FREE" ? "FREE" : draftMode === "SUB" ? "Abonnement" : "PayPerView";
  const isLockedPreview = draftMode !== "FREE";
  const effectiveHashtags = draftHashtags.length > 0 ? draftHashtags : ["#coiffure", "#color"];

  const mockViews = 0;
  const mockLikes = 0;

  const creatorAvatar = currentCreator.avatar;
  const creatorHandleRaw = (currentCreator as any).handle ?? "@aiko_tanaka";
  const creatorHandle = creatorHandleRaw.startsWith("@") ? creatorHandleRaw : `@${creatorHandleRaw}`;

  return (
   <main className="mx-auto max-w-5xl px-4 pb-36 pt-4 sm:px-6 sm:pt-8 sm:pb-40">
      {/* Avatar + infos créateur */}
      <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentCreator.avatar}
              alt={currentCreator.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{currentCreator.name}</h1>
            <p className="text-sm text-slate-600">
              {creatorHandle}
              {currentCreator.city ? ` · ${currentCreator.city} (CH)` : ""}
              {currentCreator.langs?.length ? ` · Langues : ${currentCreator.langs.join(", ")}` : ""}
            </p>
            <p className="text-xs text-slate-500">
              {followerLabel} followers · {created.length} Magic Clock créés ·{" "}
              {purchased.length} Magic Clock débloqués (MVP)
            </p>
          </div>
        </div>
      </header>

      {/* 🔵 Toolbar existante (on la garde) */}
    <MyMagicToolbar />

      {/* ✅ Onglets MVP (ceux-là pilotent réellement la page) */}
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTabInUrl("creations")}
          className={
            activeTab === "creations"
              ? "rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              : "rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700"
          }
        >
          Créations
        </button>
        <button
          type="button"
          onClick={() => setTabInUrl("bibliotheque")}
          className={
            activeTab === "bibliotheque"
              ? "rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              : "rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700"
          }
        >
          Bibliothèque
        </button>
      </div>

      {/* PROFIL + COCKPIT RÉSUMÉ */}
      <section id="mymagic-profile" className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Profil</h2>
          <p className="text-sm text-slate-600">
            Coiffeuse-coloriste professionnelle spécialisée dans les balayages blonds, les blonds lumineux
            et les transformations en douceur. Aiko partage ses techniques étape par étape à travers des
            Magic Clock pédagogiques, pour t&apos;aider à reproduire des résultats salon sur mesure et
            respectueux de la fibre.
          </p>
        </div>

        <div id="mymagic-cockpit" className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
          <h2 className="text-lg font-semibold">Résumé Cockpit</h2>
          <Cockpit mode="compact" followers={currentCreator.followers} />
          <a
            href="/monet"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline"
          >
            Ouvrir le cockpit complet <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      {/* ========================= */}
      {/* TAB: CRÉATIONS            */}
      {/* ========================= */}
      {activeTab === "creations" && (
        <section id="mymagic-created" className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold">Mes Magic Clock créés</h2>
          <p className="text-sm text-slate-600">
            Ici apparaissent tes propres Magic Clock (Studio + Display). Pour le MVP, nous réutilisons les
            contenus du flux Amazing créés par ton profil et nous préparons déjà les catégories « En cours »
            et « Publiés ».
          </p>

          {/* En cours */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">En cours</h3>
            <p className="text-xs text-slate-600">
              Magic Clock en construction (MVP : même visuel que dans Magic Display, en attendant le vrai statut « draft »).
            </p>

            {draftLoaded && (draftBefore || draftAfter) ? (
              <div className="mt-2 max-w-md">
                <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="relative mx-auto aspect-[4/5] w-full">
                      <div className="grid h-full w-full grid-cols-2">
                        <StudioMediaSlot
                          src={beforePreview}
                          alt={`${effectiveTitle || "Magic Studio"} - Avant`}
                          coverTime={beforeCoverTime}
                        />
                        <StudioMediaSlot
                          src={afterPreview}
                          alt={`${effectiveTitle || "Magic Studio"} - Après`}
                          coverTime={afterCoverTime}
                        />
                      </div>

                      <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />

                      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-white/10 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={creatorAvatar}
                            alt={currentCreator.name}
                            className="h-[72px] w-[72px] rounded-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="pointer-events-none absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
                      <span className="font-medium">{currentCreator.name}</span>
                      <span className="text-slate-400">{creatorHandle}</span>

                      <span className="h-[3px] w-[3px] rounded-full bg-slate-300" />

                      <span>
                        <span className="font-medium">{mockViews.toLocaleString("fr-CH")}</span> vues
                      </span>

                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{mockLikes}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        {isLockedPreview ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        <span>{accessLabel}</span>
                        {draftMode === "PPV" && draftPpvPrice != null && (
                          <span className="ml-1 text-[11px] text-slate-500">· {draftPpvPrice.toFixed(2)} CHF</span>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                      {effectiveTitle && <span className="font-medium text-slate-800">{effectiveTitle}</span>}
                      {effectiveHashtags.map((tag) => (
                        <span key={tag} className="text-brand-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">Aucun Magic Clock en cours pour l&apos;instant.</p>
            )}
          </div>

                   

          {/* Publiés sur Amazing */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-900">Publiés sur Amazing</h3>
            <p className="text-xs text-slate-600">
              Magic Clock déjà visibles dans le flux Amazing (contenus publics publiés depuis ton profil).
            </p>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {created.map((item) => (
                <MediaCard key={String(item.id)} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================= */}
      {/* TAB: BIBLIOTHÈQUE         */}
      {/* ========================= */}
      {activeTab === "bibliotheque" && (
        <section id="mymagic-unlocked" className="space-y-3">
          <h2 className="text-lg font-semibold">Bibliothèque (Acquis)</h2>
          <p className="text-sm text-slate-600">
            Tout ce qui a été débloqué (FREE / Abonnement / PPV) + l’ours d’onboarding.
            (MVP : on affiche les contenus “autres créateurs” du flux Amazing.)
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {purchased.map((item) => {
              const isOpen = openParam && String(item.id) === String(openParam);
              return (
                <div
                  key={String(item.id)}
                  ref={(el) => {
                    purchasedRefs.current[String(item.id)] = el;
                  }}
                  className={isOpen ? "rounded-2xl ring-2 ring-brand-500 ring-offset-2" : undefined}
                >
                  <div className="space-y-2">
                    <MediaCard item={item} />

        <Link
  href={`/display/${encodeURIComponent(String(item.id))}`}
  prefetch={false}
  className="block text-left text-[11px] font-medium text-brand-600 hover:underline"
>
  Ouvrir le Magic Display (MVP)
</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
