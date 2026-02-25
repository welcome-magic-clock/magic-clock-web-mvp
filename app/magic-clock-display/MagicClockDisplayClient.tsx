// app/magic-clock-display/MagicClockDisplayClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";

type LoadState =
  | { status: "idle"; id: string | null }
  | { status: "loading"; id: string }
  | { status: "error"; id: string | null; message: string }
  | { status: "ready"; id: string; display: PreviewDisplay };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export default function MagicClockDisplayClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [state, setState] = useState<LoadState>({
    status: "idle",
    id,
  });

  useEffect(() => {
    if (!id) {
      setState({
        status: "error",
        id: null,
        message: "Aucun id reçu dans l'URL.",
      });
      return;
    }

    let cancelled = false;

    async function run() {
      setState({ status: "loading", id: id ?? "" });

      // 1) Presets (Bear & futurs tutos officiels)
      const preset = DISPLAY_PRESETS[id];
      if (preset) {
        if (!cancelled) {
          setState({ status: "ready", id, display: preset });
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("magic_clocks")
          .select("id, work, is_published")
          .eq("id", id)
          .eq("is_published", true)
          .maybeSingle();

        if (error) {
          console.error("[MagicClockDisplay] Supabase error", error);
          if (!cancelled) {
            setState({
              status: "error",
              id,
              message:
                "Erreur Supabase pendant le chargement du Display.",
            });
          }
          return;
        }

        const row = data as { id: string; work: any } | null;

        if (!row || !row.work || !(row.work as any).display) {
          if (!cancelled) {
            setState({
              status: "error",
              id,
              message:
                "Aucun Display trouvé pour ce Magic Clock (work.display manquant).",
            });
          }
          return;
        }

        const display = (row.work as any).display;

        if (!display || !Array.isArray(display.segments)) {
          if (!cancelled) {
            setState({
              status: "error",
              id,
              message:
                "work.display ne contient pas un Display exploitable.",
            });
          }
          return;
        }

        if (!cancelled) {
          setState({ status: "ready", id, display });
        }
      } catch (err) {
        console.error("[MagicClockDisplay] Unexpected error", err);
        if (!cancelled) {
          setState({
            status: "error",
            id,
            message:
              "Erreur inconnue pendant le chargement du Magic Display.",
          });
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const goBackHref = "/mymagic";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-4">
        <Link
          href={goBackHref}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          ← Retour à My Magic Clock
        </Link>
      </div>

      <section className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold sm:text-2xl">
            Magic Display
          </h1>
          <p className="text-sm text-slate-600">
            Visualisation en lecture seule du Magic Display associé à ton
            Magic Clock.
          </p>
        </header>

        {state.status === "loading" && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Chargement du Magic Display…
          </div>
        )}

        {state.status === "error" && (
          <div className="space-y-3 rounded-2xl border border-dashed border-rose-300 bg-rose-50/60 p-4 text-sm text-rose-700">
            <div className="font-medium">Magic Display introuvable</div>
            <p>{state.message}</p>
            <div className="rounded-xl bg-white/70 p-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-700">
                DEBUG (pour Amiral + Capitaine)
              </div>
              <div className="mt-1">
                id paramètre :{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">
                  {id ?? "(aucun)"}
                </code>
              </div>
            </div>
          </div>
        )}

        {state.status === "ready" && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-900/95 p-3 sm:p-4">
            <MagicDisplayPreviewShell display={state.display} />
          </div>
        )}
      </section>
    </main>
  );
}
