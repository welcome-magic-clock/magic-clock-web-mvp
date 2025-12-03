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
      {/* Titre / intro */}
      <header className="mb-3 space-y-1">
        <h1 className="text-xl font-semibold sm:text-2xl">Créer</h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Compose tes œuvres Magic Clock : le visuel{" "}
          <strong>Magic Studio</strong> et le cube pédagogique{" "}
          <strong>Magic Display</strong>, puis gère tes projets en cours.
        </p>
      </header>

      {/* 🔵 Barre de bulles : Studio / Display / Projets en cours */}
      <CreateToolbar mode={mode} onChange={setMode} />

      {/* MAGIC STUDIO */}
      {mode === "studio" && (
        <section
          id="create-studio"
          className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Magic Studio – Avant / Après
          </h2>
          <p className="text-sm text-slate-600">
            Crée un visuel <strong>Avant / Après</strong> propre et
            partageable : parfait pour montrer une transformation capillaire,
            un maquillage, ou tout autre résultat avant / après.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Étape 1
              </h3>
              <p className="text-sm text-slate-700">
                Importer les médias Avant &amp; Après, recadrer au format Magic
                Clock, ajouter ton avatar et ton titre.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Étape 2
              </h3>
              <p className="text-sm text-slate-700">
                Choisir le mode <strong>FREE / Abo / PPV</strong>, fixer ton
                prix et publier vers <strong>Amazing</strong> et{" "}
                <strong>My Magic Clock</strong>.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            MVP : l’éditeur complet (upload, recadrage, overlay, etc.) sera
            branché ici. Pour l’instant, cette section sert de maquette claire
            pour le design et les interactions.
          </p>
        </section>
      )}

      {/* MAGIC DISPLAY */}
      {mode === "display" && (
        <section
          id="create-display"
          className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Magic Display – Cube pédagogique
          </h2>
          <p className="text-sm text-slate-600">
            Configure ton <strong>cube 3D</strong> : faces pédagogiques,
            cercles, segments et aiguilles pour expliquer{" "}
            <strong>comment</strong> tu as obtenu le résultat.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Faces &amp; cercles
              </h3>
              <p className="text-sm text-slate-700">
                Choisis quelles faces utiliser, définis les cercles (anneaux),
                les segments, les couleurs et les textes.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Aiguilles &amp; pédagogie
              </h3>
              <p className="text-sm text-slate-700">
                Place les aiguilles pour guider l&apos;œil étape par étape :
                diagnostic, choix de la technique, temps de pause, produits,
                etc.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            MVP : le véritable éditeur 3D Magic Display (cube interactif) sera
            branché dans cette section. La page actuelle pose le cadre visuel
            et l&apos;UX.
          </p>
        </section>
      )}

      {/* PROJETS EN COURS & BROUILLONS */}
      {mode === "projects" && (
        <section
          id="create-projects"
          className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Projets en cours & brouillons
          </h2>
          <p className="text-sm text-slate-600">
            Ici tu retrouveras tous les Magic Studio et Magic Display{" "}
            <strong>non publiés</strong> : travaux en cours, tests, idées à
            finaliser avant mise en ligne.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Projets en cours
              </h3>
              <p className="text-sm text-slate-700">
                Magic Clock que tu es en train de préparer (médias importés,
                textes en brouillon, mais pas encore publiés). Ils resteront
                visibles uniquement pour toi.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Brouillons & idées
              </h3>
              <p className="text-sm text-slate-700">
                Notes, essais rapides, Magic Studio ou Display incomplets.
                Parfait pour garder une trace de tes inspirations avant de les
                transformer en contenu final.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            MVP : cette section ne liste pas encore de vrais contenus, mais elle
            définit la structure UX. Plus tard, elle sera connectée à ta
            bibliothèque My Magic Clock pour afficher tes projets en temps réel.
          </p>
        </section>
      )}
    </main>
  );
}
