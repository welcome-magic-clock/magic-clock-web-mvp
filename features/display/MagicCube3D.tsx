// features/display/MagicCube3D.tsx
"use client";

import React, { useState } from "react";

type MagicCube3DProps = {
  faceLabels?: string[];
  avatarUrl?: string;
  avatarInitials?: string;
};

const DEFAULT_FACES = [
  "Face 1 – Diagnostic / point de départ",
  "Face 2 – Préparation / sectionnement",
  "Face 3 – Application principale",
  "Face 4 – Patine / correction",
  "Face 5 – Finition / coiffage",
  "Face 6 – Résultat / conseils maison",
];

export default function MagicCube3D({
  faceLabels = DEFAULT_FACES,
  avatarUrl,
  avatarInitials = "AT",
}: MagicCube3DProps) {
  const [rotation, setRotation] = useState({ x: -20, y: -30 });
  const faces = faceLabels.length === 6 ? faceLabels : DEFAULT_FACES;

  const size = 140;
  const half = size / 2;

  const makeFaceStyle = (transform: string): React.CSSProperties => ({
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    top: "50%",
    left: "50%",
    transform: `${transform} translate(-50%, -50%)`,
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
  });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            Magic Display · Cube 3D (prototype)
          </p>
          <h2 className="text-lg font-semibold sm:text-xl">
            Vue 3D de ton Magic Clock
          </h2>
          <p className="text-xs text-slate-500">
            Le cube représente ton œuvre complète : 6 faces pédagogiques. Tu
            peux le faire tourner pour visualiser chaque face comme un vrai
            objet.
          </p>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 sm:mt-0">
          Prototype frontal : pas encore connecté aux vraies données.
        </p>
      </header>

      <div className="mt-4 grid items-center gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Cube 3D */}
        <div className="flex justify-center">
          <div
            className="relative h-64 w-64"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative h-full w-full"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: "transform 400ms ease",
              }}
            >
              {/* Face avant */}
              <div
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/95 px-3 text-center text-[11px] font-medium text-slate-700 shadow-sm"
                style={makeFaceStyle(`translateZ(${half}px)`)}
              >
                {faces[0]}
              </div>

              {/* Face arrière */}
              <div
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/80 px-3 text-center text-[11px] font-medium text-slate-700 shadow-sm"
                style={makeFaceStyle(`rotateY(180deg) translateZ(${half}px)`)}
              >
                {faces[1]}
              </div>

              {/* Face droite */}
              <div
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/90 px-3 text-center text-[11px] font-medium text-slate-700 shadow-sm"
                style={makeFaceStyle(`rotateY(90deg) translateZ(${half}px)`)}
              >
                {faces[2]}
              </div>

              {/* Face gauche */}
              <div
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/90 px-3 text-center text-[11px] font-medium text-slate-700 shadow-sm"
                style={makeFaceStyle(`rotateY(-90deg) translateZ(${half}px)`)}
              >
                {faces[3]}
              </div>

              {/* Face dessus */}
              <div
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/90 px-3 text-center text-[11px] font-medium text-slate-700 shadow-sm"
                style={makeFaceStyle(`rotateX(90deg) translateZ(${half}px)`)}
              >
                {faces[4]}
              </div>

              {/* Face dessous */}
              <div
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/90 px-3 text-center text-[11px] font-medium text-slate-700 shadow-sm"
                style={makeFaceStyle(`rotateX(-90deg) translateZ(${half}px)`)}
              >
                {faces[5]}
              </div>
            </div>

            {/* Avatar créatrice au centre (par-dessus le cube) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-white bg-slate-900 shadow-xl shadow-slate-900/40">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={avatarInitials}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                    {avatarInitials}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Légende + contrôles */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-700">
              Faces de ce cube
            </p>
            <ul className="space-y-1.5">
              {faces.map((label, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-1.5"
                >
                  <span className="text-[11px] text-slate-700">{label}</span>
                  <span className="text-[10px] text-slate-400">
                    Face {index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-700">
              Contrôles de rotation
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setRotation((r) => ({ ...r, y: r.y - 30 }))
                }
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                ↺ Tourner gauche
              </button>
              <button
                type="button"
                onClick={() =>
                  setRotation((r) => ({ ...r, y: r.y + 30 }))
                }
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                ↻ Tourner droite
              </button>
              <button
                type="button"
                onClick={() =>
                  setRotation((r) => ({ ...r, x: r.x - 20 }))
                }
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                ⤵ Vue dessus
              </button>
              <button
                type="button"
                onClick={() =>
                  setRotation((r) => ({ ...r, x: r.x + 20 }))
                }
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                ⤴ Vue de face
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Plus tard, chaque face sera cliquable pour ouvrir sa “Face
            universelle” détaillée et les données Studio associées.
          </p>
        </div>
      </div>
    </section>
  );
}
