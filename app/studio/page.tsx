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
  duration?: number | null;
  coverTime?: number | null;
};

type PublishMode = "FREE" | "SUB" | "PPV";
type Side = "before" | "after";
type Orientation = "vertical" | "horizontal";

export default function MagicStudioPage() {
  const router = useRouter();

  // Import médias
  const [before, setBefore] = useState<MediaState>({
    kind: null,
    url: null,
    duration: null,
    coverTime: null,
  });
  const [after, setAfter] = useState<MediaState>({
    kind: null,
    url: null,
    duration: null,
    coverTime: null,
  });

  // Titre & hashtags
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");

  // Mode de publication
  const [mode, setMode] = useState<PublishMode>("FREE");
  const [ppvPrice, setPpvPrice] = useState<number>(0.99);

  // Orientation du canevas
  const [orientation, setOrientation] = useState<Orientation>("vertical");

  // Sélection couverture vidéo
  const [selectingCoverFor, setSelectingCoverFor] = useState<Side | null>(null);

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  const beforeVideoRef = useRef<HTMLVideoElement | null>(null);
  const afterVideoRef = useRef<HTMLVideoElement | null>(null);

  // Avatar créateur (Aiko)
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];
  const avatar = currentCreator.avatar;

  function updateMedia(side: Side, updater: (prev: MediaState) => MediaState) {
    if (side === "before") {
      setBefore((prev) => updater(prev));
    } else {
      setAfter((prev) => updater(prev));
    }
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    side: Side
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const kind: MediaKind = file.type.startsWith("video") ? "video" : "image";

    const state: MediaState = { kind, url, duration: null, coverTime: null };
    if (side === "before") {
      setBefore(state);
    } else {
      setAfter(state);
    }
  }

  function handleLoadedMetadata(
    side: Side,
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) {
    const duration = event.currentTarget.duration || 0;
    updateMedia(side, (prev) => ({ ...prev, duration }));
  }

  // Passer à Magic Display
  function handleGoToDisplay() {
    router.push("/magic-display");
  }

  const modeLabel: string =
    mode === "FREE"
      ? "FREE"
      : mode === "SUB"
      ? "Abonnement"
      : "Pay Per View (PPV)";

  // === Couverture vidéo (MVP) ======================================

  function openCoverSelection(side: Side, event?: React.MouseEvent) {
    if (event) event.stopPropagation();
    const media = side === "before" ? before : after;
    if (media.kind !== "video" || !media.url) return;
    setSelectingCoverFor(side);
  }

  function currentMediaForCover(): {
    media: MediaState | null;
    videoRef: React.RefObject<HTMLVideoElement>;
  } {
    if (selectingCoverFor === "before") {
      return { media: before, videoRef: beforeVideoRef };
    }
    if (selectingCoverFor === "after") {
      return { media: after, videoRef: afterVideoRef };
    }
    return { media: null, videoRef: beforeVideoRef };
  }

  function handleCoverSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selectingCoverFor) return;
    const percent = Number(event.target.value);
    const { media, videoRef } = currentMediaForCover();
    if (!media || media.kind !== "video" || !media.duration || !videoRef.current)
      return;

    const time = (media.duration * percent) / 100;
    videoRef.current.currentTime = time;

    updateMedia(selectingCoverFor, (prev) => ({ ...prev, coverTime: time }));
  }

  const coverSliderValue = (() => {
    if (!selectingCoverFor) return 0;
    const { media } = currentMediaForCover();
    if (!media || !media.duration || !media.coverTime) return 0;
    return (media.coverTime / media.duration) * 100;
  })();

  // ================================================================

  const publishModes: { value: PublishMode; label: string }[] = [
    { value: "FREE", label: "FREE" },
    { value: "SUB", label: "Abonnement" },
    { value: "PPV", label: "PPV" },
  ];

  const aspectClass =
    orientation === "vertical" ? "aspect-[4/5]" : "aspect-[16/9]";

  const layoutGridClass =
    orientation === "vertical"
      ? "grid grid-cols-2 divide-x divide-slate-200"
      : "grid grid-rows-2 divide-y divide-slate-200";

  return (
    <main className="container max-w-4xl py-6 space-y-4">
      {/* Titre simple, sans texte explicatif */}
      <header>
        <h1 className="text-2xl font-semibold">
          Magic Studio — Avant / Après
        </h1>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6 space-y-4">
        {/* Choix du format du canevas : uniquement les boutons */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setOrientation("vertical")}
              className={`rounded-full px-3 py-1 transition ${
                orientation === "vertical"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Portrait
            </button>
            <button
              type="button"
              onClick={() => setOrientation("horizontal")}
              className={`rounded-full px-3 py-1 transition ${
                orientation === "horizontal"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Horizontal
            </button>
          </div>
        </div>

        {/* CANEVAS AVANT / APRÈS */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className={`relative mx-auto ${aspectClass} w-full max-w-xl`}>
            <div className={`absolute inset-0 ${layoutGridClass}`}>
              {/* AVANT */}
              <button
                type="button"
                className="relative flex h-full w-full flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                onClick={() => beforeInputRef.current?.click()}
              >
                {before.url ? (
                  before.kind === "video" ? (
                    <video
                      ref={beforeVideoRef}
                      src={before.url}
                      className="h-full w-full object-cover"
                      controls
                      onLoadedMetadata={(e) =>
                        handleLoadedMetadata("before", e)
                      }
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

                {before.kind === "video" && before.url && (
                  <button
                    type="button"
                    onClick={(e) => openCoverSelection("before", e)}
                    className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white shadow-sm"
                  >
                    Couverture
                  </button>
                )}
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
                      ref={afterVideoRef}
                      src={after.url}
                      className="h-full w-full object-cover"
                      controls
                      onLoadedMetadata={(e) =>
                        handleLoadedMetadata("after", e)
                      }
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

                {after.kind === "video" && after.url && (
                  <button
                    type="button"
                    onClick={(e) => openCoverSelection("after", e)}
                    className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white shadow-sm"
                  >
                    Couverture
                  </button>
                )}
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
        </div>

        {/* Panneau choix couverture vidéo */}
        {selectingCoverFor && (
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] text-slate-600">
            <p className="font-medium text-slate-700">
              Choisir la couverture vidéo (
              {selectingCoverFor === "before" ? "Avant" : "Après"})
            </p>
            <p>
              Fais glisser le curseur pour choisir l&apos;image qui servira de
              couverture dans le flux Amazing (MVP).
            </p>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={coverSliderValue}
                onChange={handleCoverSliderChange}
                className="flex-1 accent-brand-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setSelectingCoverFor(null)}
              className="mt-2 inline-flex rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-white"
            >
              Terminer le choix de couverture
            </button>
          </div>
        )}

        {/* TITRE, HASHTAGS & MODE SOUS LE CANEVAS */}
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

          {/* Mode de publication */}
          <div className="space-y-1 pt-1">
            <label className="text-xs font-medium text-slate-700">
              Mode de publication
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium">
                {publishModes.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMode(opt.value)}
                    className={`rounded-full px-3 py-1 transition ${
                      mode === opt.value
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                {mode === "FREE"
                  ? "Accessible à tous les utilisateurs."
                  : mode === "SUB"
                  ? "Réservé à tes abonnés payants."
                  : "Débloqué à l’achat pour chaque spectateur (PPV)."}
              </p>
            </div>
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
                  min={0.99}
                  max={999.99}
                  step={0.5}
                  value={ppvPrice}
                  onChange={(event) =>
                    setPpvPrice(Number(event.target.value))
                  }
                  className="flex-1 accent-brand-500"
                />
                <div className="w-20 text-right text-xs font-semibold text-slate-700">
                  {ppvPrice.toFixed(2)} CHF
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton flèche vers Magic Display, à l'intérieur de la carte */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGoToDisplay}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Passer à Magic Display"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
