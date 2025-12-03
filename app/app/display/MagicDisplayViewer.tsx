"use client";

import React from "react";

type Props = {
  /** ID du contenu Magic Clock (même que la carte Amazing / My Magic Clock) */
  contentId: number;
};

/**
 * MagicDisplayViewer
 *
 * MVP purement visuel : on affiche un "fake" Magic Display circulaire,
 * avec des anneaux, quelques segments et 2–3 "aiguilles" pour donner
 * l'impression d'un cube pédagogique vivant.
 *
 * Plus tard, cette vue sera entièrement pilotée par les vraies données
 * (faces, cercles, segments, arcs, aiguilles, etc.).
 */
export default function MagicDisplayViewer({ contentId }: Props) {
  const variant = contentId % 3; // 0,1,2 → 3 motifs différents

  const titleByVariant = [
    "Balance couleur / soin",
    "Plan balayage caramel",
    "Correction & neutralisation",
  ];

  const subtitleByVariant = [
    "Répartition temps de pose · oxydant · gloss",
    "Sections · placements · transitions de ton",
    "Neutralisation, reflets froids & reflets chauds",
  ];

  const segmentsByVariant: { label: string; angle: number }[][] = [
    [
      { label: "Temps de pose", angle: -20 },
      { label: "Oxydant", angle: 40 },
      { label: "Gloss", angle: 110 },
    ],
    [
      { label: "Zone frontale", angle: -40 },
      { label: "Zone médiane", angle: 20 },
      { label: "Zone arrière", angle: 80 },
    ],
    [
      { label: "Pigments chauds", angle: -30 },
      { label: "Pigments froids", angle: 30 },
      { label: "Soins & pH", angle: 90 },
    ],
  ];

  const needles = segmentsByVariant[variant];

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6 text-slate-50 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
      <header className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 items-center rounded-full bg-slate-900 px-2 text-[10px] font-semibold text-slate-100">
            Magic Display · Face 1
          </span>
          <span className="text-slate-500">Démo #{contentId}</span>
        </div>
        <span className="text-[10px] text-slate-500">
          Visualisation pédagogique (MVP)
        </span>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* Cercle principal */}
        <div className="flex items-center justify-center">
          <div className="relative h-64 w-64 max-w-full">
            {/* Halo */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(244,244,245,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.35),transparent_55%)]" />
            {/* Disque principal */}
            <div className="absolute inset-3 rounded-full border border-slate-600/70 bg-[radial-gradient(circle_at_30%_20%,#1f2937,#020617)] shadow-inner" />

            {/* Anneau externe */}
            <div className="absolute inset-6 rounded-full border border-slate-500/60" />

            {/* Anneau intermédiaire */}
            <div className="absolute inset-14 rounded-full border border-slate-600/80" />

            {/* Nucleus central */}
            <div className="absolute inset-[5.2rem] rounded-full border border-slate-400/80 bg-slate-900/70 backdrop-blur-sm" />

            {/* Aiguilles / segments symboliques */}
            {needles.map((seg, index) => {
              const length = 90 + index * 16;
              return (
                <div
                  key={seg.label}
                  className="absolute left-1/2 top-1/2 origin-bottom -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${seg.angle}deg) translateX(-50%)`,
                  }}
                >
                  <div
                    className="rounded-full bg-cyan-400/80"
                    style={{
                      width: 2,
                      height: length,
                      boxShadow: "0 0 8px rgba(34,211,238,0.7)",
                    }}
                  />
                  <div
                    className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.9)]"
                    style={{
                      transform: "translateX(-1px)",
                    }}
                  />
                </div>
              );
            })}

            {/* Curseur central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/90 text-center text-[10px] font-semibold leading-tight text-slate-100 shadow-[0_0_18px_rgba(8,47,73,0.9)]">
                <span>It&apos;s time to smile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Légende / lecture pédagogique */}
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-cyan-300">
              {titleByVariant[variant]}
            </p>
            <p className="text-xs text-slate-300">
              {subtitleByVariant[variant]}
            </p>
          </div>

          <ul className="space-y-2 text-xs">
            {needles.map((seg, i) => (
              <li
                key={seg.label}
                className="flex items-start gap-2 rounded-xl bg-slate-900/70 px-3 py-2"
              >
                <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-semibold text-cyan-300">
                  {i + 1}
                </span>
                <div className="space-y-0.5">
                  <p className="font-medium text-slate-50">{seg.label}</p>
                  <p className="text-[11px] text-slate-400">
                    Paramètre clé de cette face. Dans la version complète,
                    chaque segment sera cliquable et relié aux formules,
                    vidéos et explications du créateur.
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-[11px] text-slate-500">
            Démo front uniquement : les vrais Magic Display seront générés à
            partir des données Studio (faces, anneaux, segments, aiguilles).
          </p>
        </div>
      </div>
    </section>
  );
}
