import { listCreators } from "@/core/domain/repository";
import MagicDisplayFaceEditor from "@/features/display/MagicDisplayFaceEditor";

export default function MagicDisplayPage() {
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const initials = currentCreator.name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <header className="mb-6 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          Magic Display · Prototype face universelle v1
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Éditeur de face Magic Clock
        </h1>
        <p className="text-sm text-slate-600">
          Chaque face représente un chapitre de ton Magic Clock : diagnostic,
          application, patine ou routine maison. Cette version est un prototype
          purement frontal pour valider l&apos;expérience.
        </p>
      </header>

      <MagicDisplayFaceEditor
        creatorName={currentCreator.name}
        creatorAvatar={currentCreator.avatar}
        creatorInitials={initials}
      />
    </main>
  );
}
