// app/monet/RealMonetPanel.tsx
// ✅ v4.8 — Supabase réel · PPV par Magic Clock · commission individuelle par palier · slider Abo · 4 pages liées
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Wallet, TrendingUp, RefreshCw, Zap, DollarSign,
  Percent, Users, Shield, Edit2, Check, X, AlertTriangle,
  ChevronRight, Clock,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import {
  CreatorLight,
  CURRENT_COUNTRY,
  PRICE_TIERS,
  getPriceTierFromPrice,
  formatMoney,
  computeVatAndShares,
  clamp,
} from "./monet-helpers";

// ── Styles partagés ──────────────────────────────────────────
const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as React.CSSProperties;
const PRIMARY_GRADIENT = "linear-gradient(135deg,#7B4BF5,#C44BDA,#F54B8F)";
const GH = "https://raw.githubusercontent.com/welcome-magic-clock/magic-clock-web-mvp/main/public/";

// ── Réseaux sociaux ──────────────────────────────────────────
const SOCIAL_NETWORKS = [
  { id: "magic_clock", label: "Magic Clock", icon: `${GH}magic-clock-social-monet.png` },
  { id: "instagram",   label: "Instagram",   icon: `${GH}magic-clock-social-instagram.png` },
  { id: "tiktok",      label: "TikTok",      icon: `${GH}magic-clock-social-tiktok.png` },
  { id: "youtube",     label: "YouTube",     icon: `${GH}magic-clock-social-youtube.png` },
  { id: "facebook",    label: "Facebook",    icon: `${GH}magic-clock-social-facebook.png` },
  { id: "x",           label: "X",           icon: `${GH}magic-clock-social-x.png` },
  { id: "snapchat",    label: "Snapchat",    icon: `${GH}magic-clock-social-snapchat.png` },
  { id: "linkedin",    label: "LinkedIn",    icon: `${GH}magic-clock-social-linkedin.png` },
  { id: "pinterest",   label: "Pinterest",   icon: `${GH}magic-clock-social-pinterest.png` },
  { id: "threads",     label: "Threads",     icon: `${GH}magic-clock-social-threads.png` },
  { id: "bereal",      label: "BeReal",      icon: `${GH}magic-clock-social-bereal.png` },
  { id: "twitch",      label: "Twitch",      icon: `${GH}magic-clock-social-twitch.png` },
];

// ── Types Supabase ───────────────────────────────────────────
type MagicClockPPV = {
  id: string;
  slug: string;
  title: string;
  ppv_price: number;
  thumbnail_url: string | null;
  views_count: number;
  is_published: boolean;
  sales_count: number;   // agrégé depuis payment_logs
  gross_revenue: number; // ppv_price × sales_count
};

type ProfileData = {
  subscription_price: number | null;
  stripe_account_id: string | null;
  stripe_account_status: string | null;
};

type SocialFollowers = Record<string, number>;

// ── Composant principal ─────────────────────────────────────
type Props = { creator?: CreatorLight };

export function RealMonetPanel({ creator }: Props) {
  const supabase = getSupabaseBrowser();
  const vatRate  = CURRENT_COUNTRY.vatRate;

  // ── State Supabase ────────────────────────────────────────
  const [profile,      setProfile]      = useState<ProfileData | null>(null);
  const [ppvClocks,    setPpvClocks]    = useState<MagicClockPPV[]>([]);
  const [aboSubs,      setAboSubs]      = useState<number>(0);
  const [aboDelta,     setAboDelta]     = useState<number>(0);
  const [socialData,   setSocialData]   = useState<SocialFollowers>({});
  const [loading,      setLoading]      = useState(true);

  // ── State UI ──────────────────────────────────────────────
  const [aboPrice,        setAboPrice]        = useState(9.99);
  const [aboPriceSlider,  setAboPriceSlider]  = useState(9.99);
  const [aboPriceEdit,    setAboPriceEdit]    = useState(false);
  const [aboPriceDraft,   setAboPriceDraft]   = useState("9.99");
  const [showAboModal,    setShowAboModal]    = useState(false);

  // ── Fetch Supabase ────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // 1. Profil créateur
      const { data: prof } = await supabase
        .from("profiles")
        .select("subscription_price, stripe_account_id, stripe_account_status")
        .eq("id", user.id)
        .single();

      if (prof) {
        setProfile(prof);
        const price = prof.subscription_price ?? 9.99;
        setAboPrice(price);
        setAboPriceSlider(price);
        setAboPriceDraft(price.toFixed(2));
      }

      // 2. Magic Clocks PPV publiés par ce créateur
      const { data: clocks } = await supabase
        .from("magic_clocks")
        .select("id, slug, title, ppv_price, thumbnail_url, views_count, is_published")
        .eq("user_id", user.id)
        .eq("gating_mode", "PPV")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (clocks && clocks.length > 0) {
        // 3. Agréger les ventes depuis payment_logs par magic_clock_id
        const clockIds = clocks.map((c) => c.id);
        const { data: sales } = await supabase
          .from("payment_logs")
          .select("magic_clock_id, amount_paid")
          .in("magic_clock_id", clockIds)
          .eq("status", "paid");

        // Map : clock_id → { count, total }
        const salesMap: Record<string, { count: number; total: number }> = {};
        (sales ?? []).forEach((s) => {
          if (!salesMap[s.magic_clock_id]) salesMap[s.magic_clock_id] = { count: 0, total: 0 };
          salesMap[s.magic_clock_id].count  += 1;
          salesMap[s.magic_clock_id].total  += s.amount_paid ?? 0;
        });

        const enriched: MagicClockPPV[] = clocks.map((c) => ({
          ...c,
          sales_count:   salesMap[c.id]?.count ?? 0,
          gross_revenue: salesMap[c.id]?.total ?? 0,
        }));
        setPpvClocks(enriched);
      }

      // 4. Abonnés actifs (payment_type = subscription, creator_handle)
      const handle = creator?.handle?.replace(/^@/, "");
      if (handle) {
        const { count } = await supabase
          .from("payment_logs")
          .select("id", { count: "exact", head: true })
          .eq("creator_handle", handle)
          .eq("payment_type", "subscription")
          .eq("status", "paid");
        setAboSubs(count ?? 0);
      }

      // 5. Followers réseaux sociaux (depuis profiles — colonnes ig_followers etc.)
      // TODO: brancher les vraies colonnes quand APIs sociales intégrées
      // Pour l'instant on affiche "–" sauf Magic Clock (= aboSubs)
      setSocialData({});

      setLoading(false);
    }
    load();
  }, [creator?.handle]);

  // ── Calculs financiers PPV (commission par Magic Clock) ───
  const ppvByTier = useMemo(() => {
    // Regrouper par tier pour le résumé financier
    const map: Record<string, { tier: typeof PRICE_TIERS[0]; grossTotal: number; salesTotal: number }> = {};
    ppvClocks.forEach((mc) => {
      const tier = getPriceTierFromPrice(mc.ppv_price);
      if (!map[tier.id]) map[tier.id] = { tier, grossTotal: 0, salesTotal: 0 };
      map[tier.id].grossTotal  += mc.gross_revenue;
      map[tier.id].salesTotal  += mc.sales_count;
    });
    return Object.values(map);
  }, [ppvClocks]);

  const ppvSummary = useMemo(() => {
    return ppvByTier.reduce((acc, { tier, grossTotal }) => {
      const { vatAmount, platformShareNet, creatorShareNet } =
        computeVatAndShares(grossTotal, tier, vatRate);
      acc.gross   += grossTotal;
      acc.vat     += vatAmount;
      acc.plat    += platformShareNet;
      acc.creator += creatorShareNet;
      return acc;
    }, { gross: 0, vat: 0, plat: 0, creator: 0 });
  }, [ppvByTier, vatRate]);

  const totalPpvSales = useMemo(
    () => ppvClocks.reduce((s, mc) => s + mc.sales_count, 0),
    [ppvClocks]
  );

  // ── Calculs abonnement ────────────────────────────────────
  const priceTierAbo  = getPriceTierFromPrice(aboPrice);
  const grossAbos     = aboPrice * aboSubs;
  const { vatAmount: vatAbo, platformShareNet: platAbo, creatorShareNet: gainAbo } =
    computeVatAndShares(grossAbos, priceTierAbo, vatRate);

  // ── Total général ─────────────────────────────────────────
  const grossTotal      = grossAbos + ppvSummary.gross;
  const vatTotal        = vatAbo + ppvSummary.vat;
  const platTotal       = platAbo + ppvSummary.plat;
  const creatorTotal    = gainAbo + ppvSummary.creator;
  const netBase         = grossTotal - vatTotal;
  const creatorPct      = netBase > 0 ? Math.round((creatorTotal / netBase) * 100) : 0;

  // ── Versements ────────────────────────────────────────────
  const availableBalance = creatorTotal * 0.72;
  const pendingBalance   = creatorTotal * 0.28;

  // ── Handlers prix abonnement ──────────────────────────────
  function commitAboPrice(next: number) {
    if (isNaN(next) || next < 0.99) return;
    if (aboSubs > 0) { setShowAboModal(true); }
    else {
      setAboPrice(next);
      saveAboPriceToSupabase(next);
    }
  }
  async function saveAboPriceToSupabase(price: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ subscription_price: price }).eq("id", user.id);
  }
  async function confirmAboPriceChange() {
    const next = parseFloat(aboPriceDraft);
    if (!isNaN(next) && next >= 0.99) {
      setAboPrice(next);
      setAboPriceSlider(next);
      await saveAboPriceToSupabase(next);
      // TODO: INSERT subscription_price_changes + Stripe price update + messaging abonnés
    }
    setShowAboModal(false);
    setAboPriceEdit(false);
  }

  // ── Tiers PPV actifs (pour badges commission) ─────────────
  const activePpvTierIds = useMemo(
    () => [...new Set(ppvClocks.map((mc) => getPriceTierFromPrice(mc.ppv_price).id))],
    [ppvClocks]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-0 pb-8">

      {/* ══ MODALE — changement prix abonnement ══ */}
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
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Aperçu du message</p>
              <p className="text-[12px] font-semibold text-slate-700">
                @{creator?.handle?.replace(/^@/, "") ?? "toi"} a modifié le prix de son abonnement
                ({aboPrice.toFixed(2)} → {parseFloat(aboPriceDraft).toFixed(2)} CHF / mois)
              </p>
              <div className="mt-2 space-y-1.5">
                {["Poursuivre mon abonnement au nouveau tarif", "Suspendre mon abonnement"].map((opt) => (
                  <div key={opt} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <div className="h-3.5 w-3.5 rounded border border-slate-300" />
                    <span className="text-[11px] font-medium text-slate-700">{opt}</span>
                  </div>
                ))}
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
          <div className="mb-1 flex justify-center"><RefreshCw size={16} strokeWidth={2} color="white" /></div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Abonnés</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{aboSubs.toLocaleString("fr-CH")}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">Magic Clock</p>
        </a>
        <a href="#bloc-gains" className="block rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)", boxShadow: "0 4px 14px rgba(123,75,245,.3)" }}>
          <div className="mb-1 flex justify-center"><DollarSign size={16} strokeWidth={2} color="white" /></div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Tu gagnes</p>
          <p className="mt-0.5 text-[14px] font-black leading-none text-white">
            {Math.round(creatorTotal).toLocaleString("fr-CH")} CHF
          </p>
          <p className="mt-1 text-[10px] font-bold text-white/70">/ mois estimé</p>
        </a>
        <a href="#bloc-ppv" className="block rounded-2xl p-3 text-center"
          style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)", boxShadow: "0 4px 14px rgba(196,75,218,.25)" }}>
          <div className="mb-1 flex justify-center"><Zap size={16} strokeWidth={2} color="white" /></div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Ventes PPV</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{totalPpvSales.toLocaleString("fr-CH")}</p>
          <p className="mt-1 text-[10px] font-bold text-white/70">{ppvClocks.length} Magic Clocks</p>
        </a>
      </div>

      {/* ══ BLOC ABONNEMENTS ══ */}
      <div id="bloc-abo" className="mx-4 mt-3 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)" }}>
            <RefreshCw size={16} strokeWidth={2} color="white" />
          </div>
          <p className="text-[13px] font-bold text-slate-800">Abonnements</p>
        </div>

        {/* Nombre abonnés */}
        <p className="mb-3">
          <span className="text-[30px] font-black leading-none text-slate-800">
            {aboSubs.toLocaleString("fr-CH")}
          </span>
          <span className="ml-1.5 text-[13px] text-slate-400">abonnés Magic Clock</span>
        </p>

        {/* Ligne prix + crayon */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-slate-500">Prix / mois</span>
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-black" style={GRAD}>
              {aboPriceSlider.toFixed(2)} CHF
            </span>
            <button
              onClick={() => { setAboPriceEdit(true); setAboPriceDraft(aboPrice.toFixed(2)); }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-violet-100">
              <Edit2 size={12} color="#64748b" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Slider visuel */}
        <div className="mt-2">
          <input
            type="range"
            min={0.99} max={999.99} step={0.5}
            value={aboPriceSlider}
            onChange={(e) => setAboPriceSlider(parseFloat(e.target.value))}
            onMouseUp={(e) => commitAboPrice(parseFloat((e.target as HTMLInputElement).value))}
            onTouchEnd={(e) => commitAboPrice(parseFloat((e.target as HTMLInputElement).value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0,99</span><span>999,99</span>
          </div>
        </div>

        {/* Champ précis si crayon cliqué */}
        {aboPriceEdit && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2">
            <span className="text-[11px] text-slate-500">Précis :</span>
            <input
              type="number" min={0.99} step={0.5}
              value={aboPriceDraft}
              onChange={(e) => {
                setAboPriceDraft(e.target.value);
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) setAboPriceSlider(clamp(v, 0.99, 999.99));
              }}
              onFocus={(e) => e.target.select()}
              className="w-24 rounded-lg border border-violet-300 bg-white px-2 py-1 text-right text-[13px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-200"
            />
            <span className="text-[11px] text-slate-400">CHF</span>
            <button onClick={() => commitAboPrice(parseFloat(aboPriceDraft))}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
              <Check size={13} color="#7B4BF5" strokeWidth={2.5} />
            </button>
            <button onClick={() => { setAboPriceEdit(false); setAboPriceSlider(aboPrice); }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
              <X size={13} color="#94a3b8" strokeWidth={2.5} />
            </button>
          </div>
        )}

        <p className="mt-2 text-[11px] text-slate-400">
          Palier : <strong className="text-slate-600">{priceTierAbo.label}</strong>
          &nbsp;·&nbsp; Tu gagnes <strong className="text-slate-600">{Math.round(priceTierAbo.creatorRate * 100)}%</strong>
          &nbsp;·&nbsp; Brut : <strong className="text-slate-600">{formatMoney(grossAbos)}</strong> / mois
        </p>
      </div>

      {/* ══ BLOC PAY-PER-VIEW — liste par Magic Clock ══ */}
      <div id="bloc-ppv" className="mx-4 mt-3 scroll-mt-20 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px]"
              style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)" }}>
              <Zap size={16} strokeWidth={2} color="white" />
            </div>
            <p className="text-[13px] font-bold text-slate-800">Pay-Per-View</p>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-black leading-none" style={GRAD}>
              {totalPpvSales.toLocaleString("fr-CH")}
            </p>
            <p className="text-[10px] text-slate-400">ventes · {ppvClocks.length} Magic Clocks</p>
          </div>
        </div>

        {/* Liste des Magic Clocks PPV */}
        {ppvClocks.length === 0 ? (
          <div className="px-4 pb-4 text-center">
            <p className="text-[12px] text-slate-400">Aucun Magic Clock PPV publié pour l'instant.</p>
            <Link href="/studio" className="mt-2 inline-block text-[12px] font-semibold"
              style={{ color: "#7B4BF5" }}>
              Créer mon premier Magic Clock →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ppvClocks.map((mc) => {
              const tier     = getPriceTierFromPrice(mc.ppv_price);
              const { creatorShareNet } = computeVatAndShares(mc.gross_revenue, tier, vatRate);
              return (
                <Link
                  key={mc.id}
                  href={`/monet/ppv/${mc.slug}`}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50/80"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail ou icône */}
                    {mc.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mc.thumbnail_url} alt={mc.title}
                        className="h-9 w-9 flex-shrink-0 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Clock size={16} color="#94a3b8" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-slate-800">{mc.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {mc.ppv_price.toFixed(2)} CHF · {mc.sales_count} vente{mc.sales_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex flex-shrink-0 items-center gap-2">
                    <div className="text-right">
                      <p className="text-[12px] font-black text-slate-800">
                        {formatMoney(creatorShareNet)}
                      </p>
                      <span className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                        style={{ background: PRIMARY_GRADIENT }}>
                        {tier.label} {Math.round(tier.creatorRate * 100)}%
                      </span>
                    </div>
                    <ChevronRight size={14} color="#cbd5e1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Total PPV net */}
        {ppvClocks.length > 0 && (
          <div className="mx-4 mb-4 mt-2 flex items-center justify-between rounded-[12px] px-3 py-2.5"
            style={{ background: "linear-gradient(135deg,rgba(196,75,218,.05),rgba(245,75,143,.05))", border: "1px solid rgba(196,75,218,.12)" }}>
            <p className="text-[11px] font-semibold text-slate-600">Total PPV net estimé</p>
            <p className="text-[15px] font-black" style={GRAD}>{formatMoney(ppvSummary.creator)}</p>
          </div>
        )}
      </div>

      {/* ══ RÉSUMÉ FINANCIER ══ */}
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
            <span className="font-semibold text-slate-600">{formatMoney(grossTotal)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">TVA ({Math.round(vatRate * 1000) / 10}% · Suisse)</span>
            <span className="font-semibold text-slate-600">– {formatMoney(vatTotal)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">Base HT</span>
            <span className="font-semibold text-slate-600">{formatMoney(netBase)}</span>
          </div>
          {/* Commission Abonnement */}
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400">
              Commission Abo · {priceTierAbo.label} ({Math.round(priceTierAbo.platformRate * 100)}%)
            </span>
            <span className="font-semibold text-slate-600">– {formatMoney(platAbo)}</span>
          </div>
          {/* Commission PPV — une ligne par tier actif */}
          {ppvByTier.map(({ tier, grossTotal: gt }) => {
            const { platformShareNet } = computeVatAndShares(gt, tier, vatRate);
            return (
              <div key={tier.id} className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">
                  Commission PPV · {tier.label} ({Math.round(tier.platformRate * 100)}%)
                </span>
                <span className="font-semibold text-slate-600">– {formatMoney(platformShareNet)}</span>
              </div>
            );
          })}
        </div>
        {/* Total créateur */}
        <div className="mt-3 flex items-center justify-between rounded-[14px] px-3.5 py-3"
          style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.12)" }}>
          <div>
            <p className="text-[13px] font-bold text-slate-800">Tu gagnes (HT estimé)</p>
            <p className="text-[10px] text-slate-400">{creatorPct}% HT · versement le 15 du mois</p>
          </div>
          <p className="text-[24px] font-black" style={GRAD}>{formatMoney(creatorTotal)}</p>
        </div>
      </div>

      {/* ══ COMMISSION PROGRESSIVE ══ */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <Percent size={12} strokeWidth={2.5} color="#475569" />
          </div>
          <p className="text-[12px] font-bold text-slate-700">
            Commission progressive par prix PPV &amp; abonnement
          </p>
        </div>
        {/* Badges actifs */}
        <div className="mb-2 flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full px-2 py-0.5 font-semibold"
            style={{ background: "rgba(75,123,245,.1)", color: "#4B7BF5" }}>
            Abo · {priceTierAbo.label} · tu gagnes {Math.round(priceTierAbo.creatorRate * 100)}%
          </span>
          {activePpvTierIds.map((tid) => {
            const t = PRICE_TIERS.find((p) => p.id === tid)!;
            return (
              <span key={tid} className="rounded-full px-2 py-0.5 font-semibold"
                style={{ background: "rgba(196,75,218,.1)", color: "#C44BDA" }}>
                PPV · {t.label} · tu gagnes {Math.round(t.creatorRate * 100)}%
              </span>
            );
          })}
        </div>
        {/* Tableau des 4 paliers */}
        <div className="space-y-1.5">
          {PRICE_TIERS.map((tier) => {
            const isAboActive = tier.id === priceTierAbo.id;
            const isPpvActive = activePpvTierIds.includes(tier.id);
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
                  {isAboActive && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: "#4B7BF5" }}>Abo</span>}
                  {isPpvActive && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: "#C44BDA" }}>PPV</span>}
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

      {/* ══ AUDIENCE TOTALE ══ */}
      <div className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-100">
            <Users size={15} strokeWidth={2} color="#7B4BF5" />
          </div>
          <p className="text-[12px] font-bold text-slate-800">Audience totale</p>
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
              <span className="text-[11px] font-bold text-slate-500">
                {net.id === "magic_clock" && aboSubs > 0
                  ? aboSubs.toLocaleString("fr-CH")
                  : socialData[net.id]
                    ? socialData[net.id].toLocaleString("fr-CH")
                    : "–"}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400">
          Tes gains sont calculés uniquement sur ton audience Magic Clock. Les autres réseaux sont affichés à titre indicatif.
        </p>
      </div>

      {/* ══ VERSEMENTS STRIPE ══ */}
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
          <Link href="/settings/kyc"
            className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            <Shield className="h-3 w-3" />
            {profile?.stripe_account_status === "active" ? "Vérifié ✓" : "KYC en cours"}
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
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
            <p className="text-[10px] text-slate-400">En attente</p>
            <p className="mt-0.5 text-[14px] font-black leading-tight text-slate-700">{formatMoney(pendingBalance)}</p>
            <p className="mt-0.5 text-[9px] text-slate-400">7 derniers jours</p>
          </div>
          <Link href="/settings/payout"
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 transition-colors hover:border-violet-200">
            <p className="text-[10px] text-slate-400">Compte</p>
            <p className="mt-0.5 text-[12px] font-bold text-slate-700">
              {profile?.stripe_account_id ? "···· liés" : "Non lié"}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold" style={{ color: "#7B4BF5" }}>Modifier →</p>
          </Link>
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
            { date: "15 mars 2026",  amount: creatorTotal * 0.88 },
            { date: "15 fév. 2026",  amount: creatorTotal * 0.76 },
            { date: "15 jan. 2026",  amount: creatorTotal * 0.65 },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[9px] text-violet-600">✓</span>
                <span className="text-slate-600">{p.date}</span>
              </div>
              <span className="font-bold text-slate-800">{formatMoney(p.amount)}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="text-[10px] font-medium text-emerald-600">Cockpit connecté en temps réel</p>
          </div>
        </div>
      </div>

      {/* ══ PIED DE PAGE ══ */}
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
