import Link from "next/link";
import { notFound } from "next/navigation";
import { findContentById } from "@/core/domain/repository";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";
import { canViewContent } from "@/core/domain/access";

type Props = {
  params: { id: string };
};

export default async function DisplayDetailPage({ params }: Props) {
  const numericId = Number(params.id);
  const content = findContentById(
    Number.isNaN(numericId) ? params.id : numericId
  );

  if (!content) {
    notFound();
  }

  // Contexte d'accès depuis le cookie (subs, unlocked PPV, etc.)
  const viewer = await getViewerAccessContextFromCookie();
  const decision = canViewContent(content!, viewer);
  const canSee = decision === "ALLOWED";

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Magic Display —{" "}
            <span className="text-brand-600">@{content?.user}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Prototype de la face “cube pédagogique” liée au Magic Studio Avant
            / Après.
          </p>
        </div>

        <Link
          href="/mymagic"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
        >
          <span>←</span>
          <span>Retour à My Magic Clock</span>
        </Link>
      </div>

      {/* Bandeau d'état d'accès (juste pour le MVP, pour visualiser la logique) */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <span>
            État d’accès pour ce contenu :{" "}
            <strong>{canSee ? "ALLOWED" : "LOCKED"}</strong>
          </span>
          <span className="text-xs text-slate-500">
            (Basé sur FREE / Abonnement / PPV + cookie d’accès)
          </span>
        </div>
      </div>

      {/* Placeholder Magic Display (cube 3D à venir) */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Magic Display (MVP)</h2>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              Proto cube 3D
            </span>
          </div>

          <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16">
            <div className="text-center text-slate-500">
              <div className="mb-3 text-sm font-medium uppercase tracking-wide">
                MAGIC DISPLAY
              </div>
              <p className="max-w-md text-sm leading-relaxed">
                Ici viendra le{" "}
                <strong>cube pédagogique interactif (Magic Display)</strong>{" "}
                relié à cette création Magic Studio. On affichera les faces,
                segments, aiguilles, médias, etc.
              </p>
              <p className="mt-3 text-xs text-slate-400">
                Pour l’instant, cette page vérifie déjà l’accès (FREE / Abo /
                PPV) via <code>canViewContent</code> et le cookie viewer.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne latérale avec méta & debug accès */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Détails du contenu
            </h3>
            <dl className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Créateur</dt>
                <dd className="font-medium">@{content?.user}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">ID contenu</dt>
                <dd className="font-mono text-xs">{String(content?.id)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Type d’accès</dt>
                <dd className="font-medium">{content?.access}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Rappel logique accès
            </h3>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              <li>• FREE → toujours ALLOWED</li>
              <li>• ABO → ALLOWED si viewer est abonné au créateur</li>
              <li>• PPV → ALLOWED si ID contenu dans unlockedPpvContentIds</li>
              <li>• Sinon : LOCKED_LOGIN / LOCKED_ABO / LOCKED_PPV</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
