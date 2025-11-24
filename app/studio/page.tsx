// app/studio/page.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, Hash, ArrowUpRight } from "lucide-react";

type MediaKind = "image" | "video";

type MediaState = {
  kind: MediaKind | null;
  url: string | null;
};

type PublishMode = "FREE" | "SUB" | "PPV";

export default function MagicStudioPage() {
  const [before, setBefore] = useState<MediaState>({ kind: null, url: null });
  const [after, setAfter] = useState<MediaState>({ kind: null, url: null });
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mode, setMode] = useState<PublishMode>("FREE");
  const [ppvPrice, setPpvPrice] = useState<number>(9.99);

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

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
    setMode((prev) => {
      if (prev === "FREE") return "SUB";
      if (prev === "SUB") return "PPV";
      return "FREE";
    });
  }

  const modeLabel =
    mode === "FREE" ? "FREE" : mode === "SUB" ? "Abonnement" : "PPV";

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
        {/* CANEVAS AVANT / APRÈS */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {/* Bouton flèche (mode de publication) */}
          <button
            type="button"
            onClick={cycleMode}
            className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Changer le mode de publication (FREE / Abonnement / PPV)"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>

          {/* Avatar au centre de la ligne de séparation */}
          <div className="pointer-events-none absolute inset-y-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
              <img
                src="/images/aiko_tanaka.jpg"
                alt="Aiko Tanaka"
                className="h-14 w-14 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-200">
            {/* AVANT */}
            <button
              type="button"
              className="relative aspect-[3/4] w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Avant
                  </span>
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
              className="relative aspect-[3/4] w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Après
                  </span>
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
        </div>

        {/* TITRE & HASHTAGS SOUS LE CANEVAS */}
        <div className="space-y-4">
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

          {/* Mode de publication + prix PPV */}
          <div className="space-y-2 text-[11px] text-slate-600">
            <p>
              Mode de publication actuel :{" "}
              <strong>{modeLabel}</strong> (appuie sur la flèche du canevas
              pour changer entre FREE / Abonnement / PPV).
            </p>
            {mode === "PPV" && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600">Prix PPV</span>
                <input
                  type="number"
                  min={0.99}
                  max={999}
                  step={0.5}
                  value={ppvPrice}
                  onChange={(e) =>
                    setPpvPrice(
                      Math.min(
                        999,
                        Math.max(0.99, Number(e.target.value) || 0.99)
                      )
                    )
                  }
                  className="w-28 rounded-full border border-slate-200 px-3 py-1 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <span className="text-slate-500">CHF / accès</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BOUTON DE PUBLICATION (MVP) */}
      <section className="space-y-2">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          Publier ce Magic Clock (MVP)
        </button>
        <p className="text-[11px] text-slate-500">
          MVP : ce bouton simulera la publication. À terme, ton Magic Studio
          sera envoyé dans le flux <strong>Amazing</strong> et apparaîtra aussi
          dans <strong>My Magic Clock → Mes Magic Clock créés</strong>. Le
          routing et la sauvegarde réelle seront branchés quand le backend sera
          prêt.
        </p>
      </section>
    </main>
  );
}
