// features/display/ContentDisplayGate.tsx
"use client";

import { useState } from "react";
import type { Access as FeedAccess } from "@/core/domain/types";
import { ResultDisclaimerGate } from "@/components/legal/ResultDisclaimerGate";
import { BuyButton } from "@/components/payment/BuyButton";
import { Lock, Users, Sparkles } from "lucide-react";

type ContentDisplayGateProps = {
  mode: FeedAccess; // "FREE" | "ABO" | "PPV"
  // Infos nécessaires pour le paiement (PPV / ABO)
  contentId?: string;
  creatorId?: string;
  creatorHandle?: string;
  /** Prix TTC en centimes — ex: 299 = 2.99 CHF */
  ppvPriceValue?: number;
  aboPriceValue?: number;
  currency?: string;
};

export function ContentDisplayGate({
  mode,
  contentId = "unknown",
  creatorId = "unknown",
  creatorHandle,
  ppvPriceValue = 299,
  aboPriceValue = 1490,
  currency = "CHF",
}: ContentDisplayGateProps) {
  const [unlocked, setUnlocked] = useState(false);

  // ── Contenu débloqué ──
  if (unlocked) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        <p className="mb-1 font-medium text-slate-700">
          Magic Display débloqué
        </p>
        <p>
          Dans la prochaine version, le cube 3D apparaîtra ici : rotation,
          faces pédagogiques, aiguilles et médias du Magic Clock.
        </p>
      </div>
    );
  }

  // ── FREE : disclaimer simple ──
  if (mode === "FREE") {
    return (
      <ResultDisclaimerGate
        mode="FREE"
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  // ── PPV : bouton d'achat Stripe ──
  if (mode === "PPV") {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
        {/* Badge accès */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100">
            <Lock className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              Contenu Pay-Per-View
            </p>
            <p className="text-[11px] text-slate-500">
              Accès définitif après achat unique
            </p>
          </div>
        </div>

        {/* Bouton Stripe */}
        <BuyButton
          contentId={contentId}
          contentType="ppv"
          amountValue={ppvPriceValue}
          currency={currency}
          creatorId={creatorId}
          creatorHandle={creatorHandle}
        />
      </div>
    );
  }

  // ── ABO : bouton abonnement Stripe ──
  if (mode === "ABO") {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
        {/* Badge accès */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100">
            <Users className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              Contenu réservé aux abonnés
            </p>
            <p className="text-[11px] text-slate-500">
              Accès illimité · résiliable à tout moment
            </p>
          </div>
        </div>

        {/* Bouton Stripe abonnement */}
        <BuyButton
          contentId={contentId}
          contentType="subscription"
          amountValue={aboPriceValue}
          currency={currency}
          creatorId={creatorId}
          creatorHandle={creatorHandle}
        />

        {/* Avantages abonnement */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="h-3 w-3 text-slate-400" strokeWidth={1.5} />
            Accès à tous les contenus abonnés de ce créateur
          </div>
        </div>
      </div>
    );
  }

  return null;
}
