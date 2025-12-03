// app/create/page.tsx
"use client";

import { useState } from "react";
import CreateToolbar, {
  type CreateMode,
} from "@/components/create/CreateToolbar";

export default function CreatePage() {
  const [mode, setMode] = useState<CreateMode>("studio");

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Titre + intro */}
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">Créer</h1>
        <p className="text-sm text-slate-600 sm:text-[15px]">
          Compose tes œuvres Magic Clock : le visuel{" "}
          <strong>Magic Studio</strong> et le cube pédagogique{" "}
          <strong>Magic Display</strong>, puis gère tes projets en cours.
        </p>
      </header>

      {/* Bulles : Magic Studio / Magic Display / Projets */}
      <section className="mb-4">
        <CreateToolbar mode={mode} onChange={setMode} />
      </section>

      {/* CONTENU SELON LE MODE SÉLECTIONNÉ */}

      {mode === "studio" && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold sm:text-xl">
            Magic Studio – Avant / Après
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Crée un visuel <strong>Avant / Après</strong> propre et partageable :
            parfait pour montrer une transformation capillaire, un maquillage,
            ou tout autre résultat avant / après.
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                ÉTAPE 1
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Importer les médias Avant &amp; Après, recadrer au format Magic
                Clock, ajouter ton avatar et ton titre.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                ÉTAPE 2
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Choisir le mode <strong>FREE / Abo / PPV</strong>, fixer ton
                prix et publier vers <strong>Amazing</strong> et{" "}
                <strong>My Magic Clock</strong>.
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            MVP : l&apos;éditeur complet (upload, recadrage, overlay, etc.) sera
            branché ici. Pour l&apos;instant, cette section sert de maquette
            claire pour le design et les interactions.
          </p>
        </section>
      )}

      {mode === "display" && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold sm:text-xl">
            Magic Display – Cube 3D pédagogique
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Construis le <strong>cube 3D</strong> qui explique comment
            reproduire ton résultat : faces, cercles, segments, aiguilles,
            textes et médias. Le Display est la partie pédagogique de ta Magic
            Clock.
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                ÉTAPE 1
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Choisir une face, définir les cercles et segments, puis poser
                tes textes (produits, temps de pose, diagnostics, etc.).
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                ÉTAPE 2
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Ajouter les aiguilles et les médias (photos / vidéos courtes),
                puis lier ce Display à ton Magic Studio correspondant pour
                former une Magic Clock complète.
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            MVP : l&apos;éditeur Magic Display sera branché ici (cube 3D
            interactif). Cette vue sert de base claire pour le produit et la
            navigation.
          </p>
        </section>
      )}

      {mode === "projects" && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold sm:text-xl">
            Projets en cours
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Cet espace accueillera tes <strong>brouillons</strong> : Magic
            Studio non publiés, Magic Display en construction, et Magic Clock
            complètes prêtes à être planifiées.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Pour le MVP, cette section sert surtout de repère visuel : elle
            montre où apparaîtront tes projets enregistrés automatiquement au
            fur et à mesure de la création.
          </p>
          <p className="mt-4 text-[11px] text-slate-400">
            Version ultérieure : filtres par statut (brouillon, prêt à publier,
            publié), duplication rapide d&apos;une Magic Clock, archivage.
          </p>
        </section>
      )}
    </main>
  );
}
