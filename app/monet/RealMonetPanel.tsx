// app/monet/RealMonetPanel.tsx
// ✅ v4.4 ULTIMATE — Lucide icons · gradient unifié · réseaux sociaux complets · graphique premium · Stripe
"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  Wallet, TrendingUp, RefreshCw, Zap, DollarSign,
  Percent, Users, Shield, ExternalLink,
} from "lucide-react";
import {
  CreatorLight, CURRENT_COUNTRY, PRICE_TIERS,
  getPriceTierFromPrice, formatMoney, computeVatAndShares,
  DailyRevenuePoint, RevenueLinesChart,
} from "./monet-helpers";

// Gradient partagé avec SimMonetPanel et page.tsx
const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as React.CSSProperties;

const GH = "https://raw.githubusercontent.com/welcome-magic-clock/magic-clock-web-mvp/main/public/";

// Réseaux sociaux complets — alignés avec My Magic Clock + profiles Supabase
const SOCIAL_NETWORKS = [
  { id: "magic_clock",  label: "Magic Clock",  icon: `${GH}magic-clock-social-monet.png`,     followers: 12450 },
  { id: "instagram",    label: "Instagram",    icon: `${GH}magic-clock-social-instagram.png`,  followers: 9800 },
  { id: "tiktok",       label: "TikTok",       icon: `${GH}magic-clock-social-tiktok.png`,     followers: 15400 },
  { id: "youtube",      label: "YouTube",      icon: `${GH}magic-clock-social-youtube.png`,    followers: 7200 },
  { id: "facebook",     label: "Facebook",     icon: `${GH}magic-clock-social-facebook.png`,   followers: 12500 },
  { id: "x",            label: "X",            icon: `${GH}magic-clock-social-x.png`,          followers: 5600 },
  { id: "snapchat",     label: "Snapchat",     icon: `${GH}magic-clock-social-snapchat.png`,   followers: 4300 },
  { id: "linkedin",     label: "LinkedIn",     icon: `${GH}magic-clock-social-linkedin.png`,   followers: 2100 },
  { id: "pinterest",    label: "Pinterest",    icon: `${GH}magic-clock-social-pinterest.png`,  followers: 1800 },
  { id: "threads",      label: "Threads",      icon: `${GH}magic-clock-social-threads.png`,    followers: 3200 },
  { id: "bereal",       label: "BeReal",       icon: `${GH}magic-clock-social-bereal.png`,     followers: 890  },
  { id: "twitch",       label: "Twitch",       icon: `${GH}magic-clock-social-twitch.png`,     followers: 2600 },
];

type Props = { creator?: CreatorLight };

export function RealMonetPanel({ creator }: Props) {
  const vatRate = CURRENT_COUNTRY.vatRate;

  // Données MVP indicatives
  const aboPrice    = 14.9;
  const aboSubs     = 480;
  const aboDelta    = 8.1;
  const ppvPrice    = 2.99;
  const ppvBuyers   = 520;
  const ppvPerBuyer = 1.4;
  const ppvDelta    = 5.2;
  const followersDelta = 12.4;

  const priceTier = getPriceTierFromPrice(ppvPrice);
  const grossAbos = aboPrice * aboSubs;
  const grossPpv  = ppvPrice * ppvBuyers * ppvPerBuyer;
  const grossTotal = grossAbos + grossPpv;
  const { vatAmount, netBase, platformShareNet, creatorShareNet } =
    computeVatAndShares(grossTotal, priceTier, vatRate);

  const socialTotal = useMemo(
    () => SOCIAL_NETWORKS.reduce((s, n) => s + n.followers, 0),
    []
  );

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

  const availableBalance = creatorShareNet * 0.72;
  const pendingBalance   = creatorShareNet * 0.28;

  return (
    <div className="space-y-0 pb-8">

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        <div className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)", boxShadow: "0 4px 14px rgba(123,75,245,.3)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Tu gardes</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">
            {Math.round(creatorShareNet).toLocaleString("fr-CH")} CHF
          </p>
          <p className="mt-1 text-[10px] font-bold text-white/70">/ mois estimé</p>
        </div>
        <div className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5)", boxShadow: "0 4px 14px rgba(75,123,245,.25)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Abonnés</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{aboSubs}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">+{aboDelta}%</p>
        </div>
        <div className="rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)", boxShadow: "0 4px 14px rgba(196,75,218,.25)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Acheteurs PPV</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{ppvBuyers}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">+{ppvDelta}%</p>
        </div>
      </div>

      {/* ── GRAPHIQUE PREMIUM 30 JOURS ── */}
      <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start justify-between px-4 pt-3.5 pb-2">
          <div>
            <p className="text-[13px] font-bold text-slate-800">Revenus quotidiens · 30 jours</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Abonnements + Pay-Per-View</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </div>
        </div>

        {/* Zone graphique avec fond dégradé subtil */}
        <div className="px-3 pb-2">
          <RevenueLinesChart data={dailyRevenue} variant="large" />
        </div>

        {/* Légende + total mois */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
          <div className="flex gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5)" }} />
              Abonnements
              <strong className="ml-1 text-slate-700">{formatMoney(grossAbos)}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)" }} />
              PPV
              <strong className="ml-1 text-slate-700">{formatMoney(grossPpv)}</strong>
            </span>
          </div>
          <span className="text-[10px] italic text-slate-400">MVP indicatif</span>
        </div>
      </div>

      {/* ── METRIC CARDS Abo + PPV ── */}
      <div className="grid grid-cols-2 gap-2.5 px-4 pt-3">
        {/* Abonnements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}>
            <RefreshCw size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[12px] font-bold text-slate-800">Abonnements</p>
          <p className="mt-1">
            <span className="text-[22px] font-black leading-none text-slate-800">{aboSubs}</span>
            <span className="ml-1 text-[12px] text-slate-400">abonnés</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Prix : <strong className="text-slate-600">{aboPrice.toFixed(2)} CHF</strong> / mois</p>
          <p className="text-[11px] text-slate-400">Brut : <strong className="text-slate-600">{Math.round(grossAbos).toLocaleString("fr-CH")} CHF</strong> / mois</p>
          <p className="mt-2 text-[11px] font-semibold text-emerald-500">↗ +{aboDelta}%</p>
        </div>

        {/* Pay-Per-View */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)" }}>
            <Zap size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[12px] font-bold text-slate-800">Pay-Per-View</p>
          <p className="mt-1">
            <span className="text-[22px] font-black leading-none text-slate-800">{ppvBuyers}</span>
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
            <DollarSign size={15} strokeWidth={2} color="#7B4BF5" />
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
        <div className="mt-3 flex items-center justify-between rounded-[14px] px-3.5 py-3"
          style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.12)" }}>
          <div>
            <p className="text-[13px] font-bold text-slate-800">Tu gardes (HT estimé)</p>
            <p className="text-[10px] text-slate-400">{Math.round(priceTier.creatorRate * 100)}% base HT · versé le 15 du mois</p>
          </div>
          <p className="text-[24px] font-black" style={GRAD}>
            {Math.round(creatorShareNet).toLocaleString("fr-CH")} CHF
          </p>
        </div>
      </div>

      {/* ── COMMISSION PROGRESSIVE ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
              <Percent size={13} strokeWidth={2} color="#475569" />
            </div>
            <p className="text-[12px] font-bold text-slate-700">Commission progressive · Prix PPV</p>
          </div>
          <span className="text-[11px] text-slate-400">Actuel : <strong>{ppvPrice} CHF</strong></span>
        </div>
        <div className="space-y-1.5">
          {PRICE_TIERS.map((tier) => {
            const isActive = tier.id === priceTier.id;
            return (
              <div key={tier.id}
                className={`flex items-center justify-between rounded-[10px] px-3 py-2 text-[11px] ${isActive ? "font-semibold" : "text-slate-400"}`}
                style={isActive ? {
                  background: "linear-gradient(to right,rgba(123,75,245,.06),rgba(196,75,218,.06))",
                  border: "1px solid rgba(123,75,245,.18)",
                  color: "#7B4BF5",
                } : {}}
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: isActive ? "#7B4BF5" : "#cbd5e1" }} />
                  <span className={isActive ? "font-bold" : ""}>
                    {tier.label} · tu gardes {Math.round(tier.creatorRate * 100)}%
                  </span>
                  {isActive && <span className="ml-1 text-[9px] opacity-70">{tier.description}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{Math.round(tier.platformRate * 100)}% MC</span>
                  {isActive && (
                    <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}>
                      Actif
                    </span>
                  )}
                </div>
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
        <p className="mt-1.5 text-[10px] text-slate-400">Plus ton contenu est cher → plus tu gardes. Sans frais cachés.</p>
      </div>

      {/* ── FOLLOWERS + RÉSEAUX SOCIAUX COMPLETS ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-100">
            <Users size={15} strokeWidth={2} color="#7B4BF5" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-800">Audience totale</p>
            <p className="text-[10px] text-slate-400">Tous réseaux confondus</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[22px] font-black leading-none" style={GRAD}>
              {socialTotal.toLocaleString("fr-CH")}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-500">↗ +{followersDelta}%</p>
          </div>
        </div>

        {/* Grille réseaux sociaux */}
        <div className="grid grid-cols-2 gap-2">
          {SOCIAL_NETWORKS.map((net) => (
            <div key={net.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={net.icon} alt={net.label} className="h-5 w-5 rounded-full object-cover" />
                <span className="text-[11px] font-medium text-slate-600">{net.label}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-700">
                {net.followers.toLocaleString("fr-CH")}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-2.5 text-[10px] text-slate-400 leading-relaxed">
          Chiffres indicatifs MVP — synchronisés via APIs officielles en production.
        </p>
      </div>

      {/* ── VERSEMENTS STRIPE ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px]"
              style={{ background: "linear-gradient(135deg,#635BFF,#4B4ACF)" }}>
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">Mes versements</p>
              <p className="text-[10px] text-slate-400">Powered by Stripe Connect</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            <Shield className="h-3 w-3" />KYC en cours
          </div>
        </div>

        {/* Solde disponible */}
        <div className="mt-3 overflow-hidden rounded-xl"
          style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.04))", border: "1px solid rgba(123,75,245,.12)" }}>
          <div className="p-4">
            <p className="text-[11px] font-semibold text-violet-700">Solde disponible</p>
            <p className="mt-1 text-[28px] font-black leading-none tracking-tight" style={GRAD}>
              {formatMoney(availableBalance)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prochain versement : <strong>15 avril 2026</strong>
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}>
              <span>✓</span> Virement planifié le 15 avril 2026
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
            <p className="text-[10px] text-slate-400">En attente</p>
            <p className="mt-0.5 text-[15px] font-black leading-tight text-slate-700">{formatMoney(pendingBalance)}</p>
            <p className="mt-0.5 text-[9px] text-slate-400">7 derniers jours</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
            <p className="text-[10px] text-slate-400">Compte</p>
            <p className="mt-0.5 text-[12px] font-bold text-slate-700">···· 4521</p>
            <button className="mt-0.5 text-[10px] font-semibold" style={{ color: "#7B4BF5" }}>Modifier</button>
          </div>
          <div className="rounded-xl border border-slate-200 p-2.5"
            style={{ background: "linear-gradient(135deg,rgba(123,75,245,.05),rgba(196,75,218,.05))" }}>
            <p className="text-[10px] text-slate-400">Prochain</p>
            <p className="mt-0.5 text-[14px] font-black" style={GRAD}>15 avril</p>
            <p className="text-[9px] text-violet-500">SEPA auto</p>
          </div>
        </div>

        {/* Historique */}
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-bold text-slate-700">Historique des versements</p>
            <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
          </div>
          {[
            { date: "15 mars 2026",  amount: creatorShareNet * 0.88 },
            { date: "15 fév. 2026",  amount: creatorShareNet * 0.76 },
            { date: "15 jan. 2026",  amount: creatorShareNet * 0.65 },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[9px] text-violet-600">✓</span>
                <span className="text-slate-600">{p.date}</span>
              </div>
              <span className="font-bold text-slate-800">{formatMoney(p.amount)}</span>
            </div>
          ))}
          <p className="mt-2 text-[10px] italic text-slate-400">
            Données indicatives MVP — à connecter backend Stripe Connect.
          </p>
        </div>
      </div>

      <p className="mt-3 px-4 text-center text-[10px] italic text-slate-400">
        Données indicatives MVP · non connectées au backend.
      </p>
    </div>
  );
}
