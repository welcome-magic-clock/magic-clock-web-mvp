// components/create/CreateToolbar.tsx
"use client";

import React from "react";

export type CreateMode = "studio" | "display" | "projects";

type CreateToolbarProps = {
  mode: CreateMode;
  onChange: (mode: CreateMode) => void;
};

export default function CreateToolbar({ mode, onChange }: CreateToolbarProps) {
  const bubbles: {
    id: CreateMode;
    label: string;
    helper: string;
    gradient: string;
    renderIcon: () => React.ReactNode;
  }[] = [
    {
      id: "studio",
      label: "Magic Studio",
      helper: "Avant / Après",
      gradient:
        "bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-500 text-white",
      renderIcon: () => (
        <span className="text-[11px] font-semibold tracking-tight">MC</span>
      ),
    },
    {
      id: "display",
      label: "Magic Display",
      helper: "Cube pédagogique",
      gradient:
        "bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-500 text-white",
      renderIcon: () => (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path
            d="M12 3L5 7v10l7 4 7-4V7l-7-4z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M12 3L5 7l7 4 7-4-7-4z"
            fill="currentColor"
            opacity="0.7"
          />
          <path
            d="M5 7v10l7 4V11L5 7z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M19 7l-7 4v10l7-4V7z"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
      ),
    },
    {
      id: "projects",
      label: "Projets en cours",
      helper: "Brouillons (MVP)",
      gradient:
        "bg-gradient-to-br from-amber-400 via-pink-500 to-rose-500 text-white",
      renderIcon: () => (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
        >
          {/* petit bloc-notes */}
          <rect
            x="6"
            y="4"
            width="12"
            height="16"
            rx="2"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M9 8h6M9 12h6M9 16h3"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="
        sticky top-0 z-30 mb-4 border-b border-slate-100/60
        bg-slate-50/90 pb-3 pt-3 backdrop-blur
        px-4 sm:mx-0 sm:px-0
      "
    >
      <div className="flex flex-wrap gap-3">
        {bubbles.map((bubble) => {
          const isActive = mode === bubble.id;

          return (
            <button
              key={bubble.id}
              type="button"
              onClick={() => onChange(bubble.id)}
              className={`
                group flex items-center gap-2 rounded-full px-1.5 py-1
                transition
                ${isActive ? "bg-slate-900/5" : "hover:bg-slate-100"}
              `}
            >
              {/* Bulle ronde dégradée */}
              <span
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold shadow-sm
                  ${bubble.gradient}
                  ${isActive ? "ring-2 ring-slate-900/80 ring-offset-2 ring-offset-slate-50" : ""}
                `}
              >
                {bubble.renderIcon()}
              </span>

              {/* Texte à droite, comme dans Amazing / Meet me */}
              <span className="flex flex-col text-left">
                <span
                  className={`
                    text-xs sm:text-[13px] font-semibold
                    ${isActive ? "text-slate-900" : "text-slate-700"}
                  `}
                >
                  {bubble.label}
                </span>
                <span className="hidden text-[11px] text-slate-500 sm:inline">
                  {bubble.helper}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
