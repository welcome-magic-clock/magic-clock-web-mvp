// app/display/[id]/page.tsx
import { notFound } from "next/navigation";
import MagicDisplayViewer from "../MagicDisplayViewer";
import { ONBOARDING_MAGIC_CLOCK_WORK } from "@/core/domain/magicClockWork";

// ✅ params est une Promise en Next.js 15/16
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DisplayPage({ params }: PageProps) {
  const { id } = await params;

  // MVP : seul le Magic Clock d'onboarding est disponible
  // On accepte l'id ou le slug pour plus de flexibilité
  const isOnboarding =
    id === ONBOARDING_MAGIC_CLOCK_WORK.id ||
    id === ONBOARDING_MAGIC_CLOCK_WORK.slug;

  const contentId = isOnboarding ? ONBOARDING_MAGIC_CLOCK_WORK.id : id;

  // Si l'id n'existe pas du tout, 404 propre
  if (!id) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Magic Display
      </h1>
      <MagicDisplayViewer contentId={contentId} />
    </main>
  );
}
