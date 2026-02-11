// features/display/ContentDisplayGate.tsx
"use client";

import { useState } from "react";
import type { Access as FeedAccess } from "@/core/domain/types";
import { ResultDisclaimerGate } from "@/components/legal/ResultDisclaimerGate";

type ContentDisplayGateProps = {
  mode: FeedAccess; // "FREE" | "ABO" | "PPV"
};

export function ContentDisplayGate({ mode }: ContentDisplayGateProps) {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <ResultDisclaimerGate
        mode={mode as "FREE" | "ABO" | "PPV"}
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  // Une fois débloqué : on montre ton placeholder “cube 3D”
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
      <p className="mb-1 font-medium text-slate-700">
        Magic Display débloqué ✅
      </p>
      <p>
        Dans la prochaine version, le cube 3D apparaîtra ici : rotation,
        faces pédagogiques, aiguilles et médias du Magic Clock.
      </p>
      <p className="mt-2">
        Pour l&apos;instant, cette zone sert de maquette pour le parcours
        d&apos;accès (FREE / Abonnement / PayPerView + disclaimer).
      </p>
    </div>
  );
}
