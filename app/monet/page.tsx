// app/monet/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { listCreators } from "@/core/domain/repository";
import { RealMonetPanel } from "./RealMonetPanel";
import { SimMonetPanel } from "./SimMonetPanel";

// Typage léger du créateur (profil Aiko)
type CreatorLight = {
  name?: string;
  handle?: string;
  avatar?: string;
  followers?: number;
  likes?: number;
};

export default function MonetPage() {
  // ── Profil créateur : Aiko Tanaka depuis le repository
  const creators = listCreators() as CreatorLight[];
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const displayHandle =
    currentCreator && currentCreator.handle
      ? currentCreator.handle.startsWith("@")
        ? currentCreator.handle
        : `@${currentCreator.handle}`
      : "@magic_clock";

  // 🔀 Mode affiché : Réalité / Simulateur
  const [activeMode, setActiveMode] = useState<"real" | "sim">("real");

  return (
    <div className="container space-y-6 py-8">
      {/* HEADER AVEC AVATAR + TOGGLE */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Bloc avatar + nom */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
              {currentCreator?.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentCreator.avatar}
                  alt={currentCreator.name ?? "Créateur Magic Clock"}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500">
                Cockpit monétisation
              </span>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {currentCreator?.name ?? "Créateur Magic Clock"}
                </h1>
                <span className="text-xs text-slate-500">
                  {displayHandle}
                </span>
              </div>
            </div>
          </div>

         {/* Toggle Réalité / Simulateur – version compacte, gris clair */}
<div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
  <button
    type="button"
    onClick={() => setActiveMode("real")}
    className={`min-w-[70px] whitespace-nowrap rounded-full px-2.5 py-1 font-medium transition
      ${
        activeMode === "real"
          ? "bg-slate-200 text-slate-900 shadow-sm"
          : "bg-transparent text-slate-500"
      }`}
  >
    Réalité
  </button>
  <button
    type="button"
    onClick={() => setActiveMode("sim")}
    className={`min-w-[90px] whitespace-nowrap rounded-full px-2.5 py-1 font-medium transition
      ${
        activeMode === "sim"
          ? "bg-slate-200 text-slate-900 shadow-sm"
          : "bg-transparent text-slate-500"
      }`}
  >
    Simulateur
  </button>
</div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Monétisation</h2>
          <p className="text-sm text-slate-600">
            Comprends l&apos;impact de ton audience et simule ton potentiel avec
            Magic Clock (MODE FREE, abonnements + Pay-Per-View). Choisis entre{" "}
            <span className="font-semibold">Réalité</span> (données indicatives
            du compte) et{" "}
            <span className="font-semibold">Simulateur</span> (projections).
          </p>

          {/* Lien vers la page Prix & monétisation */}
          <div className="mb-1 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-slate-800 sm:text-sm">
            <p className="font-medium">Nouveau sur Magic Clock ?</p>
            <p>
              Tu peux utiliser Magic Clock en{" "}
              <span className="font-semibold">MODE FREE</span> sans monétiser,
              puis activer les modèles{" "}
              <span className="font-semibold">SUB / Pay-Per-View</span> quand tu
              es prêt. Découvre comment tout fonctionne sur la page{" "}
              <Link
                href="/pricing"
                className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-800"
              >
                Prix &amp; monétisation
              </Link>
              .
            </p>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL, SELON LE MODE */}
      {activeMode === "real" ? (
        <RealMonetPanel creator={currentCreator} />
      ) : (
        <SimMonetPanel creator={currentCreator} />
      )}
    </div>
  );
}
