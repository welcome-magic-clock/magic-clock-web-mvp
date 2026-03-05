// app/magic-display/MagicDisplayPublishBar.tsx
"use client";

type Props = {
  canPublish:          boolean;
  isPublishing:        boolean;
  clampedPercent:      number;
  studioPartDisplay:   number;
  displayPart:         number;
  totalPercentDisplay: number;
  publishHelperText:   string;
  onPublish:           () => void;
};

export function MagicDisplayPublishBar({
  canPublish,
  isPublishing,
  clampedPercent,
  studioPartDisplay,
  displayPart,
  totalPercentDisplay,
  publishHelperText,
  onPublish,
}: Props) {
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onPublish}
        disabled={!canPublish || isPublishing}
        className="flex w-full flex-col items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-slate-50 shadow-md shadow-slate-900/40 transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="whitespace-nowrap">
          {isPublishing ? "Publication en cours…" : "Publier sur Amazing + My Magic Clock"}
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
          Studio : {studioPartDisplay}% · Display (Face + Segment) : {displayPart}% · Total : {Math.round(totalPercentDisplay)}%
        </p>
      </div>
    </div>
  );
}
