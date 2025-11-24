// app/studio/page.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, Hash } from "lucide-react";

type MediaKind = "image" | "video";

type MediaState = {
  kind: MediaKind | null;
  url: string | null;
};

export default function MagicStudioPage() {
  const [before, setBefore] = useState<MediaState>({ kind: null, url: null });
  const [after, setAfter] = useState<MediaState>({ kind: null, url: null });
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");

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
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            {/* AVANT */}
            <button
              type="button"
              className="relative aspect-[3/4] w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              onClick={() => beforeInputRef.current?.click()}
            >
              <span className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                AVANT
              </span>
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
                  <span className="text-[10px] text-slate-400">
                    Appuie pour choisir un fichier
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
              <span className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                APRÈS
              </span>
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
                  <span className="text-[10px] text-slate-400">
                    Appuie pour choisir un fichier
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
        </div>
      </section>

      <section className="space-y-1">
        <p className="text-[11px] text-slate-500">
          MVP : le bouton de publication (FREE / Abonnement / PPV) sera ajouté
          ici pour envoyer ce Magic Studio dans Amazing et le lier à un Magic
          Display.
        </p>
      </section>
    </main>
  );
}
