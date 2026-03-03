// app/mymagic/page.tsx
import { Suspense } from "react";
import { MyMagicClient, SupabaseMagicClockRow } from "./MyMagicClient";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, {
    auth: { persistSession: false },
    global: { fetch },
  });
}

// ✅ AJOUT — vérifie la session côté serveur
async function getSession() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

async function getPublishedMagicClocks(creatorHandle: string): Promise<SupabaseMagicClockRow[]> {
  const client = getSupabaseServerClient();
  const { data, error } = await client
    .from("magic_clocks")
    .select(
      "id, slug, creator_handle, creator_name, title, gating_mode, ppv_price, created_at, work",
    )
    .eq("is_published", true)
    .eq("creator_handle", creatorHandle) // ✅ filtre en DB plutôt qu'en JS
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[MyMagic] Supabase list error", error);
    return [];
  }
  return (data ?? []) as SupabaseMagicClockRow[];
}

export default async function Page() {
  // ✅ AJOUT — protection de route : redirige si non connecté
  const session = await getSession();
  if (!session) {
    redirect("/?auth=required&next=/mymagic");
  }

  const published = await getPublishedMagicClocks(session.user.email ?? "");

  return (
    <Suspense fallback={null}>
      <MyMagicClient initialPublished={published} />
    </Suspense>
  );
}
