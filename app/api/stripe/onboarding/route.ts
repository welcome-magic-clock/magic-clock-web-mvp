// app/api/stripe/onboarding/route.ts
//
// ─────────────────────────────────────────────────────────────
// Magic Clock — Stripe Connect Onboarding
// Crée un compte Express Stripe pour une créatrice
// et retourne le lien d'onboarding co-brandé
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

interface OnboardingRequestBody {
  returnUrl: string;
  refreshUrl: string;
  /** ID utilisateur Supabase — pour lier le compte Stripe */
  userId?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as OnboardingRequestBody;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // ── Mode mock ──
    if (!stripeSecretKey) {
      return NextResponse.json({
        ok: true,
        url: `${body.returnUrl}?return=stripe&mock=true`,
        accountId: "acct_mock_123",
        mock: true,
      });
    }

    // ── 1. Créer un compte Express Stripe ──
    const accountResponse = await fetch("https://api.stripe.com/v1/accounts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        type: "express",
        country: "CH",
        "capabilities[transfers][requested]": "true",
        "capabilities[card_payments][requested]": "true",
        "business_type": "individual",
        "settings[payouts][schedule][interval]": "monthly",
        "settings[payouts][schedule][monthly_anchor]": "15",
        ...(body.userId ? { "metadata[magic_clock_user_id]": body.userId } : {}),
      }).toString(),
    });

    if (!accountResponse.ok) {
      const err = await accountResponse.json() as { error?: { message?: string } };
      return NextResponse.json(
        { ok: false, error: err?.error?.message ?? "Erreur création compte Stripe" },
        { status: 502 },
      );
    }

    const account = await accountResponse.json() as { id: string };

    // ── 2. Générer le lien d'onboarding ──
    const linkResponse = await fetch("https://api.stripe.com/v1/account_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        account: account.id,
        return_url: body.returnUrl,
        refresh_url: body.refreshUrl,
        type: "account_onboarding",
      }).toString(),
    });

    if (!linkResponse.ok) {
      const err = await linkResponse.json() as { error?: { message?: string } };
      return NextResponse.json(
        { ok: false, error: err?.error?.message ?? "Erreur génération lien Stripe" },
        { status: 502 },
      );
    }

    const link = await linkResponse.json() as { url: string };

    // TODO: sauvegarder account.id dans Supabase
    // await supabase.from("creators").update({ stripe_account_id: account.id })
    //   .eq("user_id", body.userId);

    return NextResponse.json({
      ok: true,
      url: link.url,
      accountId: account.id,
    });

  } catch (err) {
    console.error("[Stripe Onboarding] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur inattendue" },
      { status: 500 },
    );
  }
}


