"use client";

import { useState } from "react";

type SegmentStatus = "empty" | "in-progress" | "complete";

type Segment = {
  id: number;
  label: string;
  status: SegmentStatus;
};

const INITIAL_SEGMENTS: Segment[] = [
  { id: 1, label: "Diagnostic / observation", status: "empty" },
  { id: 2, label: "Préparation / sectionnement", status: "empty" },
  { id: 3, label: "Application principale", status: "empty" },
  { id: 4, label: "Patine / correction", status: "empty" },
];

const positionClasses = [
  "top-3 left-1/2 -translate-x-1/2",          // segment 1
  "top-1/2 right-3 -translate-y-1/2",         // segment 2
  "bottom-3 left-1/2 -translate-x-1/2",       // segment 3
  "top-1/2 left-3 -translate-y-1/2",          // segment 4
];

const statusDotClass = (status: SegmentStatus) => {
  if (status === "complete") return "bg-emerald-500";
  if (status === "in-progress") return "bg-amber-400";
  return "bg-slate-300";
};

const segmentIcon = (status: SegmentStatus) => {
  if (status === "complete") return "🎬";
  if (status === "in-progress") return "✏️";
  return "＋";
};

export default function MagicDisplayFaceEditor() {
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [selectedId, setSelectedId] = useState<number>(INITIAL_SEGMENTS[0].id);

  const selectedSegment =
    segments.find((s) => s.id === selectedId) ?? INITIAL_SEGMENTS[0];

  function markSegmentComplete() {
    setSegments((prev) =>
      prev.map((s) =>
        s.id === selectedId ? { ...s, status: "complete" } : s
      )
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
      {/* En-tête face */}
      <header className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            Magic Display · Face 1 / 6
          </p>
          <h2 className="text-lg font-semibold sm:text-xl">
            Face universelle – Étapes pédagogiques
          </h2>
          <p className="text-xs text-slate-500">
            Chaque point autour du cercle est un segment (chapitre) de cette
            face : diagnostic, application, patine, etc.
          </p>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 sm:mt-0">
          Prototype frontal : aucune donnée n&apos;est encore sauvegardée.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        {/* Cercle principal */}
        <div className="flex items-center justify-center">
          <div className="relative h-64 w-64 max-w-full">
            {/* Halo */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(241,245,249,0.45),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(129,140,248,0.45),transparent_55%)]" />
            {/* Disque principal */}
            <div className="absolute inset-4 rounded-full border border-slate-200 bg-[radial-gradient(circle_at_30%_20%,#f9fafb,#e5e7eb)] shadow-inner" />
            {/* Anneau interne */}
            <div className="absolute inset-16 rounded-full border border-slate-300/70" />

            {/* Noyau central = avatar créateur simplifié */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/90 text-[10px] font-semibold leading-tight text-slate-50 shadow-[0_0_18px_rgba(15,23,42,0.6)]">
                AT
              </div>
            </div>

            {/* Points de segments */}
            {segments.map((seg, index) => {
              const isSelected = seg.id === selectedId;
              const pos =
                positionClasses[index] ?? "top-1/2 left-1/2 -translate-x-1/2";
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedId(seg.id)}
                  className={`absolute ${pos} flex h-10 w-10 items-center justify-center rounded-full border text-xs backdrop-blur-sm transition
                    ${
                      isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                        : "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400"
                    }`}
                >
                  <span>{segmentIcon(seg.status)}</span>
                  <span
                    className={`absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border border-white ${statusDotClass(
                      seg.status
                    )}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste des segments + détail du segment sélectionné */}
        <div className="space-y-4">
          {/* Liste */}
          <div className="space-y-2">
            {segments.map((seg) => {
              const isSelected = seg.id === selectedId;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedId(seg.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition
                    ${
                      isSelected
                        ? "border-brand-500 bg-brand-50/70"
                        : "border-transparent bg-slate-50 hover:border-slate-200"
                    }`}
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      Segment {seg.id} – {seg.label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Chapitre de cette face (diagnostic, application, etc.).
                    </p>
                  </div>
                  <span
                    className={`ml-2 inline-flex h-2.5 w-2.5 rounded-full ${statusDotClass(
                      seg.status
                    )}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Détail segment sélectionné */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Segment {selectedSegment.id} – {selectedSegment.label}
              </p>
              <p className="text-[11px] text-slate-500">
                Ajoute un média et des notes pour expliquer précisément cette
                étape.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={markSegmentComplete}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                📷 Ajouter une photo
              </button>
              <button
                type="button"
                onClick={markSegmentComplete}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                🎬 Ajouter une vidéo
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                Notes pédagogiques
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none ring-0 focus:border-brand-500"
                placeholder="Décris cette étape : produits, temps de pose, astuces, erreurs à éviter…"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              MVP local : les données ne sont pas encore enregistrées. Cette
              vue sert à valider l&apos;UX de la face universelle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
