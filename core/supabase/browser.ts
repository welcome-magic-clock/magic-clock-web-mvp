// core/supabase/browser.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

/**
 * Client Supabase côté navigateur — clé publique anon uniquement.
 * Singleton : un seul client par session browser.
 * ✅ Sûr à importer dans les composants React ("use client")
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (!instance) {
    instance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return instance;
}
