// app/monet/SimMonetPanel.tsx
"use client";

import { useMemo, useState } from "react";
import MonetToolbar from "@/components/monet/MonetToolbar";
import {
  CreatorLight,
  COUNTRY_VAT_TABLE,
  CURRENT_COUNTRY,
  PRICE_TIERS,
  getPriceTierFromPrice,
  getTierFromLikes,
  formatMoney,
  clamp,
  computeVatAndShares,
  DailyRevenuePoint,
  RevenueLinesChart,
} from "./monet-helpers";

// ─────────────────────────────────────────────────────────────
// Composant principal : SimMonetPanel
// ─────────────────────────────────────────────────────────────

type SimMonetPanelProps = {
  creator?: CreatorLight;
};

export function SimMonetPanel({ creator }: SimMonetPanelProps) {
  const defaultFollowers = creator?.followers ?? 5000;
  const defaultLikes = creator?.likes ?? 3200;

  const [simFollowers, setSimFollowers] = useState<number>(
    defaultFollowers || 5000,
  );
  const [simAboPrice, setSimAboPrice] = useState<number>(9.99);
  const [simAboConv, setSimAboConv] = useState<number>(3);
  const [simPpvPrice, setSimPpvPrice] = useState<number>(2.99);
  const [simPpvConv, setSimPpvConv] = useState<number>(1.5);
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState<number>(1);
  const [simLikes, setSimLikes] = useState<number>(defaultLikes);
  const [simCountryCode, setSimCountryCode] = useState<string>(
    CURRENT_COUNTRY.code,
  );

  const simCountry =
    COUNTRY_VAT_TABLE.find((c) => c.code === simCountryCode) ?? CURRENT_COUNTRY;
  const vatRateSim = simCountry.vatRate;

  // Palier audience (Bronze/Argent/Or) — pour affichage engagement
  const simTier = getTierFromLikes(simLikes);

  // Palier tarifaire PPV (nouvelle logique Adyen) — pour le calcul commission
  const simPriceTier = getPriceTierFromPrice(simPpvPrice);

  const simAboSubs = (simFollowers * simAboConv) / 100;
  const simPpvBuyers = (simFollowers * simPpvConv) / 100;
  const simGrossAbos = simAboSubs * simAboPrice;
  const simGrossPpv = simPpvBuyers * simPpvPrice * simPpvPerBuyer;
  const simGrossTotal = simGrossAbos + simGrossPpv;

  // computeVatAndShares attend maintenant un PriceTier (plus un Tier likes)
  const {
    vatAmount: simVatAmount,
    netBase: simNetBase,
    platformShareNet: simPlatformShareNet,
    creatorShareNet: simCreatorShareNet,
  } = computeVatAndShares(simGrossTotal, simPriceTier, vatRateSim);

  const simAboSharePct =
    simGrossTotal > 0 ? (simGrossAbos / simGrossTotal) * 100 : 0;
  const simPpvSharePct = simGrossTotal > 0 ? 100 - simAboSharePct : 0;

  const donutStyle = useMemo(
    () => ({
      backgroundImage: `conic-gradient(rgb(59,130,246) 0 ${simAboSharePct}%, rgb(16,185,129) ${simAboSharePct}% 100%)`,
    }),
    [simAboSharePct],
  );

  const simDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
    const days = 7;
    const baseAbo = simGrossAbos / days;
    const basePpv = simGrossPpv / days;

    return Array.from({ length: days }, (_, index) => {
      const t = index / (days - 1 || 1);
      const trend = 0.7 + 0.8 * t;
      const waveA = 0.12 * Math.sin(t * Math.PI * 2);
      const waveP = 0.18 * Math.sin((t + 0.35) * Math.PI * 2);
      const abo = Math.max(0, Math.round(baseAbo * (trend + waveA)));
      const ppv = Math.max(0, Math.round(basePpv * (trend + waveP)));
      return { day: index + 1, abo, ppv };
    });
  }, [simGrossAbos, simGrossPpv]);

  return (
    <div className="space-y-4">
      {/* Toolbar bulles Monétisation */}
      <MonetToolbar />

      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* ── Contrôles simulateur ── */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Réglages simulateur
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Pays TVA</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px]"
                value={simCountryCode}
                onChange={(e) => setSimCountryCode(e.target.value)}
              >
                {COUNTRY_VAT_TABLE.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Les prix saisis sont TTC. Magic Clock retire la TVA du pays
            sélectionné, puis applique la commission progressive selon le prix
            PPV (35% → 20%). Plus le contenu est cher, plus tu gardes.
          </p>

          {/* Followers */}
          <div id="monet-followers" className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Followers (tous réseaux)
              </span>
              <span className="font-semibold text-slate-700">
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
            <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500">Saisis un nombre précis :</span>
              <input
                type="number"
                min={0}
                max={1000000000}
                step={100}
                value={simFollowers}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const raw = e.target.value;
                  const normalized = raw.replace(/^0+(?=\d)/, "");
                  const num = Number(normalized || "0");
                  setSimFollowers(clamp(num, 0, 1000000000));
                }}
                className="w-28 rounded border border-slate-200 px-2 py-1 text-right text-[11px]"
              />
            </div>
          </div>

          {/* Abonnements */}
          <div id="monet-subscriptions" className="grid gap-3 md:grid-cols-2">
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
                max={999.99}
                step={0.5}
                value={simAboPrice}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  setSimAboPrice(Math.round(raw * 100) / 100);
                }}
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                0,99 → 999,99 CHF / mois (TTC).
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
            </div>
          </div>

          {/* Pay-Per-View */}
          <div id="monet-ppv" className="grid gap-3 md:grid-cols-3">
            {/* Prix PPV */}
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
                max={999.99}
                step={0.5}
                value={simPpvPrice}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  setSimPpvPrice(Math.round(raw * 100) / 100);
                }}
                className="w-full"
              />
              {/* Badge palier tarifaire dynamique */}
              <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] text-sky-700">
                <span>{simPriceTier.emoji}</span>
                <span>
                  {simPriceTier.label} · tu gardes{" "}
                  {Math.round(simPriceTier.creatorRate * 100)}%
                </span>
              </div>
            </div>

            {/* Conversion PPV */}
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
            </div>

            {/* PPV / acheteur */}
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
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={Math.min(simPpvPerBuyer, 100)}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setSimPpvPerBuyer(clamp(num, 0, 100000000));
                }}
                className="w-full"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">Précis :</span>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={simPpvPerBuyer}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const normalized = raw.replace(/^0+(?=\d)/, "");
                    const num = Number(normalized || "0");
                    setSimPpvPerBuyer(clamp(num, 0, 100000000));
                  }}
                  className="w-28 rounded border border-slate-200 px-2 py-1 text-right text-xs"
                />
              </div>
            </div>
          </div>

          {/* Likes / palier engagement */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Likes cumulés (engagement)
              </span>
              <span className="text-slate-500">
                {simLikes.toLocaleString("fr-CH")} ·{" "}
                <span className="font-semibold">
                  {simTier.emoji} {simTier.label}
                </span>
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
              Le badge d&apos;engagement (Bronze/Argent/Or) reflète ta popularité sur
              Magic Clock. La commission, elle, dépend du prix PPV.
            </p>
          </div>

          {/* Grille paliers commission PPV */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
            <p className="mb-2 text-[11px] font-medium text-slate-600">
              Commission progressive par prix PPV
            </p>
            <div className="flex flex-col gap-1.5">
              {PRICE_TIERS.map((tier) => {
                const isActive = tier.id === simPriceTier.id;
                return (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] ${
                      isActive
                        ? "border border-emerald-300 bg-emerald-50 font-medium text-emerald-800"
                        : "text-slate-500"
                    }`}
                  >
                    <span>
                      {tier.emoji} {tier.label} · {tier.description}
                    </span>
                    <span className={isActive ? "text-emerald-700 font-bold" : ""}>
                      tu gardes {Math.round(tier.creatorRate * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Résultats simulateur ── */}
        <div
          id="monet-revenue"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-slate-800">
            Résultat simulateur (par mois)
          </h2>

          <div className="grid gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Abonnés estimés · {simAboConv.toFixed(1)}%
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
              <span className="text-slate-500">Revenu brut Abo (TTC)</span>
              <span className="font-semibold">{formatMoney(simGrossAbos)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Revenu brut PPV (TTC)</span>
              <span className="font-semibold">{formatMoney(simGrossPpv)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
              <span className="text-slate-500">Revenu brut total (TTC)</span>
              <span className="text-sm font-medium">
                {formatMoney(simGrossTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                TVA estimée ({Math.round(vatRateSim * 1000) / 10}% ·{" "}
                {simCountry.label})
              </span>
              <span className="font-semibold text-slate-600">
                {formatMoney(simVatAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Base HT estimée</span>
              <span className="font-semibold text-slate-700">
                {formatMoney(simNetBase)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Commission Magic Clock (HT,{" "}
                {Math.round(simPriceTier.platformRate * 100)}% · palier{" "}
                {simPriceTier.label})
              </span>
              <span className="font-semibold text-slate-600">
                {formatMoney(simPlatformShareNet)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/60 px-2 py-1.5">
              <span className="font-medium text-emerald-700">
                Tu gardes (après TVA + commission)
              </span>
              <span className="text-lg font-bold text-emerald-600">
                {formatMoney(simCreatorShareNet)}
              </span>
            </div>
          </div>

          {/* Donut + courbe simulée */}
          <div className="mt-2 grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            {/* Donut */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-32 w-32 items-center justify-center rounded-full"
                style={donutStyle}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center text-[11px] font-semibold text-slate-700 shadow">
                  <span>{formatMoney(simCreatorShareNet)}</span>
                </div>
              </div>
              <p className="text-center text-[11px] text-slate-500">
                Répartition Abo / PPV. Le centre = ta part créateur estimée
                après TVA + commission.
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

            {/* Courbe revenus simulés */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-700">
                Projection d&apos;évolution (revenus simulés)
              </p>
              <div
                id="monet-graph"
                className="-mx-4 overflow-hidden border-y border-slate-200 bg-slate-50/80 px-0 py-4 sm:mx-0 sm:rounded-xl sm:border sm:px-3 sm:py-3"
              >
                <RevenueLinesChart data={simDailyRevenue} variant="large" />
                <p className="mt-1 text-[11px] text-slate-500">
                  Projection sur 7 périodes basée sur tes paramètres PPV /
                  abonnements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="mt-2 text-center text-[11px] text-slate-500 md:text-right">
        Simulation indicative, ne constitue pas une garantie de revenus.
      </p>
    </div>
  );
}
