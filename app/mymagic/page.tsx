// app/mymagic/page.tsx
import { Suspense } from "react";
import MyMagicClient from "./MyMagicClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-500">Chargement…</div>}>
      <MyMagicClient />
    </Suspense>
  );
}
