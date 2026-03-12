/**
 * app/api/subscription/price-change/route.ts
 * v1.0 — Orchestration complète Supabase + Stripe
 *
 * POST /api/subscription/price-change
 * Body JSON : { new_price: number }
 *
 * Flow :
 *  1. Auth créateur (JWT Supabase)
 *  2. Validation prix (dans les tiers Viral/Spotlight/Signature/Legendary)
 *  3. INSERT subscription_price_changes (status='pending')
 *  4. Stripe : prices.create → stripe_price_id_new
 *  5. UPDATE status='stripe_ready'
 *  6. Notifier les abonnés actifs (notifications Supabase)
 *  7. Retourner le change_id pour suivi côté client
 *
 * ⚠️  Utilise sk_test_ en dev → zéro argent réel.
 *     Passe sk_live_ le jour de la SA → aucune modification de code.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/core/supabase/admin";
import { stripe } from "@/lib/stripe";

// ─── Tiers de prix valides (synchronisé avec monet-helpers.tsx) ────────────
const PRICE_TIERS = [
  { id: "VIRAL",     min: 0.99,  max: 1.99  },
  { id: "SPOTLIGHT", min: 2.00,  max: 9.99  },
  { id: "SIGNATURE", min: 9.99,  max: 29.99 },
  { id: "LEGENDARY", min: 29.99, max: 999.99 },
];

function isValidSubscriptionPrice(price: number): boolean {
  return PRICE_TIERS.some((t) => price >= t.min && price <= t.max);
}

// ─── Helper — récupérer l'utilisateur connecté depuis les cookies ──────────
async function getAuthUser(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list: { name: string; value: string; options?: unknown }[]) =>
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          ),
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── POST /api/subscription/price-change ──────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    // 2. Body
    const body = await req.json();
    const newPrice: number = Number(body.new_price);

    if (isNaN(newPrice) || newPrice <= 0) {
      return NextResponse.json({ ok: false, error: "Prix invalide" }, { status: 400 });
    }
    if (!isValidSubscriptionPrice(newPrice)) {
      return NextResponse.json(
        { ok: false, error: "Prix hors des tiers autorisés (0.99–999.99 CHF)" },
        { status: 400 }
      );
    }

    // 3. Profil créateur — on a besoin du prix actuel + stripe_account_id
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("id, handle, display_name, subscription_price, stripe_account_id, stripe_account_status")
      .eq("id", user.id)
      .maybeSingle();

    if (profileErr || !profile) {
      return NextResponse.json({ ok: false, error: "Profil introuvable" }, { status: 404 });
    }

    const oldPrice: number = Number(profile.subscription_price ?? 0);

    // Pas de changement → pas d'action
    if (oldPrice === newPrice) {
      return NextResponse.json({
        ok: true,
        message: "Prix identique — aucun changement nécessaire",
        change_id: null,
      });
    }

    // 4. Nombre d'abonnés actifs (pour adapter le message)
    const { count: subCount } = await supabaseAdmin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", user.id)
      .eq("type", "subscription")
      .eq("status", "active");

    const subscriberCount = subCount ?? 0;

    // Deadline : 7 jours pour les abonnés actuels pour répondre
    const deadlineAt = subscriberCount > 0
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // 5. INSERT subscription_price_changes (status='pending')
    const { data: changeRow, error: insertErr } = await supabaseAdmin
      .from("subscription_price_changes")
      .insert({
        creator_id: user.id,
        old_price: oldPrice,
        new_price: newPrice,
        status: "pending",
        notified_at: null,
        deadline_at: deadlineAt,
      })
      .select("id")
      .single();

    if (insertErr || !changeRow) {
      console.error("[price-change] INSERT error:", insertErr);
      return NextResponse.json({ ok: false, error: "Erreur création du changement" }, { status: 500 });
    }

    const changeId: string = changeRow.id;

    // 6. Stripe : créer le nouveau Price sur le compte connecté du créateur
    //    ⚠️  stripe_account_id est null tant que le créateur n'a pas fait son onboarding Connect.
    //    On crée quand même le Price sur le compte Magic Clock master en test.
    let stripePriceIdNew: string | null = null;
    let stripePriceIdOld: string | null = null;

    try {
      const stripeOptions = profile.stripe_account_id
        ? { stripeAccount: profile.stripe_account_id }
        : undefined;

      // Nouveau Price Stripe (en centimes CHF)
      const newPriceCents = Math.round(newPrice * 100);
      const stripePrice = await stripe.prices.create(
        {
          unit_amount: newPriceCents,
          currency: "chf",
          recurring: { interval: "month" },
          product_data: {
            name: `Abonnement Magic Clock — @${profile.handle ?? user.id}`,
          },
          metadata: {
            magic_clock_creator_id: user.id,
            magic_clock_change_id: changeId,
          },
        },
        stripeOptions
      );
      stripePriceIdNew = stripePrice.id;

      // Récupérer l'ancien Price ID si disponible (stocké dans profiles ou autre)
      // Pour l'instant on laisse null — sera complété après onboarding Connect
      stripePriceIdOld = null;

    } catch (stripeErr: unknown) {
      // En test sans clé Stripe configurée → on continue sans stripe_price_id_new
      // Le changement reste en 'pending' et sera complété manuellement
      console.warn("[price-change] Stripe error (non bloquant en test):", stripeErr);
    }

    // 7. UPDATE : stripe_price_id_new + status='stripe_ready' (si Stripe OK)
    const newStatus = stripePriceIdNew ? "stripe_ready" : "pending";
    await supabaseAdmin
      .from("subscription_price_changes")
      .update({
        stripe_price_id_new: stripePriceIdNew,
        stripe_price_id_old: stripePriceIdOld,
        status: newStatus,
      })
      .eq("id", changeId);

    // 8. Notifier les abonnés actifs (si il y en a)
    if (subscriberCount > 0) {
      // Récupérer les IDs des abonnés
      const { data: subscribers } = await supabaseAdmin
        .from("follows")
        .select("follower_id")
        .eq("creator_id", user.id)
        .eq("type", "subscription")
        .eq("status", "active");

      if (subscribers && subscribers.length > 0) {
        const creatorName = profile.display_name ?? `@${profile.handle}`;
        const direction = newPrice > oldPrice ? "augmente" : "baisse";

        const notifications = subscribers.map((sub) => ({
          user_id: sub.follower_id,
          type: "subscription_price_change",
          title: `${creatorName} ${direction} son prix d'abonnement`,
          message: `Le prix passe de ${oldPrice.toFixed(2)} CHF à ${newPrice.toFixed(2)} CHF/mois. Tu as 7 jours pour accepter ou annuler ton abonnement.`,
          from_handle: profile.handle ?? null,
          magic_clock_id: null,
          metadata: {
            change_id: changeId,
            old_price: oldPrice,
            new_price: newPrice,
            deadline_at: deadlineAt,
          },
        }));

        await supabaseAdmin.from("notifications").insert(notifications);

        // Marquer notified_at
        await supabaseAdmin
          .from("subscription_price_changes")
          .update({ notified_at: new Date().toISOString() })
          .eq("id", changeId);
      }
    } else {
      // Pas d'abonnés → appliquer directement le nouveau prix sur le profil
      await supabaseAdmin
        .from("profiles")
        .update({ subscription_price: newPrice })
        .eq("id", user.id);

      await supabaseAdmin
        .from("subscription_price_changes")
        .update({
          status: "applied",
          stripe_applied_at: new Date().toISOString(),
        })
        .eq("id", changeId);
    }

    return NextResponse.json({
      ok: true,
      change_id: changeId,
      old_price: oldPrice,
      new_price: newPrice,
      subscriber_count: subscriberCount,
      stripe_ready: !!stripePriceIdNew,
      applied_immediately: subscriberCount === 0,
      message:
        subscriberCount === 0
          ? "Prix mis à jour immédiatement (aucun abonné actif)"
          : `${subscriberCount} abonné(s) notifié(s) — changement effectif dans 7 jours`,
    });

  } catch (error: unknown) {
    console.error("[price-change] Unexpected error:", error);
    const msg = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// ─── GET /api/subscription/price-change?change_id=xxx ─────────────────────
// Permet au créateur de suivre le statut d'un changement de prix en cours
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const changeId = searchParams.get("change_id");

    if (!changeId) {
      // Retourner le dernier changement en cours du créateur
      const { data: latestChange } = await supabaseAdmin
        .from("subscription_price_changes")
        .select("*")
        .eq("creator_id", user.id)
        .in("status", ["pending", "stripe_ready"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return NextResponse.json({ ok: true, change: latestChange ?? null });
    }

    const { data: change, error } = await supabaseAdmin
      .from("subscription_price_changes")
      .select(`
        *,
        subscription_price_responses (
          id, subscriber_id, response, responded_at
        )
      `)
      .eq("id", changeId)
      .eq("creator_id", user.id) // sécurité : le créateur ne voit que ses propres changements
      .maybeSingle();

    if (error || !change) {
      return NextResponse.json({ ok: false, error: "Changement introuvable" }, { status: 404 });
    }

    // Stats réponses
    const responses = change.subscription_price_responses ?? [];
    const accepts = responses.filter((r: { response: string }) => r.response === "accept").length;
    const cancels = responses.filter((r: { response: string }) => r.response === "cancel").length;
    const timeouts = responses.filter((r: { response: string }) => r.response === "timeout").length;

    return NextResponse.json({
      ok: true,
      change: {
        ...change,
        stats: { accepts, cancels, timeouts, total: responses.length },
      },
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
