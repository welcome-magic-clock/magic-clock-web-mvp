// core/supabase/browser.ts
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

/**
 * Client Supabase côté navigateur — utilise @supabase/ssr
 * pour synchroniser la session dans les cookies (lisibles côté serveur).
 * Singleton : un seul client par session browser.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (!instance) {
    instance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return instance;
}
