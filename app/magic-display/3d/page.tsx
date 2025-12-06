// app/magic-display/3d/page.tsx
import { listCreators } from "@/core/domain/repository";
import MagicCube3D from "@/features/display/MagicCube3D";

export default function MagicDisplay3DPage() {
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const initials = currentCreator.name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const faceLabels = [
    "Face 1 – Diagnostic / point de départ",
    "Face 2 – Préparation / sectionnement",
    "Face 3 – Application principale",
    "Face 4 – Patine / correction",
    "Face 5 – Finition / coiffage",
    "Face 6 – Résultat / conseils maison",
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <header className="mb-6 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          Magic Display · Cube 3D expérimental
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

      <MagicCube3D
        faceLabels={faceLabels}
        avatarUrl={currentCreator.avatar}
        avatarInitials={initials}
      />
    </main>
  );
}
