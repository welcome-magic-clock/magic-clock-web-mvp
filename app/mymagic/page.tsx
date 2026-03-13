// app/mymagic/page.tsx
// ✅ Séparation nette créateur / client :
//    - initialPublished  → magic_clocks créés par ce user (Créations)
//    - initialAcquired   → magic_clock_accesses de ce user (Bibliothèque)
// ✅ v2.1 — Filtre deleted_at IS NULL (soft-delete)

import { Suspense } from "react";
import { MyMagicClient, type SupabaseMagicClockRow } from "./MyMagicClient";
import { redirect } from "next/navigation";
import { getSession } from "@/core/supabase/server";
import { supabaseAdmin } from "@/core/supabase/admin";

// ─────────────────────────────────────────────────────────────
// Type pour un Magic Clock acquis (Bibliothèque)
// ─────────────────────────────────────────────────────────────
export type AcquiredMagicClockRow = {
  magic_clock_id: string;
  access_type: string;
  acquired_at: string;
  // Données du Magic Clock joint
  id: string;
  slug: string | null;
  title: string | null;
  creator_handle: string | null;
  creator_name: string | null;
  gating_mode: "FREE" | "SUB" | "PPV" | null;
  work: any | null;
};

// ─────────────────────────────────────────────────────────────
// CRÉATIONS : Magic Clocks publiés par ce user
// ─────────────────────────────────────────────────────────────
async function getPublishedByUser(
  userId: string,
  userHandle: string | null,
): Promise<SupabaseMagicClockRow[]> {
  // Essai 1 : par user_id UUID (après migration)
  const { data: byId, error: errById } = await supabaseAdmin
    .from("magic_clocks")
    .select(
      "id, slug, creator_handle, creator_name, title, gating_mode, ppv_price, created_at, work",
    )
    .eq("is_published", true)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (!errById && byId && byId.length > 0) {
    return byId as SupabaseMagicClockRow[];
  }

  // Essai 2 : fallback par handle (Sonny + anciens enregistrements)
  if (!userHandle) return [];
  const clean = userHandle.replace(/^@/, "");

  const { data: byHandle, error: errByHandle } = await supabaseAdmin
    .from("magic_clocks")
    .select(
      "id, slug, creator_handle, creator_name, title, gating_mode, ppv_price, created_at, work",
    )
    .eq("is_published", true)
    .eq("creator_handle", clean)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (errByHandle) {
    console.error("[MyMagic] getPublished error:", errByHandle.message);
    return [];
  }
  return (byHandle ?? []) as SupabaseMagicClockRow[];
}

// ─────────────────────────────────────────────────────────────
// BIBLIOTHÈQUE : Magic Clocks acquis/débloqués par ce user
// Joint magic_clock_accesses → magic_clocks pour avoir les données
// ─────────────────────────────────────────────────────────────
async function getAcquiredByUser(
  userId: string,
): Promise<AcquiredMagicClockRow[]> {
  // Requête avec join via Supabase (foreign key magic_clock_id → magic_clocks.id)
  const { data, error } = await supabaseAdmin
    .from("magic_clock_accesses")
    .select(
      `
      magic_clock_id,
      access_type,
      created_at,
      magic_clocks (
        id,
        slug,
        title,
        creator_handle,
        creator_name,
        gating_mode,
        work
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[MyMagic] getAcquired error:", error.message);
    return [];
  }

  // Aplatir le join
  return (data ?? [])
    .map((row: any) => {
      const mc = row.magic_clocks;
      if (!mc) return null;
      return {
        magic_clock_id: row.magic_clock_id,
        access_type: row.access_type,
        acquired_at: row.created_at,
        id: mc.id,
        slug: mc.slug,
        title: mc.title,
        creator_handle: mc.creator_handle,
        creator_name: mc.creator_name,
        gating_mode: mc.gating_mode,
        work: mc.work,
      };
    })
    .filter(Boolean) as AcquiredMagicClockRow[];
}

// ─────────────────────────────────────────────────────────────
// PAGE SERVER COMPONENT
// ─────────────────────────────────────────────────────────────
export default async function Page() {
  const user = await getSession();
  if (!user) redirect("/auth?next=/mymagic");

  // Récupérer le handle depuis profiles (pour le fallback)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("handle")
    .eq("id", user.id)
    .single();

  // ✅ Charge les deux flux en parallèle — performance
  const [published, acquired] = await Promise.all([
    getPublishedByUser(user.id, profile?.handle ?? null),
    getAcquiredByUser(user.id),
  ]);

  return (
    <Suspense fallback={null}>
      <MyMagicClient
        initialPublished={published}
        initialAcquired={acquired}
      />
    </Suspense>
  );
}
