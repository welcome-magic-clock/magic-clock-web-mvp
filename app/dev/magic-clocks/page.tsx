// app/dev/magic-clocks/page.tsx

import { createClient } from "@supabase/supabase-js";

type MagicClockRow = {
  id: string;
  slug: string | null;
  creator_handle: string | null;
  creator_name: string | null;
  title: string | null;
  gating_mode: string | null;
  ppv_price: number | null;
  created_at: string | null;
};

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars manquantes : NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  // Client serveur simple (pas besoin du service role ici)
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

// Si tu as déjà un type Database généré par Supabase, remplace ce stub
// par ton import. Sinon, on peut laisser `any` pour commencer.
type Database = any;

export const dynamic = "force-dynamic"; // pour être sûr d'avoir les données fraîches en dev

export default async function DevMagicClocksPage() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("magic_clocks")
    .select(
      "id, slug, creator_handle, creator_name, title, gating_mode, ppv_price, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  const clocks = (data ?? []) as MagicClockRow[];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Dev · Magic Clocks (Supabase)
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Source : table <code className="font-mono">public.magic_clocks</code>{" "}
          (lecture directe depuis Supabase).
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            <div className="font-semibold mb-1">Erreur Supabase</div>
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {clocks.length === 0 && !error && (
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-4 py-6 text-sm text-slate-300">
            Aucun Magic Clock trouvé pour l&apos;instant.
            <br />
            Ajoute une ligne dans Supabase (table{" "}
            <code className="font-mono">magic_clocks</code>) pour tester.
          </div>
        )}

        {clocks.length > 0 && (
          <ul className="space-y-4">
            {clocks.map((clock) => (
              <li
                key={clock.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-sm shadow-slate-900/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-mono text-sky-400 mb-1">
                      @{clock.creator_handle ?? "unknown"}
                    </div>
                    <h2 className="text-lg font-semibold">
                      {clock.title ?? "Sans titre"}
                    </h2>
                    {clock.creator_name && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Créateur : {clock.creator_name}
                      </p>
                    )}
                    {clock.slug && (
                      <p className="text-xs text-slate-500 mt-1">
                        slug : <code className="font-mono">{clock.slug}</code>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 text-xs">
                    <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-200">
                      {clock.gating_mode ?? "FREE"}
                    </span>
                    <span className="text-slate-400">
                      {clock.ppv_price
                        ? `${clock.ppv_price.toFixed(2)} $`
                        : "Gratuit"}
                    </span>
                    {clock.created_at && (
                      <span className="text-[11px] text-slate-500 mt-1">
                        {new Date(clock.created_at).toLocaleString("fr-CH")}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
