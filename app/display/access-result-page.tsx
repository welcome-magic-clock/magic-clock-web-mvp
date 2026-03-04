// app/access/result/page.tsx
//
// ─────────────────────────────────────────────────────────────
// Magic Clock — Page confirmation accès FREE
// Même expérience UX que /payment/result (PPV / Abonnement)
// ─────────────────────────────────────────────────────────────

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Unlock,
  ArrowRight,
  Home,
  Play,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";

function AccessResultContent() {
  const searchParams  = useSearchParams();
  const contentId     = searchParams.get("contentId") ?? null;
  const creatorHandle = searchParams.get("creator")   ?? null;
  const status        = searchParams.get("status")    ?? "ok";
  const isError       = status === "error";

  if (isError) {
    return (
      <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-white/80 p-6 shadow-sm">
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
          <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
            Ce contenu n&apos;est pas disponible en accès libre. Vérifie qu&apos;il est bien en mode FREE.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
              Retour à Amazing
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">

      {/* Carte confirmation */}
      <div className="rounded-2xl border border-emerald-200 bg-white/80 p-6 shadow-sm">

        {/* Icône + Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <Unlock className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700">
            Accès libre
          </span>
        </div>

        {/* Titre */}
        <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
          Contenu débloqué
        </h1>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
          Ce contenu est en accès libre. Il est maintenant disponible dans ta bibliothèque Magic Clock.
        </p>

        {/* Détails */}
        <div className="mt-5 space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
            Accès gratuit · aucun abonnement requis
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Play className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
            Disponible dans My Magic Clock · Bibliothèque
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 space-y-2.5">

        {/* Accéder au contenu directement */}
        {contentId && (
          <Link
            href={`/mymagic?tab=bibliotheque&open=${encodeURIComponent(contentId)}`}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" strokeWidth={1.5} />
              Voir dans ma bibliothèque
            </span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        )}

        {/* Profil créateur */}
        {creatorHandle && (
          <Link
            href={`/u/${encodeURIComponent(creatorHandle.replace(/^@/, ""))}`}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Voir le profil de {creatorHandle}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
          </Link>
        )}

        {/* Retour Amazing */}
        <Link
          href="/"
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Home className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
            Retour à Amazing
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-slate-400">
        Magic Clock — It&apos;s time to smile
      </p>
    </main>
  );
}

export default function AccessResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" strokeWidth={1.5} />
      </div>
    }>
      <AccessResultContent />
    </Suspense>
  );
}
