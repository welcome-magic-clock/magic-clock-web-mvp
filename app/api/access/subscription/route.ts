// app/api/access/subscription/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/core/supabase/admin";

export async function POST(req: Request) {
  try {
    // ✅ 1) Auth — vérifier que l'user est connecté
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
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // ✅ 2) Récupérer le handle du user
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("handle")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Profil introuvable" },
        { status: 404 }
      );
    }

    // ✅ 3) Vérifier le contentId
    const body = await req.json().catch(() => ({} as any));
    const contentId = body?.contentId;

    if (!contentId) {
      return NextResponse.json(
        { ok: false, error: "contentId manquant" },
        { status: 400 }
      );
    }

    // ✅ 4) Vérifier que le Magic Clock existe et est en mode SUB
    const { data: magicClock } = await supabaseAdmin
      .from("magic_clocks")
      .select("id, gating_mode, is_published")
      .eq("id", contentId)
      .single();

    if (!magicClock || !magicClock.is_published) {
      return NextResponse.json(
        { ok: false, error: "Contenu introuvable" },
        { status: 404 }
      );
    }

    if (magicClock.gating_mode !== "SUB") {
      return NextResponse.json(
        { ok: false, error: "Ce contenu n'est pas en mode abonnement" },
        { status: 400 }
      );
    }

    // ✅ 5) Vérifier si l'accès SUB existe déjà
    const { data: existingAccess } = await supabaseAdmin
      .from("magic_clock_accesses")
      .select("id")
      .eq("user_handle", profile.handle)
      .eq("magic_clock_id", contentId)
      .eq("access_type", "SUB")
      .single();

    // ✅ 6) Si pas encore d'accès, l'enregistrer
    if (!existingAccess) {
      await supabaseAdmin
        .from("magic_clock_accesses")
        .insert({
          user_handle: profile.handle,
          magic_clock_id: contentId,
          access_type: "SUB",
        });
    }

    return NextResponse.json(
      { ok: true, access: "SUBSCRIPTION", contentId },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("[Access/SUB] POST failed", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
```

---

**Ce que j'ai ajouté vs l'original :**

✅ **Auth réelle** — 401 si non connecté
✅ **Vérification profil** — 404 si handle manquant
✅ **Vérification Magic Clock** — existe + publié + bien en mode `SUB`
✅ **Enregistrement dans `magic_clock_accesses`** — trace réelle de l'abonnement
✅ **Idempotent** — si l'accès existe déjà, pas de doublon grâce à la contrainte qu'on a posée en DB

Colle ça dans `app/api/access/subscription/route.ts` sur GitHub et commite — le message de commit que je suggère :
```
fix: auth réelle sur /api/access/subscription — vérif user + magic_clock + enregistrement accès SUB en DB
