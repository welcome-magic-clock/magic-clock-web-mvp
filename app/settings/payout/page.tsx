// app/settings/payout/page.tsx
// ✅ v1.0 — Compte bancaire + calendrier versements Stripe
import { getSupabaseServer } from "@/core/supabase/server";
import { redirect }     from "next/navigation";
import Link             from "next/link";
import { ChevronLeft, Wallet, Calendar, Shield, ExternalLink, CreditCard } from "lucide-react";

const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as React.CSSProperties;
const PRIMARY_GRADIENT = "linear-gradient(135deg,#7B4BF5,#C44BDA,#F54B8F)";

export default async function PayoutPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id, stripe_account_status, subscription_price")
    .eq("id", user.id)
    .single();

  const hasStripe = !!profile?.stripe_account_id;
  const isActive  = profile?.stripe_account_status === "active";

  // Historique versements (3 derniers mois simulés — TODO: brancher Stripe payouts API)
  const payoutHistory = [
    { date: "15 mars 2026",  amount: 1240.5,  status: "paid" },
    { date: "15 fév. 2026",  amount: 980.0,   status: "paid" },
    { date: "15 jan. 2026",  amount: 820.75,  status: "paid" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/monet" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <ChevronLeft size={18} color="#64748b" />
          </Link>
          <p className="text-[15px] font-black text-slate-800">Mes versements</p>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-6">

        {/* Statut compte */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px]"
              style={{ background: "linear-gradient(135deg,#635BFF,#4B4ACF)" }}>
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">Stripe Connect</p>
              <p className="text-[10px] text-slate-400">
                {hasStripe ? `Compte lié · ${isActive ? "actif" : "en cours"}` : "Compte non lié"}
              </p>
            </div>
          </div>
          <Link href="/settings/kyc"
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${isActive ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-amber-200 bg-amber-50 text-amber-700"}`}>
            <Shield size={10} />
            {isActive ? "Vérifié" : "KYC en cours"}
          </Link>
        </div>

        {/* Compte bancaire */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" id="account">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
              <CreditCard size={13} color="#475569" />
            </div>
            <p className="text-[13px] font-bold text-slate-800">Compte bancaire</p>
          </div>

          {hasStripe ? (
            <div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <div>
                  <p className="text-[12px] font-bold text-slate-700">IBAN ···· ···· ···· 4521</p>
                  <p className="text-[10px] text-slate-400">SEPA · Suisse · CHF</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Principal
                </span>
              </div>
              <a href="/api/stripe/connect/update"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 py-2.5 text-[12px] font-semibold"
                style={{ color: "#7B4BF5" }}>
                <ExternalLink size={13} />
                Modifier le compte sur Stripe
                {/* TODO: route /api/stripe/connect/update → Stripe dashboard update */}
              </a>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-3 text-[12px] text-slate-400">
                Aucun compte bancaire lié. Complète ta vérification KYC pour activer les versements.
              </p>
              <Link href="/settings/kyc"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold text-white"
                style={{ background: PRIMARY_GRADIENT }}>
                Commencer la vérification →
              </Link>
            </div>
          )}
        </div>

        {/* Calendrier versements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" id="schedule">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
              <Calendar size={13} color="#7B4BF5" />
            </div>
            <p className="text-[13px] font-bold text-slate-800">Calendrier des versements</p>
          </div>

          {/* Prochain versement */}
          <div className="mb-3 overflow-hidden rounded-xl"
            style={{ background: "linear-gradient(135deg,rgba(123,75,245,.06),rgba(196,75,218,.04))", border: "1px solid rgba(123,75,245,.12)" }}>
            <div className="p-3">
              <p className="text-[11px] font-semibold text-violet-700">Prochain versement</p>
              <p className="mt-0.5 text-[22px] font-black" style={GRAD}>15 avril 2026</p>
              <p className="text-[10px] text-slate-500">SEPA automatique · délai 1–3 jours ouvrés</p>
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-slate-500">
            <p>• Versements le <strong className="text-slate-700">15 de chaque mois</strong></p>
            <p>• Seuil minimum : <strong className="text-slate-700">10 CHF</strong></p>
            <p>• Virement SEPA vers ton IBAN lié</p>
            <p>• Solde en attente libéré après 7 jours</p>
          </div>
        </div>

        {/* Historique */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[13px] font-bold text-slate-800">Historique des versements</p>
          {payoutHistory.map((p, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[9px] text-violet-600">✓</span>
                <span className="text-[12px] text-slate-600">{p.date}</span>
              </div>
              <span className="text-[13px] font-black text-slate-800">
                {new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF" }).format(p.amount)}
              </span>
            </div>
          ))}
          <p className="mt-3 text-center text-[10px] text-slate-400">
            {/* TODO: brancher Stripe payouts API pour l'historique réel */}
            Historique complet disponible sur le tableau de bord Stripe
          </p>
        </div>

        <p className="text-center text-[10px] text-slate-400">
          Powered by Stripe Connect · Données sécurisées et chiffrées
        </p>
      </div>
    </div>
  );
}
