// app/settings/kyc/page.tsx
// ✅ v1.0 — Statut KYC Stripe Connect
import { createClient } from "@/core/supabase/server";
import { redirect }     from "next/navigation";
import Link             from "next/link";
import { ChevronLeft, Shield, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";

const PRIMARY_GRADIENT = "linear-gradient(135deg,#7B4BF5,#C44BDA,#F54B8F)";

export default async function KycPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id, stripe_account_status")
    .eq("id", user.id)
    .single();

  const status   = profile?.stripe_account_status ?? "pending";
  const hasStripe = !!profile?.stripe_account_id;

  const statusConfig = {
    active: {
      icon: <CheckCircle size={28} color="#10b981" />,
      label: "Identité vérifiée",
      desc: "Ton compte Stripe est actif. Les versements sont activés.",
      bg: "bg-emerald-50 border-emerald-200",
      textColor: "text-emerald-700",
    },
    pending: {
      icon: <Clock size={28} color="#f59e0b" />,
      label: "Vérification en cours",
      desc: "Stripe traite tes documents. Cela peut prendre 1 à 2 jours ouvrés.",
      bg: "bg-amber-50 border-amber-200",
      textColor: "text-amber-700",
    },
    restricted: {
      icon: <AlertTriangle size={28} color="#ef4444" />,
      label: "Action requise",
      desc: "Des informations supplémentaires sont nécessaires pour activer les versements.",
      bg: "bg-red-50 border-red-200",
      textColor: "text-red-700",
    },
  }[status as "active" | "pending" | "restricted"] ?? {
    icon: <Shield size={28} color="#94a3b8" />,
    label: "Non commencé",
    desc: "Tu n'as pas encore lié de compte Stripe. Commence la vérification pour recevoir tes gains.",
    bg: "bg-slate-50 border-slate-200",
    textColor: "text-slate-600",
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/monet" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <ChevronLeft size={18} color="#64748b" />
          </Link>
          <p className="text-[15px] font-black text-slate-800">Vérification d'identité (KYC)</p>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-6">

        {/* Statut actuel */}
        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${statusConfig.bg}`}>
          {statusConfig.icon}
          <div>
            <p className={`text-[14px] font-black ${statusConfig.textColor}`}>{statusConfig.label}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">{statusConfig.desc}</p>
          </div>
        </div>

        {/* Explication KYC */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-[13px] font-bold text-slate-800">Pourquoi cette vérification ?</p>
          <div className="space-y-2 text-[12px] text-slate-500">
            <p>• Requis par la réglementation financière européenne (PSD2 / AML)</p>
            <p>• Protège les créateurs contre la fraude et les chargebacks</p>
            <p>• Obligatoire pour les versements SEPA via Stripe Connect</p>
          </div>
        </div>

        {/* Informations requises */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-[13px] font-bold text-slate-800">Documents requis</p>
          <div className="space-y-2 text-[12px] text-slate-500">
            <p>• Pièce d'identité (carte d'identité ou passeport)</p>
            <p>• Preuve d'adresse (moins de 3 mois)</p>
            <p>• IBAN pour les versements</p>
          </div>
        </div>

        {/* CTA Stripe */}
        {status !== "active" && (
          <a
            href={
              hasStripe
                ? `https://connect.stripe.com/setup/e/acct_${profile?.stripe_account_id}/…`
                : "/api/stripe/connect"
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-bold text-white"
            style={{ background: PRIMARY_GRADIENT }}
          >
            <ExternalLink size={15} />
            {hasStripe ? "Continuer la vérification sur Stripe" : "Commencer la vérification"}
            {/* TODO: brancher route /api/stripe/connect → Stripe Express onboarding */}
          </a>
        )}

        <p className="text-center text-[10px] text-slate-400">
          Powered by Stripe Connect · Données sécurisées et chiffrées
        </p>
      </div>
    </div>
  );
}
