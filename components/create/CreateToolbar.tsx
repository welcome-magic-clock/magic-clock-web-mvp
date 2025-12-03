// components/create/CreateToolbar.tsx
"use client";

import { Sparkles, Box, FileStack } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type CreateTabId = "studio" | "display" | "projects";

type CreateTab = {
  id: CreateTabId;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className: string; // dégradé
};

const CREATE_TABS: CreateTab[] = [
  {
    id: "studio",
    icon: Sparkles,
    className: "from-slate-900 via-slate-800 to-slate-900",
  },
  {
    id: "display",
    icon: Box,
    className: "from-emerald-400 via-teal-400 to-sky-400",
  },
  {
    id: "projects",
    icon: FileStack,
    className: "from-rose-400 via-orange-400 to-amber-400",
  },
];

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CreateToolbar() {
  const router = useRouter();

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

  const handleClick = (id: CreateTabId) => {
    switch (id) {
      case "studio":
        router.push("/studio");
        break;
      case "display":
        router.push("/magic-display");
        break;
      case "projects":
        scrollToSection("create-projects");
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
        {CREATE_TABS.map((tab) => {
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
