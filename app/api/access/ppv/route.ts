// app/api/access/ppv/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  try {
    // ✅ 1) Auth obligatoire pour PPV
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "Authentification requise pour accéder au contenu PPV" },
        { status: 401 }
      );
    }

    // ✅ 2) Récupérer le profil
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("handle")
      .eq("id", user.id)
      .single();

    if (!profile?.handle) {
      return NextResponse.json(
        { ok: false, error: "Profil introuvable" },
        { status: 404 }
      );
    }

    // ✅ 3) Valider le body
    const body = await req.json().catch(() => ({}));
    const { magicClockId } = body;

    if (!magicClockId) {
      return NextResponse.json(
        { ok: false, error: "magicClockId manquant" },
        { status: 400 }
      );
    }

    // ✅ 4) Vérifier que le Magic Clock est bien PPV et publié
    const { data: clock, error: clockError } = await supabaseAdmin
      .from("magic_clocks")
      .select("id, gating_mode, is_published, ppv_price")
      .eq("id", magicClockId)
      .single();

    if (clockError || !clock) {
      return NextResponse.json(
        { ok: false, error: "Magic Clock introuvable" },
        { status: 404 }
      );
    }

    if (!clock.is_published) {
      return NextResponse.json(
        { ok: false, error: "Contenu non publié" },
        { status: 403 }
      );
    }

    if (clock.gating_mode !== "PPV") {
      return NextResponse.json(
        { ok: false, error: "Ce contenu n'est pas en mode PPV" },
        { status: 403 }
      );
    }

    // ✅ 5) Vérifier si l'accès a déjà été acheté
    const { data: existingAccess } = await supabaseAdmin
      .from("magic_clock_accesses")
      .select("id")
      .eq("user_handle", profile.handle)
      .eq("magic_clock_id", magicClockId)
      .eq("access_type", "PPV")
      .single();

    if (existingAccess) {
      // Accès déjà acheté — on autorise directement
      return NextResponse.json(
        {
          ok: true,
          allowed: true,
          access: "PPV",
          magicClockId,
          alreadyPurchased: true,
        },
        { status: 200 }
      );
    }

    // ✅ 6) Pas encore acheté — rediriger vers le checkout
    // (le vrai paiement Adyen sera branché ici)
    return NextResponse.json(
      {
        ok: false,
        allowed: false,
        requiresPayment: true,
        magicClockId,
        ppvPrice: clock.ppv_price,
        checkoutUrl: `/api/payments/checkout?magicClockId=${magicClockId}`,
      },
      { status: 402 } // 402 Payment Required
    );

  } catch (error: any) {
    console.error("[Access/PPV] error", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
