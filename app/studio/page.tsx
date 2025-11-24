// app/studio/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Hash } from "lucide-react";
import { listCreators } from "@/core/domain/repository";

type MediaKind = "image" | "video";

type MediaState = {
  kind: MediaKind | null;
  url: string | null;
};

type AccessMode = "MEET" | "FREE" | "SUB" | "PPV";

const ABO_PRICE_MVP = 14.9; // 💡 En vrai : viendra du cockpit Monétisation

export default function MagicStudioPage() {
  const router = useRouter();

  const [before, setBefore] = useState<MediaState>({ kind: null, url: null });
  const [after, setAfter] = useState<MediaState>({ kind: null, url: null });
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [accessMode, setAccessMode] = useState<AccessMode>("FREE");
  const [ppvPrice, setPpvPrice] = useState<string>("9.99");

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  // On réutilise Aiko Tanaka comme créatrice par défaut
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];
  const avatar = currentCreator?.avatar;

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

  function handlePublish() {
    // 🔮 MVP : pas encore de backend → on simule juste la suite
    console.log("Publier Magic Clock", {
      title,
      hashtags,
      accessMode,
      ppvPrice,
      before,
      after,
    });

    // Redirection MVP vers My Magic Clock
    router.push("/mymagic");
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
          {/* Sélecteur d'accès en haut à droite */}
          <div className="absolute right-3 top-3 z-10">
            <label htmlFor="accessMode" className="sr-only">
              Type d&apos;accès
            </label>
            <div className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white">
              <select
                id="accessMode"
                value={accessMode}
                onChange={(e) =>
                  setAccessMode(e.target.value as AccessMode)
                }
                className="bg-transparent text-[10px] font-medium focus:outline-none"
              >
                <option value="MEET">Meet me</option>
                <option value="FREE">FREE</option>
                <option value="SUB">Abonnement</option>
                <option value="PPV">Pay Per View</option>
              </select>
            </div>
          </div>

          {/* Avatar au centre de la ligne de séparation */}
          {avatar && (
            <div className="pointer-events-none absolute inset-y-0 left-1/2 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-white shadow-md flex items-center justify-center">
                <img
                  src={avatar}
                  alt={currentCreator.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
            </div>
          )}

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

        {/* TITRE / HASHTAGS / TARIFICATION */}
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

          {/* Tarification selon le mode d'accès */}
          {accessMode === "PPV" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Prix du Pay Per View (TTC)
              </label>
              <input
                type="number"
                min={0.99}
                max={999}
                step={0.5}
                value={ppvPrice}
                onChange={(e) => setPpvPrice(e.target.value)}
                className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-500">
                Ce prix sera appliqué à ce Magic Clock lorsqu&apos;il sera
                débloqué en PPV.
              </p>
            </div>
          )}

          {accessMode === "SUB" && (
            <p className="text-[11px] text-slate-500">
              Abonnement : prix actuel estimé{" "}
              <span className="font-semibold">
                CHF {ABO_PRICE_MVP.toFixed(2)} / mois
              </span>{" "}
              (réglé dans ton cockpit Monétisation).
            </p>
          )}
        </div>
      </section>

      {/* PUBLICATION */}
      <section className="space-y-3">
        <button
          type="button"
          onClick={handlePublish}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
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
