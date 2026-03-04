// app/payment/result/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Home,
  Play,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  CalendarCheck,
  Ticket,
  Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type PaymentStatus = "authorized" | "refused" | "pending" | "cancelled" | "mock";

interface StatusConfig {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  borderColor: string;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
}

// ─────────────────────────────────────────────────────────────
// Config visuelle par statut — uniquement icônes Lucide
// ─────────────────────────────────────────────────────────────

function getStatusConfig(status: PaymentStatus): StatusConfig {
  switch (status) {
    case "authorized":
    case "mock":
      return {
        icon: <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />,
        title: "Paiement confirmé",
        subtitle: "Ton contenu est maintenant débloqué. Bonne découverte !",
        borderColor: "border-emerald-200",
        iconBg: "bg-emerald-50",
        badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
        badgeText: "Confirmé",
      };
    case "pending":
      return {
        icon: <Clock className="h-10 w-10 text-amber-400" strokeWidth={1.5} />,
        title: "Paiement en cours de validation",
        subtitle: "Ton paiement est en cours de traitement. Tu recevras une confirmation par email sous peu.",
        borderColor: "border-amber-200",
        iconBg: "bg-amber-50",
        badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
        badgeText: "En attente",
      };
    case "refused":
      return {
        icon: <XCircle className="h-10 w-10 text-red-400" strokeWidth={1.5} />,
        title: "Paiement refusé",
        subtitle: "Ton paiement n'a pas pu être traité. Vérifie tes informations et réessaie.",
        borderColor: "border-red-200",
        iconBg: "bg-red-50",
        badgeBg: "bg-red-50 border-red-200 text-red-600",
        badgeText: "Refusé",
      };
    case "cancelled":
      return {
        icon: <XCircle className="h-10 w-10 text-slate-400" strokeWidth={1.5} />,
        title: "Paiement annulé",
        subtitle: "Tu as annulé le paiement. Tu peux retenter à tout moment.",
        borderColor: "border-slate-200",
        iconBg: "bg-slate-50",
        badgeBg: "bg-slate-100 border-slate-200 text-slate-600",
        badgeText: "Annulé",
      };
  }
}

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

function PaymentResultContent() {
  const searchParams = useSearchParams();

  // Paramètres retournés par Adyen (redirect 3DS)
  const rawStatus = searchParams.get("resultCode") ?? searchParams.get("status") ?? "mock";
  const sessionId = searchParams.get("sessionId") ?? searchParams.get("id") ?? null;
  const contentId = searchParams.get("contentId") ?? null;
  const contentType = searchParams.get("contentType") ?? "ppv";
  const creatorHandle = searchParams.get("creator") ?? null;

  // Normalise le code Adyen → type interne
  const normalizeStatus = (raw: string): PaymentStatus => {
    const s = raw.toLowerCase();
    if (s === "authorised" || s === "authorized" || s === "mock") return "authorized";
    if (s === "pending" || s === "receivedbyissuer") return "pending";
    if (s === "refused" || s === "error") return "refused";
    if (s === "cancelled") return "cancelled";
    return "authorized";
  };

  const status = normalizeStatus(rawStatus);
  const config = getStatusConfig(status);
  const isSuccess = status === "authorized" || status === "mock";
  const isFailure = status === "refused" || status === "cancelled";

  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">

      {/* Carte statut principale */}
      <div className={`rounded-2xl border ${config.borderColor} bg-white/80 p-6 shadow-sm`}>

        {/* Icône + Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${config.iconBg}`}>
            {config.icon}
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${config.badgeBg}`}>
            {config.badgeText}
          </span>
        </div>

        {/* Titre & description */}
        <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
          {config.title}
        </h1>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
          {config.subtitle}
        </p>

        {/* Référence transaction */}
        {sessionId && (
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Référence transaction
            </p>
            <p className="mt-1 font-mono text-xs text-slate-600 break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Détails achat (succès uniquement) */}
        {isSuccess && (
          <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            {contentType === "subscription" ? (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Users className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
                  Accès illimité aux contenus abonnés
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CalendarCheck className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
                  Renouvellement automatique mensuel — résiliable à tout moment
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Ticket className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
                  Contenu débloqué définitivement
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
                  Reçu envoyé par email · Accessible depuis My Magic Clock
                </div>
              </>
            )}
          </div>
        )}

        {/* Note mode mock */}
        {status === "mock" && (
          <p className="mt-3 text-center text-[10px] text-slate-400">
            Mode démonstration MVP — paiement simulé
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 space-y-2.5">

        {isSuccess && contentId && (
          <Link
            href={`/p/${contentId}`}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" strokeWidth={1.5} />
              Accéder au contenu
            </span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        )}

        {isSuccess && !contentId && (
          <Link
            href="/mymagic"
            className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" strokeWidth={1.5} />
              Voir mes contenus
            </span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        )}

        {isFailure && (
          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
              Réessayer le paiement
            </span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}

        {creatorHandle && (
          <Link
            href={`/u/${encodeURIComponent(creatorHandle)}`}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Voir le profil de @{creatorHandle}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
          </Link>
        )}

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
        Paiement sécurisé par{" "}
        <span className="font-medium text-slate-500">Adyen</span>
        {" "}· Magic Clock — It&apos;s time to smile
      </p>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          <p className="text-sm text-slate-500">Vérification du paiement…</p>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
