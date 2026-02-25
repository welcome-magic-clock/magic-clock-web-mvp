// app/mymagic/page.tsx
import { Suspense } from "react";
import { MyMagicClient, SupabaseMagicClockRow } from "./MyMagicClient";
import { createClient } from "@supabase/supabase-js";

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, anon, {
    auth: { persistSession: false },
    global: { fetch },
  });
}

async function getAikoPublishedMagicClocks(): Promise<SupabaseMagicClockRow[]> {
  const client = getSupabaseServerClient();

  const { data, error } = await client
    .from("magic_clocks")
    .select(
      "id, slug, creator_handle, creator_name, title, gating_mode, ppv_price, created_at, work",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[MyMagic] Supabase list error", error);
    return [];
  }

  // Filtre sur le persona Aiko
  return (data ?? []).filter(
    (row) => row.creator_handle === "aiko_tanaka",
  ) as SupabaseMagicClockRow[];
}

export default async function Page() {
  const publishedForAiko = await getAikoPublishedMagicClocks();

  return (
    <Suspense fallback={null}>
      <MyMagicClient initialPublished={publishedForAiko} />
    </Suspense>
  );
}
