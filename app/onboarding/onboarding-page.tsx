// app/onboarding/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Clock,
  User,
  Building2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Étapes KYC Stripe Express
// ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: User,
    title: "Identité",
    description: "Nom, prénom, date de naissance",
  },
  {
    icon: Building2,
    title: "Activité",
    description: "Type d'activité, adresse",
  },
  {
    icon: CreditCard,
    title: "Compte bancaire",
    description: "IBAN pour recevoir tes versements",
  },
  {
    icon: ShieldCheck,
    title: "Vérification",
    description: "Stripe vérifie tes informations",
  },
];

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

function OnboardingContent() {
  const searchParams = useSearchParams();
  const returnedFrom = searchParams.get("return") ?? null;
  const alreadyOnboarded = returnedFrom === "stripe";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Démarre le flow Stripe Express onboarding
  const handleStartOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/onboarding?return=stripe`,
          refreshUrl: `${window.location.origin}/onboarding?return=refresh`,
        }),
      });

      const data = await response.json() as { ok: boolean; url?: string; error?: string };

      if (!data.ok || !data.url) {
        setError(data.error ?? "Impossible de démarrer la vérification. Réessaie.");
        return;
      }

      // Redirect vers Stripe Express onboarding (co-brandé Magic Clock)
      window.location.href = data.url;

    } catch {
      setError("Erreur réseau. Vérifie ta connexion et réessaie.");
    } finally {
      setIsLoading(false);
    }
  };

  // Retour après completion Stripe
  if (alreadyOnboarded) {
    return (
      <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">
        <div className="rounded-2xl border border-emerald-200 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700">
              Vérification soumise
            </span>
          </div>

          <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
            Dossier envoyé à Stripe
          </h1>
          <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
            Stripe vérifie ton identité et ton compte bancaire. Tu recevras un email de confirmation sous 24-48h.
          </p>

          <div className="mt-5 space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
              Vérification sous 24-48h
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CreditCard className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
              Premiers versements disponibles dès validation
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
              Virement SEPA automatique le 15 de chaque mois
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <Link
            href="/monet"
            className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              Voir mon cockpit Monétisation
            </span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Retour à Amazing
            <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
          </Link>
        </div>
      </main>
    );
  }

  // Page d'accueil onboarding
  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Magic Clock — Espace créatrice
        </p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">
          Active tes versements
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Pour recevoir tes gains, Magic Clock utilise Stripe — la même infrastructure que Shopify et Deliveroo. La vérification prend 5 minutes.
        </p>
      </div>

      {/* Étapes */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
          Ce que Stripe va te demander
        </p>
        <div className="space-y-3">
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <step.icon className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">{step.title}</p>
                <p className="text-[11px] text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infos paiement */}
      <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
          <div className="space-y-1 text-xs text-slate-500">
            <p>Versements <strong className="text-slate-700">SEPA le 15 de chaque mois</strong></p>
            <p>Commission progressive <strong className="text-slate-700">20–35%</strong> selon prix · reste visible dans ton cockpit</p>
            <p>Minimum de versement : <strong className="text-slate-700">50 CHF</strong></p>
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" strokeWidth={1.5} />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-5 space-y-2.5">
        <button
          onClick={handleStartOnboarding}
          disabled={isLoading}
          className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            )}
            {isLoading ? "Redirection vers Stripe…" : "Démarrer la vérification"}
          </span>
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <Link
          href="/monet"
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Plus tard
          <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Footer sécurité */}
      <p className="mt-8 text-center text-xs text-slate-400">
        Vérification sécurisée par{" "}
        <span className="font-medium text-slate-500">Stripe</span>
        {" "}· Magic Clock ne stocke aucune donnée bancaire
      </p>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" strokeWidth={1.5} />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
