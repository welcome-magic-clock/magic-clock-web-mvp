"use client";

import { useState, useMemo } from "react";

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "0.00 CHF";
  return `${value.toLocaleString("fr-CH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} CHF`;
}

type DeltaBadgeProps = {
  value: number; // en %
};

function DeltaBadge({ value }: DeltaBadgeProps) {
  const display = value.toFixed(2).replace(".", ",");
  const isPositiveOrZero = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        isPositiveOrZero
          ? "bg-emerald-50 text-emerald-600"
          : "bg-rose-50 text-rose-600"
      }`}
    >
      <span className="inline-block text-[13px]">
        {isPositiveOrZero ? "▲" : "▼"}
      </span>
      <span>{display} %</span>
    </span>
  );
}

export default function MonetPage() {
  // -----------------------------
  // États du simulateur
  // -----------------------------
  const [followers, setFollowers] = useState<number>(0);
  const [priceSub, setPriceSub] = useState<number>(9.99);
  const [subConv, setSubConv] = useState<number>(5); // %
  const [pricePpv, setPricePpv] = useState<number>(9.99);
  const [ppvConv, setPpvConv] = useState<number>(5); // %
  const [ppvPerBuyer, setPpvPerBuyer] = useState<number>(2);
  const [likes, setLikes] = useState<number>(0);

  // -----------------------------
  // Tiers de commission (likes)
  // -----------------------------
  const commissionTier = useMemo(() => {
    if (likes > 10000) {
      return { label: "Or", rate: 20, min: 10001, max: Infinity };
    }
    if (likes >= 1001) {
      return { label: "Argent", rate: 25, min: 1001, max: 10000 };
    }
    return { label: "Bronze", rate: 30, min: 0, max: 1000 };
  }, [likes]);

  // -----------------------------
  // Calculs principaux
  // -----------------------------
  const vatRate = 8.1; // TVA fictive

  const subSubscribers = (followers * subConv) / 100;
  const ppvBuyers = (followers * ppvConv) / 100;

  const subRevenue = subSubscribers * priceSub;
  const ppvRevenue = ppvBuyers * pricePpv * ppvPerBuyer;

  const totalRevenue = subRevenue + ppvRevenue;

  const platformCommission = (totalRevenue * commissionTier.rate) / 100;
  const vatAmount = (totalRevenue * vatRate) / 100;
  const creatorNet = totalRevenue - platformCommission - vatAmount;

  // Part abo / PPV pour le donut
  const [aboShare, ppvShare] = useMemo(() => {
    if (totalRevenue <= 0) return [0, 0];
    const a = (subRevenue / totalRevenue) * 100;
    const p = 100 - a;
    return [a, p];
  }, [subRevenue, totalRevenue]);

  // Petits % de variation toujours positifs (illustration)
  const deltaFromValue = (value: number) => {
    if (value <= 0) return 0;
    return Math.min(150, Math.sqrt(value) / 10);
  };

  const deltaSub = deltaFromValue(subRevenue);
  const deltaPpv = deltaFromValue(ppvRevenue);
  const deltaGross = deltaFromValue(totalRevenue);
  const deltaNet = deltaFromValue(creatorNet || 0);

  // Donut SVG
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const aboStroke = (aboShare / 100) * circumference;

  // Mini courbe d’évolution
  const historyPoints = useMemo(() => {
    const base = creatorNet <= 0 ? 1 : creatorNet;
    return Array.from({ length: 8 }).map((_, i) => {
      const factor = 0.6 + i * 0.06;
      return base * factor;
    });
  }, [creatorNet]);

  const maxHistory = Math.max(...historyPoints, 1);

  // -----------------------------
  // Rendu
  // -----------------------------
  return (
    <div className="px-4 pb-10 pt-6 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Monétisation — Cockpit</h1>
        <p className="text-sm text-slate-600">
          Visualise le potentiel de revenus de tes Magic Clock en fonction de
          ton audience et de tes réglages.
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Bloc du haut ={" "}
          <span className="font-medium">vue actuelle (MVP)</span>. Bloc du bas
          = <span className="font-medium">simulateur</span> pour tester des
          scénarios.
        </p>
      </header>

      {/* ==================== VUE ACTUELLE ==================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Vue actuelle — estimation
          </p>
          <p className="text-[11px] text-slate-400">
            Dans la version complète, ces chiffres viendront de ton compte réel.
          </p>
        </div>

        {/* Cartes KPI */}
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Abonnements */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Revenus abonnements (MRR)
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(subRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {subSubscribers.toFixed(0)} abonnés · {subConv.toFixed(1)} % de
                  conversion
                </p>
              </div>
              <DeltaBadge value={deltaSub} />
            </div>
          </div>

          {/* PPV */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Revenus PPV
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(ppvRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {ppvBuyers.toFixed(0)} acheteurs · {ppvConv.toFixed(1)} % conv.{" "}
                  · {ppvPerBuyer.toFixed(1)} PPV / acheteur / mois
                </p>
              </div>
              <DeltaBadge value={deltaPpv} />
            </div>
          </div>

          {/* Chiffre d'affaires brut */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Chiffre d&apos;affaires (BRUT TTC)
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(totalRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Commission plateforme {commissionTier.rate.toFixed(1)} % · TVA{" "}
                  {vatRate.toFixed(1)} %
                </p>
              </div>
              <DeltaBadge value={deltaGross} />
            </div>
          </div>

          {/* Revenu net créateur */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Revenu net créateur (estimation)
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(Math.max(creatorNet, 0))}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Après commission Magic Clock & TVA (approx.).
                </p>
              </div>
              <DeltaBadge value={deltaNet} />
            </div>
          </div>
        </div>

        {/* Mix revenus + courbe */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Mix revenus
              </p>
              <p className="text-sm text-slate-600">
                Répartition entre abonnements et contenus PPV.
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Abos&nbsp;: {aboShare.toFixed(1)} % · PPV&nbsp;:{" "}
              {ppvShare.toFixed(1)} %
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
            {/* Donut */}
            <div className="flex items-center justify-center">
              <div className="relative h-56 w-56">
                <svg
                  viewBox="0 0 220 220"
                  className="h-full w-full -rotate-90"
                >
                  {/* fond */}
                  <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="18"
                    fill="transparent"
                  />
                  {/* Abo */}
                  <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    stroke="#6366f1"
                    strokeWidth="18"
                    fill="transparent"
                    strokeDasharray={`${aboStroke} ${circumference}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Abo / PPV
                  </p>
                  <p className="text-xs font-medium text-slate-700">
                    Répartition
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Abos&nbsp;{aboShare.toFixed(1)} %<br />
                    PPV&nbsp;{ppvShare.toFixed(1)} %
                  </p>
                </div>
              </div>
            </div>

            {/* Légende + courbe */}
            <div className="space-y-4">
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <div>
                    <p className="font-medium text-slate-800">
                      Abonnements récurrents · {aboShare.toFixed(1)} %
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Revenus mensuels stables liés à ton offre d&apos;abonnement.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                  <div>
                    <p className="font-medium text-slate-800">
                      PPV (Pay-Per-View) · {ppvShare.toFixed(1)} %
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Revenus liés aux contenus premium débloqués à l&apos;achat.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Évolution estimée du revenu net</span>
                  <span>{formatMoney(Math.max(creatorNet, 0))} / mois</span>
                </div>
                <svg viewBox="0 0 160 50" className="w-full h-16">
                  <polyline
                    points="0,40 160,40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeLinecap="round"
                    points={historyPoints
                      .map((v, i) => {
                        const x = (i / (historyPoints.length - 1)) * 160;
                        const y = 40 - (v / maxHistory) * 30;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                </svg>
                <p className="mt-1 text-[10px] text-slate-500">
                  Illustration dynamique : plus tes paramètres montent, plus la
                  courbe se projette vers le haut.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SÉPARATEUR SIMULATEUR ==================== */}
      <div className="flex items-center gap-3 pt-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] uppercase tracking-wide text-slate-500">
          Simulateur
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* ==================== ZONE SIMULATEUR ==================== */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Simulateur — paramètres
          </p>
          <p className="text-sm text-slate-600">
            Cette zone est un{" "}
            <span className="font-medium">simulateur</span> : les curseurs ne
            modifient pas encore ton compte réel, mais te permettent de tester
            des scénarios.
          </p>
        </div>

        {/* Followers */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Followers</span>
            <span>{followers.toLocaleString("fr-CH")}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1_000_000}
            value={Math.min(followers, 1_000_000)}
            onChange={(e) => setFollowers(Number(e.target.value))}
            className="w-full"
          />
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
            value={followers}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              setFollowers(Math.max(0, v));
            }}
          />
          <p className="text-[11px] text-slate-500">
            Aucune limite technique : saisis simplement la taille de ton
            audience. Le slider va jusqu&apos;à 1M, au-delà utilise le champ
            numérique.
          </p>
        </div>

        {/* Prix abo */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Prix abo / mois (CHF)</span>
            <span>{priceSub.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.99}
            max={999}
            step={0.01}
            value={priceSub}
            onChange={(e) => setPriceSub(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Conversion abo */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Conversion abonnements (%)</span>
            <span>{subConv.toFixed(1)} %</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={subConv}
            onChange={(e) => setSubConv(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-[11px] text-s
