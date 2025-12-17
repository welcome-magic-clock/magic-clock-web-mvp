// app/display/[id]/page.tsx

import Link from "next/link";
import MagicDisplayViewer from "../MagicDisplayViewer";

type PageProps = {
  params: { id: string };
};

export default function MagicDisplayPage({ params }: PageProps) {
  const rawId = params.id;

  const isOnboardingBear = rawId === "mcw-onboarding-bear-001";

  const title = isOnboardingBear
    ? "Magic Display · Magic Clock (Onboarding)"
    : "Magic Display (MVP)";

  const subtitle = isOnboardingBear
    ? "Version MVP : ce Magic Display raconte les 6 faces du Magic Clock d’onboarding (notre ours 🐻). Les Magic Display des autres contenus arrivent ensuite."
    : "MVP : visualisation pédagogique liée à ce Magic Clock. Les versions détaillées (faces, aiguilles, formules) arrivent dans la prochaine étape.";

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      <Link
        href="/mymagic"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        ← Retour à My Magic Clock
      </Link>

      <section className="mt-4 space-y-4">
        <header>
          <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </header>

        {/* On passe directement l'id brut au viewer */}
        <MagicDisplayViewer contentId={rawId} />
      </section>
    </main>
  );
}
