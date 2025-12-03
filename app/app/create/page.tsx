import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="container space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Créer — Magic Studio &amp; Magic Display</h1>
        <p className="text-sm text-slate-600">
          Magic Studio est la vitrine (Avant / Après). Magic Display explique comment
          réaliser le résultat. Les deux vont toujours ensemble.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/studio"
          className="rounded-2xl border border-slate-200 bg-white/80 p-5 flex flex-col gap-2 hover:border-brand-500 hover:shadow-sm transition"
        >
          <div className="text-lg font-semibold">Magic Studio — Avant / Après</div>
          <p className="text-sm text-slate-600">
            Crée ta vitrine : import photo ou vidéo Avant / Après, ajoute un titre et des
            hashtags, choisis FREE / Abonnement / PPV puis publie dans Amazing.
          </p>
          <span className="mt-2 text-sm font-medium text-brand-600">
            Ouvrir Magic Studio →
          </span>
        </Link>

        <Link
  href="/magic-display"
  className="rounded-2xl border border-slate-200 bg-white/80 p-5 flex flex-col gap-2 hover:border-brand-500 hover:shadow-sm transition"
>
  <div className="text-lg font-semibold">Magic Display — Cube 3D</div>
  <p className="text-sm text-slate-600">
    Construis l&apos;explication pédagogique : faces, cercles, segments, aiguilles
    et médias. Le Display montre comment reproduire l&apos;Avant / Après de Studio.
  </p>
  <span className="mt-2 text-sm font-medium text-brand-600">
    Ouvrir Magic Display →
  </span>
</Link>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Logique produit</h2>
        <p className="text-sm text-slate-600">
          À terme, chaque Magic Clock sera une œuvre complète : un Studio (vitrine) lié à
          un Display (méthode). Cet écran &quot;Créer&quot; est le point de départ unique
          pour préparer les deux.
        </p>
      </section>
    </div>
  );
}
