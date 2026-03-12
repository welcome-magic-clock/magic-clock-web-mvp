// app/magic-display/MagicDisplayPublishBar.tsx
// v1.1 — Ajout publishError + toast visible
"use client";
import { AlertCircle, X } from "lucide-react";

type Props = {
  canPublish: boolean;
  isPublishing: boolean;
  clampedPercent: number;
  studioPartDisplay: number;
  displayPart: number;
  totalPercentDisplay: number;
  publishHelperText: string;
  publishError?: string | null;
  onPublish: () => void;
  onDismissError?: () => void;
};

export function MagicDisplayPublishBar({
  canPublish,
  isPublishing,
  clampedPercent,
  studioPartDisplay,
  displayPart,
  totalPercentDisplay,
  publishHelperText,
  publishError,
  onPublish,
  onDismissError,
}: Props) {
  return (
    <div className="mt-2 space-y-2">
      {/* ✅ Toast d'erreur visible — jamais silencieux */}
      {publishError && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="flex-1 text-[12px] font-medium leading-snug text-red-700">
            {publishError}
          </p>
          {onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              className="flex-shrink-0 text-red-400 hover:text-red-600"
              aria-label="Fermer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onPublish}
        disabled={!canPublish || isPublishing}
        className="flex w-full flex-col items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-slate-50 shadow-md shadow-slate-900/40 transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="whitespace-nowrap">
          {isPublishing
            ? "Publication en cours…"
            : "Publier sur Amazing + My Magic Clock"}
        </span>
        <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-slate-700/40">
          <div
            className="h-full rounded-full bg-emerald-400 transition-[width]"
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
      </button>

      <div className="mt-2 text-[11px] text-slate-500">
        <p>{publishHelperText}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">
          Studio : {studioPartDisplay}% · Display (Face + Segment) :{" "}
          {displayPart}% · Total : {Math.round(totalPercentDisplay)}%
        </p>
      </div>
    </div>
  );
}
