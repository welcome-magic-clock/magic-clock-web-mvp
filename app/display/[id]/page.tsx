import Link from "next/link";
import { findContentById } from "@/core/domain/repository";
import {
  canViewContent,
  explainAccessDecision,
  type AccessDecision,
} from "@/core/domain/access";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";

type Props = {
  params: { id: string };
};

export default async function DisplayDetailPage({ params }: Props) {
  const numericId = Number(params.id);
  const content = findContentById(
    Number.isNaN(numericId) ? params.id : numericId
  );

  // 🧩 Si le contenu est introuvable, on reste sur la page (plus de 404)
  if (!content) {
    return (
      <div className="container py-8 space-y-4">
        <h1 className="text-2xl font-semibold">Magic Display — contenu introuvable</h1>
        <p className="text-sm text-slate-600">
          Le Magic Display demandé n&apos;existe pas (ID : {params.id}).
        </p>
        <Link
          href="/mymagic"
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          ← Retour à My Magic Clock
        </Link>
      </div>
    );
  }

  // 👤 Contexte d’accès depuis le cookie (subs, unlocked)
  const viewer = await getViewerAccessContextFromCookie();
  const decision: AccessDecision = canViewContent(content, viewer);
  const canSee = decision === "ALLOWED";

  return (
    <div className="container py-8 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Magic Display · #{content.id}
          </h1>
          <p className="text-sm text-slate-600">
            Créateur : <span className="font-medium">@{content.user}</span>
          </p>
          <p className="text-xs text-slate-500">
            Type d&apos;accès : <code>{content.access}</code>
          </p>
        </div>

        <Link
          href="/mymagic"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          ← Retour à My Magic Clock
        </Link>
      </div>

      {/* Carte résumé Magic Studio (placeholder) */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <p className="text-sm font-medium mb-1">{content.title}</p>
        <p className="text-xs text-slate-500">
          Ici, tu verras un rappel du Magic Studio (Avant / Après) lié à ce
          Magic Display.
        </p>
      </div>

      {/* État d’accès */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-1">
        <p className="font-semibold">État d&apos;accès :</p>
        <p>
          Décision : <code>{decision}</code>
        </p>
        <p className="text-slate-600">
          {explainAccessDecision(decision)}
        </p>
      </div>

      {/* Zone Magic Display (visible seulement si ALLOWED) */}
      {canSee ? (
        <MagicDisplayViewer contentId={Number(content.id)} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600">
          Ce Magic Display est verrouillé. Débloque le contenu depuis le flux Amazing
          ou My Magic Clock (FREE / Abo / PPV).
        </div>
      )}

    </div>
  );
}
