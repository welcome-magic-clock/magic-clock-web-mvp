// app/mymagic/page.tsx
import { Suspense } from "react";
import { MyMagicClient, SupabaseMagicClockRow } from "./MyMagicClient";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getSession } from "@/core/supabase/server";

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, {
    auth: { persistSession: false },
    global: { fetch },
  });
}

async function getPublishedMagicClocks(creatorHandle: string): Promise<SupabaseMagicClockRow[]> {
  const client = getSupabaseServerClient();
  const { data, error } = await client
    .from("magic_clocks")
    .select(
      "id, slug, creator_handle, creator_name, title, gating_mode, ppv_price, created_at, work",
    )
    .eq("is_published", true)
    .eq("creator_handle", creatorHandle)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[MyMagic] Supabase list error", error);
    return [];
  }
  return (data ?? []) as SupabaseMagicClockRow[];
}

export default async function Page() {
  const user = await getSession(); // ✅ retourne User | null
  if (!user) {
    redirect("/?auth=required&next=/mymagic");
  }

  const published = await getPublishedMagicClocks(user.email ?? ""); // ✅ user.email directement

  return (
    <Suspense fallback={null}>
      <MyMagicClient initialPublished={published} />
    </Suspense>
  );
}
