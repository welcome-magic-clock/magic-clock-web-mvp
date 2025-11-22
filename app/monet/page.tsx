"use client";

import React, { useMemo, useState } from "react";

// ----------------------
// Helpers & types
// ----------------------

type Currency = "CHF" | "EUR" | "USD";

type Params = {
  followers: number;
  aboPrice: number;
  aboConv: number; // %
  ppvPrice: number;
  ppvConv: number; // %
  ppvPerBuyer: number;
  platformTierId: "bronze" | "silver" | "gold";
  vatRate: number; // %
};

type Metrics = {
  mrrAbo: number;
  revPpv: number;
  gross: number;
  creatorNet: number;
  mixAboPct: number;
  mixPpvPct: number;
};

const CURRENCY: Currency = "CHF";

// presets init (point de référence pour les flèches %)
const DEFAULT_PARAMS: Params = {
  followers: 12000,
  aboPrice: 9.99,
  aboConv: 5,
  ppvPrice: 9.99,
  ppvConv: 2,
  ppvPerBuyer: 1,
  platformTierId: "bronze",
  vatRate: 8.1,
};

const PLATFORM_TIERS = [
  // seuils théoriques (0–1000 / 1001–10000 / 10001+)
  { id: "bronze" as const, label: "Bronze", rate: 0.3, minLikes: 0, maxLikes: 1000 },
  {
    id: "silver" as const,
    label: "Argent",
    rate: 0.25,
    minLikes: 1001,
    maxLikes: 10000,
  },
  { id: "gold" as const, label: "Or", rate: 0.2, minLikes: 10001, maxLikes: Infinity },
];

// Démo : likes reçus dans le flux Amazing
const FAKE_LIKES_RECEIVED = 6200;

// pour la barre de progression
const BRONZE_MAX = 1000;
const SILVER_MAX = 10000;
const BAR_MAX = 15000;

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function computeMetrics(p: Params): Metrics {
  const aboSubscribers = (p.followers * p.aboConv) / 100;
  const mrrAbo = aboSubscribers * p.aboPrice;

  const ppvBuyers = (p.followers * p.ppvConv) / 100;
  const ppvUnits = ppvBuyers * p.ppvPerBuyer;
  const revPpv = ppvUnits * p.ppvPrice;

  const gross = mrrAbo + revPpv;

  const platformRate =
    PLATFORM_TIERS.find((t) => t.id === p.platformTierId)?.rate ?? 0.3;
  const platformFee = gross * platformRate;
  const vat = gross * (p.vatRate / 100);

  const creatorNet = gross - platformFee - vat;

  const mixAboPct = gross > 0 ? (mrrAbo / gross) * 100 : 0;
  const mixPpvPct = gross > 0 ? (revPpv / gross) * 100 : 0;

  return {
    mrrAbo,
    revPpv,
    gross,
    creatorNet,
    mixAboPct,
    mixPpvPct,
  };
}

function TrendPill({
  base,
  current,
}: {
  base: number;
  current: number;
}) {
  if (!Number.isFinite(base) || base <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
        → 0.00 %
      </span>
    );
  }

  const deltaPct = ((current - base) / base) * 100;
  const rounded = deltaPct.toFixed(2);
  const sign = deltaPct > 0 ? "+" : "";
  const isUp = deltaPct > 0.01;
  const isDown = deltaPct < -0.01;

  const colorClass = isUp
    ? "bg-emerald-100 text-emerald-700"
    : isDown
    ? "bg-rose-100 text-rose-700"
    : "bg-slate-100 text-slate-500";

  const arrow = isUp ? "↑" : isDown ? "↓" : "→";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${colorClass}`}
    >
      {arrow} {sign}
      {rounded} %
    </span>
  );
}

// ----------------------
// Page composant
// ----------------------

export default function MonetPage() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);

  const baseMetrics = useMemo(() => computeMetrics(DEFAULT_PARAMS), []);
  const metrics = useMemo(() => computeMetrics(params), [params]);

  const currentTier = PLATFORM_TIERS.find(
    (t) => t.id === params.platformTierId
  )!;

  // Pour le moment : seul Bronze est vraiment débloqué
  const unlockedTierIds: ("bronze" | "silver" | "gold")[] = ["bronze"];

  const handleParamChange = <K extends keyof Params>(
    key: K,
    value: Params[K]
  ) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Barre de progression likes
  const likes = FAKE_LIKES_RECEIVED;
  const progressPct = Math.min(likes / BAR_MAX, 1) * 100;
  const bronzePct = (BRONZE_MAX / BAR_MAX) * 100;
  const silverPct = (SILVER_MAX / BAR_MAX) * 100;

  return (
    <div className="container py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Monétisation — Cockpit</h1>
        <p className="text-sm text-slate-600">
          Visualise le potentiel de revenus de tes Magic Clock en fonction de
          ton audience et de tes réglages.
        </p>
      </header>

      {/* Top cards */}
      <section className="grid gap-4 md:grid-cols-4">
        {/* MRR abonnements */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Revenus abonnements (MRR)
              </p>
              <p className="mt-1 text-xl font-semibold">
                {formatMoney(metrics.mrrAbo)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {params.followers.toLocaleString("fr-CH")} followers ·{" "}
                {params.aboConv.toFixed(1)} % de conversion
              </p>
            </div>
            <TrendPill base={baseMetrics.mrrAbo} current={metrics.mrrAbo} />
          </div>
        </div>

        {/* Revenus PPV */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Revenus PPV
              </p>
              <p className="mt-1 text-xl font-semibold">
                {formatMoney(metrics.revPpv)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {params.ppvConv.toFixed(1)} % achètent au moins un PPV ·{" "}
                {params.ppvPerBuyer.toFixed(1)} PPV / acheteur / mois
              </p>
            </div>
            <TrendPill base={baseMetrics.revPpv} current={metrics.revPpv} />
          </div>
        </div>

        {/* Chiffre d'affaires brut */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Chiffre d&apos;affaires (brut TTC)
              </p>
              <p className="mt-1 text-xl font-semibold">
                {formatMoney(metrics.gross)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Commission plateforme {Math.round(currentTier.rate * 100)} % ·
                TVA {params.vatRate.toFixed(1)} %
              </p>
            </div>
            <TrendPill base={baseMetrics.gross} current={metrics.gross} />
          </div>
        </div>

        {/* Revenu net créateur */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Revenu net créateur (estimation)
              </p>
              <p className="mt-1 text-xl font-semibold">
                {formatMoney(metrics.creatorNet)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Après commission Magic Clock & TVA (approx.)
              </p>
            </div>
            <TrendPill
              base={baseMetrics.creatorNet}
              current={metrics.creatorNet}
            />
          </div>
        </div>
      </section>

      {/* Bottom grid : mix + simulateur */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Mix revenus */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <header className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Mix revenus</p>
              <p className="text-xs text-slate-500">
                Répartition entre abonnements et contenus PPV.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Abos : {metrics.mixAboPct.toFixed(1)} % · PPV :{" "}
              {metrics.mixPpvPct.toFixed(1)} %
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
            {/* Donut simplifié */}
            <div className="flex items-center justify-center">
              <div className="relative h-52 w-52">
                <div
                  className="absolute inset-0 rounded-full bg-[conic-gradient(theme(colors.indigo.400)_0%_var(--abo),theme(colors.sky.400)_var(--abo)_100%)]"
                  style={
                    {
                      "--abo": `${metrics.mixAboPct}%`,
                    } as React.CSSProperties
                  }
                />
                <div className="absolute inset-8 rounded-full bg-white" />
                <div className="absolute inset-14 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] font-semibold text-slate-500">
                    Abo / PPV
                  </p>
                  <p className="text-xs text-slate-400">Répartition</p>
                </div>
              </div>
            </div>

            {/* Légende */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                <div>
                  <p className="font-medium">
                    Abonnements récurrents · {metrics.mixAboPct.toFixed(1)} %
                  </p>
                  <p className="text-xs text-slate-500">
                    Revenus mensuels stables liés à ton offre
                    d&apos;abonnement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                <div>
                  <p className="font-medium">
                    PPV (Pay-Per-View) · {metrics.mixPpvPct.toFixed(1)} %
                  </p>
                  <p className="text-xs text-slate-500">
                    Revenus liés aux contenus premium débloqués à l&apos;achat.
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Dans la version complète, ce graphique sera directement relié à
                tes Magic Clock (performances réelles par contenu).
              </p>
            </div>
          </div>
        </div>

        {/* Paramètres simulateur */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <header className="mb-4">
            <p className="text-sm font-semibold">Paramètres simulateur</p>
            <p className="text-xs text-slate-500">
              Ajuste tes chiffres pour visualiser ton potentiel.
            </p>
          </header>

          <div className="space-y-4 text-sm">
            {/* Followers */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <p>Followers</p>
                <p className="text-slate-500">
                  {params.followers.toLocaleString("fr-CH")}
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={1_000_000}
                value={Math.min(params.followers, 1_000_000)}
                onChange={(e) =>
                  handleParamChange("followers", Number(e.target.value))
                }
                className="mt-1 w-full"
              />
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={params.followers}
                min={0}
                onChange={(e) =>
                  handleParamChange(
                    "followers",
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Aucune limite technique : saisis simplement la taille de ton
                audience (slider jusqu&apos;à 1M, au-delà utilise le champ
                numérique).
              </p>
            </div>

            {/* Prix abo */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <p>Prix abo / mois ({CURRENCY})</p>
                <p className="text-slate-500">
                  {params.aboPrice.toFixed(2)} {CURRENCY}
                </p>
              </div>
              <input
                type="range"
                min={0.99}
                max={999}
                step={0.01}
                value={params.aboPrice}
                onChange={(e) =>
                  handleParamChange("aboPrice", Number(e.target.value))
                }
                className="mt-1 w-full"
              />
            </div>

            {/* Conversion abonnements */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <p>Conversion abonnements (%)</p>
                <p className="text-slate-500">
                  {params.aboConv.toFixed(1)} %
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={params.aboConv}
                onChange={(e) =>
                  handleParamChange("aboConv", Number(e.target.value))
                }
                className="mt-1 w-full"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Part de tes followers qui prennent un abonnement.
              </p>
            </div>

            {/* Prix PPV */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <p>Prix PPV ({CURRENCY})</p>
                <p className="text-slate-500">
                  {params.ppvPrice.toFixed(2)} {CURRENCY}
                </p>
              </div>
              <input
                type="range"
                min={0.99}
                max={999}
                step={0.01}
                value={params.ppvPrice}
                onChange={(e) =>
                  handleParamChange("ppvPrice", Number(e.target.value))
                }
                className="mt-1 w-full"
              />
            </div>

            {/* Conversion PPV */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <p>Conversion PPV (%)</p>
                <p className="text-slate-500">
                  {params.ppvConv.toFixed(1)} %
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={params.ppvConv}
                onChange={(e) =>
                  handleParamChange("ppvConv", Number(e.target.value))
                }
                className="mt-1 w-full"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Part de tes followers qui achètent au moins un PPV.
              </p>
            </div>

            {/* PPV / acheteur / mois (sans vraie limite) */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <p>PPV / acheteur / mois</p>
                <p className="text-slate-500">
                  {params.ppvPerBuyer.toFixed(1)}
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.1}
                value={Math.min(params.ppvPerBuyer, 20)}
                onChange={(e) =>
                  handleParamChange("ppvPerBuyer", Number(e.target.value))
                }
                className="mt-1 w-full"
              />
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                min={0}
                value={params.ppvPerBuyer}
                onChange={(e) =>
                  handleParamChange(
                    "ppvPerBuyer",
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Saisis librement, aucune limite. Le slider te donne un repère
                confortable (0 → 20).
              </p>
            </div>

            {/* Commission plateforme : paliers Bronze / Argent / Or */}
            <div>
              <p className="text-xs mb-1">Commission plateforme (%)</p>
              <div className="flex gap-2">
                {PLATFORM_TIERS.map((tier) => {
                  const unlocked = unlockedTierIds.includes(tier.id);
                  const selected = params.platformTierId === tier.id;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() =>
                        unlocked && handleParamChange("platformTierId", tier.id)
                      }
                      className={[
                        "flex-1 rounded-lg border px-2 py-1.5 text-xs flex flex-col items-center gap-0.5",
                        selected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-slate-50 text-slate-600",
                        !unlocked && "opacity-50 cursor-not-allowed",
                      ].join(" ")}
                    >
                      <span className="font-semibold">
                        {Math.round(tier.rate * 100)} %
                      </span>
                      <span>
                        {tier.label}
                        {!unlocked && " 🔒"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Barre de progression likes / paliers */}
              <div className="mt-3">
                <div className="relative h-2 rounded-full bg-slate-100">
                  {/* Progress */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-indigo-400"
                    style={{ width: `${progressPct}%` }}
                  />
                  {/* Repère Bronze max (1000) */}
                  <div
                    className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-slate-300"
                    style={{ left: `${bronzePct}%` }}
                  />
                  {/* Repère Silver max (10000) */}
                  <div
                    className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-slate-300"
                    style={{ left: `${silverPct}%` }}
                  />
                  {/* Curseur */}
                  <div
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white bg-indigo-500 shadow-sm"
                    style={{ left: `${progressPct}%`, transform: "translate(-50%, -50%)" }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                  <span>0–1 000 : Bronze</span>
                  <span>1 001–10 000 : Argent</span>
                  <span>10 001+ : Or</span>
                </div>
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                Bronze (30 %) est actif par défaut. Argent (25 %) et Or (20 %)
                se débloqueront plus tard en fonction des likes reçus dans le
                flux Amazing.
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Likes reçus (démo) :{" "}
                {FAKE_LIKES_RECEIVED.toLocaleString("fr-CH")}
              </p>
            </div>

            {/* TVA */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <p>TVA (%)</p>
                <p className="text-slate-500">
                  {params.vatRate.toFixed(1)} %
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={0.1}
                value={params.vatRate}
                onChange={(e) =>
                  handleParamChange("vatRate", Number(e.target.value))
                }
                className="mt-1 w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
