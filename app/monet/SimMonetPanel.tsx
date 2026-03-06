// app/monet/SimMonetPanel.tsx
// ✅ v4.2 PREMIUM — Design cards séparées Audience / Abo / PPV + résumé financier gradient
"use client";

import { useMemo, useState } from "react";
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
} from "./monet-helpers";

type Props = { creator?: CreatorLight };

export function SimMonetPanel({ creator }: Props) {
  const [simFollowers, setSimFollowers]     = useState(creator?.followers ?? 5000);
  const [simLikes,     setSimLikes]         = useState(creator?.likes     ?? 3200);
  const [simAboPrice,  setSimAboPrice]      = useState(9.99);
  const [simAboConv,   setSimAboConv]       = useState(3);
  const [simPpvPrice,  setSimPpvPrice]      = useState(0.99);
  const [simPpvConv,   setSimPpvConv]       = useState(0);
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState(100);
  const [simCountryCode, setSimCountryCode] = useState(CURRENT_COUNTRY.code);

  const simCountry  = COUNTRY_VAT_TABLE.find((c) => c.code === simCountryCode) ?? CURRENT_COUNTRY;
  const vatRate     = simCountry.vatRate;
  const simTier     = getTierFromLikes(simLikes);
  const priceTier   = getPriceTierFromPrice(simPpvPrice);

  const aboSubs     = (simFollowers * simAboConv) / 100;
  const ppvBuyers   = (simFollowers * simPpvConv) / 100;
  const grossAbos   = aboSubs * simAboPrice;
  const grossPpv    = ppvBuyers * simPpvPrice * simPpvPerBuyer;
  const grossTotal  = grossAbos + grossPpv;

  const { vatAmount, netBase, platformShareNet, creatorShareNet } =
    computeVatAndShares(grossTotal, priceTier, vatRate);

  // Gradient pour les sliders
  const gradientStyle = {
    background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as React.CSSProperties;

  return (
    <div className="space-y-0 pb-8">

      {/* ── SECTION AUDIENCE ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-100">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7B4BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p className="text-[13px] font-bold text-slate-800">Audience</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Pays TVA</span>
            <select
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700"
              value={simCountryCode}
              onChange={(e) => setSimCountryCode(e.target.value)}
            >
              {COUNTRY_VAT_TABLE.map((c) => (
                <option key={c.code} value={c.code}>{c.label} {Math.round(c.vatRate*1000)/10}%</option>
              ))}
            </select>
          </div>
        </div>

        {/* Followers */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="font-medium text-slate-600">Followers (tous réseaux)</span>
            <span className="text-[15px] font-black" style={gradientStyle}>
              {simFollowers.toLocaleString("fr-CH")}
            </span>
          </div>
          <input
            type="range" min={0} max={1000000} step={1000} value={simFollowers}
            onChange={(e) => setSimFollowers(clamp(Number(e.target.value), 0, 1000000000))}
            className="w-full"
          />
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>0</span><span>500k</span><span>1M+</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Valeur précise :</span>
            <input
              type="number" min={0} value={simFollowers}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setSimFollowers(clamp(Number(e.target.value.replace(/^0+(?=\d)/, "")) || 0, 0, 1000000000))}
              className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-[12px] font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Badge engagement */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <span className="text-base">{simTier.emoji}</span>
          <div>
            <span className="text-[11px] font-bold text-slate-700">{simTier.label}</span>
            <span className="ml-1.5 text-[10px] text-slate-400">Basé sur {simLikes.toLocaleString("fr-CH")} likes</span>
          </div>
          <div className="ml-auto w-24">
            <input
              type="range" min={0} max={50000} step={100} value={simLikes}
              onChange={(e) => setSimLikes(clamp(Number(e.target.value), 0, 50000))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* ── SECTION ABONNEMENTS ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </div>
          <p className="text-[13px] font-bold text-slate-800">Abonnements</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Prix / mois</span>
              <span className="font-black" style={gradientStyle}>{simAboPrice.toFixed(2)} CHF</span>
            </div>
            <input
              type="range" min={0.99} max={999.99} step={0.5} value={simAboPrice}
              onChange={(e) => setSimAboPrice(Math.round(Number(e.target.value) * 100) / 100)}
              className="w-full"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-slate-400"><span>0,99</span><span>999,99</span></div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span>Précis :</span>
              <input
                type="number" min={0.99} step={0.5} value={simAboPrice}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setSimAboPrice(Math.round(Number(e.target.value) * 100) / 100)}
                className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-right text-[12px] font-bold text-slate-700 outline-none focus:border-violet-400"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Conversion</span>
              <span className="font-black" style={gradientStyle}>{simAboConv.toFixed(1)}%</span>
            </div>
            <input
              type="range" min={0} max={100} step={0.5} value={simAboConv}
              onChange={(e) => setSimAboConv(clamp(Number(e.target.value), 0, 100))}
              className="w-full"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-slate-400"><span>0%</span><span>100%</span></div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          ≈ {Math.round(aboSubs).toLocaleString("fr-CH")} abonnés · {formatMoney(grossAbos)} brut / mois
        </p>
      </div>

      {/* ── SECTION PAY-PER-VIEW ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[10px]"
              style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <p className="text-[13px] font-bold text-slate-800">Pay-Per-View</p>
          </div>
          <div className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700">
            {priceTier.label} · {Math.round(priceTier.creatorRate * 100)}%
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Prix moyen</span>
              <span className="font-black text-[#F54B8F]">{simPpvPrice.toFixed(2)} CHF</span>
            </div>
            <input
              type="range" min={0.99} max={999.99} step={0.5} value={simPpvPrice}
              onChange={(e) => setSimPpvPrice(Math.round(Number(e.target.value) * 100) / 100)}
              className="w-full pink"
            />
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>Précis :</span>
              <input
                type="number" min={0.99} step={0.5} value={simPpvPrice}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setSimPpvPrice(Math.round(Number(e.target.value) * 100) / 100)}
                className="w-16 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-right text-[11px] font-bold text-slate-700 outline-none focus:border-pink-400"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Conversion</span>
              <span className="font-black text-[#F54B8F]">{simPpvConv.toFixed(1)}%</span>
            </div>
            <input
              type="range" min={0} max={100} step={0.5} value={simPpvConv}
              onChange={(e) => setSimPpvConv(clamp(Number(e.target.value), 0, 100))}
              className="w-full pink"
            />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">/ acheteur</span>
              <span className="font-black text-[#F54B8F]">{simPpvPerBuyer.toFixed(1)}</span>
            </div>
            <input
              type="range" min={0} max={100} step={0.1} value={Math.min(simPpvPerBuyer, 100)}
              onChange={(e) => setSimPpvPerBuyer(clamp(Number(e.target.value), 0, 100000000))}
              className="w-full pink"
            />
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>Précis :</span>
              <input
                type="number" min={0} step={0.1} value={simPpvPerBuyer}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setSimPpvPerBuyer(clamp(Number(e.target.value.replace(/^0+(?=\d)/, "")) || 0, 0, 100000000))}
                className="w-16 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-right text-[11px] font-bold text-slate-700 outline-none focus:border-pink-400"
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          ≈ {Math.round(ppvBuyers).toLocaleString("fr-CH")} acheteurs · {formatMoney(grossPpv)} brut / mois
        </p>
      </div>

      {/* ── RÉSUMÉ FINANCIER ESTIMÉ ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B4BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <p className="text-[13px] font-bold text-slate-800">Résumé financier estimé</p>
        </div>

        <div className="space-y-1.5 text-[12px]">
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">Revenu brut Abo (TTC)</span>
            <span className="font-semibold text-slate-600">{formatMoney(grossAbos)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">Revenu brut PPV (TTC)</span>
            <span className="font-semibold text-slate-600">{formatMoney(grossPpv)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1.5 font-semibold">
            <span className="text-slate-700">Total brut (TTC)</span>
            <span className="text-slate-800">{formatMoney(grossTotal)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">TVA estimée ({Math.round(vatRate * 1000) / 10}%)</span>
            <span className="font-semibold text-slate-600">– {formatMoney(vatAmount)}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-400">Commission Magic Clock</span>
            <span className="font-semibold text-slate-600">– {formatMoney(platformShareNet)}</span>
          </div>
        </div>

        <div
          className="mt-3 flex items-center justify-between rounded-[14px] px-3.5 py-3"
          style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.12)" }}
        >
          <div>
            <p className="text-[13px] font-bold text-slate-800">Tu gardes estimé</p>
            <p className="text-[10px] text-slate-400">Après TVA + commission · versé le 15</p>
          </div>
          <p
            className="text-[24px] font-black leading-tight"
            style={gradientStyle}
          >
            {formatMoney(creatorShareNet)}
          </p>
        </div>
      </div>

      {/* ── COMMISSION PROGRESSIVE ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <span className="text-[12px] font-bold text-slate-500">%</span>
          </div>
          <p className="text-[12px] font-bold text-slate-700">Commission progressive par prix PPV</p>
        </div>

        <div className="space-y-1.5">
          {PRICE_TIERS.map((tier) => {
            const isActive = tier.id === priceTier.id;
            return (
              <div
                key={tier.id}
                className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[11px] ${
                  isActive ? "font-semibold" : "text-slate-400"
                }`}
                style={isActive ? { background: "linear-gradient(to right,#f0fdf4,#dcfce7)", border: "1px solid #86efac", color: "#15803d" } : {}}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: isActive ? "#4ade80" : "#cbd5e1" }} />
                  <span>{tier.label} · {tier.description}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={isActive ? "font-bold" : ""}>tu gardes {Math.round(tier.creatorRate * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full" style={{ background: "linear-gradient(to right,#fbbf24,#38bdf8,#818cf8,#4ade80)" }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>0,99</span><span>2,00</span><span>9,99</span><span>29,99+</span>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400">Plus ton contenu est cher → plus tu gardes. Sans frais cachés.</p>
      </div>

      <p className="mt-3 px-4 text-center text-[10px] italic text-slate-400">
        Simulation indicative — ne constitue pas une garantie de revenus.
      </p>
    </div>
  );
}
