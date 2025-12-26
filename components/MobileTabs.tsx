// components/MobileTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Box, DollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { listCreators } from "@/core/domain/repository";

type TabItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  isProfile?: boolean;
};

const TABS: TabItem[] = [
  {
    href: "/",
    label: "Amazing",
    icon: Home,
  },
  {
    href: "/meet",
    label: "Meet me",
    icon: Users,
  },
  {
    href: "/create",
    label: "Créer",
    icon: Box, // 🧊 cube 3D
  },
  {
    href: "/monet",
    label: "Monétisation",
    icon: DollarSign,
  },
  {
    href: "/mymagic",
    label: "My Magic Clock",
    isProfile: true, // 👉 onglet profil avec avatar
  },
];

export default function MobileTabs() {
  const pathname = usePathname();

  // On réutilise Aiko Tanaka comme créatrice actuelle
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];
  const avatar = currentCreator.avatar;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-1">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab.isProfile ? (
                // Avatar rond pour My Magic Clock
                <span className="mb-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                  <img
                    src={avatar}
                    alt={currentCreator.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                </span>
              ) : tab.href === "/create" && tab.icon ? (
                // 🧊 Icône "Créer" bien mise en avant
                <span className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
                  <tab.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : (
                tab.icon && (
                  <tab.icon
                    className="mb-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                )
              )}

              <span className="leading-tight text-[10px] whitespace-nowrap">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
