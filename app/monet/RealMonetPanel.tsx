// app/monet/RealMonetPanel.tsx
"use client";

import MonetToolbar from "@/components/monet/MonetToolbar";
import { useMemo } from "react";
import { Info, Calendar, TrendingUp, Wallet, Shield, ChevronRight, Clock } from "lucide-react";
import {
  CreatorLight,
  CURRENT_COUNTRY,
  PRICE_TIERS,
  getPriceTierFromPrice,
  formatMoney,
  formatMoneyCompact,
  computeVatAndShares,
  DailyRevenuePoint,
  RevenueLinesChart,
} from "./monet-helpers";

// Réseaux sociaux (maquette MVP, chiffres indicatifs)
const SOCIAL_NETWORKS = [
  {
    id: "facebook",
    label: "Facebook",
    icon: "/magic-clock-social-facebook.png",
    followers: 12500,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "/magic-clock-social-instagram.png",
    followers: 9800,
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "/magic-clock-social-youtube.png",
    followers: 7200,
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "/magic-clock-social-tiktok.png",
    followers: 15400,
  },
  {
    id: "snapchat",
    label: "Snapchat",
    icon: "/magic-clock-social-snapchat.png",
    followers: 4300,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "/magic-clock-social-linkedin.png",
    followers: 2100,
  },
  {
    id: "x",
    label: "X (Twitter)",
    icon: "/magic-clock-social-x.png",
    followers: 5600,
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers UI locaux
// ─────────────────────────────────────────────────────────────

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

  const color =
    trend === "up"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-rose-50 text-rose-600";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${color}`}
    >
      {trend === "up" ? (
        <span className="h-3 w-3">↗</span>
      ) : (
        <span className="h-3 w-3">↘</span>
      )}
      <span>
        {value > 0 ? "+" : ""}
        {value.toFixed(1)}%
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Versements — Adyen for Platforms
// ─────────────────────────────────────────────────────────────

function PayoutsSection({
  creatorShareNet,
  currency = "CHF",
}: {
  creatorShareNet: number;
  currency?: string;
}) {
  // Données maquette MVP — à connecter backend Adyen
  const availableBalance = creatorShareNet * 0.72;
  const pendingBalance = creatorShareNet * 0.28;
  const nextPayoutDate = "15 avril 2026";
  const lastPayoutAmount = creatorShareNet * 0.95;
  const payoutThreshold = 50;
  const kycStatus: "verified" | "pending" | "not_started" = "pending";
  const ibanLast4 = "4521";

  const payoutHistory = [
    { date: "15 mars 2026", amount: creatorShareNet * 0.88, status: "paid" },
    { date: "15 fév. 2026", amount: creatorShareNet * 0.76, status: "paid" },
    { date: "15 jan. 2026", amount: creatorShareNet * 0.65, status: "paid" },
  ];

  const progressToThreshold = Math.min(
    100,
    (availableBalance / payoutThreshold) * 100,
  );

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Mes versements
            </h2>
            <p className="text-[11px] text-slate-500">
              Powered by Adyen for Platforms
            </p>
          </div>
        </div>
        {/* KYC Status Badge */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            kycStatus === "verified"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : kycStatus === "pending"
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <Shield className="h-3 w-3" />
          {kycStatus === "verified"
            ? "KYC vérifié ✓"
            : kycStatus === "pending"
              ? "KYC en cours…"
              : "KYC requis"}
        </div>
      </div>

      {/* Soldes */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* Solde disponible */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4">
          <p className="text-[11px] font-medium text-emerald-700">
            Solde disponible
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-700">
            {formatMoney(availableBalance, currency)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600/70">
            Prochain versement : <strong>{nextPayoutDate}</strong>
          </p>

          {/* Barre progression vers seuil */}
          {availableBalance < payoutThreshold && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-emerald-700/60">
                <span>
                  Seuil de versement : {payoutThreshold} {currency}
                </span>
                <span>{progressToThreshold.toFixed(0)}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-emerald-200/60">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progressToThreshold}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-emerald-700/50">
                Encore{" "}
                {formatMoney(payoutThreshold - availableBalance, currency)}{" "}
                avant le prochain virement automatique.
              </p>
            </div>
          )}
          {availableBalance >= payoutThreshold && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] text-white">
              <span>✓</span>
              <span>Virement planifié le {nextPayoutDate}</span>
            </div>
          )}
        </div>

        {/* En attente + détails */}
        <div className="space-y-3">
          {/* Pending */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500">En attente</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-700">
                  {formatMoney(pendingBalance, currency)}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Ventes des 7 derniers jours (en traitement)
                </p>
              </div>
              <Clock className="h-5 w-5 text-slate-300" />
            </div>
          </div>

          {/* IBAN */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
            <div>
              <p className="text-[11px] text-slate-500">Compte de versement</p>
              <p className="mt-0.5 text-xs font-medium text-slate-700">
                IBAN ···· ···· {ibanLast4}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
            >
              Modifier <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Prochain versement */}
          <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5">
            <Calendar className="h-4 w-4 flex-shrink-0 text-indigo-400" />
            <div>
              <p className="text-[11px] font-medium text-indigo-700">
                Virement SEPA le 15 de chaque mois
              </p>
              <p className="text-[10px] text-indigo-500">
                Dernier versement :{" "}
                <strong>
                  {formatMoney(lastPayoutAmount, currency)}
                </strong>{" "}
                le 15 mars 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historique versements */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-700">
            Historique des versements
          </p>
          <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <div className="divide-y divide-slate-100">
          {payoutHistory.map((payout, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[9px] text-emerald-600">
                  ✓
                </span>
                <span className="text-slate-600">{payout.date}</span>
              </div>
              <span className="font-semibold text-slate-800">
                {formatMoney(payout.amount, currency)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-slate-400">
          Données indicatives MVP — à connecter backend Adyen for Platforms.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant principal : RealMonetPanel
// ─────────────────────────────────────────────────────────────

type RealMonetPanelProps = {
  creator?: CreatorLight;
};

export function RealMonetPanel({ creator }: RealMonetPanelProps) {
  const vatRateReal = CURRENT_COUNTRY.vatRate;
  const currency = CURRENT_COUNTRY.currency;

  const realFollowers = creator?.followers ?? 12450;
  const realFollowersDelta = 12.4;

  const realAboPrice = 14.9;
  const realAboSubs = 480;
  const realAboDelta = 8.1;

  // PPV — prix moyen 2.99 CHF (sweet spot stratégique Magic Clock)
  const realPpvPrice = 2.99;
  const realPpvBuyers = 520;
  const realPpvPerBuyer = 1.4;
  const realPpvDelta = 5.2;

  // Palier tarifaire basé sur le prix PPV (nouvelle logique Adyen)
  const realPriceTier = getPriceTierFromPrice(realPpvPrice);

  const realGrossAbos = realAboPrice * realAboSubs;
  const realGrossPpv = realPpvPrice * realPpvBuyers * realPpvPerBuyer;
  const realGrossTotal = realGrossAbos + realGrossPpv;

  const {
    vatAmount: realVatAmount,
    netBase: realNetBase,
    platformShareNet: realPlatformShareNet,
    creatorShareNet: realCreatorShareNet,
  } = computeVatAndShares(realGrossTotal, realPriceTier, vatRateReal);

  const indicativeFollowersTotal = useMemo(
    () => SOCIAL_NETWORKS.reduce((sum, n) => sum + n.followers, 0),
    [],
  );

  const realDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
    const days = 30;
    const baseAbo = realGrossAbos / days;
    const basePpv = realGrossPpv / days;

    return Array.from({ length: days }, (_, index) => {
      const t = index / (days - 1 || 1);
      const waveAbo = 0.15 * Math.sin(index / 2) + 0.1 * Math.cos(index / 3);
      const wavePpv =
        0.2 * Math.sin(index / 1.7) + 0.05 * Math.cos(index / 4);
      const factorAbo = 0.8 + 0.6 * t + waveAbo;
      const factorPpv = 0.9 + 0.7 * t + wavePpv;
      const abo = Math.max(0, Math.round(baseAbo * factorAbo));
      const ppv = Math.max(0, Math.round(basePpv * factorPpv));
      return { day: index + 1, abo, ppv };
    });
  }, [realGrossAbos, realGrossPpv]);

  return (
    <div className="space-y-4">
      {/* Toolbar bulles Monétisation */}
      <MonetToolbar />

      {/* ── SECTION 1 : Revenus du mois ── */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">
              Réalité · compte
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Info className="h-3 w-3" />
              Données indicatives pour le MVP (non connectées au backend).
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Les montants sont affichés en TTC, TVA estimée, puis en base HT pour
            la répartition plateforme / créateur.
          </p>
        </div>

        {/* Encadré TVA / pays */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
          <Info className="h-3 w-3" />
          <span>
            Pays détecté :{" "}
            <strong>
              {CURRENT_COUNTRY.label} · TVA{" "}
              {Math.round(vatRateReal * 1000) / 10}%
            </strong>{" "}
            — estimée pour ce cockpit (MVP).
          </span>
        </div>

        {/* HERO graphique */}
        <div
          id="monet-graph"
          className="mt-2 -mx-4 overflow-hidden border-y border-slate-200 bg-slate-50/80 px-0 py-4 sm:mx-0 sm:rounded-2xl sm:border sm:px-4 sm:py-4"
        >
          <div className="mb-3 flex flex-col gap-1 text-[11px] md:flex-row md:items-center md:justify-between">
            <p className="font-medium text-slate-700">
              Revenus quotidiens (réels) · PPV &amp; abonnements
            </p>
            <p className="text-slate-500">
              Exemple de répartition sur 30 jours, basé sur tes chiffres PPV /
              abonnements du cockpit.
            </p>
          </div>
          <div className="mt-1">
            <RevenueLinesChart data={realDailyRevenue} variant="large" />
          </div>
        </div>

        {/* Grille Followers / Abo / PPV */}
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {/* Followers */}
          <div
            id="monet-followers"
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
          >
            <p className="text-xs text-slate-500">Followers Magic Clock</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/magic-clock-social-monet.png"
                  alt="Magic Clock"
                  className="h-7 w-7 rounded-xl"
                />
                <div className="flex flex-col">
                  <p className="text-xl font-semibold">
                    {realFollowers.toLocaleString("fr-CH")}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Followers réels sur Magic Clock (cockpit).
                  </p>
                </div>
              </div>
              <TrendBadge value={realFollowersDelta} />
            </div>

            {/* Autres réseaux */}
            <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-700">
                  Aperçu autres réseaux sociaux
                </span>
                <span className="text-slate-500">
                  Total indicatif :{" "}
                  <span className="font-semibold">
                    {indicativeFollowersTotal.toLocaleString("fr-CH")}
                  </span>
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {SOCIAL_NETWORKS.map((net) => (
                  <div
                    key={net.id}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={net.icon}
                      alt={net.label}
                      className="h-4 w-4 rounded-full"
                    />
                    <span className="text-[10px] text-slate-600">
                      {net.followers.toLocaleString("fr-CH")}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-snug text-slate-500">
                Les chiffres affichés par réseau social sont fournis à titre{" "}
                <strong>purement indicatif</strong> dans ce cockpit MVP. En
                production, les données seront synchronisées via les APIs
                officielles.
              </p>
            </div>
          </div>

          {/* Abonnements */}
          <div
            id="monet-subscriptions"
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
          >
            <p className="text-xs text-slate-500">Abonnements (Abo)</p>
            <p className="mt-1 text-lg font-semibold">
              {realAboSubs.toLocaleString("fr-CH")} abonnés
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prix moyen : {formatMoney(realAboPrice, currency)} / mois (TTC).
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Revenu brut Abo : {formatMoneyCompact(realGrossAbos, currency)} /
              mois (TTC).
            </p>
            <div className="mt-2">
              <TrendBadge value={realAboDelta} />
            </div>
          </div>

          {/* Pay-Per-View */}
          <div
            id="monet-ppv"
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
          >
            <p className="text-xs text-slate-500">Contenus Pay-Per-View (PPV)</p>
            <p className="mt-1 text-lg font-semibold">
              {realPpvBuyers.toLocaleString("fr-CH")} acheteurs / mois
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prix moyen : {formatMoney(realPpvPrice, currency)} (TTC) ·{" "}
              {realPpvPerBuyer.toFixed(1)} PPV / acheteur / mois.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Revenu brut PPV : {formatMoneyCompact(realGrossPpv, currency)} /
              mois (TTC).
            </p>
            {/* Badge palier tarifaire */}
            <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] text-sky-700">
              <span>{realPriceTier.emoji}</span>
              <span>
                Palier {realPriceTier.label} · Commission{" "}
                {Math.round(realPriceTier.platformRate * 100)}%
              </span>
            </div>
            <div className="mt-1.5">
              <TrendBadge value={realPpvDelta} />
            </div>
          </div>
        </div>

        {/* ── Résumé revenus + commission progressive ── */}
        <div
          id="monet-revenue"
          className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Revenu brut total</p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatMoneyCompact(realGrossTotal, currency)}
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p>TVA estimée ({Math.round(vatRateReal * 1000) / 10}%)</p>
                  <p className="mt-1 font-medium">
                    {formatMoneyCompact(realVatAmount, currency)}
                  </p>
                  <p className="mt-2">Base HT estimée</p>
                  <p className="mt-1 font-semibold">
                    {formatMoneyCompact(realNetBase, currency)}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-xs md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white/80 p-3">
                  <p className="text-[11px] text-slate-500">
                    Commission Magic Clock (HT)
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-700">
                    {formatMoneyCompact(realPlatformShareNet, currency)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {realPriceTier.emoji} Palier {realPriceTier.label} ·{" "}
                    {Math.round(realPriceTier.platformRate * 100)}% · inclut
                    frais Adyen.
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                  <p className="text-[11px] text-emerald-700">
                    Tu gardes (HT estimé)
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600">
                    {formatMoneyCompact(realCreatorShareNet, currency)}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600/80">
                    {Math.round(realPriceTier.creatorRate * 100)}% de la base
                    HT — versé le 15 du mois.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Grille paliers commission progressifs ── */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between text-xs">
              <p className="font-medium text-slate-700">
                Commission progressive · Prix PPV
              </p>
              <p className="text-slate-500">
                Prix actuel :{" "}
                <span className="font-semibold">
                  {formatMoney(realPpvPrice, currency)}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {PRICE_TIERS.map((tier) => {
                const isActive = tier.id === realPriceTier.id;
                return (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                      isActive
                        ? "border-emerald-400 bg-emerald-50/80"
                        : "border-slate-200 bg-white/80"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span>{tier.emoji}</span>
                        <span className="font-semibold">{tier.label}</span>
                        <span className="text-slate-400">·</span>
                        <span
                          className={
                            isActive
                              ? "font-bold text-emerald-700"
                              : "text-slate-600"
                          }
                        >
                          tu gardes {Math.round(tier.creatorRate * 100)}%
                        </span>
                      </div>
                      <span className="mt-0.5 text-[10px] text-slate-400">
                        {tier.description}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] ${isActive ? "font-medium text-emerald-600" : "text-slate-400"}`}
                      >
                        {Math.round(tier.platformRate * 100)}% MC
                      </span>
                      {isActive && (
                        <div className="mt-0.5 inline-flex rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] text-white">
                          Actif
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barre progression visuelle */}
            <div className="mt-1 rounded-lg border border-slate-100 bg-white/60 p-2">
              <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>0.99</span>
                <span>2.00</span>
                <span>9.99</span>
                <span>29.99+</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-gradient-to-r from-amber-400 via-sky-400 via-indigo-500 to-emerald-500" />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400">
                Plus ton contenu est cher → plus tu gardes. Modèle tout
                compris, sans frais cachés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : Mes Versements (Adyen) ── */}
      <PayoutsSection
        creatorShareNet={realCreatorShareNet}
        currency={currency}
      />
    </div>
  );
}
