import { getAmazingFeed } from "@/core/domain/repository";
import {
  canViewContent,
  explainAccessDecision,
} from "@/core/domain/access";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";

type DisplayPageProps = {
  params: { id: string };
};

export default async function DisplayPage({ params }: DisplayPageProps) {
  const rawId = params.id;

  // 1) On récupère le faux flux Amazing
  const feed = getAmazingFeed();

  // 2) On cherche le contenu correspondant à l'id de l'URL
  const fromFeed = feed.find((item: any) => String(item.id) === String(rawId));

  // 3) Fallback de sécurité si rien trouvé
  const fallbackId = rawId ?? "demo";

  const content: any =
    fromFeed ??
    {
      id: fallbackId,
      user: "demo",
      access: "FREE",
      likes: 0,
      views: 0,
      tags: ["demo"],
    };

  // 4) Règles d’accès (FREE / Abo / PPV) avec le cookie viewer
  const viewer = await getViewerAccessContextFromCookie();
  const decision = canViewContent(content, viewer);
  const canSee = decision === "ALLOWED";

  const displayIdLabel =
    typeof content.id === "number" || typeof content.id === "string"
      ? String(content.id)
      : String(fallbackId);

  return (
    <div className="container py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">
          Magic Display — contenu #{displayIdLabel}
        </h1>
        <p className="text-sm text-slate-600">
          Vue de démonstration du Magic Display pour ce Magic Clock.
        </p>
      </header>

      {/* Résumé accès */}
      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700">
        <p className="font-medium">
          Créateur :{" "}
          <span className="font-semibold">@{content.user ?? "demo"}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Statut d&apos;accès : {decision === "ALLOWED" ? "Débloqué" : "Verrouillé"}
        </p>
        <p className="text-xs text-slate-500">
          {explainAccessDecision(decision)}
        </p>
      </div>

      {/* Zone Magic Display (MVP) */}
      {canSee ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <p className="mb-2 text-sm text-slate-600">🎛️ Magic Display — MVP</p>
          <p className="text-sm text-slate-500">
            Ici s&apos;affichera le cube pédagogique 3D lié à ce contenu :
            étapes, formules, paramètres techniques, etc.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600">
          Ce Magic Display est verrouillé. Débloque le contenu depuis le flux
          Amazing ou My Magic Clock (FREE / Abo / PPV).
        </div>
      )}
    </div>
  );
}
