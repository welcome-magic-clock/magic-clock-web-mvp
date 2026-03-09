// app/monet/SimMonetPanel.tsx
// ✅ v4.5 FINAL — KPI cards Lucide icons + gradient identique RealMonetPanel
"use client";

import { useState } from "react";
import { Users, RefreshCw, Zap, DollarSign, Percent, TrendingUp } from "lucide-react";
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

// Gradient texte — identique page.tsx et RealMonetPanel
const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as React.CSSProperties;

export function SimMonetPanel({ creator }: Props) {
  const [simFollowers, setSimFollowers] = useState(creator?.followers ?? 5000);
  const [simLikes, setSimLikes]         = useState(creator?.likes ?? 3200);
  const [simAboPrice, setSimAboPrice]   = useState(9.99);
  const [simAboConv, setSimAboConv]     = useState(3);
  const [simPpvPrice, setSimPpvPrice]   = useState(0.99);
  const [simPpvConv, setSimPpvConv]     = useState(0);
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState(100);
  const [simCountryCode, setSimCountryCode] = useState(CURRENT_COUNTRY.code);

  const simCountry  = COUNTRY_VAT_TABLE.find((c) => c.code === simCountryCode) ?? CURRENT_COUNTRY;
  const vatRate     = simCountry.vatRate;
  const simTier     = getTierFromLikes(simLikes);
  const priceTier   = getPriceTierFromPrice(simPpvPrice);

  const aboSubs  = (simFollowers * simAboConv) / 100;
  const ppvBuyers = (simFollowers * simPpvConv) / 100;
  const grossAbos = aboSubs * simAboPrice;
  const grossPpv  = ppvBuyers * simPpvPrice * simPpvPerBuyer;
  const grossTotal = grossAbos + grossPpv;
  const { vatAmount, netBase, platformShareNet, creatorShareNet } =
    computeVatAndShares(grossTotal, priceTier, vatRate);

  // Taux conservé pour la 3e KPI card
  const creatorPct = Math.round(priceTier.creatorRate * 100);

  return (
    <div className="space-y-0 pb-8">

      {/* ── KPI CARDS 3 colonnes — identiques au mode connecté ── */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        {/* Followers */}
        <div className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5)", boxShadow: "0 4px 14px rgba(75,123,245,.25)" }}>
          <div className="mb-1.5 flex justify-center">
            <Users size={18} strokeWidth={2} color="white" />
          </div>
          <p className="text-[15px] font-black leading-none text-white">
            {simFollowers >= 1000
              ? `${(simFollowers / 1000).toFixed(simFollowers >= 10000 ? 0 : 1)}k`
              : simFollowers.toLocaleString("fr-CH")}
          </p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-white/70">Followers</p>
        </div>

        {/* Revenus / mois */}
        <div className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)", boxShadow: "0 4px 14px rgba(123,75,245,.3)" }}>
          <div className="mb-1.5 flex justify-center">
            <TrendingUp size={18} strokeWidth={2} color="white" />
          </div>
          <p className="text-[13px] font-black leading-none text-white">
            {grossTotal >= 1000
              ? `${Math.round(grossTotal / 100) / 10}k`
              : Math.round(grossTotal).toLocaleString("fr-CH")}{" "}
            CHF
          </p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-white/70">/ mois</p>
        </div>

        {/* Tu gardes */}
        <div className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)", boxShadow: "0 4px 14px rgba(196,75,218,.25)" }}>
          <div className="mb-1.5 flex justify-center">
            <Zap size={18} strokeWidth={2} color="white" />
          </div>
          <p className="text-[15px] font-black leading-none text-white">{creatorPct}%</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-white/70">Tu gardes</p>
        </div>
      </div>

      {/* ── AUDIENCE ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-100">
              <Users size={15} strokeWidth={2} color="#7B4BF5" />
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
                <option key={c.code} value={c.code}>{c.label} {Math.round(c.vatRate * 1000) / 10}%</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="font-medium text-slate-600">Followers (tous réseaux)</span>
            <span className="text-[15px] font-black" style={GRAD}>
              {simFollowers.toLocaleString("fr-CH")}
            </span>
          </div>
          <input type="range" min={0} max={1000000} step={1000} value={simFollowers}
            onChange={(e) => setSimFollowers(clamp(Number(e.target.value), 0, 1000000000))}
            className="w-full" />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>0</span><span>500k</span><span>1M+</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Valeur précise :</span>
            <input type="number" min={0} value={simFollowers}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setSimFollowers(clamp(Number(e.target.value.replace(/^0+(?=\d)/, "")) || 0, 0, 1000000000))}
              className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-[12px] font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <span className="text-base">{simTier.emoji}</span>
          <div>
            <span className="text-[11px] font-bold text-slate-700">{simTier.label}</span>
            <span className="ml-1.5 text-[10px] text-slate-400">Basé sur {simLikes.toLocaleString("fr-CH")} likes</span>
          </div>
          <div className="ml-auto w-24">
            <input type="range" min={0} max={50000} step={100} value={simLikes}
              onChange={(e) => setSimLikes(clamp(Number(e.target.value), 0, 50000))}
              className="w-full" />
          </div>
        </div>
      </div>

      {/* ── ABONNEMENTS ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}>
            <RefreshCw size={15} strokeWidth={2} color="white" />
          </div>
          <p className="text-[13px] font-bold text-slate-800">Abonnements</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Prix / mois</span>
              <span className="font-black" style={GRAD}>{simAboPrice.toFixed(2)} CHF</span>
            </div>
            <input type="range" min={0.99} max={999.99} step={0.5} value={simAboPrice}
              onChange={(e) => setSimAboPrice(Math.round(Number(e.target.value) * 100) / 100)}
              className="w-full" />
            <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
              <span>0,99</span><span>999,99</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span>Précis :</span>
              <input type="number" min={0.99} step={0.5} value={simAboPrice}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setSimAboPrice(Math.round(Number(e.target.value) * 100) / 100)}
                className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-right text-[12px] font-bold text-slate-700 outline-none focus:border-violet-400"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Conversion</span>
              <span className="font-black" style={GRAD}>{simAboConv.toFixed(1)}%</span>
            </div>
            <input type="range" min={0} max={100} step={0.5} value={simAboConv}
              onChange={(e) => setSimAboConv(clamp(Number(e.target.value), 0, 100))}
              className="w-full" />
            <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
              <span>0%</span><span>100%</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          ≈ {Math.round(aboSubs).toLocaleString("fr-CH")} abonnés · {formatMoney(grossAbos)} brut / mois
        </p>
      </div>

      {/* ── PAY-PER-VIEW ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px]"
              style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)" }}>
              <Zap size={15} strokeWidth={2} color="white" />
            </div>
            <p className="text-[13px] font-bold text-slate-800">Pay-Per-View</p>
          </div>
          <div className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: "linear-gradient(135deg,rgba(123,75,245,.08),rgba(196,75,218,.08))", border: "1px solid rgba(123,75,245,.18)", color: "#7B4BF5" }}>
            {priceTier.label} · {Math.round(priceTier.creatorRate * 100)}%
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Prix moyen</span>
              <span className="font-black" style={GRAD}>{simPpvPrice.toFixed(2)} CHF</span>
            </div>
            <input type="range" min={0.99} max={999.99} step={0.5} value={simPpvPrice}
              onChange={(e) => setSimPpvPrice(Math.round(Number(e.target.value) * 100) / 100)}
              className="w-full" />
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>Précis :</span>
              <input type="number" min={0.99} step={0.5} value={simPpvPrice}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setSimPpvPrice(Math.round(Number(e.target.value) * 100) / 100)}
                className="w-16 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-right text-[11px] font-bold text-slate-700 outline-none focus:border-violet-400"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">Conversion</span>
              <span className="font-black" style={GRAD}>{simPpvConv.toFixed(1)}%</span>
            </div>
            <input type="range" min={0} max={100} step={0.5} value={simPpvConv}
              onChange={(e) => setSimPpvConv(clamp(Number(e.target.value), 0, 100))}
              className="w-full" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-slate-500">/ acheteur</span>
              <span className="font-black" style={GRAD}>{simPpvPerBuyer.toFixed(1)}</span>
            </div>
            <input type="range" min={0} max={100} step={0.1} value={Math.min(simPpvPerBuyer, 100)}
              onChange={(e) => setSimPpvPerBuyer(clamp(Number(e.target.value), 0, 100000000))}
              className="w-full" />
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>Précis :</span>
              <input type="number" min={0} step={0.1} value={simPpvPerBuyer}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setSimPpvPerBuyer(clamp(Number(e.target.value.replace(/^0+(?=\d)/, "")) || 0, 0, 100000000))}
                className="w-16 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-right text-[11px] font-bold text-slate-700 outline-none focus:border-violet-400"
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          ≈ {Math.round(ppvBuyers).toLocaleString("fr-CH")} acheteurs · {formatMoney(grossPpv)} brut / mois
        </p>
      </div>

      {/* ── RÉSUMÉ FINANCIER ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-100">
            <DollarSign size={14} strokeWidth={2} color="#7B4BF5" />
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
        <div className="mt-3 flex items-center justify-between rounded-[14px] px-3.5 py-3"
          style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.12)" }}>
          <div>
            <p className="text-[13px] font-bold text-slate-800">Tu gardes estimé</p>
            <p className="text-[10px] text-slate-400">Après TVA + commission · versé le 15</p>
          </div>
          <p className="text-[24px] font-black leading-tight" style={GRAD}>
            {formatMoney(creatorShareNet)}
          </p>
        </div>
      </div>

      {/* ── COMMISSION PROGRESSIVE ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <Percent size={12} strokeWidth={2.5} color="#475569" />
          </div>
          <p className="text-[12px] font-bold text-slate-700">
            Commission progressive par prix PPV &amp; abonnement
          </p>
        </div>
        <div className="space-y-1.5">
          {PRICE_TIERS.map((tier) => {
            const isActive = tier.id === priceTier.id;
            return (
              <div key={tier.id}
                className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[11px] ${isActive ? "font-semibold" : "text-slate-400"}`}
                style={isActive ? {
                  background: "linear-gradient(to right,rgba(123,75,245,.06),rgba(196,75,218,.06))",
                  border: "1px solid rgba(123,75,245,.18)",
                  color: "#7B4BF5",
                } : {}}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? "#7B4BF5" : "#cbd5e1" }} />
                  <span>{tier.label} · {tier.description}</span>
                </div>
                <span className={isActive ? "font-bold" : ""}>
                  tu gardes {Math.round(tier.creatorRate * 100)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full"
            style={{ background: "linear-gradient(to right,#a78bfa,#7B4BF5,#C44BDA,#F54B8F)" }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>0,99</span><span>2,00</span><span>9,99</span><span>29,99+</span>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400">
          Plus ton contenu est cher (PPV ou abonnement) → plus tu gardes. Sans frais cachés.
        </p>
      </div>

      <p className="mt-3 px-4 text-center text-[10px] italic text-slate-400">
        Simulation indicative — ne constitue pas une garantie de revenus.
      </p>
    </div>
  );
}
