// app/mymagic/MyMagicClient.tsx
// ✅ Séparation nette :
//    CRÉATEUR → onglet Créations  → ses Magic Clocks publiés
//    CLIENT   → onglet Bibliothèque → ses Magic Clocks acquis
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MyMagicToolbar from "@/components/mymagic/MyMagicToolbar";
import ProfileSection from "@/components/mymagic/ProfileSection";
import Cockpit from "@/features/monet/Cockpit";
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import { Heart, Lock, Unlock, ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import type { AcquiredMagicClockRow } from "./page";

type PublishMode = "FREE" | "SUB" | "PPV";
type MyMagicTab = "creations" | "bibliotheque";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export type SupabaseMagicClockRow = {
  id: string;
  slug: string | null;
  creator_handle: string | null;
  creator_name: string | null;
  title: string | null;
  gating_mode: "FREE" | "SUB" | "PPV" | null;
  ppv_price: number | null;
  created_at: string | null;
  work: any | null;
};

type MyMagicClientProps = {
  initialPublished?: SupabaseMagicClockRow[];
  initialAcquired?: AcquiredMagicClockRow[];
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const FALLBACK_BEFORE = "/images/magic-clock-bear/before.jpg";
const FALLBACK_AFTER = "/images/magic-clock-bear/after.jpg";

function isVideo(url: string) {
  if (!url) return false;
  if (url.startsWith("data:video/") || url.startsWith("blob:")) return true;
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg");
}

function StudioMediaSlot({ src, alt, coverTime }: { src: string; alt: string; coverTime?: number | null }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!isVideo(src) || coverTime == null) return;
    const v = videoRef.current;
    if (!v) return;
    const seek = () => {
      try { v.currentTime = coverTime; v.pause(); } catch {}
    };
    if (v.readyState >= 1) seek();
    else { v.addEventListener("loadedmetadata", seek); return () => v.removeEventListener("loadedmetadata", seek); }
  }, [src, coverTime]);

  return (
    <div className="relative h-full w-full">
      {isVideo(src) ? (
        <video ref={videoRef} src={src} className="h-full w-full object-cover" muted playsInline autoPlay={!coverTime} loop={!coverTime} />
      ) : (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  );
}

// Lien vers Display — par slug si disponible, sinon par id
function displayHref(id: string, slug?: string | null): string {
  if (slug) return `/magic-clock-display?slug=${encodeURIComponent(slug)}`;
  return `/magic-clock-display?id=${encodeURIComponent(id)}`;
}

// ─────────────────────────────────────────────────────────────
// Carte : Magic Clock PUBLIÉ (vue créateur)
// ─────────────────────────────────────────────────────────────
function CreatorCard({
  clock,
  avatarUrl,
  isHighlighted,
  cardRef,
}: {
  clock: SupabaseMagicClockRow;
  avatarUrl: string | null;
  isHighlighted?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const studio = (clock.work as any)?.studio ?? {};
  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
  const afterUrl = typeof studio.afterUrl === "string" ? studio.afterUrl : FALLBACK_AFTER;
  const title = studio.title || clock.title || "Magic Clock";
  const hashtags = (Array.isArray(studio.hashtags) ? studio.hashtags : [])
    .map((t: string) => t.startsWith("#") ? t : `#${t}`);
  const mode = clock.gating_mode ?? "FREE";
  const accessLabel = mode === "FREE" ? "FREE" : mode === "SUB" ? "Abonnement" : "Pay Per View";

  return (
    <article
      ref={cardRef}
      className={`rounded-3xl border bg-white/80 p-3 shadow-sm transition-all ${isHighlighted ? "border-brand-500 ring-2 ring-brand-300 ring-offset-2" : "border-slate-200"}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative mx-auto aspect-[4/5] w-full">
          <div className="grid h-full w-full grid-cols-2">
            <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
            <StudioMediaSlot src={afterUrl} alt={`${title} - Après`} coverTime={studio.afterCoverTime} />
          </div>
          <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-white/10 shadow-sm overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={title} className="h-[72px] w-[72px] rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-brand-600">{title[0]?.toUpperCase()}</span>
              )}
            </div>
          </div>
          <Link
            href={displayHref(clock.id, clock.slug)}
            prefetch={false}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-md"
          >
            <ArrowUpRight className="h-5 w-5" />
            <span className="sr-only">Voir le Magic Display</span>
          </Link>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-xs">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
          <span className="font-medium">{clock.creator_name ?? clock.creator_handle}</span>
          <span className="text-slate-400">@{(clock.creator_handle ?? "").replace(/^@/, "")}</span>
          <span className="flex items-center gap-1">
            {mode === "FREE" ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            <span>{accessLabel}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px]">
          {title && <span className="font-medium text-slate-800">{title}</span>}
          {hashtags.map((tag: string) => <span key={tag} className="text-brand-600">{tag}</span>)}
        </div>
        <Link href={displayHref(clock.id, clock.slug)} prefetch={false} className="mt-1 block text-[11px] font-medium text-brand-600 hover:underline">
          Ouvrir le Magic Display →
        </Link>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte : Magic Clock ACQUIS (vue client)
// ─────────────────────────────────────────────────────────────
function AcquiredCard({
  item,
  isHighlighted,
  cardRef,
}: {
  item: AcquiredMagicClockRow;
  isHighlighted?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const studio = (item.work as any)?.studio ?? {};
  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
  const afterUrl = typeof studio.afterUrl === "string" ? studio.afterUrl : FALLBACK_AFTER;
  const title = studio.title || item.title || "Magic Clock";
  const hashtags = (Array.isArray(studio.hashtags) ? studio.hashtags : [])
    .map((t: string) => t.startsWith("#") ? t : `#${t}`);
  const creatorName = item.creator_name ?? item.creator_handle ?? "";
  const handle = (item.creator_handle ?? "").replace(/^@/, "");
  const accessLabel = item.access_type === "FREE" ? "FREE" : item.access_type === "SUB" ? "Abonnement" : "PPV";

  return (
    <article
      ref={cardRef}
      className={`rounded-3xl border bg-white/80 p-3 shadow-sm transition-all ${isHighlighted ? "border-brand-500 ring-2 ring-brand-300 ring-offset-2" : "border-slate-200"}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative mx-auto aspect-[4/5] w-full">
          <div className="grid h-full w-full grid-cols-2">
            <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
            <StudioMediaSlot src={afterUrl} alt={`${title} - Après`} coverTime={studio.afterCoverTime} />
          </div>
          <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />
          {/* Badge accès */}
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
              <Unlock className="h-3 w-3" /> {accessLabel}
            </span>
          </div>
          {/* Lien Display — débloquer le Magic Clock complet */}
          <Link
            href={displayHref(item.id, item.slug)}
            prefetch={false}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-md"
          >
            <ArrowUpRight className="h-5 w-5" />
            <span className="sr-only">Ouvrir le Magic Display</span>
          </Link>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-xs">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
          <span className="font-medium">{creatorName}</span>
          {handle && <span className="text-slate-400">@{handle}</span>}
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px]">
          {title && <span className="font-medium text-slate-800">{title}</span>}
          {hashtags.map((tag: string) => <span key={tag} className="text-brand-600">{tag}</span>)}
        </div>
        <Link href={displayHref(item.id, item.slug)} prefetch={false} className="mt-1 block text-[11px] font-medium text-brand-600 hover:underline">
          Voir le Magic Display complet →
        </Link>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function MyMagicClient({
  initialPublished = [],
  initialAcquired = [],
}: MyMagicClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const sb = getSupabaseBrowser();

  // Profil
  const userEmail = user?.email ?? "";
  const userId = user?.id ?? "";
  const [profileHandle, setProfileHandle] = useState("");
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null,
  );

  useEffect(() => {
    if (!userId) return;
    sb.from("profiles").select("handle, display_name, avatar_url").eq("id", userId).single()
      .then(({ data }) => {
        if (!data) return;
        if (data.handle) setProfileHandle(data.handle);
        if (data.display_name) setProfileDisplayName(data.display_name);
        if (data.avatar_url) setProfileAvatarUrl(data.avatar_url);
      });
  }, [userId]);

  const displayHandle = profileHandle ? `@${profileHandle.replace(/^@/, "")}` : userEmail ? `@${userEmail.split("@")[0]}` : "@…";
  const displayName = profileDisplayName || user?.user_metadata?.full_name || userEmail;
  const effectiveAvatarUrl = profileAvatarUrl;
  const initial = (displayName[0] ?? "?").toUpperCase();

  // ── Onglets ──────────────────────────────────────────────
  const openParam = searchParams.get("open");
  const [activeTab, setActiveTab] = useState<MyMagicTab>("creations");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "bibliotheque") setActiveTab("bibliotheque");
    else setActiveTab("creations");
  }, [searchParams]);

  // Refs pour le scroll
  const creatorCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const acquiredCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll vers la carte concernée après redirect
  useEffect(() => {
    if (!openParam) return;
    const t = setTimeout(() => {
      const el =
        creatorCardRefs.current[openParam] ??
        acquiredCardRefs.current[openParam] ??
        null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(t);
  }, [openParam, activeTab]);

  const setTabInUrl = (tab: MyMagicTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/mymagic?${params.toString()}`);
  };

  // ── Draft Studio ─────────────────────────────────────────
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftBefore, setDraftBefore] = useState<string | null>(null);
  const [draftAfter, setDraftAfter] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_FORWARD_KEY);
      if (!raw) { setDraftLoaded(true); return; }
      const p = JSON.parse(raw) as StudioForwardPayload;
      if (p.before?.url) setDraftBefore(p.before.url);
      if (p.after?.url) setDraftAfter(p.after.url);
      if (p.title) setDraftTitle(p.title);
    } catch {}
    finally { setDraftLoaded(true); }
  }, []);

  // ─────────────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-5xl px-4 pb-36 pt-4 sm:px-6 sm:pt-8 sm:pb-40">

      {/* ── Header profil ── */}
      <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center">
            {effectiveAvatarUrl ? (
              <img src={effectiveAvatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-brand-600">{initial}</span>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{displayName}</h1>
            <p className="text-sm text-slate-600">{displayHandle}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{initialPublished.length} créé{initialPublished.length > 1 ? "s" : ""}</span>
              <span>·</span>
              <span>{initialAcquired.length} acquis</span>
            </div>
          </div>
        </div>
      </header>

      <MyMagicToolbar />

      {/* ── Onglets ── */}
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTabInUrl("creations")}
          className={activeTab === "creations"
            ? "rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            : "rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700"}
        >
          Créations {initialPublished.length > 0 && <span className="ml-1 opacity-60">({initialPublished.length})</span>}
        </button>
        <button
          type="button"
          onClick={() => setTabInUrl("bibliotheque")}
          className={activeTab === "bibliotheque"
            ? "rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            : "rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700"}
        >
          Bibliothèque {initialAcquired.length > 0 && <span className="ml-1 opacity-60">({initialAcquired.length})</span>}
        </button>
      </div>

      {/* ── Profil + Cockpit ── */}
      <section className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileSection
            userId={userId}
            userEmail={userEmail}
            initialProfile={{ handle: profileHandle, display_name: profileDisplayName, avatar_url: effectiveAvatarUrl }}
            onProfileUpdated={(u) => {
              setProfileHandle(u.handle);
              setProfileDisplayName(u.display_name);
              if (u.avatar_url) setProfileAvatarUrl(u.avatar_url);
            }}
          />
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
          <h2 className="text-lg font-semibold">Résumé Cockpit</h2>
          <Cockpit mode="compact" followers={0} />
          <a href="/monet" className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline">
            Ouvrir le cockpit complet <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* TAB CRÉATIONS — Vue CRÉATEUR                      */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === "creations" && (
        <section className="mb-8 space-y-6">
          <h2 className="text-lg font-semibold">Mes Magic Clock créés</h2>

          {/* En cours (draft localStorage) */}
          {draftLoaded && (draftBefore || draftAfter) && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-amber-500" /> En cours de création
              </h3>
              <p className="text-xs text-slate-500">
                Ton brouillon Studio — pas encore publié.
              </p>
              <div className="max-w-sm rounded-3xl border border-dashed border-amber-300 bg-amber-50/40 p-3">
                <div className="grid aspect-[4/5] grid-cols-2 overflow-hidden rounded-2xl">
                  <StudioMediaSlot src={draftBefore ?? FALLBACK_BEFORE} alt="Avant" />
                  <StudioMediaSlot src={draftAfter ?? FALLBACK_AFTER} alt="Après" />
                </div>
                {draftTitle && <p className="mt-2 text-xs font-medium text-slate-700">{draftTitle}</p>}
              </div>
            </div>
          )}

          {/* Publiés sur Amazing */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles className="h-4 w-4 text-brand-500" /> Publiés sur Amazing
            </h3>
            {initialPublished.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
                <p className="text-sm text-slate-400">Aucun Magic Clock publié pour le moment.</p>
                <Link href="/studio" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                  Créer mon premier Magic Clock →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {initialPublished.map((clock) => {
                  const isHighlighted = !!openParam && (clock.slug === openParam || clock.id === openParam);
                  return (
                    <CreatorCard
                      key={clock.id}
                      clock={clock}
                      avatarUrl={effectiveAvatarUrl}
                      isHighlighted={isHighlighted}
                      cardRef={(el) => {
                        creatorCardRefs.current[clock.id] = el;
                        if (clock.slug) creatorCardRefs.current[clock.slug] = el;
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* TAB BIBLIOTHÈQUE — Vue CLIENT                     */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === "bibliotheque" && (
        <section className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-brand-500" /> Bibliothèque
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tous les Magic Clock que tu as débloqués — accès permanent.
            </p>
          </div>

          {initialAcquired.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
              <Unlock className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium text-slate-500">
                Ta bibliothèque est vide pour l'instant.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Débloquer un Magic Clock depuis Amazing pour le retrouver ici.
              </p>
              <Link href="/" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                Explorer Amazing →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {initialAcquired.map((item) => {
                const isHighlighted = !!openParam &&
                  (item.id === openParam || item.slug === openParam || item.magic_clock_id === openParam);
                return (
                  <AcquiredCard
                    key={item.magic_clock_id}
                    item={item}
                    isHighlighted={isHighlighted}
                    cardRef={(el) => {
                      acquiredCardRefs.current[item.id] = el;
                      acquiredCardRefs.current[item.magic_clock_id] = el;
                      if (item.slug) acquiredCardRefs.current[item.slug] = el;
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
