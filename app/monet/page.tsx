"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

type TierId = "BRONZE" | "SILVER" | "GOLD";

type Tier = {
  id: TierId;
  label: string;
  rate: number; // part plateforme, ex: 0.30 = 30 %
  minLikes: number;
  maxLikes?: number;
};

const TIERS: Tier[] = [
  {
    id: "BRONZE",
    label: "Bronze",
    rate: 0.30,
    minLikes: 0,
    maxLikes: 1000,
  },
  {
    id: "SILVER",
    label: "Argent",
    rate: 0.25,
    minLikes: 1001,
    maxLikes: 10000,
  },
  {
    id: "GOLD",
    label: "Or",
    rate: 0.20,
    minLikes: 10001,
  },
];

function getTierFromLikes(likes: number): Tier {
  if (likes > 10000) return TIERS[2]; // Or
  if (likes > 1000) return TIERS[1]; // Argent
  return TIERS[0]; // Bronze
}

type Trend = "up" | "down" | "flat";

function TrendBadge({ value }: { value: number }) {
  const trend: Trend = value > 0 ? "up" : value < 0 ? "down" : "flat";

  if (trend === "flat") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
        <span>0%</span>
      </span>
    );
  }

  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const color =
    trend === "up"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-rose-50 text-rose-600";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${color}`}
    >
      <Icon className="h-3 w-3" />
      <span>
        {value > 0 ? "+" : ""}
        {value.toFixed(1)}%
      </span>
    </span>
  );
}

function formatMoney(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function MonetPage() {
  // 🔹 Partie "réalité" (cockpit actuel, en lecture seule / fake data)
  const realFollowers = 12450;
  const realFollowersDelta = 12.4;

  const realAboPrice = 14.9;
  const realAboSubs = 480;
  const realAboDelta = 8.1;

  const realPpvPrice = 19.9;
  const realPpvBuyers = 120;
  const realPpvPerBuyer = 1.4;
  const realPpvDelta = 5.2;

  const realLikes = 3200;
  const realTier = getTierFromLikes(realLikes);

  const realGrossAbos = realAboPrice * realAboSubs;
  const realGrossPpv = realPpvPrice * realPpvBuyers * realPpvPerBuyer;
  const realGrossTotal = realGrossAbos + realGrossPpv;

  const realPlatformShare = realGrossTotal * realTier.rate;
  const realCreatorShare = realGrossTotal - realPlatformShare;

  // 🔸 Partie "SIMULATEUR"
  const [simFollowers, setSimFollowers] = useState<number>(5000);
  const [simAboPrice, setSimAboPrice] = useState<number>(9.99);
  const [simAboConv, setSimAboConv] = useState<number>(3); // % followers → abo
  const [simPpvPrice, setSimPpvPrice] = useState<number>(14.99);
  const [simPpvConv, setSimPpvConv] = useState<number>(1.5); // % followers → acheteurs PPV
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState<number>(1);
  const [simLikes, setSimLikes] = useState<number>(realLikes);

  // Dérivés simulateur
  const simTier = getTierFromLikes(simLikes);
  const simAboSubs = (simFollowers * simAboConv) / 100;
  const simPpvBuyers = (simFollowers * simPpvConv) / 100;

  const simGrossAbos = simAboSubs * simAboPrice;
  const simGrossPpv = simPpvBuyers * simPpvPrice * simPpvPerBuyer;
  const simGrossTotal = simGrossAbos + simGrossPpv;

  const simPlatformShare = simGrossTotal * simTier.rate;
  const simCreatorShare = simGrossTotal - simPlatformShare;

  const simAboSharePct =
    simGrossTotal > 0 ? (simGrossAbos / simGrossTotal) * 100 : 0;
  const simPpvSharePct = simGrossTotal > 0 ? 100 - simAboSharePct : 0;

  const donutStyle = useMemo(
    () => ({
      backgroundImage: `conic-gradient(rgb(59,130,246) 0 ${simAboSharePct}%, rgb(16,185,129) ${simAboSharePct}% 100%)`,
    }),
    [simAboSharePct]
  );

  // Mini "courbe" d’évolution simulée (7 périodes)
  const historyPoints = useMemo(() => {
    const base = simCreatorShare || 0;
    const factors = [0.55, 0.7, 0.85, 1, 1.08, 1.15, 1.25];
    return factors.map((f, idx) => ({
      x: idx,
      y: Math.round(base * f),
    }));
  }, [simCreatorShare]);

  const linePoints = useMemo(() => {
    if (historyPoints.length === 0) return "";
    const ys = historyPoints.map((p) => p.y);
    const maxY = Math.max(...ys, 1);
    const minY = Math.min(...ys, 0);
    const spanY = maxY - minY || 1;

    return historyPoints
      .map((p, idx) => {
        const x = (idx / (historyPoints.length - 1 || 1)) * 100;
        const normY = (p.y - minY) / spanY;
        const y = 100 - normY * 80 - 10; // marge haut/bas
        return `${x},${y}`;
      })
      .join(" ");
  }, [historyPoints]);

  return (
    <div className="container py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Monétisation</h1>
        <p className="text-sm text-slate-600">
          Comprends l&apos;impact de ton audience et simule ton potentiel avec Magic
          Clock (abonnements + PPV). Partie haute = ton cockpit. Partie basse =
          simulateur.
        </p>
      </header>

      {/* 🔹 1. REALITÉ : Cockpit actuel (lecture seule) */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex h-6 items-center rounded-full bg-slate-900 px-3 text-xs font-semibold text-white">
              Réalité · compte Magic Clock
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Info className="h-3 w-3" />
              Données indicatives pour le MVP (non connectées au backend).
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Followers */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Followers (tous réseaux)</p>
            <p className="mt-1 text-xl font-semibold">
              {realFollowers.toLocaleString("fr-CH")}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Base estimée de ton audience activable avec Magic Clock.
            </p>
            <div className="mt-2">
              <TrendBadge value={realFollowersDelta} />
            </div>
          </div>

          {/* Abonnements */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Abonnements (Abo)</p>
            <p className="mt-1 text-lg font-semibold">
              {realAboSubs.toLocaleString("fr-CH")} abonnés
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prix moyen : {formatMoney(realAboPrice)} / mois.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Revenu brut Abo : {formatMoney(realGrossAbos)} / mois.
            </p>
            <div className="mt-2">
              <TrendBadge value={realAboDelta} />
            </div>
          </div>

          {/* PPV */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Contenus PPV</p>
            <p className="mt-1 text-lg font-semibold">
              {realPpvBuyers.toLocaleString("fr-CH")} acheteurs / mois
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prix moyen : {formatMoney(realPpvPrice)} ·{" "}
              {realPpvPerBuyer.toFixed(1)} PPV / acheteur / mois.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Revenu brut PPV : {formatMoney(realGrossPpv)} / mois.
            </p>
            <div className="mt-2">
              <TrendBadge value={realPpvDelta} />
            </div>
          </div>
        </div>

        {/* Résumé revenus + commission réelle */}
        <div className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Revenu brut total</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatMoney(realGrossTotal)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Abonnements + PPV avant commission et taxes.
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Part plateforme ({Math.round(realTier.rate * 100)}%)</p>
                <p className="mt-1 font-semibold">
                  {formatMoney(realPlatformShare)}
                </p>
                <p className="mt-2">Part créateur (≈{Math.round((1 - realTier.rate) * 100)}%)</p>
                <p className="mt-1 font-semibold text-emerald-600">
                  {formatMoney(realCreatorShare)}
                </p>
              </div>
            </div>
          </div>

          {/* Paliers commission (réels, non modifiables) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <p className="font-medium text-slate-700">
                Paliers de commission Magic Clock
              </p>
              <p className="text-slate-500">
                Likes ce mois-ci :{" "}
                <span className="font-semibold">{realLikes}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {TIERS.map((tier) => {
                const isActive = tier.id === realTier.id;
                const locked =
                  tier.id === "SILVER" && realLikes <= 1000
                    ? true
                    : tier.id === "GOLD" && realLikes <= 10000
                    ? true
                    : false;

                return (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50/60"
                        : "border-slate-200 bg-white/80"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {tier.label} · {Math.round(tier.rate * 100)}% plateforme
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {tier.id === "BRONZE" && "0 → 1 000 likes / mois"}
                        {tier.id === "SILVER" &&
                          "1 001 → 10 000 likes / mois (débloqué Argent)"}
                        {tier.id === "GOLD" &&
                          "+ de 10 000 likes / mois (débloqué Or)"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {locked ? (
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5">
                          🔒 Bloqué
                        </span>
                      ) : isActive ? (
                        <span className="inline-flex rounded-full bg-emerald-600 px-2 py-0.5 text-white">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5">
                          Inactif
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barre de progression likes */}
            <div className="mt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>0</span>
                <span>1 000</span>
                <span>10 000+</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-sky-500 to-emerald-500"
                  style={{
                    width: `${Math.min(100, (realLikes / 10000) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Séparateur Réalité / Simulateur */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <span className="absolute inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Simulateur (projection)
        </span>
      </div>

      {/* 🔸 2. SIMULATEUR : réglages + logique complète */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Contrôles simulateur */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Réglages simulateur
          </h2>
          <p className="text-xs text-slate-500">
            Ajuste ton audience, tes prix et tes conversions pour voir l&apos;impact
            sur tes revenus mensuels. Les paliers Bronze / Argent / Or restent
            pilotés uniquement par les likes (comme dans la réalité).
          </p>

          {/* Followers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Followers (tous réseaux)
              </span>
              <span className="text-slate-500">
                {simFollowers.toLocaleString("fr-CH")}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={1000}
              value={simFollowers}
              onChange={(e) =>
                setSimFollowers(clamp(Number(e.target.value), 0, 1000000))
              }
              className="w-full"
            />
            <p className="text-[11px] text-slate-500">
              Glisse pour simuler ton audience. Le curseur va jusqu&apos;à 1
              million pour rester lisible, mais en réalité il n&apos;y a pas de
              limite.
            </p>
          </div>

          {/* Abos */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Prix abonnement (Abo)
                </span>
                <span className="text-slate-500">
                  {simAboPrice.toFixed(2)} CHF / mois
                </span>
              </div>
              <input
                type="range"
                min={0.99}
                max={999}
                step={0.5}
                value={simAboPrice}
                onChange={(e) =>
                  setSimAboPrice(clamp(Number(e.target.value), 0.99, 999))
                }
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Tarification Abo Magic Clock (0,99 → 999 CHF / mois).
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Conversion Abo
                </span>
                <span className="text-slate-500">
                  {simAboConv.toFixed(1)}% followers
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={simAboConv}
                onChange={(e) =>
                  setSimAboConv(clamp(Number(e.target.value), 0, 100))
                }
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Pourcentage de tes followers qui deviennent abonnés Magic Clock.
              </p>
            </div>
          </div>

          {/* PPV */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Prix PPV moyen
                </span>
                <span className="text-slate-500">
                  {simPpvPrice.toFixed(2)} CHF
                </span>
              </div>
              <input
                type="range"
                min={0.99}
                max={999}
                step={0.5}
                value={simPpvPrice}
                onChange={(e) =>
                  setSimPpvPrice(clamp(Number(e.target.value), 0.99, 999))
                }
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Prix moyen d&apos;un contenu PPV (0,99 → 999 CHF).
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Conversion PPV
                </span>
                <span className="text-slate-500">
                  {simPpvConv.toFixed(1)}% followers
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={simPpvConv}
                onChange={(e) =>
                  setSimPpvConv(clamp(Number(e.target.value), 0, 100))
                }
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Part de tes followers qui achètent au moins un PPV ce mois-ci.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  PPV / acheteur / mois
                </span>
                <span className="text-slate-500">
                  {simPpvPerBuyer.toFixed(1)}
                </span>
              </div>
              <input
                type="number"
                min={0}
                step={0.1}
                value={simPpvPerBuyer}
                onChange={(e) =>
                  setSimPpvPerBuyer(
                    clamp(Number(e.target.value) || 0, 0, 9999)
                  )
                }
                className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
              />
              <p className="text-[11px] text-slate-500">
                Tu peux saisir n&apos;importe quelle valeur (0 → ∞). Le champ n&apos;est
                pas limité par un slider.
              </p>
            </div>
          </div>

          {/* Likes → palier simulateur */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Likes / mois (simulateur)
              </span>
              <span className="text-slate-500">
                {simLikes.toLocaleString("fr-CH")} · palier{" "}
                <span className="font-semibold">{simTier.label}</span>{" "}
                ({Math.round(simTier.rate * 100)}% plateforme)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={100}
              value={simLikes}
              onChange={(e) =>
                setSimLikes(clamp(Number(e.target.value), 0, 50000))
              }
              className="w-full"
            />
            <p className="text-[11px] text-slate-500">
              Le palier de commission est 100% automatique : plus de likes = plus
              de part créateur (Or = 20% plateforme, 80% pour toi).
            </p>
          </div>
        </div>

        {/* Résultats simulateur */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Résultat simulateur (par mois)
          </h2>

          <div className="grid gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Abonnés estimés (Abo) · {simAboConv.toFixed(1)}%
              </span>
              <span className="font-semibold">
                {Math.round(simAboSubs).toLocaleString("fr-CH")} abonnés
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Acheteurs PPV estimés · {simPpvConv.toFixed(1)}%
              </span>
              <span className="font-semibold">
                {Math.round(simPpvBuyers).toLocaleString("fr-CH")} acheteurs
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Revenu brut Abo (avant commission)
              </span>
              <span className="font-semibold">
                {formatMoney(simGrossAbos)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Revenu brut PPV (avant commission)
              </span>
              <span className="font-semibold">
                {formatMoney(simGrossPpv)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
              <span className="text-slate-500">Revenu brut total</span>
              <span className="text-base font-semibold">
                {formatMoney(simGrossTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Part plateforme ({Math.round(simTier.rate * 100)}%)
              </span>
              <span className="font-semibold text-slate-600">
                {formatMoney(simPlatformShare)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Part créateur estimée (
                {Math.round((1 - simTier.rate) * 100)}%)
              </span>
              <span className="font-semibold text-emerald-600">
                {formatMoney(simCreatorShare)}
              </span>
            </div>
          </div>

          {/* Donut + légende */}
          <div className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-32 w-32 items-center justify-center rounded-full"
                style={donutStyle}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center text-[11px] font-semibold text-slate-700 shadow">
                  <span>{formatMoney(simCreatorShare)}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Répartition Abo / PPV dans ton revenu total.
              </p>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-[rgb(59,130,246)]" />
                  <span>Abo · {simAboSharePct.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-[rgb(16,185,129)]" />
                  <span>PPV · {simPpvSharePct.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Courbe d'évolution */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-700">
                Projection d&apos;évolution (créateur)
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <svg viewBox="0 0 100 100" className="h-24 w-full">
                  <defs>
                    <linearGradient
                      id="mc-line"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#mc-line)"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePoints}
                  />
                </svg>
                <p className="mt-1 text-[11px] text-slate-500">
                  Exemple de progression sur 7 périodes (par ex. jours ou
                  semaines) basée sur ton revenu créateur simulé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
