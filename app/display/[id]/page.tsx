import { findContentById } from "@/core/domain/repository";
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

  // On accepte soit un ID numérique, soit un ID string
  const numericId = Number(rawId);
  const lookupKey = Number.isNaN(numericId) ? rawId : numericId;

  // 1) On essaie de retrouver le contenu dans notre "fake DB"
  const found = findContentById(lookupKey);

  // 2) Fallback : si rien trouvé, on crée un contenu FREE de démo
  const content =
    found ??
    ({
      id: lookupKey,
      user: "demo",
      access: "FREE",
      likes: 0,
      views: 0,
      tags: ["demo"],
    } as any);

  // 3) Contexte d'accès (cookie + règles FREE / ABO / PPV)
  const viewer = await getViewerAccessContextFromCookie();
  const decision = canViewContent(content as any, viewer);
  const canSee = decision === "ALLOWED";

  const displayId = content.id ?? rawId;

  return (
    <div className="container py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">
          Magic Display — contenu #{String(displayId)}
        </h1>
        <p className="text-sm text-slate-600">
          Vue de démonstration du Magic Display pour ce Magic Clock.
        </p>
      </header>

      {/* Résumé accès */}
      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700">
        <p className="font-medium">
          Créateur : <span className="font-semibold">@{content.user}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Statut d&apos;accès :{" "}
          {decision === "ALLOWED" ? "Débloqué" : "Verrouillé"}
        </p>
        <p className="text-xs text-slate-500">
          {explainAccessDecision(decision)}
        </p>
      </div>

      {/* Zone Magic Display */}
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
