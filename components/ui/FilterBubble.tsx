"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FilterBubbleTone = "indigo" | "emerald" | "sky" | "pink" | "slate";

type FilterBubbleProps = {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  tone?: FilterBubbleTone;
  onClick?: () => void;
};

const toneClasses: Record<FilterBubbleTone, string> = {
  indigo:
    "from-indigo-500 via-violet-500 to-sky-400 text-white",
  emerald:
    "from-emerald-500 via-teal-400 to-sky-400 text-white",
  sky:
    "from-sky-500 via-cyan-400 to-indigo-400 text-white",
  pink:
    "from-pink-500 via-rose-400 to-amber-400 text-white",
  slate:
    "from-slate-500 via-slate-400 to-slate-300 text-white",
};

export function FilterBubble({
  label,
  icon,
  active,
  tone = "indigo",
  onClick,
}: FilterBubbleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        active
          ? `bg-gradient-to-br ${toneClasses[tone]} shadow-md`
          : "bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"
      )}
    >
      <span className="flex items-center gap-1.5">
        {icon && <span className="text-[13px]">{icon}</span>}
        <span className="truncate max-w-[90px]">{label}</span>
      </span>
    </button>
  );
}
