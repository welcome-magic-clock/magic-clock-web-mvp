"use client";

import {
  MessageCircle,
  Bell,
  User2,
  BarChart3,
  Sparkles,
  Unlock,
  Scale,
} from "lucide-react";

type MyMagicTab = {
  id: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
};

const TABS: MyMagicTab[] = [
  {
    id: "messages",
    icon: MessageCircle,
    gradient: "from-sky-400 via-sky-500 to-indigo-500",
  },
  {
    id: "notifications",
    icon: Bell,
    gradient: "from-amber-400 via-orange-500 to-pink-500",
  },
  {
    id: "profile",
    icon: User2,
    gradient: "from-emerald-400 via-teal-400 to-sky-400",
  },
  {
    id: "cockpit",
    icon: BarChart3,
    gradient: "from-violet-400 via-indigo-500 to-fuchsia-500",
  },
  {
    id: "created",
    icon: Sparkles,
    gradient: "from-sky-400 via-cyan-400 to-emerald-400",
  },
  {
    id: "unlocked",
    icon: Unlock,
    gradient: "from-lime-400 via-emerald-400 to-teal-400",
  },
  {
    id: "legal",
    icon: Scale,
    gradient: "from-slate-800 via-slate-900 to-slate-700",
  },
];

export function MyMagicToolbar() {
  return (
    <div className="rounded-[32px] border border-slate-100 bg-white/90 px-3 py-3 shadow-sm sm:px-4">
      <div className="flex items-center justify-between gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className="flex items-center justify-center"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full 
                  bg-gradient-to-br ${tab.gradient} text-white shadow-sm
                  transition-transform duration-150 ease-out
                  hover:scale-105 active:scale-95
                  sm:h-10 sm:w-10`}
              >
                <Icon className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
