// app/display/mcw-onboarding-bear-001/page.tsx

import type { Metadata } from "next";
import MagicDisplayPreviewShell from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";

export const metadata: Metadata = {
  title: "Magic Display – Bear Onboarding",
};

export default function BearOnboardingDisplayPage() {
  const display = DISPLAY_PRESETS["mcw-onboarding-bear-001"];

  if (!display) {
    // Sécurité au cas où le preset ne serait pas trouvé
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <p className="text-sm">
          Le preset <code>mcw-onboarding-bear-001</code> n&apos;est pas encore configuré.
        </p>
      </main>
    );
  }

  // 👉 Vue finale 3D (cube + cercle Aiko), 100 % lecture seule
  return <MagicDisplayPreviewShell display={display} />;
}
