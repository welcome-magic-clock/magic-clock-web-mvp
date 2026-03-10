// app/monet/RealMonetPanel.tsx
// ✅ v4.7 — Graphique supprimé · cards réordonnées + Lucide · Abo éditable + modale · commission unifiée · textes reformulés · liens versements · support
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wallet, TrendingUp, RefreshCw, Zap, DollarSign,
  Percent, Users, Shield, Edit2, Check, X, AlertTriangle,
} from "lucide-react";
import {
  CreatorLight,
  CURRENT_COUNTRY,
  PRICE_TIERS,
  getPriceTierFromPrice,
  formatMoney,
  computeVatAndShares,
} from "./monet-helpers";

const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as React.CSSProperties;

const PRIMARY_GRADIENT = "linear-gradient(135deg,#7B4BF5,#C44BDA,#F54B8F)";

const GH = "https://raw.githubusercontent.com/welcome-magic-clock/magic-clock-web-mvp/main/public/";

const SOCIAL_NETWORKS = [
  { id: "magic_clock", label: "Magic Clock", icon: `${GH}magic-clock-social-monet.png`,     followers: 12450 },
  { id: "instagram",   label: "Instagram",   icon: `${GH}magic-clock-social-instagram.png`, followers: 9800  },
  { id: "tiktok",      label: "TikTok",      icon: `${GH}magic-clock-social-tiktok.png`,    followers: 15400 },
  { id: "youtube",     label: "YouTube",     icon: `${GH}magic-clock-social-youtube.png`,   followers: 7200  },
  { id: "facebook",    label: "Facebook",    icon: `${GH}magic-clock-social-facebook.png`,  followers: 12500 },
  { id: "x",           label: "X",           icon: `${GH}magic-clock-social-x.png`,         followers: 5600  },
  { id: "snapchat",    label: "Snapchat",    icon: `${GH}magic-clock-social-snapchat.png`,  followers: 4300  },
  { id: "linkedin",    label: "LinkedIn",    icon: `${GH}magic-clock-social-linkedin.png`,  followers: 2100  },
  { id: "pinterest",   label: "Pinterest",   icon: `${GH}magic-clock-social-pinterest.png`, followers: 1800  },
  { id: "threads",     label: "Threads",     icon: `${GH}magic-clock-social-threads.png`,   followers: 3200  },
  { id: "bereal",      label: "BeReal",      icon: `${GH}magic-clock-social-bereal.png`,    followers: 890   },
  { id: "twitch",      label: "Twitch",      icon: `${GH}magic-clock-social-twitch.png`,    followers: 2600  },
];

type Props = { creator?: CreatorLight };

export function RealMonetPanel({ creator }: Props) {
  const vatRate = CURRENT_COUNTRY.vatRate;

  // ── Données MVP indicatives ──
  const aboSubs    = 480;
  const aboDelta   = 8.1;
  const ppvPrice   = 2.99;
  const ppvBuyers  = 520;
  const ppvPerBuyer = 1.4;
  const ppvDelta   = 5.2;
  const followersDelta = 12.4;

  // ── Prix abonnement éditable ──
  const [aboPrice, setAboPrice]           = useState(14.9);
  const [aboPriceEdit, setAboPriceEdit]   = useState(false);
  const [aboPriceDraft, setAboPriceDraft] = useState("14.90");
  const [showAboModal, setShowAboModal]   = useState(false);

  // ── Tiers séparés PPV / Abo ──
  const priceTierPpv = getPriceTierFromPrice(ppvPrice);
  const priceTierAbo = getPriceTierFromPrice(aboPrice);

  const grossAbos  = aboPrice * aboSubs;
  const grossPpv   = ppvPrice * ppvBuyers * ppvPerBuyer;
  const grossTotal = grossAbos + grossPpv;

  // Calcul commission séparé par flux
  const { vatAmount: vatAbo, platformShareNet: platAbo, creatorShareNet: gainAbo } =
    computeVatAndShares(grossAbos, priceTierAbo, vatRate);
  const { vatAmount: vatPpv, platformShareNet: platPpv, creatorShareNet: gainPpv } =
    computeVatAndShares(grossPpv, priceTierPpv, vatRate);

  const vatAmount        = vatAbo + vatPpv;
  const platformShareNet = platAbo + platPpv;
  const creatorShareNet  = gainAbo + gainPpv;
  const netBase          = grossTotal - vatAmount;

  // Taux moyen pondéré pour l'affichage
  const creatorPctWeighted = netBase > 0
    ? Math.round((creatorShareNet / netBase) * 100)
    : Math.round(priceTierAbo.creatorRate * 100);

  const socialTotal = useMemo(
    () => SOCIAL_NETWORKS.reduce((s, n) => s + n.followers, 0), []
  );
  const availableBalance = creatorShareNet * 0.72;
  const pendingBalance   = creatorShareNet * 0.28;

  function handleAboPriceSave() {
    const next = parseFloat(aboPriceDraft);
    if (isNaN(next) || next < 0.99) return;
    if (aboSubs > 0) {
      setShowAboModal(true);
    } else {
      setAboPrice(next);
      setAboPriceEdit(false);
    }
  }

  function confirmAboPriceChange() {
    const next = parseFloat(aboPriceDraft);
    if (!isNaN(next) && next >= 0.99) setAboPrice(next);
    setShowAboModal(false);
    setAboPriceEdit(false);
    // TODO: Stripe price update + Supabase messaging aux abonnés
  }

  return (
    <div className="space-y-0 pb-8">

      {/* ══ MODALE — abonnements en cours ══ */}
      {showAboModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle size={18} color="#d97706" />
              </div>
              <p className="text-[14px] font-black text-slate-800">Des abonnements sont en cours</p>
            </div>
            <p className="mb-3 text-[12px] leading-relaxed text-slate-500">
              Tu passes de <strong>{aboPrice.toFixed(2)} CHF</strong> à{" "}
              <strong>{parseFloat(aboPriceDraft).toFixed(2)} CHF / mois</strong>.{" "}
              Un message sera envoyé à tes <strong>{aboSubs} abonnés</strong> :
            </p>
            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Aperçu du message
              </p>
              <p className="text-[12px] font-semibold text-slate-700">
                @{creator?.handle?.replace(/^@/, "") ?? "toi"} a modifié le prix de son abonnement
                ({aboPrice.toFixed(2)} → {parseFloat(aboPriceDraft).toFixed(2)} CHF / mois)
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div className="h-3.5 w-3.5 rounded border border-slate-300" />
                  <span className="text-[11px] font-medium text-slate-700">Poursuivre mon abonnement au nouveau tarif</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div className="h-3.5 w-3.5 rounded border border-slate-300" />
                  <span className="text-[11px] font-medium text-slate-700">Suspendre mon abonnement</span>
                </div>
              </div>
              <p className="mt-2 text-[10px] italic text-slate-400">
                Sans réponse sous 7 jours, l'abonnement se poursuit automatiquement au nouveau tarif.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAboModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[12px] font-semibold text-slate-600">
                Annuler
              </button>
              <button onClick={confirmAboPriceChange}
                className="flex-1 rounded-xl py-2.5 text-[12px] font-bold text-white"
                style={{ background: PRIMARY_GRADIENT }}>
                Confirmer &amp; envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ KPI CARDS — Abonnés · Tu gagnes · PPV ══ */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">

        <a href="#bloc-abo" className="block rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5)", boxShadow: "0 4px 14px rgba(75,123,245,.25)" }}>
          <div className="mb-1 flex justify-center">
            <RefreshCw size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Abonnés</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{aboSubs}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">+{aboDelta}%</p>
        </a>

        <a href="#bloc-gains" className="block rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)", boxShadow: "0 4px 14px rgba(123,75,245,.3)" }}>
          <div className="mb-1 flex justify-center">
            <DollarSign size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Tu gagnes</p>
          <p className="mt-0.5 text-[14px] font-black leading-none text-white">
            {Math.round(creatorShareNet).toLocaleString("fr-CH")} CHF
          </p>
          <p className="mt-1 text-[10px] font-bold text-white/70">/ mois estimé</p>
        </a>

        <a href="#bloc-ppv" className="block rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)", boxShadow: "0 4px 14px rgba(196,75,218,.25)" }}>
          <div className="mb-1 flex justify-center">
            <Zap size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Acheteurs PPV</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{ppvBuyers}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">+{ppvDelta}%</p>
        </a>
      </div>

      {/* ── ABONNEMENTS (ancre + prix éditable) ── */}
      <div id="bloc-abo" className="mx-4 mt-3 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}>
            <RefreshCw size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[13px] font-bold text-slate-800">Abonnements</p>
        </div>
        <p>
          <span className="text-[26px] font-black leading-none text-slate-800">{aboSubs}</span>
          <span className="ml-1.5 text-[13px] text-slate-400">abonnés Magic Clock</span>
        </p>

        {/* Prix éditable */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="text-[12px] font-medium text-slate-600">Prix / mois</span>
          {aboPriceEdit ? (
            <div className="flex items-center gap-2">
              <input
                type="number" min={0.99} step={0.5}
                value={aboPriceDraft}
                onChange={(e) => setAboPriceDraft(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-24 rounded-lg border border-violet-300 bg-white px-2 py-1 text-right text-[13px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-200"
              />
              <span className="text-[12px] text-slate-400">CHF</span>
              <button onClick={handleAboPriceSave}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
                <Check size={13} color="#7B4BF5" strokeWidth={2.5} />
              </button>
              <button onClick={() => { setAboPriceEdit(false); setAboPriceDraft(aboPrice.toFixed(2)); }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                <X size={13} color="#94a3b8" strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black" style={GRAD}>{aboPrice.toFixed(2)} CHF</span>
              <button
                onClick={() => { setAboPriceEdit(true); setAboPriceDraft(aboPrice.toFixed(2)); }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-violet-100">
                <Edit2 size={12} color="#64748b" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Brut : <strong className="text-slate-600">{Math.round(grossAbos).toLocaleString("fr-CH")} CHF</strong> / mois
          &nbsp;·&nbsp; Tier : <strong className="text-slate-600">{priceTierAbo.label}</strong>
          &nbsp;·&nbsp; Tu gagnes <strong className="text-slate-600">{Math.round(priceTierAbo.creatorRate * 100)}%</strong>
        </p>
        <p className="mt-1 text-[11px] font-semibold text-emerald-500">↗ +{aboDelta}%</p>
      </div>

      {/* ── PAY-PER-VIEW ── */}
      <div id="bloc-ppv" className="mx-4 mt-3 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)" }}>
            <Zap size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[13px] font-bold text-slate-800">Pay-Per-View</p>
        </div>
        <p>
          <span className="text-[26px] font-black leading-none text-slate-800">{ppvBuyers}</span>
          <span className="ml-1.5 text-[13px] text-slate-400">/ mois</span>
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Prix : <strong className="text-slate-600">{ppvPrice} CHF</strong> · {ppvPerBuyer}x par acheteur
          &nbsp;·&nbsp; Brut : <strong className="text-slate-600">{Math.round(grossPpv).toLocaleString("fr-CH")} CHF</strong> / mois
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Tier : <strong className="text-slate-600">{priceTierPpv.label}</strong>
          &nbsp;·&nbsp; Tu gagnes <strong className="text-slate-600">{Math.round(priceTierPpv.creatorRate * 100)}%</strong>
        </p>
        <p className="mt-1.5 text-[11px] font-semibold text-emerald-500">↗ +{ppvDelta}%</p>
      </div>

      {/* ── RÉSUMÉ FINANCIER ── */}
      <div id="bloc-gains" className="mx-4 mt-3 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">Commission Abo ({Math.round(priceTierAbo.platformRate * 100)}% · {priceTierAbo.label})</span>
            <span className="font-semibold text-slate-600">– {Math.round(platAbo).toLocaleString("fr-CH")} CHF</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-400">Commission PPV ({Math.round(priceTierPpv.platformRate * 100)}% · {priceTierPpv.label})</span>
            <span className="font-semibold text-slate-600">– {Math.round(platPpv).toLocaleString("fr-CH")} CHF</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-[14px] px-3.5 py-3"
          style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.12)" }}>
          <div>
            <p className="text-[13px] font-bold text-slate-800">Tu gagnes (HT estimé)</p>
            <p className="text-[10px] text-slate-400">{creatorPctWeighted}% HT · versement le 15 du mois</p>
          </div>
          <p className="text-[24px] font-black" style={GRAD}>
            {Math.round(creatorShareNet).toLocaleString("fr-CH")} CHF
          </p>
        </div>
      </div>

      {/* ── COMMISSION PROGRESSIVE — identique Simulateur ── */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <Percent size={12} strokeWidth={2.5} color="#475569" />
          </div>
          <p className="text-[12px] font-bold text-slate-700">
            Commission progressive par prix PPV &amp; abonnement
          </p>
        </div>
        {/* Badges tiers actifs */}
        <div className="mb-2 flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full px-2 py-0.5 font-semibold"
            style={{ background: "rgba(75,123,245,.1)", color: "#4B7BF5" }}>
            Abo : {priceTierAbo.label} · tu gagnes {Math.round(priceTierAbo.creatorRate * 100)}%
          </span>
          <span className="rounded-full px-2 py-0.5 font-semibold"
            style={{ background: "rgba(196,75,218,.1)", color: "#C44BDA" }}>
            PPV : {priceTierPpv.label} · tu gagnes {Math.round(priceTierPpv.creatorRate * 100)}%
          </span>
        </div>
        <div className="space-y-1.5">
          {PRICE_TIERS.map((tier) => {
            const isAboActive = tier.id === priceTierAbo.id;
            const isPpvActive = tier.id === priceTierPpv.id;
            const isActive    = isAboActive || isPpvActive;
            return (
              <div key={tier.id}
                className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[11px] ${isActive ? "font-semibold" : "text-slate-400"}`}
                style={isActive ? {
                  background: "linear-gradient(to right,rgba(123,75,245,.06),rgba(196,75,218,.06))",
                  border: "1px solid rgba(123,75,245,.18)",
                  color: "#7B4BF5",
                } : {}}
              >
                <span className={isActive ? "font-bold" : ""}>
                  Tu gagnes {Math.round(tier.creatorRate * 100)}%
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: isActive ? "#7B4BF5" : "#cbd5e1" }} />
                  <span>{tier.label} · {tier.description}</span>
                  {isAboActive && (
                    <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                      style={{ background: "#4B7BF5" }}>Abo</span>
                  )}
                  {isPpvActive && (
                    <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                      style={{ background: "#C44BDA" }}>PPV</span>
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
        <p className="mt-1.5 text-[10px] text-slate-400">
          Le prix que tu fixes détermine ce que tu gagnes — plus ton contenu a de la valeur, plus ta part est grande.
        </p>
      </div>

      {/* ── AUDIENCE TOTALE ── */}
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
        {/* ✅ Texte reformulé */}
        <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400">
          Tes gains sont calculés uniquement sur ton audience Magic Clock. Les autres réseaux sont affichés à titre indicatif.
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
          {/* ✅ KYC → /settings/kyc */}
          <Link href="/settings/kyc"
            className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            <Shield className="h-3 w-3" /> KYC en cours
          </Link>
        </div>

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

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
            <p className="text-[10px] text-slate-400">En attente</p>
            <p className="mt-0.5 text-[15px] font-black leading-tight text-slate-700">{formatMoney(pendingBalance)}</p>
            <p className="mt-0.5 text-[9px] text-slate-400">7 derniers jours</p>
          </div>
          {/* ✅ Compte → /settings/payout */}
          <Link href="/settings/payout"
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 transition-colors hover:border-violet-200">
            <p className="text-[10px] text-slate-400">Compte</p>
            <p className="mt-0.5 text-[12px] font-bold text-slate-700">···· 4521</p>
            <p className="mt-0.5 text-[10px] font-semibold" style={{ color: "#7B4BF5" }}>Modifier →</p>
          </Link>
          {/* ✅ Prochain → /settings/payout#schedule */}
          <Link href="/settings/payout#schedule"
            className="rounded-xl border border-slate-200 p-2.5 transition-colors hover:border-violet-200"
            style={{ background: "linear-gradient(135deg,rgba(123,75,245,.05),rgba(196,75,218,.05))" }}>
            <p className="text-[10px] text-slate-400">Prochain</p>
            <p className="mt-0.5 text-[14px] font-black" style={GRAD}>15 avril</p>
            <p className="text-[9px] text-violet-500">SEPA auto →</p>
          </Link>
        </div>

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
          {/* ✅ "Cockpit connecté en temps réel" */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="text-[10px] font-medium text-emerald-600">Cockpit connecté en temps réel</p>
          </div>
        </div>
      </div>

      {/* ── PIED DE PAGE — support ── */}
      <div className="mt-4 px-4 text-center">
        <p className="text-[11px] text-slate-400">
          Un problème avec ton cockpit ?{" "}
          <Link href="/support" className="font-semibold underline" style={{ color: "#7B4BF5" }}>
            Clique ici
          </Link>
        </p>
      </div>

    </div>
  );
}
