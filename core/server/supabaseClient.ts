// core/server/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Supabase env vars manquantes : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY"
  );
}

// Client ADMIN (service-role) — À UTILISER UNIQUEMENT CÔTÉ SERVEUR
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
