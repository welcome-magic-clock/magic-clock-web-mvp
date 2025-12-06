"use client";

import { useEffect, useState } from "react";

type FaceLike = {
  id: number;
  label: string;
  description: string;
  hasMedia: boolean;
};

type MagicCube3DProps = {
  segments: FaceLike[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function MagicCube3D({
  segments,
  selectedId,
  onSelect,
}: MagicCube3DProps) {
  const [rotation, setRotation] = useState({ x: -18, y: 28 });

  // 🔁 Orientation automatique en fonction de la face sélectionnée
  // Index = ordre des segments :
  //  0: Face 1 = TOP
  //  1: Face 2 = FRONT
  //  2: Face 3 = RIGHT
  //  3: Face 4 = BACK
  //  4: Face 5 = LEFT
  //  5: Face 6 = BOTTOM
  useEffect(() => {
    if (selectedId == null) return;
    const index = segments.findIndex((s) => s.id === selectedId);
    if (index === -1) return;

   const presets = [
  { x: -90, y: 0 },    // Face 1 (top) → arrive depuis le haut
  { x: 0, y: 0 },      // Face 2 (front)
  { x: 0, y: -90 },    // Face 3 (right)
  { x: 0, y: -180 },   // Face 4 (back)
  { x: 0, y: -270 },   // Face 5 (left)
  { x: 90, y: 0 },     // Face 6 (bottom) → arrive depuis le bas
] as const;

    setRotation(presets[index] ?? presets[1]); // défaut = face 2 (front)
  }, [selectedId, segments]);

  const handleFaceClick = (id: number) => {
    onSelect(id); // le parent gère selectedId → useEffect s'occupe de la rotation
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Vue 3D du cube (proto React)
      </p>
      <div className="relative mx-auto w-full max-w-xs sm:max-w-sm aspect-square [perspective:1100px]">
        <div
          className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {segments.slice(0, 6).map((seg, index) => {
            const isActive = seg.id === selectedId;

            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => handleFaceClick(seg.id)}
                className={[
                  "absolute rounded-3xl border shadow-md flex items-center justify-center px-3 text-center",
                  "bg-white/90 backdrop-blur-sm transition-colors",
                  "inset-[14%]",
                  isActive
                    ? "border-violet-400 shadow-violet-200"
                    : "border-slate-200 hover:border-violet-200",
                ].join(" ")}
                style={{ transform: faceTransform(index) }}
              >
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Face {seg.id}
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {seg.description}
                  </p>
                  {seg.hasMedia && (
                    <p className="text-[11px] text-emerald-600">
                      Média associé
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Halo léger */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_60%)]" />
      </div>
      <p className="mt-2 text-[11px] text-slate-500 text-center">
        Clique sur une face du cube pour la sélectionner. La liste et le cercle
        se synchronisent automatiquement.
      </p>
    </div>
  );
}

// Placement physique des faces dans l'espace 3D
function faceTransform(index: number): string {
  const depth = "6.5rem";

  switch (index) {
    case 0: // Face 1 = TOP
      return `rotateX(90deg) translateZ(${depth})`;
    case 1: // Face 2 = FRONT
      return `translateZ(${depth})`;
    case 2: // Face 3 = RIGHT
      return `rotateY(90deg) translateZ(${depth})`;
    case 3: // Face 4 = BACK
      return `rotateY(180deg) translateZ(${depth})`;
    case 4: // Face 5 = LEFT
      return `rotateY(-90deg) translateZ(${depth})`;
    case 5: // Face 6 = BOTTOM
      return `rotateX(-90deg) translateZ(${depth})`;
    default:
      return `translateZ(${depth})`;
  }
}
