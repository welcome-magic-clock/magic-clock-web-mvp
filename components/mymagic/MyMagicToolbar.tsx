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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type MyMagicTabId =
  | "messages"
  | "notifications"
  | "profile"
  | "cockpit"
  | "created"
  | "unlocked"
  | "legal";

type MyMagicTab = {
  id: MyMagicTabId;
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
    id: "created",
    icon: Sparkles,
    className: "from-sky-400 via-cyan-400 to-emerald-400",
  },
  {
    id: "unlocked",
    icon: Unlock,
    className: "from-lime-400 via-emerald-400 to-teal-500",
  },
  {
    id: "legal",
    icon: Scale,
    className: "from-slate-800 via-slate-900 to-slate-950",
  },
];

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MyMagicToolbar() {
  const router = useRouter();

  // même logique que la SearchToolbar : visible / caché au scroll
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

      // scroll vers le bas → on cache
      if (diff > 6 && current > 40) {
        setVisible(false);
      }

      // scroll vers le haut → on ré-affiche
      if (diff < -6) {
        setVisible(true);
      }

      lastScrollYRef.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: MyMagicTabId) => {
    switch (id) {
      case "messages":
        router.push("/messages");
        break;
      case "notifications":
        router.push("/notifications");
        break;
      case "profile":
        scrollToSection("mymagic-profile");
        break;
      case "cockpit":
        scrollToSection("mymagic-cockpit");
        break;
      case "created":
        scrollToSection("mymagic-created");
        break;
      case "unlocked":
        scrollToSection("mymagic-unlocked");
        break;
      case "legal":
        router.push("/legal/cgu");
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
        {MY_MAGIC_TABS.map((tab) => {
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
