"use client";

import Link from "next/link";
import { useState } from "react";

type CreateMode = "picture" | "display";

export default function CreatePage() {
  const [mode, setMode] = useState<CreateMode>("picture");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Header principal */}
      <header className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          Créer · Magic Clock
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Choisis comment tu veux créer
        </h1>
        <p className="text-sm text-slate-600">
          Comme sur TikTok ou Instagram, tu démarres en un geste&nbsp;: soit tu
          montres le <span className="font-semibold">résultat</span> (Avant / Après),
          soit tu expliques la <span className="font-semibold">méthode</span> (Cube 3D).
        </p>
      </header>

      {/* Barre de mode – comme un switch Reels / Story */}
      <section className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
        <div className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode("picture")}
            className={`flex-1 rounded-2xl px-3 py-2 transition ${
              mode === "picture"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            ✨ Magic Picture
          </button>
          <button
            type="button"
            onClick={() => setMode("display")}
            className={`flex-1 rounded-2xl px-3 py-2 transition ${
              mode === "display"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            🧠 Magic Display
          </button>
        </div>

        {/* CTA direct – style bouton “Suivant” TikTok/Instagram */}
        <div className="ml-3 hidden sm:block">
          {mode === "picture" ? (
            <Link
              href="/magic-studio"
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 shadow-sm hover:bg-slate-800"
            >
              Continuer vers Magic Picture
            </Link>
          ) : (
            <Link
              href="/magic-display"
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 shadow-sm hover:bg-slate-800"
            >
              Continuer vers Magic Display
            </Link>
          )}
        </div>
      </section>

      {/* Zone principale – inspirée “écran de création” TikTok / Reels */}
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:p-6">
        {/* Colonne gauche : “preview mobile” + explication courte */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-80 w-40 rounded-[2.4rem] border border-slate-200 bg-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.4)]">
            {/* Encoche haut */}
            <div className="absolute inset-x-10 top-2 mx-auto h-1.5 rounded-full bg-slate-700" />
            {/* Contenu “écran” */}
            <div className="absolute inset-4 rounded-[2rem] bg-slate-950/90 p-2 text-[11px] text-slate-100">
              {mode === "picture" ? (
                <div className="flex h-full flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Magic Picture
                    </p>
                    <p className="text-xs font-semibold">
                      Avant / Après en un écran
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Comme la caméra TikTok&nbsp;: tu captures ton résultat,
                      puis tu ajoutes texte et détails en quelques gestes.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex h-20 w-full gap-1 rounded-xl bg-slate-800/80 p-1">
                      <div className="flex-1 rounded-lg bg-slate-600/70" />
                      <div className="flex-1 rounded-lg bg-slate-500/70" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Avant</span>
                      <span>Après</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Magic Display
                    </p>
                    <p className="text-xs font-semibold">
                      Cube 3D pédagogique
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Comme l&apos;éditeur Reels&nbsp;: tu construis face par face,
                      en gardant une vue claire de ton parcours étape par étape.
                    </p>
                  </div>
                  <div className="flex h-20 w-full items-center justify-center">
                    <div className="relative h-16 w-16 [perspective:700px]">
                      <div className="absolute inset-0 [transform-style:preserve-3d] rotate-x-[-18deg] rotate-y-[28deg]">
                        <div className="absolute inset-2 rounded-xl border border-violet-300/60 bg-violet-500/60" />
                        <div className="absolute inset-2 rotate-y-90 translate-z-[1.85rem] rounded-xl border border-sky-300/60 bg-sky-500/60" />
                        <div className="absolute inset-2 -rotate-x-90 translate-z-[1.85rem] rounded-xl border border-emerald-300/60 bg-emerald-500/60" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="max-w-xs text-center text-[11px] text-slate-500">
            Cette vue te montre à quoi ressemble l&apos;écran principal. Tu peux
            changer de mode à tout moment, exactement comme tu switches entre
            Story / Reel / Live.
          </p>
        </div>

        {/* Colonne droite : avantages + actions rapides */}
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-3">
            {mode === "picture" ? (
              <>
                <h2 className="text-sm font-semibold text-slate-900">
                  Magic Picture · Montrer le résultat
                </h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>
                    • Capture rapide du <span className="font-medium">Avant / Après</span> –
                    comme filmer un Reel.
                  </li>
                  <li>
                    • Interface épurée, boutons principaux regroupés 
                    <span className="font-medium"> sous le pouce</span>.
                  </li>
                  <li>
                    • Idéal pour l&apos;impact visuel immédiat sur le flux Amazing.
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h2 className="text-sm font-semibold text-slate-900">
                  Magic Display · Expliquer la méthode
                </h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>
                    • Cube 3D avec <span className="font-medium">faces 1–6</span> pour structurer ton protocole.
                  </li>
                  <li>
                    • Boutons clés regroupés sur le côté, 
                    comme les outils créateur TikTok / Reels.
                  </li>
                  <li>
                    • Parfait pour transformer ton savoir-faire en pédagogie.
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 text-xs text-slate-500">
            <div className="flex flex-wrap gap-2">
              {mode === "picture" ? (
                <>
                  <Link
                    href="/magic-studio"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 shadow-sm hover:bg-slate-800"
                  >
                    Démarrer un Magic Picture
                  </Link>
                  <Link
                    href="/magic-display"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Aller au Magic Display
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/magic-display"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 shadow-sm hover:bg-slate-800"
                  >
                    Démarrer un Magic Display
                  </Link>
                  <Link
                    href="/magic-studio"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Aller au Magic Picture
                  </Link>
                </>
              )}
            </div>
            <p className="text-[11px]">
              Tu pourras lier ton Magic Picture à un Magic Display plus tard,
              comme un Reel relié à un tutoriel détaillé.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
