/**
 * app/api/subscription/price-response/route.ts
 * v1.0 — Réponse d'un abonné à un changement de prix
 *
 * POST /api/subscription/price-response
 * Body JSON : { change_id: string, response: "accept" | "cancel" }
 *
 * Flow :
 *  1. Auth abonné
 *  2. Vérifier que le changement est actif (status='pending' ou 'stripe_ready')
 *  3. Vérifier que l'abonné est bien actif chez ce créateur
 *  4. Upsert subscription_price_responses
 *  5. Si "cancel" → marquer le follow comme cancelled
 *     Si "accept" → rien (sera traité par le webhook deadline)
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/core/supabase/admin";

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

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    // 2. Body
    const body = await req.json();
    const { change_id, response } = body as { change_id: string; response: string };

    if (!change_id || !["accept", "cancel"].includes(response)) {
      return NextResponse.json(
        { ok: false, error: "change_id et response ('accept'|'cancel') requis" },
        { status: 400 }
      );
    }

    // 3. Récupérer le changement de prix
    const { data: change, error: changeErr } = await supabaseAdmin
      .from("subscription_price_changes")
      .select("id, creator_id, old_price, new_price, status, deadline_at")
      .eq("id", change_id)
      .in("status", ["pending", "stripe_ready"])
      .maybeSingle();

    if (changeErr || !change) {
      return NextResponse.json(
        { ok: false, error: "Changement introuvable ou déjà traité" },
        { status: 404 }
      );
    }

    // Vérifier la deadline
    if (change.deadline_at && new Date(change.deadline_at) < new Date()) {
      return NextResponse.json(
        { ok: false, error: "La deadline de réponse est dépassée" },
        { status: 410 }
      );
    }

    // 4. Vérifier que l'utilisateur est bien abonné actif à ce créateur
    const { data: follow } = await supabaseAdmin
      .from("follows")
      .select("id, status")
      .eq("follower_id", user.id)
      .eq("creator_id", change.creator_id)
      .eq("type", "subscription")
      .eq("status", "active")
      .maybeSingle();

    if (!follow) {
      return NextResponse.json(
        { ok: false, error: "Tu n'es pas abonné à ce créateur" },
        { status: 403 }
      );
    }

    // 5. Upsert la réponse (un abonné peut changer d'avis avant la deadline)
    const { error: responseErr } = await supabaseAdmin
      .from("subscription_price_responses")
      .upsert(
        {
          change_id,
          subscriber_id: user.id,
          response,
          responded_at: new Date().toISOString(),
        },
        { onConflict: "change_id,subscriber_id" }
      );

    if (responseErr) {
      console.error("[price-response] Upsert error:", responseErr);
      return NextResponse.json({ ok: false, error: "Erreur enregistrement réponse" }, { status: 500 });
    }

    // 6. Si cancel → désactiver le follow immédiatement
    if (response === "cancel") {
      await supabaseAdmin
        .from("follows")
        .update({
          status: "cancelled",
          // cancelled_at n'existe peut-être pas encore — on met updated_at
          updated_at: new Date().toISOString(),
        })
        .eq("id", follow.id);

      // Notifier le créateur
      const { data: subscriberProfile } = await supabaseAdmin
        .from("profiles")
        .select("handle, display_name")
        .eq("id", user.id)
        .maybeSingle();

      await supabaseAdmin.from("notifications").insert({
        user_id: change.creator_id,
        type: "subscription_cancelled",
        title: "Un abonné a annulé son abonnement",
        message: `@${subscriberProfile?.handle ?? "Un abonné"} a annulé son abonnement suite à ton changement de prix (${change.old_price} → ${change.new_price} CHF/mois).`,
        from_handle: subscriberProfile?.handle ?? null,
        magic_clock_id: null,
        metadata: { change_id },
      });
    }

    return NextResponse.json({
      ok: true,
      response,
      message:
        response === "accept"
          ? `Tu continueras à être abonné au nouveau prix de ${change.new_price} CHF/mois`
          : "Ton abonnement a été annulé",
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[price-response] Unexpected error:", error);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
