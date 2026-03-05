// app/magic-clock-display/MagicClockDisplayClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import MagicDisplayPreviewShell, {
  type PreviewDisplay,
  type PreviewFace,
  type PreviewMedia,
  type PreviewSegment,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import {
  getCreatedWorks,
  type StoredMagicClockWork,
} from "@/core/domain/magicClockWorkStore";

// ─────────────────────────────────────────────────────────────
// Types internes (structure de work.display stocké en Supabase)
// ─────────────────────────────────────────────────────────────

type WorkSegment = {
  id: number;
  title?: string;
  description?: string;
  notes?: string;
  // URLs des médias stockés dans R2 — jamais via Supabase Storage
  media?: Array<{
    type: "photo" | "video" | "file";
    url: string;            // URL complète cdn.magic-clock.com/...
    filename?: string;
  }>;
  mediaCount?: number;
};

type WorkFace = {
  title?: string;
  notes?: string;
  segments?: WorkSegment[];
  // URL de couverture de la face (R2 direct)
  coverUrl?: string;
  coverType?: "photo" | "video";
};

type WorkDisplay = {
  faces?: WorkFace[];
};

type WorkStudio = {
  beforeUrl?: string | null;
  afterUrl?: string | null;
  title?: string;
};

type MagicClockRow = {
  id: string;
  slug: string | null;
  work: {
    display?: WorkDisplay;
    displayState?: { display?: WorkDisplay };
    magicDisplay?: WorkDisplay;
    studio?: WorkStudio;
    title?: string;
  };
};

// ─────────────────────────────────────────────────────────────
// État de chargement
// ─────────────────────────────────────────────────────────────

type LoadState =
  | { status: "idle"; id: string | null }
  | { status: "loading"; id: string }
  | { status: "error"; id: string | null; message: string; debugSlug?: string | null }
  | { status: "ready"; id: string; display: PreviewDisplay };

// ─────────────────────────────────────────────────────────────
// Reconstruction du PreviewDisplay depuis work.display
// ⚡️ Les URLs médias pointent directement vers cdn.magic-clock.com
//    → jamais de proxy Supabase → 0 coût double sur 1M users
// ─────────────────────────────────────────────────────────────

function buildPreviewDisplay(row: MagicClockRow): PreviewDisplay | null {
  const work = row.work;

  // Chercher le display dans tous les emplacements possibles
  const rawDisplay: WorkDisplay | null =
    work.display ??
    work.displayState?.display ??
    work.magicDisplay ??
    null;

  if (!rawDisplay || !Array.isArray(rawDisplay.faces)) {
    return null;
  }

  const faces: PreviewFace[] = rawDisplay.faces.map((face): PreviewFace => {
    // Couverture de face (URL R2 directe)
    let coverMedia: PreviewMedia | undefined = undefined;
    if (face.coverUrl) {
      coverMedia = {
        type: face.coverType ?? "photo",
        url: face.coverUrl,
      };
    }

    // Segments avec médias R2
    const segments: PreviewSegment[] = (face.segments ?? []).map(
      (seg): PreviewSegment => ({
        id: seg.id,
        title: seg.title ?? `Segment ${seg.id}`,
        description: seg.description ?? "",
        notes: seg.notes ?? "",
        // ⚡️ URLs R2 directes — cdn.magic-clock.com/display/{face}/{file}
        media: (seg.media ?? [])
          .filter((m) => !!m.url)
          .map((m): PreviewMedia => ({
            type: m.type,
            url: m.url,
            filename: m.filename,
          })),
      }),
    );

    // Si pas de coverMedia explicite → on prend la première image des segments
    if (!coverMedia && segments.length > 0) {
      const firstMedia = segments
        .flatMap((s) => s.media ?? [])
        .find((m) => m.type === "photo" || m.type === "video");
      if (firstMedia) {
        coverMedia = firstMedia;
      }
    }

    return {
      title: face.title ?? "",
      notes: face.notes ?? "",
      coverMedia,
      segments,
    };
  });

  return { faces };
}

// ─────────────────────────────────────────────────────────────
// Recherche dans le localStorage (drafts non encore publiés)
// ─────────────────────────────────────────────────────────────

function findLocalDisplay(currentId: string): PreviewDisplay | null {
  try {
    const works: StoredMagicClockWork[] = getCreatedWorks();
    if (!works.length) return null;

    const byId = works.find((w) => String(w.id) === String(currentId));
    if (byId && byId.display) return byId.display as PreviewDisplay;

    const anyWithDisplay = works.find((w) => !!w.display);
    if (anyWithDisplay && anyWithDisplay.display)
      return anyWithDisplay.display as PreviewDisplay;

    return null;
  } catch (error) {
    console.error("[MagicClockDisplay] Failed to read local display", error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Client Supabase — uniquement pour les métadonnées
// Les médias (images/vidéos) passent directement par R2 CDN
// ─────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

export default function MagicClockDisplayClient() {
  const searchParams = useSearchParams();

  // ✅ Support des deux paramètres : ?id=UUID et ?slug=mon-slug
  const idFromUrl   = searchParams.get("id");    // UUID direct
  const slugFromUrl = searchParams.get("slug");  // slug lisible

  const [state, setState] = useState<LoadState>({
    status: "idle",
    id: idFromUrl ?? slugFromUrl,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // ── 0) Aucun identifiant → erreur claire ──────────────────
      if (!idFromUrl && !slugFromUrl) {
        if (!cancelled) {
          setState({
            status: "error",
            id: null,
            message: "Aucun identifiant (id ou slug) reçu dans l'URL.",
            debugSlug: null,
          });
        }
        return;
      }

      // Identifiant "sûr" pour les logs et le state (slug prioritaire pour l'affichage)
      const safeKey = idFromUrl ?? slugFromUrl!;

      // ── 1) Presets officiels (par id uniquement) ───────────────
      if (idFromUrl) {
        const preset = DISPLAY_PRESETS[idFromUrl];
        if (preset) {
          if (!cancelled) setState({ status: "ready", id: safeKey, display: preset });
          return;
        }
      }

      // ── 2) localStorage (drafts locaux, par id) ────────────────
      if (idFromUrl) {
        const localDisplay = findLocalDisplay(idFromUrl);
        if (localDisplay) {
          if (!cancelled) setState({ status: "ready", id: safeKey, display: localDisplay });
          return;
        }
      }

      // ── 3) Supabase — métadonnées uniquement ───────────────────
      //    Les URLs médias dans work.display pointent vers R2 CDN directement
      //    → 0 bande passante Supabase pour les binaires
      if (!cancelled) setState({ status: "loading", id: safeKey });

      try {
        let query = supabase
          .from("magic_clocks")
          .select("id, slug, work")
          .eq("is_published", true);

        // Requête par slug OU par id selon ce qui est disponible
        if (slugFromUrl && !idFromUrl) {
          query = query.eq("slug", slugFromUrl);
        } else if (idFromUrl) {
          query = query.eq("id", idFromUrl);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error("[MagicClockDisplay] Supabase error", error);
          if (!cancelled) {
            setState({
              status: "error",
              id: safeKey,
              message: "Erreur lors du chargement depuis Supabase.",
              debugSlug: slugFromUrl,
            });
          }
          return;
        }

        const row = data as MagicClockRow | null;

        if (!row?.work) {
          if (!cancelled) {
            setState({
              status: "error",
              id: safeKey,
              message: "Magic Clock introuvable ou non publié.",
              debugSlug: slugFromUrl,
            });
          }
          return;
        }

        // ⚡️ Reconstruction du display avec URLs R2 directes
        const display = buildPreviewDisplay(row);

        if (!display) {
          if (!cancelled) {
            setState({
              status: "error",
              id: safeKey,
              message:
                "Ce Magic Clock n'a pas encore de Display configuré (work.display manquant ou vide).",
              debugSlug: slugFromUrl,
            });
          }
          return;
        }

        if (!cancelled) {
          setState({ status: "ready", id: safeKey, display });
        }
      } catch (err) {
        console.error("[MagicClockDisplay] Unexpected error", err);
        if (!cancelled) {
          setState({
            status: "error",
            id: safeKey,
            message: "Erreur inattendue lors du chargement du Magic Display.",
            debugSlug: slugFromUrl,
          });
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [idFromUrl, slugFromUrl]);

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
          <h1 className="text-xl font-semibold sm:text-2xl">Magic Display</h1>
          <p className="text-sm text-slate-600">
            Visualisation en lecture seule du Magic Display associé à ton Magic Clock.
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

            {/* 🔧 Bloc DEBUG — à retirer en prod */}
            <div className="rounded-xl bg-white/70 p-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-700">
                DEBUG (Amiral + Capitaine)
              </div>
              <div className="mt-1 space-y-0.5">
                <div>
                  Paramètre <code className="rounded bg-slate-100 px-1 font-mono text-[11px]">id</code> :{" "}
                  <code className="rounded bg-slate-100 px-1 font-mono text-[11px]">
                    {idFromUrl ?? "(aucun)"}
                  </code>
                </div>
                <div>
                  Paramètre <code className="rounded bg-slate-100 px-1 font-mono text-[11px]">slug</code> :{" "}
                  <code className="rounded bg-slate-100 px-1 font-mono text-[11px]">
                    {slugFromUrl ?? "(aucun)"}
                  </code>
                </div>
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
