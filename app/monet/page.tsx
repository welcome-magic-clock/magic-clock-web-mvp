"use client";

import { useState, useMemo } from "react";

const CURRENCY = "CHF";

function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export default function MonetisationPage() {
  // ---- Paramètres simulateur ----
  const [followers, setFollowers] = useState<number>(1180);
  const [subPrice, setSubPrice] = useState<number>(3.9); // prix abo / mois
  const [ppvPrice, setPpvPrice] = useState<number>(9.9); // prix PPV
  const [subConv, setSubConv] = useState<number>(2.5); // % followers -> abo
  const [ppvConv, setPpvConv] = useState<number>(2.0); // % followers -> acheteurs PPV
  const [ppvPerBuyerPerMonth, setPpvPerBuyerPerMonth] = useState<number>(1); // PPV / acheteur / mois
  const [platformFee, setPlatformFee] = useState<number>(20); // % commission Magic Clock
  const [vatRate, setVatRate] = useState<number>(8.1); // TVA %

  // ---- Calculs principaux ----
  const metrics = useMemo(() => {
    const subsCount = (followers * subConv) / 100;
    const ppvBuyers = (followers * ppvConv) / 100;

    const mrrSub = subsCount * subPrice; // revenus abo / mois (brut TTC)
    const mrrPpv = ppvBuyers * ppvPerBuyerPerMonth * ppvPrice; // revenus PPV / mois (brut TTC)

    const gross = mrrSub + mrrPpv; // chiffre d'affaires TTC
    const creatorGrossAfterFee = gross * (1 - platformFee / 100); // après commission
    const creatorNetExVat = creatorGrossAfterFee / (1 + vatRate / 100); // simplifié : hors TVA

    const aboSharePercent = gross === 0 ? 50 : (mrrSub / gross) * 100;
    const ppvSharePercent = 100 - aboSharePercent;

    return {
      mrrSub,
      mrrPpv,
      gross,
      creatorNetExVat,
      aboSharePercent,
      ppvSharePercent,
    };
  }, [
    followers,
    subPrice,
    ppvPrice,
    subConv,
    ppvConv,
    ppvPerBuyerPerMonth,
    platformFee,
    vatRate,
  ]);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Monétisation — Cockpit</h1>
          <p className="text-sm text-slate-600">
            Visualise le potentiel financier de ton audience Magic Clock et
            ajuste les paramètres pour simuler tes revenus.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 mr-1" />
          <span>Simulation en {CURRENCY}</span>
        </div>
      </header>

      {/* Ligne 1 : 4 cartes de stats */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenus abonnements */}
        <StatCard
          title="Revenus abonnements (MRR)"
          value={metrics.mrrSub}
          delta="+4.10 %"
          deltaPositive
          helper={`${followers.toLocaleString("fr-CH")} followers · ${subConv.toFixed(
            1
          )} % de conversion`}
        />

        {/* Revenus PPV */}
        <StatCard
          title="Revenus PPV"
          value={metrics.mrrPpv}
          delta="+4.10 %"
          deltaPositive
          helper={`${ppvPerBuyerPerMonth.toFixed(
            1
          )} PPV / acheteur / mois · conv. ${ppvConv.toFixed(1)} %`}
        />

        {/* Chiffre d'affaires brut */}
        <StatCard
          title="Chiffre d'affaires (brut TTC)"
          value={metrics.gross}
          delta="+4.10 %"
          deltaPositive={metrics.gross >= 0}
          helper={`Commission plateforme ${platformFee.toFixed(
            1
          )} % · TVA ${vatRate.toFixed(1)} %`}
        />

        {/* Revenu net créateur */}
        <StatCard
          title="Revenu net créateur (estimation)"
          value={metrics.creatorNetExVat}
          delta="+4.10 %"
          deltaPositive={metrics.creatorNetExVat >= 0}
          helper="Après commission Magic Clock & TVA (approx.)"
        />
      </section>

      {/* Ligne 2 : Donut mix + simulateur */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        {/* Mix revenus (donut simplifié) */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mix revenus
              </p>
              <p className="text-xs text-slate-400">
                Répartition entre abonnements et contenus PPV.
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <p>
                Abos :{" "}
                <span className="font-semibold text-slate-700">
                  {metrics.aboSharePercent.toFixed(0)} %
                </span>
              </p>
              <p>
                PPV :{" "}
                <span className="font-semibold text-slate-700">
                  {metrics.ppvSharePercent.toFixed(0)} %
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            {/* Faux donut (CSS) */}
            <div className="relative h-48 w-48">
              <div className="absolute inset-2 rounded-full bg-slate-100" />
              {/* portion abo */}
              <div
                className="absolute inset-0 rounded-full border-[10px] border-indigo-400 border-t-transparent border-l-transparent"
                style={{
                  transform: `rotate(${
                    (metrics.ppvSharePercent / 100) * 180
                  }deg)`,
                }}
              />
              {/* noyau */}
              <div className="absolute inset-10 rounded-full bg-white shadow-inner flex flex-col items-center justify-center text-xs text-slate-600">
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  Abo / PPV
                </span>
                <span className="mt-1 font-semibold text-slate-800">
                  Répartition
                </span>
              </div>
            </div>

            {/* Légende */}
            <div className="space-y-3 text-sm w-full max-w-xs">
              <LegendRow
                label="Abonnements récurrents"
                percent={metrics.aboSharePercent}
                colorClass="bg-indigo-500"
                helper="Revenus mensuels stables liés à ton offre d'abonnement."
              />
              <LegendRow
                label="PPV (Pay-Per-View)"
                percent={metrics.ppvSharePercent}
                colorClass="bg-sky-400"
                helper="Revenus liés aux contenus premium débloqués à l'achat."
              />
              <p className="text-[11px] text-slate-500">
                Dans la version complète, ce graphique sera directement lié à
                tes Magic Clock (performances réelles par contenu).
              </p>
            </div>
          </div>
        </div>

        {/* Paramètres simulateur */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Paramètres simulateur
              </p>
              <p className="text-xs text-slate-400">
                Ajuste tes chiffres pour visualiser ton potentiel.
              </p>
            </div>
          </div>

          {/* Followers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Followers</span>
              <span className="text-slate-500">
                {followers.toLocaleString("fr-CH")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
                value={followers}
                onChange={(e) =>
                  setFollowers(Math.max(0, Number(e.target.value) || 0))
                }
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Aucune limite technique : saisis simplement la taille de ton
              audience actuelle.
            </p>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Prix abo */}
          <SliderRow
            label={`Prix abo / mois (${CURRENCY})`}
            value={subPrice}
            min={0.99}
            max={999}
            step={0.1}
            onChange={setSubPrice}
            helper="Montant mensuel payé par chaque abonné."
          />

          {/* Conversion abo */}
          <SliderRow
            label="Conversion abonnements (%)"
            value={subConv}
            min={0}
            max={50}
            step={0.1}
            onChange={setSubConv}
            helper="Part de tes followers qui prennent un abonnement."
          />

          {/* Prix PPV */}
          <SliderRow
            label={`Prix PPV (${CURRENCY})`}
            value={ppvPrice}
            min={0.99}
            max={999}
            step={0.1}
            onChange={setPpvPrice}
            helper="Prix moyen d'un contenu PPV débloqué."
          />

          {/* Conversion PPV */}
          <SliderRow
            label="Conversion PPV (%)"
            value={ppvConv}
            min={0}
            max={50}
            step={0.1}
            onChange={setPpvConv}
            helper="Part de tes followers qui achètent au moins un PPV."
          />

          {/* PPV / acheteur / mois */}
          <SliderRow
            label="PPV / acheteur / mois"
            value={ppvPerBuyerPerMonth}
            min={0.5}
            max={20}
            step={0.5}
            onChange={setPpvPerBuyerPerMonth}
            helper="Nombre moyen de contenus PPV achetés chaque mois."
          />

          <div className="h-px bg-slate-100 my-2" />

          {/* Commission plateforme */}
          <SliderRow
            label="Commission plateforme (%)"
            value={platformFee}
            min={0}
            max={50}
            step={0.5}
            onChange={setPlatformFee}
            helper="Part prélevée par Magic Clock sur le chiffre d'affaires brut."
          />

          {/* TVA */}
          <SliderRow
            label="TVA (% estimative)"
            value={vatRate}
            min={0}
            max={25}
            step={0.1}
            onChange={setVatRate}
            helper="Taux de TVA moyen appliqué à tes ventes (varie selon les pays)."
          />
        </div>
      </section>
    </div>
  );
}

// ---- Petits composants UI ----

type StatCardProps = {
  title: string;
  value: number;
  delta: string;
  deltaPositive?: boolean;
  helper?: string;
};

function StatCard({
  title,
  value,
  delta,
  deltaPositive = true,
  helper,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            deltaPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          <span>{deltaPositive ? "↑" : "↓"}</span>
          <span>{delta}</span>
        </span>
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-900">
        {formatMoney(value)}
      </div>
      {helper && (
        <p className="mt-1 text-[11px] text-slate-500 leading-snug">{helper}</p>
      )}
    </div>
  );
}

type SliderRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  helper?: string;
};

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  helper,
}: SliderRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {Number.isInteger(value) ? value : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
      {helper && (
        <p className="text-[11px] text-slate-500 leading-snug">{helper}</p>
      )}
    </div>
  );
}

type LegendRowProps = {
  label: string;
  percent: number;
  helper?: string;
  colorClass: string;
};

function LegendRow({ label, percent, helper, colorClass }: LegendRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${colorClass}`} />
          <span className="font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-slate-500">{percent.toFixed(0)} %</span>
      </div>
      {helper && (
        <p className="text-[11px] text-slate-500 leading-snug">{helper}</p>
      )}
    </div>
  );
}
