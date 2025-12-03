"use client";

import {
  MessageCircle,
  Bell,
  Smile,
  BarChart3,
  Sparkles,
  Unlock,
  Scale,
} from "lucide-react";
import { useState } from "react";

type MyMagicItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  className: string;
};

const MYMAGIC_ITEMS: MyMagicItem[] = [
  {
    id: "messages",
    label: "Messages",
    icon: <MessageCircle className="h-5 w-5 text-white" />,
    className:
      "bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-5 w-5 text-white" />,
    className:
      "bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 text-white",
  },
  {
    id: "profile",
    label: "Profil",
    icon: <Smile className="h-5 w-5 text-white" />,
    className:
      "bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-400 text-white",
  },
  {
    id: "cockpit",
    label: "Cockpit",
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    className:
      "bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 text-white",
  },
  {
    id: "creations",
    label: "Mes Magic créés",
    icon: <Sparkles className="h-5 w-5 text-white" />,
    className:
      "bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-400 text-white",
  },
  {
    id: "unlocked",
    label: "Magic débloqués",
    icon: <Unlock className="h-5 w-5 text-white" />,
    className:
      "bg-gradient-to-br from-teal-400 via-emerald-400 to-lime-400 text-white",
  },
  {
    id: "legal",
    label: "Légal",
    icon: <Scale className="h-5 w-5 text-white" />,
    className:
      "bg-gradient-to-br from-slate-500 via-slate-600 to-slate-800 text-white",
  },
];

export function MyMagicToolbar() {
  const [activeId, setActiveId] = useState<string>("messages");

  const handleClick = (id: string) => {
    setActiveId(id);

    // Scroll doux vers la section correspondante (si elle existe)
    if (typeof window !== "undefined") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="rounded-3xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-wrap gap-3">
        {MYMAGIC_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            className="group flex items-center gap-2"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition 
              ${item.className} 
              ${
                activeId === item.id
                  ? "ring-2 ring-white/80 ring-offset-2 ring-offset-slate-100"
                  : ""
              }`}
            >
              {item.icon}
            </span>
            <span className="hidden text-xs font-medium text-slate-600 sm:inline">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
