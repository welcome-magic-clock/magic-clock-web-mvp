// core/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ⚠️ IMPORTANT : ce client NE DOIT être utilisé que côté serveur
// (route handlers, actions server, scripts), jamais dans un composant client.
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
  global: { fetch },
});
