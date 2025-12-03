// components/mymagic/MyMagicToolbar.tsx
"use client";

import {
  MessageCircle,
  Bell,
  UserRound,
  BarChart3,
  Sparkles,
  Unlock,
  Scale,
} from "lucide-react";

type MyMagicTab = {
  id: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className: string;
};

const MY_MAGIC_TABS: MyMagicTab[] = [
  {
    id: "messages",
    icon: MessageCircle,
    className: "from-sky-400 via-indigo-500 to-violet-500",
  },
  {
    id: "notifications",
    icon: Bell,
    className: "from-amber-400 via-orange-500 to-pink-500",
  },
  {
    id: "profile",
    icon: UserRound,
    className: "from-emerald-400 via-teal-400 to-sky-400",
  },
  {
    id: "cockpit",
    icon: BarChart3,
    className: "from-violet-500 via-purple-500 to-sky-500",
  },
  {
    id: "magic-created",
    icon: Sparkles,
    className: "from-sky-400 via-cyan-400 to-emerald-400",
  },
  {
    id: "magic-unlocked",
    icon: Unlock,
    className: "from-lime-400 via-emerald-400 to-teal-500",
  },
  {
    id: "legal",
    icon: Scale,
    className: "from-slate-800 via-slate-900 to-slate-950",
  },
];

function MyMagicToolbar() {
  return (
    <nav className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
      {MY_MAGIC_TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            className="group flex items-center"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${tab.className} shadow-sm`}
            >
              <Icon className="h-4 w-4 text-white" />
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default MyMagicToolbar;
