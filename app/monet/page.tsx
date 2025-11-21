"use client";

import { useState } from "react";

const PLATFORM_RATE = 0.2;   // 20 % Magic Clock
const CREATOR_RATE = 0.8;    // 80 % créateur

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "0 CHF";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

export default function MonetPage() {
  // Hypothèses de base
  const [followers, setFollowers] = useState(10000);
  const [avgViewsPerPost, setAvgViewsPerPost] = useState(4000);
  const [postsPerMonth, setPostsPerMonth] = useState(8);

  // Monétisation PPV
  const [ppvPrice, setPpvPrice] = useState(5);       // prix moyen PPV
  const [conversionRate, setConversionRate] = useState(2); // % de followers qui achètent

  // Calculs
  const estimatedBuyers = followers * (conversionRate / 100);
  const monthlyPaidViews = estimatedBuyers * postsPerMonth;
  const monthlyGross = monthlyPaidViews * ppvPrice; // revenu total généré
  const monthlyCreatorShare = monthlyGross * CREATOR_RATE;
  const monthlyPlatformShare = monthlyGross * PLATFORM_RATE;

  return (
    <div className="container py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Monétisation — Cockpit</h1>
        <p className="text-sm text-slate-600">
          Visualise l’impact de ton audience et simule ton potentiel financier sur Magic Clock.
        </p>
      </header>

      {/* Bloc 1 : Audience réelle */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            1. Ton audience actuelle
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Indique tes chiffres réels (ou estimés) sur les réseaux.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">
                Followers / abonnés
              </span>
              <input
                type="number"
                className="h-9 rounded-xl border border-slate-200 px-3 text-sm"
                value={followers}
                onChange={(e) => setFollowers(Number(e.target.value || 0))}
                min={0}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">
                Vues moyennes par contenu
              </span>
              <input
                type="number"
                className="h-9 rounded-xl border border-slate-200 px-3 text-sm"
                value={avgViewsPerPost}
                onChange={(e) => setAvgViewsPerPost(Number(e.target.value || 0))}
                min={0}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">
                Contenus publiés / mois
              </span>
              <input
                type="number"
                className="h-9 rounded-xl border border-slate-200 px-3 text-sm"
                value={postsPerMonth}
                onChange={(e) => setPostsPerMonth(Number(e.target.value || 0))}
                min={0}
              />
            </label>
          </div>
        </div>

        {/* Bloc 2 : Paramètres Magic Clock */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            2. Paramètres Magic Clock (simulateur)
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Simule un mix de contenus PPV payants.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">
                Prix moyen par contenu PPV (CHF)
              </span>
              <input
                type="number"
                className="h-9 rounded-xl border border-slate-200 px-3 text-sm"
                value={ppvPrice}
                onChange={(e) => setPpvPrice(Number(e.target.value || 0))}
                min={0}
                step={0.5}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">
                Taux d&apos;achat parmi tes followers (%)
              </span>
              <input
                type="number"
                className="h-9 rounded-xl border border-slate-200 px-3 text-sm"
                value={conversionRate}
                onChange={(e) =>
                  setConversionRate(Number(e.target.value || 0))
                }
                min={0}
                max={100}
                step={0.5}
              />
            </label>

            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <p>
                Acheteurs estimés / mois :{" "}
                <span className="font-semibold">
                  {Math.max(0, Math.round(estimatedBuyers))}
                </span>
              </p>
              <p>
                Contenus PPV vendus / mois :{" "}
                <span className="font-semibold">
                  {Math.max(0, Math.round(monthlyPaidViews))}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 3 : Résumé financier */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-50 p-5 shadow-sm">
          <p className="text-xs text-slate-400">Revenu total généré</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatMoney(monthlyGross)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Avant partage créateur / Magic Clock.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs text-emerald-700">Part créateur (80 %)</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-900">
            {formatMoney(monthlyCreatorShare)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700">
            Ce que tu touches chaque mois avec ce scénario.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-indigo-50 p-5 shadow-sm">
          <p className="text-xs text-indigo-700">Part Magic Clock (20 %)</p>
          <p className="mt-2 text-2xl font-semibold text-indigo-900">
            {formatMoney(monthlyPlatformShare)}
          </p>
          <p className="mt-1 text-[11px] text-indigo-700">
            Commission plateforme sur les ventes PPV.
          </p>
        </div>
      </section>

      <p className="text-[11px] text-slate-500">
        Simulation indicative, hors TVA et frais de paiement. Les chiffres
        réels dépendront de la qualité de tes contenus, de ton engagement et
        de ta stratégie FREE / Abonnement / PPV.
      </p>
    </div>
  );
}
