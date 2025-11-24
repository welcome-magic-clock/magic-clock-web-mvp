// app/studio/page.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, Hash, ArrowUpRight } from "lucide-react";
import { listCreators } from "@/core/domain/repository";

type MediaKind = "image" | "video";

type MediaState = {
  kind: MediaKind | null;
  url: string | null;
};

const PUBLISH_MODES = ["FREE", "Abonnement", "PPV"] as const;
type PublishMode = (typeof PUBLISH_MODES)[number];

export default function MagicStudioPage() {
  const [before, setBefore] = useState<MediaState>({ kind: null, url: null });
  const [after, setAfter] = useState<MediaState>({ kind: null, url: null });
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [publishModeIndex, setPublishModeIndex] = useState<number>(1); // 0=FREE, 1=Abonnement, 2=PPV

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  // On réutilise Aiko Tanaka comme créatrice actuelle (avatar au centre du canevas)
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];
  const avatar = currentCreator?.avatar ?? "/images/sample1.jpg";

  const currentMode: PublishMode = PUBLISH_MODES[publishModeIndex];

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

  function cyclePublishMode() {
    setPublishModeIndex((prev) => (prev + 1) % PUBLISH_MODES.length);
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
          {/* Bouton mode de publication (flèche simple) */}
          <button
            type="button"
            onClick={cyclePublishMode}
            className="absolute right-4 top-4 z-20 p-1 text-white shadow-[0_0_8px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Changer le mode de publication"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>

          {/* Avatar au centre de la ligne verticale (fait partie du canevas) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg">
              <img
                src={avatar}
                alt={currentCreator.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-200">
            {/* AVANT */}
            <button
              type="button"
              className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                    AVANT
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
              className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                    APRÈS
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

        {/* INFO MODE PUBLICATION */}
        <div className="space-y-1 pt-1">
          <p className="text-[11px] text-slate-500">
            Mode de publication actuel :{" "}
            <span className="font-semibold">{currentMode}</span> (appuie sur la
            flèche du canevas pour changer entre FREE / Abonnement / PPV).
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <button
          type="button"
          className="w-full rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          Publier ce Magic Clock (MVP)
        </button>
        <p className="text-[11px] text-slate-500">
          MVP : ce bouton simulera la publication. À terme, ton Magic Studio
          sera envoyé dans le flux <span className="font-semibold">Amazing</span>{" "}
          et apparaîtra aussi dans{" "}
          <span className="font-semibold">
            My Magic Clock → Mes Magic Clock créés
          </span>
          . Le routing et la sauvegarde réelle seront branchés quand le backend
          sera prêt.
        </p>
      </section>
    </main>
  );
}
