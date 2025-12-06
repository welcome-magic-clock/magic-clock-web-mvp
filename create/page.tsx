// app/create/page.tsx
import Link from "next/link";
import CreateToolbar from "@/components/create/CreateToolbar";

export default function CreatePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Titre + intro */}
      <header className="mb-4 space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">Créer</h1>
        <p className="text-sm text-slate-600">
          Compose tes œuvres Magic Clock : le visuel{" "}
          <strong>Magic Studio</strong> et le cube pédagogique{" "}
          <strong>Magic Display</strong>, puis gère tes projets en cours.
        </p>
      </header>

      {/* 🔵 Toolbar de bulles (Studio / Display / Projets) */}
      <section className="mb-6">
        <CreateToolbar />
      </section>

      {/* Cartes Magic Studio / Magic Display */}
      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/studio"
          className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:border-brand-500 hover:shadow-md"
        >
          <div className="text-lg font-semibold">
            Magic Studio — Avant / Après
          </div>
          <p className="text-sm text-slate-600">
            Crée ta vitrine : importe photo ou vidéo Avant / Après, ajoute un
            titre et des hashtags, choisis FREE / Abonnement / PPV puis publie
            dans Amazing.
          </p>
          <span className="mt-2 text-sm font-medium text-brand-600">
            Ouvrir Magic Studio →
          </span>
        </Link>

        <Link
          href="/magic-display"
          className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:border-brand-500 hover:shadow-md"
        >
          <div className="text-lg font-semibold">Magic Display — Cube 3D</div>
          <p className="text-sm text-slate-600">
            Construis l&apos;explication pédagogique : faces, cercles, segments,
            aiguilles et médias. Le Display montre comment reproduire
            l&apos;Avant / Après de Studio.
          </p>
          <span className="mt-2 text-sm font-medium text-brand-600">
            Ouvrir Magic Display →
          </span>
        </Link>
      </section>

      {/* Section Projets en cours (ancre pour la 3e bulle) */}
      <section id="create-projects" className="mt-8 space-y-2">
        <h2 className="text-lg font-semibold">Projets en cours (MVP)</h2>
        <p className="text-sm text-slate-600">
          Ici tu retrouveras tes Magic Clock en brouillon, en relecture
          ou en cours de publication. Pour le MVP, cette section sert de base
          de maquette pour le futur gestionnaire de projets.
        </p>
      </section>
    </main>
  );
}
