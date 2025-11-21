import { notFound } from "next/navigation";
import Link from "next/link";

import { FEED } from "@/features/amazing/feed";
import { canViewContent, explainAccessDecision } from "@/core/domain/access";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";

type PageProps = {
  params: { id: string };
};

export default function DisplayPage({ params }: PageProps) {
  const content = FEED.find((c) => String(c.id) === params.id);
  if (!content) {
    notFound();
  }

  // 👇 Une seule fois !
  const viewer = getViewerAccessContextFromCookie();
  const decision = canViewContent(content!, viewer);
  const canSee = decision === "ALLOWED";

  return (
    <div className="container py-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Magic Display (MVP)</h1>
          <p className="text-sm text-slate-500">
            Contenu #{content!.id} — {content!.title}
          </p>
        </div>
        <Link
          href="/mymagic"
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
        >
          ← Retour à My Magic Clock
        </Link>
      </header>

      {canSee ? (
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-700">
          <p className="font-medium mb-2">
            Ici, on affichera le vrai cube Magic Display pour ce contenu.
          </p>
          <p>
            Pour l’instant, c’est un écran placeholder branché aux règles
            FREE / Abo / PPV.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-medium mb-2">Ce Magic Display est verrouillé.</p>
          <p>{explainAccessDecision(decision)}</p>
        </div>
      )}
    </div>
  );
}
