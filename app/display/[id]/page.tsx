import Link from "next/link";
import { notFound } from "next/navigation";
import { findContentById } from "@/core/domain/repository";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";
import { canViewContent } from "@/core/domain/access";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const content = findContentById(params.id);
  if (!content) {
    return {
      title: "Magic Display · Introuvable",
    };
  }
  return {
    title: `Magic Display · ${content.title}`,
  };
}

export default async function DisplayPage({ params }: Props) {
  const content = findContentById(params.id);
  if (!content) {
    notFound();
  }

  const viewer = await getViewerAccessContextFromCookie();
  const decision = canViewContent(
    {
      id: content!.id,
      access: content!.access,
      user: content!.user,
    },
    viewer
  );

  const isAllowed = decision === "ALLOWED";

  return (
    <div className="container space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Magic Display</h1>
          <p className="text-sm text-slate-600">
            MVP : page détail pour le cube pédagogique lié à ce Magic Clock.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/mymagic"
            className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Retour My Magic Clock
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Amazing
          </Link>
        </div>
      </header>

      <section className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Magic Clock #{String(content!.id)}
        </p>
        <h2 className="text-xl font-semibold">{content!.title}</h2>
        <p className="text-sm text-slate-600">
          Créateur : <span className="font-medium">@{content!.user}</span>
        </p>
        <p className="text-xs text-slate-500">
          Accès : {content!.access === "FREE"
            ? "FREE"
            : content!.access === "ABO"
            ? "Abonnement"
            : content!.access === "PPV"
            ? "PPV"
            : "Autre"}
          {" · "}Décision d&apos;accès : {decision}
        </p>
      </section>

      {!isAllowed && (
        <section className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p>
            Vous n&apos;avez pas encore accès au Magic Display pour ce contenu.
          </p>
          <p>
            Débloquez-le depuis{" "}
            <Link href="/" className="underline font-medium">
              Amazing
            </Link>{" "}
            (FREE / Abo / PPV) ou depuis l&apos;interface créateur.
          </p>
        </section>
      )}

      {isAllowed && (
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
          <h3 className="text-lg font-semibold">Cube pédagogique (placeholder MVP)</h3>
          <p className="text-sm text-slate-600">
            Ici s&apos;affichera le Magic Display : cube 3D interactif, faces configurables,
            cercles / segments / aiguilles et médias. Cette page est déjà prête à être branchée
            sur l&apos;éditeur réel.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 aspect-square">
              <span className="text-xs text-slate-500">
                [Placeholder cube 3D — preview pédagogique]
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                MVP : cette colonne pourra détailler les étapes, formules, produits et paramètres
                techniques utilisés pour obtenir l&apos;Avant/Après de ce Magic Clock.
              </p>
              <p>
                Plus tard, chaque segment / anneau du Magic Display sera cliquable pour afficher
                une fiche détaillée (dosage, temps de pose, techniques, vidéos, etc.).
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
