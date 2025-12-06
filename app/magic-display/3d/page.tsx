"use client";

import { listCreators } from "@/core/domain/repository";

type Face = {
  id: number;
  title: string;
  subtitle: string;
};

const FACES: Face[] = [
  {
    id: 1,
    title: "Face 1 – Diagnostic / point de départ",
    subtitle: "Analyse, discussion, photos de référence, historique couleur.",
  },
  {
    id: 2,
    title: "Face 2 – Préparation / sectionnement",
    subtitle: "Sections, protection, choix des outils, produits de base.",
  },
  {
    id: 3,
    title: "Face 3 – Application principale",
    subtitle: "Application technique : mélange, placements, rythmes.",
  },
  {
    id: 4,
    title: "Face 4 – Patine / correction",
    subtitle: "Neutralisation, reflets, ajustements de tonalité.",
  },
  {
    id: 5,
    title: "Face 5 – Finition / coiffage",
    subtitle: "Brushing, boucle, style final, produits de finition.",
  },
  {
    id: 6,
    title: "Face 6 – Résultat / conseils maison",
    subtitle: "Routine maison, fréquence, produits recommandés.",
  },
];

export default function MagicDisplay3DPage() {
  // Même logique que MyMagic / Magic Display : Aiko par défaut
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const initials = currentCreator.name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const cubeDepth = 80; // “épaisseur” du cube en px

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Header */}
      <header className="mb-6 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          Magic Display · Cube 3D (prototype)
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Construction 3D de ton Magic Clock
        </h1>
        <p className="text-sm text-slate-600">
          Cette vue expérimentale montre le cube Magic Clock en 3D. Chaque face
          correspond à un chapitre pédagogique (diagnostic, application, patine,
          routine maison, etc.).
        </p>
      </header>

      {/* Bloc principal : cube 3D + texte */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          {/* Cube 3D */}
          <div className="flex items-center justify-center">
            <div
              className="relative h-72 w-72 max-w-full"
              style={{ perspective: "1200px" }}
            >
              <div
                className="relative h-full w-full transition-transform duration-500 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(-18deg) rotateY(-32deg)",
                }}
              >
                {/* Face avant : Before / After */}
                <div
                  className="absolute inset-0 rounded-[1.75rem] bg-slate-950 text-slate-50 shadow-[0_18px_40px_rgba(15,23,42,0.55)] overflow-hidden"
                  style={{
                    transform: `translateZ(${cubeDepth}px)`,
                    background:
                      "linear-gradient(135deg, #020617 0%, #0f172a 45%, #020617 100%)",
                  }}
                >
                  <div className="flex h-full w-full">
                    {/* Côté BEFORE */}
                    <div className="relative flex-1 border-r border-slate-800/80">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(248,250,252,0.14),transparent_55%)]" />
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide">
                        Before
                      </div>
                    </div>

                    {/* Côté AFTER */}
                    <div className="relative flex-1">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(248,250,252,0.18),transparent_55%)]" />
                      <div className="absolute bottom-3 right-3 rounded-full bg-brand-500/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
                        After
                      </div>
                    </div>
                  </div>

                  {/* Avatar créatrice au centre du bord */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white/90 shadow-[0_10px_25px_rgba(15,23,42,0.7)]">
                    {currentCreator.avatar ? (
                      <img
                        src={currentCreator.avatar}
                        alt={currentCreator.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-semibold text-slate-50">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                {/* Face droite : logo / marque */}
                <div
                  className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-500 shadow-[0_18px_40px_rgba(15,23,42,0.45)]"
                  style={{
                    transform: `rotateY(90deg) translateZ(${cubeDepth}px)`,
                  }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-slate-50">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <span className="text-2xl">⏱️</span>
                    </div>
                    <p className="text-xs font-semibold tracking-wide uppercase">
                      Magic Clock
                    </p>
                    <p className="px-6 text-[11px] text-slate-100/80">
                      Visualisation pédagogique 3D
                    </p>
                  </div>
                </div>

                {/* Face supérieure */}
                <div
                  className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 shadow-[0_18px_40px_rgba(15,23,42,0.35)]"
                  style={{
                    transform: `rotateX(90deg) translateZ(${cubeDepth}px)`,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-600">
                      Vue cube 3D – prototype
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Texte à droite du cube */}
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-brand-600">
                Vue 3D de ton Magic Clock
              </p>
              <p className="text-sm text-slate-600">
                Le cube représente ton œuvre complète : 6 faces pédagogiques.
                Tu peux le faire tourner plus tard pour visualiser chaque face
                comme un vrai objet.
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Prototype frontal&nbsp;: pas encore connecté aux vraies données
              Studio / Display. L&apos;objectif est de valider la sensation 3D et
              la place du cube dans l&apos;interface.
            </p>
          </div>
        </div>

        {/* Liste des faces en dessous */}
        <div className="mt-6 space-y-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Faces de ce cube
          </h2>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs text-slate-700">
            {FACES.map((face) => (
              <div
                key={face.id}
                className="flex items-center justify-between px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="font-medium">{face.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {face.subtitle}
                  </p>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Face {face.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
