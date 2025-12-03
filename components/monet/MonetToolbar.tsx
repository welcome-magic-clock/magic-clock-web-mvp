// components/monet/MonetToolbar.tsx
"use client";

import {
  Users,
  UserPlus,
  Ticket,
  Banknote,
  LineChart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MonetTabId =
  | "followers"
  | "subscriptions"
  | "ppv"
  | "revenue"
  | "graph";

type MonetTab = {
  id: MonetTabId;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className: string; // dégradé
};

const MONET_TABS: MonetTab[] = [
  {
    id: "followers",
    icon: Users,
    className: "from-sky-400 via-indigo-500 to-violet-500",
  },
  {
    id: "subscriptions",
    icon: UserPlus,
    className: "from-emerald-400 via-teal-400 to-sky-400",
  },
  {
    id: "ppv",
    icon: Ticket,
    className: "from-rose-400 via-pink-500 to-orange-400",
  },
  {
    id: "revenue",
    icon: Banknote,
    className: "from-amber-400 via-lime-400 to-emerald-400",
  },
  {
    id: "graph",
    icon: LineChart,
    className: "from-violet-500 via-purple-500 to-sky-500",
  },
];

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MonetToolbar() {
  // même logique que SearchToolbar / MyMagicToolbar
  const [visible, setVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const current =
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;

      const diff = current - lastScrollYRef.current;

      // Scroll vers le bas → on cache
      if (diff > 6 && current > 40) {
        setVisible(false);
      }

      // Scroll vers le haut → on ré-affiche
      if (diff < -6) {
        setVisible(true);
      }

      lastScrollYRef.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: MonetTabId) => {
    switch (id) {
      case "followers":
        scrollToSection("monet-followers");
        break;
      case "subscriptions":
        scrollToSection("monet-subscriptions");
        break;
      case "ppv":
        scrollToSection("monet-ppv");
        break;
      case "revenue":
        scrollToSection("monet-revenue");
        break;
      case "graph":
        scrollToSection("monet-graph");
        break;
    }
  };

  return (
    <div
      className={`sticky top-0 z-40 mb-4 bg-slate-50/80 pb-3 pt-3 backdrop-blur
      transition-transform duration-300 px-4 sm:mx-0 sm:px-0 sm:bg-transparent
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav className="flex items-center gap-2 overflow-x-auto">
        {MONET_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleClick(tab.id)}
              className="group flex items-center"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full
                bg-gradient-to-br ${tab.className} shadow-sm`}
              >
                <Icon className="h-4 w-4 text-white" />
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
