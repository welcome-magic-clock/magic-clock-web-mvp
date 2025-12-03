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
      {/* HEADER comme l’ancienne version */}
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Créer — Magic Studio &amp; Magic Display
        </h1>
        <p className="text-sm text-slate-600 sm:text-[15px]">
          Magic Studio est la vitrine (Avant / Après). Magic Display explique
          comment réaliser le résultat. Les deux vont toujours ensemble.
        </p>
      </header>

      {/* 🔵 Bulles : Magic Studio / Magic Display / Projets en cours */}
      <section className="mb-5">
        <CreateToolbar mode={mode} onChange={setMode} />
      </section>

      {/* CONTENU SELON LE MODE SÉLECTIONNÉ */}

      {/* 🟣 Onglet Magic Studio */}
      {mode === "studio" && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold sm:text-xl">
            Magic Studio — Avant / Après
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Crée ta vitrine : import photo ou vidéo Avant / Après, ajoute un
            titre et des hashtags, choisis{" "}
            <strong>FREE / Abonnement / PPV</strong> puis publie dans{" "}
            <strong>Amazing</strong>.
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
                prix et publier vers Amazing et My Magic Clock.
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

      {/* 🟢 Onglet Magic Display */}
      {mode === "display" && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold sm:text-xl">
            Magic Display — Cube 3D
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Construis l&apos;explication pédagogique : faces, cercles, segments,
            aiguilles et médias. Le Display montre comment reproduire
            l&apos;Avant / Après de Studio.
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                ÉTAPE 1
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Choisir une face, définir les cercles et segments, poser tes
                textes (produits, temps de pose, diagnostics, etc.).
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                ÉTAPE 2
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Ajouter les aiguilles et les médias, puis lier ce Display à ton
                Magic Studio correspondant pour former une Magic Clock
                complète.
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

      {/* 🟡 Onglet Projets en cours */}
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

      {/* Bloc “Logique produit” conservé de l’ancienne version */}
      <section className="mt-8 space-y-2">
        <h2 className="text-lg font-semibold">Logique produit</h2>
        <p className="text-sm text-slate-600">
          À terme, chaque Magic Clock sera une œuvre complète : un Studio
          (vitrine) lié à un Display (méthode). Cet écran &quot;Créer&quot; est
          le point de départ unique pour préparer les deux.
        </p>
      </section>
    </main>
  );
}
