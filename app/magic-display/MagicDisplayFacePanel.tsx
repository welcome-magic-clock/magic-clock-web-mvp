// app/magic-display/MagicDisplayFacePanel.tsx
"use client";

import { Camera, Clapperboard, FileText } from "lucide-react";
import type { Segment, MediaType } from "./magicDisplayTypes";

type Props = {
  segment: Segment;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNotesChange:       (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChooseMedia:       (type: MediaType) => void;
  onOpenDetail:        () => void;
};

export function MagicDisplayFacePanel({
  segment,
  onDescriptionChange,
  onNotesChange,
  onChooseMedia,
  onOpenDetail,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Colonne gauche : nom + description + notes */}
        <div className="space-y-2 sm:w-1/2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Face sélectionnée
          </p>
          <p className="text-sm font-semibold text-slate-900">{segment.label}</p>

          <textarea
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] text-slate-700 outline-none focus:border-brand-500 focus:ring-0"
            rows={1}
            maxLength={27}
            placeholder="Texte court de cette face (max. 27 caractères)"
            value={segment.description}
            onChange={onDescriptionChange}
          />

          <div className="space-y-1">
            <p className="text-[11px] font-medium text-slate-500">Notes pédagogiques</p>
            <textarea
              className="mt-0.5 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700 outline-none focus:border-brand-500 focus:bg-white focus:ring-0"
              rows={3}
              placeholder="Décris cette étape : produits, temps de pose, astuces, erreurs à éviter…"
              value={segment.notes ?? ""}
              onChange={onNotesChange}
            />
          </div>
        </div>

        {/* Colonne droite : boutons média */}
        <div className="mt-2 flex flex-wrap gap-2 sm:mt-6 sm:w-1/2 sm:justify-end">
          <button
            type="button"
            onClick={() => onChooseMedia("photo")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Ajouter une photo</span>
          </button>
          <button
            type="button"
            onClick={() => onChooseMedia("video")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
          >
            <Clapperboard className="h-3.5 w-3.5" />
            <span>Ajouter une vidéo</span>
          </button>
          <button
            type="button"
            onClick={() => onChooseMedia("file")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Ajouter un fichier</span>
          </button>
          <button
            type="button"
            onClick={onOpenDetail}
            className="inline-flex items-center gap-1 rounded-full border border-brand-500 bg-brand-50 px-3 py-1.5 text-[11px] font-medium text-brand-700 hover:bg-brand-100"
          >
            <span>Ouvrir la face en détail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
