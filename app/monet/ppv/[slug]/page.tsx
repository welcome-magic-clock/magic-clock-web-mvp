// app/monet/ppv/[slug]/page.tsx
// ✅ v1.0 — Détail d'un Magic Clock PPV : ventes · gains · commission · historique
import { getSupabaseServer } from "@/core/supabase/server";
import { redirect }     from "next/navigation";
import Link             from "next/link";
import { ChevronLeft, Zap, TrendingUp, DollarSign } from "lucide-react";
import {
  getPriceTierFromPrice,
  formatMoney,
  computeVatAndShares,
  CURRENT_COUNTRY,
} from "../../monet-helpers";

const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as React.CSSProperties;

export default async function PpvDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const vatRate = CURRENT_COUNTRY.vatRate;

  // ── Magic Clock PPV ────────────────────────────────────────
  const { data: mc } = await supabase
    .from("magic_clocks")
    .select("id, slug, title, ppv_price, thumbnail_url, views_count, is_published, created_at")
    .eq("slug", params.slug)
    .eq("user_id", user.id)
    .eq("gating_mode", "PPV")
    .single();

  if (!mc) redirect("/monet");

  // ── Ventes depuis payment_logs ─────────────────────────────
  const { data: sales } = await supabase
    .from("payment_logs")
    .select("id, amount_paid, paid_at, status")
    .eq("magic_clock_id", mc.id)
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(50);

  const salesList   = sales ?? [];
  const totalSales  = salesList.length;
  const grossRev    = salesList.reduce((s, r) => s + (r.amount_paid ?? 0), 0);
  const tier        = getPriceTierFromPrice(mc.ppv_price);
  const { vatAmount, platformShareNet, creatorShareNet } =
    computeVatAndShares(grossRev, tier, vatRate);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/monet#bloc-ppv"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <ChevronLeft size={18} color="#64748b" />
          </Link>
          <p className="truncate text-[15px] font-black text-slate-800">{mc.title}</p>
        </div>
      </div>

      <div className="space-y-3 px-4 pt-4">

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl p-3 text-center"
            style={{ background: "linear-gradient(135deg,#C44BDA,#F54B8F)", boxShadow: "0 4px 14px rgba(196,75,218,.25)" }}>
            <div className="mb-1 flex justify-center"><Zap size={14} color="white" /></div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Ventes</p>
            <p className="text-xl font-black text-white">{totalSales}</p>
          </div>
          <div className="rounded-2xl p-3 text-center"
            style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5)", boxShadow: "0 4px 14px rgba(75,123,245,.25)" }}>
            <div className="mb-1 flex justify-center"><TrendingUp size={14} color="white" /></div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Brut</p>
            <p className="text-[13px] font-black text-white">{formatMoney(grossRev)}</p>
          </div>
          <div className="rounded-2xl p-3 text-center"
            style={{ background: "linear-gradient(135deg,#7B4BF5,#C44BDA)", boxShadow: "0 4px 14px rgba(123,75,245,.3)" }}>
            <div className="mb-1 flex justify-center"><DollarSign size={14} color="white" /></div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-white/60">Tu gagnes</p>
            <p className="text-[13px] font-black text-white">{formatMoney(creatorShareNet)}</p>
          </div>
        </div>

        {/* Détail financier */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
              <DollarSign size={13} color="#7B4BF5" />
            </div>
            <p className="text-[13px] font-bold text-slate-800">Détail financier</p>
          </div>

          {/* Palier */}
          <div className="mb-3 flex items-center justify-between rounded-xl px-3 py-2.5"
            style={{ background: "linear-gradient(to right,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.15)" }}>
            <div>
              <p className="text-[11px] font-bold" style={{ color: "#7B4BF5" }}>
                Palier {tier.label} · {mc.ppv_price.toFixed(2)} CHF
              </p>
              <p className="text-[10px] text-slate-400">{tier.description}</p>
            </div>
            <p className="text-[20px] font-black" style={GRAD}>
              {Math.round(tier.creatorRate * 100)}%
            </p>
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">Prix unitaire</span>
              <span className="font-semibold text-slate-600">{mc.ppv_price.toFixed(2)} CHF</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">Ventes</span>
              <span className="font-semibold text-slate-600">{totalSales}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">Brut TTC</span>
              <span className="font-semibold text-slate-600">{formatMoney(grossRev)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">TVA ({Math.round(vatRate * 1000) / 10}%)</span>
              <span className="font-semibold text-slate-600">– {formatMoney(vatAmount)}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-400">
                Commission MC ({Math.round(tier.platformRate * 100)}% · {tier.label})
              </span>
              <span className="font-semibold text-slate-600">– {formatMoney(platformShareNet)}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-[14px] px-3.5 py-3"
            style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.06))", border: "1px solid rgba(123,75,245,.12)" }}>
            <p className="text-[13px] font-bold text-slate-800">Tu gagnes (HT)</p>
            <p className="text-[22px] font-black" style={GRAD}>{formatMoney(creatorShareNet)}</p>
          </div>
        </div>

        {/* Historique des ventes */}
        {salesList.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                <TrendingUp size={13} color="#475569" />
              </div>
              <p className="text-[13px] font-bold text-slate-800">Historique des ventes</p>
            </div>
            <div className="space-y-0">
              {salesList.slice(0, 20).map((s) => {
                const { creatorShareNet: gain } = computeVatAndShares(
                  s.amount_paid ?? 0, tier, vatRate
                );
                return (
                  <div key={s.id}
                    className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[9px] text-violet-600">✓</span>
                      <span className="text-[11px] text-slate-500">
                        {s.paid_at
                          ? new Date(s.paid_at).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-bold text-slate-700">{formatMoney(s.amount_paid ?? 0)}</p>
                      <p className="text-[10px] text-emerald-500">+{formatMoney(gain)} net</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {salesList.length > 20 && (
              <p className="mt-2 text-center text-[11px] text-slate-400">
                + {salesList.length - 20} ventes supplémentaires
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
