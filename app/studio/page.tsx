// app/studio/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Hash, ArrowUpRight } from "lucide-react";
import { listCreators } from "@/core/domain/repository";

type MediaKind = "image" | "video";

type MediaState = {
  kind: MediaKind | null;
  url: string | null;
};

type PublishMode = "FREE" | "SUB" | "PPV";

export default function MagicStudioPage() {
  const router = useRouter();

  // Import médias
  const [before, setBefore] = useState<MediaState>({ kind: null, url: null });
  const [after, setAfter] = useState<MediaState>({ kind: null, url: null });

  // Titre & hashtags
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");

  // Mode de publication
  const [mode, setMode] = useState<PublishMode>("FREE");
  const [ppvPrice, setPpvPrice] = useState<number>(9); // prix indicatif pour PPV

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  // Avatar créateur (Aiko)
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    side: "before" | "after"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const kind: MediaKind = file.type.startsWith("video") ? "video" : "image";

    const state: MediaState = { kind, url };

    if (side === "before") {
      setBefore(state);
    } else {
      setAfter(state);
    }
  }

  function cycleMode() {
    setMode((prev) =>
      prev === "FREE" ? "SUB" : prev === "SUB" ? "PPV" : "FREE"
    );
  }

  function handlePublishClick() {
    // MVP : on simule la publication et on renvoie vers My Magic Clock
    router.push("/mymagic");
  }

  const modeLabel =
    mode === "FREE"
      ? "FREE"
      : mode === "SUB"
      ? "Abonnement"
      : "Pay Per View (PPV)";

  return (
    <main className="container max-w-4xl py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Magic Studio — Avant / Après</h1>
        <p className="text-sm text-slate-600">
          Crée ta vitrine : importe ton Avant / Après directement sur le
          canevas, ajoute un titre et tes hashtags. Le Magic Display
          pédagogique sera connecté plus tard.
        </p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6 space-y-4">
        {/* CANEVAS AVANT / APRÈS (même ratio visuel que dans Amazing) */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
            {/* Grille 2 colonnes qui remplit tout le canevas */}
            <div className="absolute inset-0 grid grid-cols-2 divide-x divide-slate-200">
              {/* AVANT */}
              <button
                type="button"
                className="relative flex h-full w-full flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                onClick={() => beforeInputRef.current?.click()}
              >
                {before.url ? (
                  before.kind === "video" ? (
                    <video
                      src={before.url}
                      className="h-full w-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={before.url}
                      alt="Avant"
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                    <Upload className="h-6 w-6" />
                    <span>Importer photo / vidéo</span>
                    <span className="text-[10px] text-slate-400">AVANT</span>
                  </div>
                )}
                <input
                  ref={beforeInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => handleFileChange(event, "before")}
                />
              </button>

              {/* APRÈS */}
              <button
                type="button"
                className="relative flex h-full w-full flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                onClick={() => afterInputRef.current?.click()}
              >
                {after.url ? (
                  after.kind === "video" ? (
                    <video
                      src={after.url}
                      className="h-full w-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={after.url}
                      alt="Après"
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                    <Upload className="h-6 w-6" />
                    <span>Importer photo / vidéo</span>
                    <span className="text-[10px] text-slate-400">APRÈS</span>
                  </div>
                )}
                <input
                  ref={afterInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => handleFileChange(event, "after")}
                />
              </button>
            </div>

            {/* Avatar centre */}
<div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 shadow-sm">
  <img
    src={avatar}
    alt={currentCreator.name}
    className="h-[72px] w-[72px] rounded-full object-cover"
  />
</div>
            </div>

            {/* Flèche pour changer FREE / Abonnement / PPV */}
            <button
              type="button"
              onClick={cycleMode}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/85 text-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Changer le mode de publication"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* TITRE & HASHTAGS SOUS LE CANEVAS */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Titre du Magic Clock
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Balayage caramel lumineux, cheveux longs"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-medium text-slate-700">
              <Hash className="h-3 w-3" />
              Hashtags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(event) => setHashtags(event.target.value)}
              placeholder="#balayage #cheveuxblonds #magicclock"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <p className="text-[11px] text-slate-500">
              Les hashtags s&apos;afficheront en bas de la carte dans le flux
              Amazing (MVP).
            </p>
          </div>

          {/* Sélecteur de prix PPV */}
          {mode === "PPV" && (
            <div className="space-y-1 pt-2">
              <label className="text-xs font-medium text-slate-700">
                Prix Pay Per View (PPV)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={200}
                  step={1}
                  value={ppvPrice}
                  onChange={(event) =>
                    setPpvPrice(Number(event.target.value))
                  }
                  className="flex-1 accent-brand-500"
                />
                <div className="w-16 text-right text-xs font-semibold text-slate-700">
                  {ppvPrice.toFixed(0)}$
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                MVP : le prix est indicatif, la facturation réelle sera gérée
                par le module Monétisation.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] text-slate-500">
          Mode de publication actuel :{" "}
          <span className="font-semibold">{modeLabel}</span>{" "}
          (appuie sur la flèche du canevas pour changer entre FREE /
          Abonnement / PPV).
        </p>

        <button
          type="button"
          onClick={handlePublishClick}
          className="mt-1 w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          Publier ce Magic Clock (MVP)
        </button>

        <p className="text-[11px] text-slate-500">
          MVP : ce bouton simule la publication. À terme, ton Magic Studio sera
          envoyé dans le flux <span className="font-semibold">Amazing</span> et
          apparaîtra aussi dans{" "}
          <span className="font-semibold">My Magic Clock → Mes Magic Clock</span>{" "}
          créés. Le routing et la sauvegarde réelle seront branchés quand le
          backend sera prêt.
        </p>
      </section>
    </main>
  );
}
