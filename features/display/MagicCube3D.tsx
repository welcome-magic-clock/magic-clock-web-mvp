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

  // 👉 Dès qu'une face est sélectionnée (cercle, liste ou cube),
  //    on recalcule l'orientation du cube.
  useEffect(() => {
    if (selectedId == null) return;
    const index = segments.findIndex((s) => s.id === selectedId);
    if (index === -1) return;

    const presets = [
      { x: 0, y: 0 },   // face 1 = front
      { x: 0, y: 90 },  // face 2 = droite
      { x: 0, y: 180 }, // face 3 = arrière
      { x: 0, y: -90 }, // face 4 = gauche
      { x: -90, y: 0 }, // face 5 = haut
      { x: 90, y: 0 },  // face 6 = bas
    ] as const;

    setRotation(presets[index] ?? presets[0]);
  }, [selectedId, segments]);

  const handleFaceClick = (id: number) => {
    onSelect(id); // la rotation sera gérée par le useEffect ci-dessus
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
                  "absolute inset-[12%] rounded-3xl border shadow-md flex items-center justify-center px-3 text-center",
                  "bg-white/90 backdrop-blur-sm transition-colors",
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

function faceTransform(index: number): string {
  const depth = "6.5rem";
  switch (index) {
    case 0:
      return `translateZ(${depth})`;
    case 1:
      return `rotateY(90deg) translateZ(${depth})`;
    case 2:
      return `rotateY(180deg) translateZ(${depth})`;
    case 3:
      return `rotateY(-90deg) translateZ(${depth})`;
    case 4:
      return `rotateX(90deg) translateZ(${depth})`;
    case 5:
      return `rotateX(-90deg) translateZ(${depth})`;
    default:
      return `translateZ(${depth})`;
  }
}
