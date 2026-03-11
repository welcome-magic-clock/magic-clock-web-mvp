"use client";
// app/access/result/page.tsx
// ✅ v2 — Écran félicitations · image studio · lien bibliothèque · invitation créateur

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Unlock, ArrowRight, Home, Play,
  ChevronRight, Sparkles, Loader2,
  PartyPopper, BookOpen, UserPlus,
} from "lucide-react";

const GRAD_BG = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";
const GRAD: React.CSSProperties = {
  background: GRAD_BG,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

function AccessResultContent() {
  const searchParams  = useSearchParams();
  const contentId     = searchParams.get("contentId") ?? null;
  const creatorHandle = searchParams.get("creator")   ?? null;
  const status        = searchParams.get("status")    ?? "ok";
  const slug          = searchParams.get("slug")      ?? null;
  const title         = searchParams.get("title")     ?? "Magic Clock";
  const thumb         = searchParams.get("thumb")     ?? null;
  const isError       = status === "error";

  if (isError) {
    return (
      <main className="mx-auto max-w-lg px-4 pb-24 pt-8">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <Unlock className="h-10 w-10 text-red-400" strokeWidth={1.5} />
            </div>
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-xs font-medium text-red-600">
              Accès refusé
            </span>
          </div>
          <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
            Impossible de débloquer ce contenu
          </h1>
          <p className="mt-1.5 text-center text-sm text-slate-500">
            Vérifie que le contenu est bien disponible et réessaie.
          </p>
        </div>
        <div className="mt-4">
          <Link href="/" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2"><Home className="h-4 w-4 text-slate-400" />Retour à Amazing</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-6">

      {/* ── Image studio + badge félicitations ── */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-slate-100 mb-4"
        style={{ aspectRatio: "4/5", boxShadow: "0 8px 32px rgba(123,75,245,.18)" }}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center" style={{ background: GRAD_BG }}>
            <PartyPopper className="h-20 w-20 text-white/80" />
          </div>
        )}
        {/* Overlay gradient bas */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "50%", background: "linear-gradient(to top,rgba(10,15,30,.75),transparent)" }} />

        {/* Badge */}
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <PartyPopper className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-center text-[18px] font-black text-white leading-tight">
            Félicitations ! 🎉
          </h1>
          <p className="text-center text-[12px] text-white/85 font-medium">
            {title} est maintenant dans ta bibliothèque
          </p>
        </div>
      </div>

      {/* ── Détails ── */}
      <div className="rounded-2xl bg-white p-4 mb-4"
        style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 flex-shrink-0">
              <Unlock className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            Accès gratuit activé · aucun abonnement requis
          </div>
          <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 flex-shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-violet-500" />
            </div>
            Disponible dans <span className="font-bold" style={GRAD}>My Magic Clock · Bibliothèque</span>
          </div>
          <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 flex-shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            </div>
            Le créateur a été notifié de ton acquisition
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="space-y-2.5">

        {/* Bibliothèque */}
        <Link
          href={`/mymagic?tab=bibliotheque${contentId ? `&open=${encodeURIComponent(contentId)}` : ""}`}
          className="flex w-full items-center justify-between rounded-2xl py-3.5 px-5 text-[13px] font-bold text-white"
          style={{ background: GRAD_BG, boxShadow: "0 3px 14px rgba(123,75,245,.3)" }}>
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Voir dans ma bibliothèque
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Suivre le créateur */}
        {creatorHandle && (
          <Link
            href={`/meet?creator=${encodeURIComponent(creatorHandle)}`}
            className="flex w-full items-center justify-between rounded-2xl border px-5 py-3 text-[13px] font-medium bg-white"
            style={{ border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }}>
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Suivre {creatorHandle}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}

        {/* Retour Amazing */}
        <Link href="/" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-600">
          <span className="flex items-center gap-2">
            <Home className="h-4 w-4 text-slate-400" />
            Retour à Amazing
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
      </div>

      <p className="mt-8 text-center text-[11px] text-slate-300">
        Magic Clock — It&apos;s time to smile ✨
      </p>
    </main>
  );
}

export default function AccessResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    }>
      <AccessResultContent />
    </Suspense>
  );
}
