"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { PreviewFace } from "../MagicDisplayPreviewShell";

type MagicDisplayCube3DProps = {
  faces: PreviewFace[];
  initialFaceIndex?: number;
  onFaceChange?: (index: number) => void;
  onOpenBack?: (index: number) => void;
  getFaceMainPhotoUrl: (face: PreviewFace | undefined) => string | null;
};

/**
 * Presets de rotation pour chaque face, comme dans le CSS cube :
 * 0 -> Face 1 (top), 1 -> Face 2 (front), 2 -> Face 3 (right),
 * 3 -> Face 4 (back), 4 -> Face 5 (left), 5 -> Face 6 (bottom)
 */
const FACE_PRESETS: { x: number; y: number }[] = [
  { x: -Math.PI / 2, y: 0 }, // top
  { x: 0, y: 0 }, // front
  { x: 0, y: -Math.PI / 2 }, // right
  { x: 0, y: -Math.PI }, // back
  { x: 0, y: -3 * Math.PI / 2 }, // left
  { x: Math.PI / 2, y: 0 }, // bottom
];

const INITIAL_FACE_INDEX = 1; // Face 2 (front)

/**
 * Helper : renvoie l'index du preset le plus proche d'une rotation donnée
 */
function getClosestFaceIndex(x: number, y: number): number {
  let bestIndex = INITIAL_FACE_INDEX;
  let bestScore = Infinity;
  FACE_PRESETS.forEach((preset, index) => {
    const dx = x - preset.x;
    const dy = y - preset.y;
    const score = dx * dx + dy * dy;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
}

type CubeMeshProps = {
  textures: (string | null)[];
  initialFaceIndex: number;
  onFaceChange?: (index: number) => void;
};

function CubeMesh({ textures, initialFaceIndex, onFaceChange }: CubeMeshProps) {
  const meshRef = useRef<any>(null);

  // Rotation "cible" (vers laquelle on lerp)
  const [targetRotation, setTargetRotation] = useState(() => ({
    x: FACE_PRESETS[initialFaceIndex]?.x ?? 0,
    y: FACE_PRESETS[initialFaceIndex]?.y ?? 0,
  }));

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const startRotation = useRef<{ x: number; y: number } | null>(null);

  // Charge les 6 textures (ou undefined)
  const loadedTextures = useTexture(
    textures.map((url) => url || "")
  ) as (THREE.Texture | null)[];

  // Petite sécurité : si url vide, on ne met pas de texture
  loadedTextures.forEach((tex, i) => {
    if (!textures[i] && tex) {
      tex.dispose();
    }
  });

  useFrame(() => {
    if (!meshRef.current) return;

    // Lerp doux vers targetRotation
    const speed = 0.15;
    meshRef.current.rotation.x +=
      (targetRotation.x - meshRef.current.rotation.x) * speed;
    meshRef.current.rotation.y +=
      (targetRotation.y - meshRef.current.rotation.y) * speed;
  });

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    if (meshRef.current) {
      startRotation.current = {
        x: meshRef.current.rotation.x,
        y: meshRef.current.rotation.y,
      };
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStart.current || !startRotation.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const factor = 0.01; // sensibilité

    const nextX = startRotation.current.x - dy * factor;
    const nextY = startRotation.current.y + dx * factor;

    setTargetRotation({ x: nextX, y: nextY });
  }

  function handlePointerUp() {
    if (!meshRef.current) {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);

    // Snap sur la face la plus proche
    const snappedIndex = getClosestFaceIndex(
      meshRef.current.rotation.x,
      meshRef.current.rotation.y,
    );
    const preset = FACE_PRESETS[snappedIndex] ?? { x: 0, y: 0 };

    setTargetRotation(preset);
    onFaceChange?.(snappedIndex);
  }

  // Taille du cube
  const size = 1.8;

  // Ordre matériaux boxGeometry :
  // matériau-0: right
  // matériau-1: left
  // matériau-2: top
  // matériau-3: bottom
  // matériau-4: front
  // matériau-5: back
  const materials = useMemo(() => {
    const [face1, face2, face3, face4, face5, face6] = textures;

    const tex = loadedTextures;

    const mat = [
      tex[2] || null, // right  -> ex: face 3
      tex[4] || null, // left   -> face 5
      tex[0] || null, // top    -> face 1
      tex[5] || null, // bottom -> face 6
      tex[1] || null, // front  -> face 2
      tex[3] || null, // back   -> face 4
    ];

    return mat.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          map: texture || undefined,
          color: texture ? undefined : "#111827",
        }),
    );
  }, [loadedTextures, textures]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[440px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* halo */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_75%)]" />

      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        className="rounded-3xl bg-slate-950/95"
      >
        {/* Lumière douce */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.7} />
        <directionalLight position={[-4, -2, -3]} intensity={0.3} />

        {/* Cube */}
        <mesh ref={meshRef}>
          <boxGeometry args={[size, size, size]} />
          {materials.map((mat, i) => (
            <primitive key={i} attach={`material-${i}`} object={mat} />
          ))}
        </mesh>

        {/* Controls orbit pour zoom / rotation douce au doigt
            (on peut les limiter si besoin) */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={false} // on garde notre drag à nous
          minDistance={3}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
}

export function MagicDisplayCube3D(props: MagicDisplayCube3DProps) {
  const {
    faces,
    initialFaceIndex = INITIAL_FACE_INDEX,
    onFaceChange,
    getFaceMainPhotoUrl,
  } = props;

  const facesForCube: PreviewFace[] =
    faces.length >= 6
      ? faces.slice(0, 6)
      : Array.from({ length: 6 }, (_, i) => faces[i % faces.length]);

  const textures = useMemo(
    () => facesForCube.map((f) => getFaceMainPhotoUrl(f)),
    [facesForCube, getFaceMainPhotoUrl],
  );

  return (
    <CubeMesh
      textures={textures}
      initialFaceIndex={initialFaceIndex}
      onFaceChange={onFaceChange}
    />
  );
}
