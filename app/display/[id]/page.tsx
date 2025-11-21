
import Link from "next/link";
import { notFound } from "next/navigation";
import { findContentById } from "@/core/domain/repository";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";
import { canViewContent } from "@/core/domain/access";

type Props = {
  params: { id: string };
};

export default function DisplayDetailPage({ params }: Props) {
  const contentId = Number(params.id);
  const content = findContentById(Number.isNaN(contentId) ? params.id : contentId);

  if (!content) {
    notFound();
  }

  const viewer = getViewerAccessContextFromCookie();
  const decision = canViewContent({
    content,
    viewerId: viewer.viewerId,
    subs: viewer.subs,
    unlocked: viewer.unlocked,
  });

  const canSee = decision.decision === "ALLOW";

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Magic Display — {content.title}
          </h1>
          <p className="text-sm text-slate-600">
            MVP : page de détail pour le Magic Display lié au contenu #{content.id}.<br />
            L&apos;accès est actuellement :{" "}
            <span className={canSee ? "text-emerald-600" : "text-red-600"}>
              {canSee ? "autorisé" : "bloqué"}
            </span>
            .
          </p>
        </div>
        <Link
          href="/mymagic"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
        >
          ← Retour à My Magic Clock
        </Link>
      </div>

      {!canSee && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-semibold mb-1">
            Vous n&apos;avez pas encore débloqué ce Magic Display.
          </p>
          <p>
            Revenez sur la carte dans Amazing ou My Magic Clock et utilisez le
            menu FREE / Abo / PPV pour le débloquer. Cette page affichera ensuite
            le cube pédagogique interactif (Magic Display).
          </p>
        </div>
      )}

      {canSee && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">
            🎛️ Placeholder Magic Display (MVP)
          </p>
          <p className="text-sm text-slate-500">
            Ici s&apos;affichera le cube pédagogique 3D lié à ce contenu :
            étapes, formules de couleur, paramètres techniques, etc.
          </p>
        </div>
      )}

      <section className="space-y-2 text-xs text-slate-500">
        <p className="font-semibold">Debug accès (MVP) :</p>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-950/90 text-[11px] text-slate-100 p-3 overflow-x-auto">
          {JSON.stringify(
            {
              viewer,
              decision,
            },
            null,
            2
          )}
        </pre>
      </section>
    </div>
  );
}
