// app/monet/RealMonetPanel.tsx
// ✅ v4.2 PREMIUM — Design KPI cards colorées + graphique + versements Adyen
"use client";

import { useMemo } from "react";
import { Shield, Clock, Calendar, Wallet, TrendingUp, ChevronRight, Info } from "lucide-react";
import {
  CreatorLight,
  CURRENT_COUNTRY,
  PRICE_TIERS,
  getPriceTierFromPrice,
  formatMoney,
  computeVatAndShares,
  DailyRevenuePoint,
  RevenueLinesChart,
} from "./monet-helpers";

const GH = "https://raw.githubusercontent.com/welcome-magic-clock/magic-clock-web-mvp/main/public/";
const SOCIAL_NETWORKS = [
  { id: "facebook",  label: "Facebook",  icon: `${GH}magic-clock-social-facebook.png`,  followers: 12500 },
  { id: "instagram", label: "Instagram", icon: `${GH}magic-clock-social-instagram.png`, followers: 9800  },
  { id: "youtube",   label: "YouTube",   icon: `${GH}magic-clock-social-youtube.png`,   followers: 7200  },
  { id: "tiktok",    label: "TikTok",    icon: `${GH}magic-clock-social-tiktok.png`,    followers: 15400 },
  { id: "snapchat",  label: "Snapchat",  icon: `${GH}magic-clock-social-snapchat.png`,  followers: 4300  },
  { id: "linkedin",  label: "LinkedIn",  icon: `${GH}magic-clock-social-linkedin.png`,  followers: 2100  },
  { id: "x",         label: "X",         icon: `${GH}magic-clock-social-x.png`,         followers: 5600  },
];

type Props = { creator?: CreatorLight };

export function RealMonetPanel({ creator }: Props) {
  const vatRate = CURRENT_COUNTRY.vatRate;
  const currency = CURRENT_COUNTRY.currency;

  const aboPrice = 14.9;
  const aboSubs = 480;
  const aboDelta = 8.1;
  const ppvPrice = 2.99;
  const ppvBuyers = 520;
  const ppvPerBuyer = 1.4;
  const ppvDelta = 5.2;
  const realFollowers = creator?.followers ?? 12450;
  const followersDelta = 12.4;

  const priceTier = getPriceTierFromPrice(ppvPrice);
  const grossAbos = aboPrice * aboSubs;
  const grossPpv = ppvPrice * ppvBuyers * ppvPerBuyer;
  const grossTotal = grossAbos + grossPpv;

  const { vatAmount, netBase, platformShareNet, creatorShareNet } =
    computeVatAndShares(grossTotal, priceTier, vatRate);

  const socialTotal = useMemo(() => SOCIAL_NETWORKS.reduce((s, n) => s + n.followers, 0), []);

  const dailyRevenue: DailyRevenuePoint[] = useMemo(() => {
    const days = 30;
    const baseAbo = grossAbos / days;
    const basePpv = grossPpv / days;
    return Array.from({ length: days }, (_, i) => {
      const t = i / (days - 1 || 1);
      const abo = Math.max(0, Math.round(baseAbo * (0.8 + 0.6 * t + 0.15 * Math.sin(i / 2))));
      const ppv = Math.max(0, Math.round(basePpv * (0.9 + 0.7 * t + 0.2 * Math.sin(i / 1.7))));
      return { day: i + 1, abo, ppv };
    });
  }, [grossAbos, grossPpv]);

  const creatorShareMonth = creatorShareNet;
  const availableBalance = creatorShareMonth * 0.72;
  const pendingBalance = creatorShareMonth * 0.28;

  return (
    <div className="space-y-0 pb-8">

      {/* ── KPI CARDS 3 colonnes ── */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3 pb-0">
        {/* Tu gardes */}
        <div
          className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)", boxShadow: "0 4px 14px rgba(123,75,245,.3)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Tu gardes</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">
            {Math.round(creatorShareMonth).toLocaleString("fr-CH")} CHF
          </p>
          <p className="mt-1 text-[10px] font-bold text-white/70">/ mois estimé</p>
        </div>
        {/* Abonnés */}
        <div
          className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5)", boxShadow: "0 4px 14px rgba(75,123,245,.25)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Abonnés</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{aboSubs}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">+{aboDelta}%</p>
        </div>
        {/* Acheteurs PPV */}
        <div
          className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)", boxShadow: "0 4px 14px rgba(196,75,218,.25)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Acheteurs PPV</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{ppvBuyers}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">+{ppvDelta}%</p>
        </div>
      </div>

      {/* ── GRAPHIQUE 30 jours ── */}
      <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start justify-between px-4 py-3.5">
          <div>
            <p className="text-[13px] font-bold text-slate-800">Revenus quotidiens · 30 jours</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Abonnements + Pay-Per-View</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </div>
        </div>
        <div className="border-t border-slate-100 bg-slate-50/80 px-3 py-3">
          <RevenueLinesChart data={dailyRevenue} variant="large" />
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-[11px] text-slate-400">
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#7B4BF5]" />Abonnements
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#F54B8F]" />PPV
            </span>
          </div>
          <span className="italic">Données indicatives MVP</span>
        </div>
      </div>

      {/* ── METRIC CARDS Abo + PPV ── */}
      <div className="grid grid-cols-2 gap-2.5 px-4 pt-3">
        {/* Abonnements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div
            className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </div>
          <p className="text-[12px] font-bold text-slate-800">Abonnements</p>
          <p className="mt-1">
            <span className="text-[22px] font-black text-slate-800 leading-none">{aboSubs}</span>
            <span className="ml-1 text-[12px] text-slate-400">abonnés</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Prix : <strong className="text-slate-600">{aboPrice.toFixed(2)} CHF</strong> / mois</p>
          <p className="text-[11px] text-slate-400">Brut : <strong className="text-slate-600">{Math.round(grossAbos).toLocaleString("fr-CH")} CHF</strong> / mois</p>
          <p className="mt-2 text-[11px] font-semibold text-emerald-500">↗ +{aboDelta}%</p>
        </div>
        {/* Pay-Per-View */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div
            className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <p className="text-[12px] font-bold text-slate-800">Pay-Per-View</p>
          <p className="mt-1">
            <span className="text-[22px] font-black text-slate-800 leading-none">{ppvBuyers}</span>
            <span className="ml-1 text-[12px] text-slate-400">/ mois</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Prix : <strong className="text-slate-600">{ppvPrice} CHF</strong> · {ppvPerBuyer}x</p>
          <p className="text-[11px] text-slate-400">Brut : <strong className="text-slate-600">{Math.round(grossPpv).toLocaleString("fr-CH")} CHF</strong> / mois</p>
          <p className="mt-2 text-[11px] font-semibold text-emerald-500">↗ +{ppvDelta}%</p>
        </div>
      </div>

      {/* ── RÉSUMÉ FINANCIER ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-100">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7B4BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <p className="text-[13px] font-bold text-slate-800">Résumé financier du mois</p>
        </div>

        <div className="space-y-1.5 text-[12px]">
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">Revenu brut total (TTC)</span>
            <span className="font-semibold text-slate-600">{Math.round(grossTotal).toLocaleString("fr-CH")} CHF</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">TVA estimée ({Math.round(vatRate * 1000) / 10}% · Suisse)</span>
            <span className="font-semibold text-slate-600">– {Math.round(vatAmount).toLocaleString("fr-CH")} CHF</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">Base HT</span>
            <span className="font-semibold text-slate-600">{Math.round(netBase).toLocaleString("fr-CH")} CHF</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-400">Commission MC ({Math.round(priceTier.platformRate * 100)}% · {priceTier.label})</span>
            <span className="font-semibold text-slate-600">– {Math.round(platformShareNet).toLocaleString("fr-CH")} CHF</span>
          </div>
        </div>

        <div
          className="mt-3 flex items-center justify-between rounded-[14px] px-3.5 py-3"
          style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.12)" }}
        >
          <div>
            <p className="text-[13px] font-bold text-slate-800">Tu gardes (HT estimé)</p>
            <p className="text-[10px] text-slate-400">{Math.round(priceTier.creatorRate * 100)}% base HT · versé le 15 du mois</p>
          </div>
          <p
            className="text-[24px] font-black"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#F54B8F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {Math.round(creatorShareNet).toLocaleString("fr-CH")} CHF
          </p>
        </div>
      </div>

      {/* ── COMMISSION PROGRESSIVE ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
            <p className="text-[12px] font-bold text-slate-700">Commission progressive · Prix PPV</p>
          </div>
          <span className="text-[11px] text-slate-400">Actuel : <strong>{ppvPrice} CHF</strong></span>
        </div>

        <div className="space-y-1.5">
          {PRICE_TIERS.map((tier) => {
            const isActive = tier.id === priceTier.id;
            return (
              <div
                key={tier.id}
                className={`flex items-center justify-between rounded-[10px] px-3 py-2 text-[11px] ${
                  isActive
                    ? "border border-indigo-200 font-semibold text-indigo-700"
                    : "text-slate-400"
                }`}
                style={isActive ? { background: "linear-gradient(to right,#eef2ff,#f5f3ff)" } : {}}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? "#818cf8" : "#cbd5e1" }}
                  />
                  <span className={isActive ? "font-bold" : ""}>
                    {tier.label} · tu gardes {Math.round(tier.creatorRate * 100)}%
                  </span>
                  {isActive && (
                    <span className="ml-1 text-[9px] text-indigo-500">{tier.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{Math.round(tier.platformRate * 100)}% MC</span>
                  {isActive && (
                    <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Actif</span>
                  )}
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

      {/* ── FOLLOWERS + RÉSEAUX ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/magic-clock-social-monet.png" alt="MC" className="h-9 w-9 rounded-[10px]" />
            <div>
              <p className="text-[12px] font-bold text-slate-800">Followers Magic Clock</p>
              <p className="text-[10px] text-slate-400">Données cockpit</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-black text-slate-800 leading-none">{realFollowers.toLocaleString("fr-CH")}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-500">↗ +{followersDelta}%</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-600">Autres réseaux</span>
            <span className="text-slate-400">Total indicatif : <strong className="text-slate-700">{socialTotal.toLocaleString("fr-CH")}</strong></span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {SOCIAL_NETWORKS.map((net) => (
              <div key={net.id} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={net.icon} alt={net.label} className="h-4 w-4 rounded-full" />
                <span className="text-[10px] font-medium text-slate-600">{net.followers.toLocaleString("fr-CH")}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
            Chiffres indicatifs MVP — synchronisés via APIs officielles en production.
          </p>
        </div>
      </div>

      {/* ── VERSEMENTS ADYEN ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-emerald-500">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">Mes versements</p>
              <p className="text-[10px] text-slate-400">Powered by Adyen for Platforms</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            <Shield className="h-3 w-3" />KYC en cours
          </div>
        </div>

        {/* Solde disponible */}
        <div className="mt-3 overflow-hidden rounded-xl border border-emerald-200" style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
          <div className="p-4">
            <p className="text-[11px] font-semibold text-emerald-700">Solde disponible</p>
            <p className="mt-1 text-[28px] font-black leading-none tracking-tight text-emerald-700">
              {formatMoney(availableBalance)}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600/70">
              Prochain versement : <strong>15 avril 2026</strong>
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white">
              <span>✓</span> Virement planifié le 15 avril 2026
            </div>
          </div>
        </div>

        {/* En attente + compte + prochain */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
            <p className="text-[10px] text-slate-400">En attente</p>
            <p className="mt-0.5 text-[15px] font-black text-slate-700 leading-tight">
              {formatMoney(pendingBalance)}
            </p>
            <p className="mt-0.5 text-[9px] text-slate-400">7 derniers jours</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
            <p className="text-[10px] text-slate-400">Compte</p>
            <p className="mt-0.5 text-[12px] font-bold text-slate-700">···· 4521</p>
            <button className="mt-0.5 text-[10px] font-semibold text-violet-600">Modifier</button>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-2.5">
            <p className="text-[10px] text-slate-400">Prochain</p>
            <p className="mt-0.5 text-[14px] font-black text-indigo-700">15 avril</p>
            <p className="text-[9px] text-indigo-500">SEPA auto</p>
          </div>
        </div>

        {/* Historique */}
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-bold text-slate-700">Historique des versements</p>
            <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
          </div>
          {[
            { date: "15 mars 2026",  amount: creatorShareMonth * 0.88 },
            { date: "15 fév. 2026",  amount: creatorShareMonth * 0.76 },
            { date: "15 jan. 2026",  amount: creatorShareMonth * 0.65 },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[9px] text-emerald-600">✓</span>
                <span className="text-slate-600">{p.date}</span>
              </div>
              <span className="font-bold text-slate-800">{formatMoney(p.amount)}</span>
            </div>
          ))}
          <p className="mt-2 text-[10px] italic text-slate-400">Données indicatives MVP — à connecter backend Adyen for Platforms.</p>
        </div>
      </div>

      <p className="mt-3 px-4 text-center text-[10px] italic text-slate-400">
        Données indicatives MVP · non connectées au backend.
      </p>
    </div>
  );
}
