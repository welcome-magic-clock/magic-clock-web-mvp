// app/magic-clock-display/page.tsx

import { Suspense } from "react";
import MagicClockDisplayClient from "./MagicClockDisplayClient";

export default function MagicClockDisplayPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Chargement du Magic Display…
          </div>
        </main>
      }
    >
      <MagicClockDisplayClient />
    </Suspense>
  );
}
