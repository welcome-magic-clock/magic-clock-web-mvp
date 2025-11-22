"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Info } from "lucide-react";

const PLATFORM_RATE = 0.20; // 20 % pour Magic Clock
const CREATOR_RATE = 1 - PLATFORM_RATE; // 80 % créateur

function formatMoney(value: number): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)} %`;
}

export default function MonetisationPage() {
  // 🔧 Réglages de base (valeurs par défaut réalistes mais motivantes)
  const [followers, setFollowers] = useState<number>(10_000);
  const [avgViewsPerClock, setAvgViewsPerClock] = useState<number>(2_000);

  const [subRate, setSubRate] = useState<number>(3); // en %
  const [subPrice, setSubPrice] = useState<number>(9.9);

  const [ppvRate, setPpvRate] = useState<number>(5); // en %
  const [ppvPrice, setPpvPrice] = useState<number>(9.9);
  const [ppvPerMonth, setPpvPerMonth] = useState<number>(4); // Magic Clock PPV / mois

  // 📊 Calculs abonnements
  const monthlySubs = Math.max(0, Math.round((followers * subRate) / 100));
  const monthlySubGross = monthlySubs * subPrice;

  // 📊 Calculs PPV
  // Hypothèse simple : pour chaque Magic Clock PPV publié ce mois,
  // on part de la vue moyenne, et on applique un % de conversion en achat.
  const ppvBuyersPerClock = Math.max(
    0,
    Math.round((avgViewsPerClock * ppvRate) / 100)
  );
  const totalPpvBuyers = ppvBuyersPerClock * ppvPerMonth;
  const monthlyPpvGross = totalPpvBuyers * ppvPrice;

  // 📈 Synthèse
  const monthlyGross = monthlySubGross + monthlyPpvGross;
  const monthlyCreatorShare = monthlyGross * CREATOR_RATE;
  const monthlyPlatformShare = monthlyGross * PLATFORM_RATE;

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Monétisation</h1>
          <p className="mt-1 text-sm text-slate-600">
            Visualise ton potentiel de revenus avec Magic Clock : abonnements,
            contenus PPV et impact de ton audience réelle.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
          <Calculator className="h-4 w-4" />
          <span>Simulateur créateur (80 % / 20 %)</span>
        </div>
      </header>

      {/* Ligne principale : Résumé + Simulateur */}
      <div className="grid gap-6 md:grid-cols-[1.1fr_minmax(0,1.1fr)]">
        {/* 🟣 Résumé potentiel mensuel */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Potentiel mensuel
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {formatMoney(monthlyCreatorShare)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Part créateur (80 %) après commission Magic Clock.
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <p className="flex items-center gap-1 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                Scénario actuel
              </p>
              <p className="text-[11px]">
                Followers, vues moyennes, % abo et % PPV éditables ci-dessous.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50/80 p-3">
              <p className="font-semibold text-slate-700">
                Abonnements mensuels
              </p>
              <p className="mt-1 text-sm">
                {monthlySubs.toLocaleString("fr-CH")} abonnés ·{" "}
                {formatMoney(monthlySubGross)} brut
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Taux d&apos;abonnement : {formatPercent(subRate)} · Prix abo :{" "}
                {formatMoney(subPrice)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50/80 p-3">
              <p className="font-semibold text-slate-700">
                Contenus PPV / mois
              </p>
              <p className="mt-1 text-sm">
                {ppvPerMonth} Magic Clock PPV ·{" "}
                {totalPpvBuyers.toLocaleString("fr-CH")} achats ·{" "}
                {formatMoney(monthlyPpvGross)} brut
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Conversion PPV : {formatPercent(ppvRate)} sur{" "}
                {avgViewsPerClock.toLocaleString("fr-CH")} vues moyennes.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <div>
              Revenu brut total :{" "}
              <span className="font-semibold text-slate-700">
                {formatMoney(monthlyGross)}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              Part Magic Clock (20 %) :{" "}
              <span className="text-slate-700">
                {formatMoney(monthlyPlatformShare)}
              </span>
            </div>
          </div>
        </section>

        {/* 🧮 Simulateur détaillé */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Simulateur détaillé
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Info className="h-3.5 w-3.5" />
              <span>Glisse les curseurs pour tester des scénarios.</span>
            </div>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            {/* Followers & vues */}
            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-[11px] font-medium text-slate-700">
                  <span>Followers totaux</span>
                  <span>{followers.toLocaleString("fr-CH")}</span>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={200_000}
                  step={1000}
                  value={followers}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>

              <div>
                <label className="flex justify-between text-[11px] font-medium text-slate-700">
                  <span>Vues moyennes par Magic Clock</span>
                  <span>{avgViewsPerClock.toLocaleString("fr-CH")}</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={50_000}
                  step={200}
                  value={avgViewsPerClock}
                  onChange={(e) => setAvgViewsPerClock(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
            </div>

            {/* Abonnements */}
            <div className="rounded-xl bg-slate-50/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold text-slate-700">
                Abonnement mensuel
              </p>
              <div>
                <label className="flex justify-between text-[11px] text-slate-600">
                  <span>Taux d&apos;abonnement / followers</span>
                  <span>{formatPercent(subRate)}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.5}
                  value={subRate}
                  onChange={(e) => setSubRate(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <label className="text-[11px] text-slate-600">
                  Prix de l&apos;abonnement
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    step={0.5}
                    value={subPrice}
                    onChange={(e) => setSubPrice(Number(e.target.value))}
                    className="h-7 w-20 rounded-md border border-slate-200 bg-white px-2 text-right text-[11px]"
                  />
                  <span className="text-[11px] text-slate-500">CHF / mois</span>
                </div>
              </div>
            </div>

            {/* PPV */}
            <div className="rounded-xl bg-slate-50/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold text-slate-700">
                Contenus PPV
              </p>
              <div>
                <label className="flex justify-between text-[11px] text-slate-600">
                  <span>Conversion PPV / vues</span>
                  <span>{formatPercent(ppvRate)}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={0.5}
                  value={ppvRate}
                  onChange={(e) => setPpvRate(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <label className="text-[11px] text-slate-600">
                  Prix par Magic Clock PPV
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={199}
                    step={0.5}
                    value={ppvPrice}
                    onChange={(e) => setPpvPrice(Number(e.target.value))}
                    className="h-7 w-20 rounded-md border border-slate-200 bg-white px-2 text-right text-[11px]"
                  />
                  <span className="text-[11px] text-slate-500">CHF</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <label className="text-[11px] text-slate-600">
                  Magic Clock PPV publiés / mois
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  step={1}
                  value={ppvPerMonth}
                  onChange={(e) => setPpvPerMonth(Number(e.target.value))}
                  className="h-7 w-20 rounded-md border border-slate-200 bg-white px-2 text-right text-[11px]"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Info bas de page */}
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-[11px] text-slate-600">
        <p className="font-semibold text-slate-700 mb-1">
          Comment lire ce simulateur ?
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Abonnement (%)</strong> = part de tes followers qui
            acceptent de payer un abonnement mensuel.
          </li>
          <li>
            <strong>PPV (%)</strong> = part des spectateurs d&apos;un Magic
            Clock qui achètent ce contenu spécifique.
          </li>
          <li>
            Les chiffres sont indicatifs : le but est de t&apos;aider à te
            projeter et à fixer tes prix.
          </li>
        </ul>
      </section>
    </div>
  );
}
