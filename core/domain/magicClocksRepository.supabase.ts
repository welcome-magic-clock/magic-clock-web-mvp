// core/domain/magicClocksRepository.supabase.ts
import { supabaseAdmin } from "@/core/server/supabaseClient";

export type GatingMode = "FREE" | "SUB" | "PPV";

export interface MagicClockRecord {
  id: string;
  slug: string;
  creatorHandle: string;
  creatorName: string;
  title: string;
  subtitle: string | null;
  gatingMode: GatingMode;
  ppvPrice: number | null;
  isPublished: boolean;
  thumbnailUrl: string | null;
  work: unknown;
  createdAt: string;
}

export interface CreateMagicClockInput {
  slug: string;
  creatorHandle: string;
  creatorName: string;
  title: string;
  subtitle?: string;
  gatingMode: GatingMode;
  ppvPrice?: number;
  isPublished?: boolean;
  thumbnailUrl?: string;
  work: unknown; // le JSON complet Studio+Display
}

function mapRow(row: any): MagicClockRecord {
  return {
    id: row.id,
    slug: row.slug,
    creatorHandle: row.creator_handle,
    creatorName: row.creator_name,
    title: row.title,
    subtitle: row.subtitle,
    gatingMode: row.gating_mode,
    ppvPrice: row.ppv_price,
    isPublished: row.is_published,
    thumbnailUrl: row.thumbnail_url,
    work: row.work,
    createdAt: row.created_at,
  };
}

export async function insertMagicClock(
  input: CreateMagicClockInput
): Promise<MagicClockRecord> {
  const { data, error } = await supabaseAdmin
    .from("magic_clocks")
    .insert({
      slug: input.slug,
      creator_handle: input.creatorHandle,
      creator_name: input.creatorName,
      title: input.title,
      subtitle: input.subtitle ?? null,
      gating_mode: input.gatingMode,
      ppv_price: input.ppvPrice ?? null,
      is_published: input.isPublished ?? true,
      thumbnail_url: input.thumbnailUrl ?? null,
      work: input.work,
    })
    .select(
      "id, slug, creator_handle, creator_name, title, subtitle, gating_mode, ppv_price, is_published, thumbnail_url, work, created_at"
    )
    .single();

  if (error || !data) {
    console.error("[insertMagicClock] error:", error);
    throw new Error(error?.message ?? "Insert MagicClock failed");
  }

  return mapRow(data);
}

export async function listPublishedMagicClocks(
  limit = 20
): Promise<MagicClockRecord[]> {
  const { data, error } = await supabaseAdmin
    .from("magic_clocks")
    .select(
      "id, slug, creator_handle, creator_name, title, subtitle, gating_mode, ppv_price, is_published, thumbnail_url, work, created_at"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("[listPublishedMagicClocks] error:", error);
    throw new Error(error?.message ?? "List MagicClocks failed");
  }

  return data.map(mapRow);
}
