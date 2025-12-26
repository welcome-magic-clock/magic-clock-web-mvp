// components/MobileTabs.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { Home, Users, DollarSign } from "lucide-react";

import { listCreators } from "@/core/domain/repository";
import { MagicCubeIcon } from "@/components/icons/MagicCubeIcon";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type TabItem = {
  href: string;
  label: string;
  icon?: IconComponent;
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
    icon: MagicCubeIcon, // 🧊 Nouveau cube 3D Magic Clock
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
  const creators = useMemo(() => listCreators(), []);
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

          const Icon = tab.icon;

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatar}
                    alt={currentCreator.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                </span>
              ) : tab.href === "/create" && Icon ? (
                // 🧊 Icône "Créer" dans un rond violet (cube 3D)
                <span className="mb-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : Icon ? (
                <Icon className="mb-0.5 h-5 w-5" aria-hidden="true" />
              ) : null}

              {/* Label toujours sur une seule ligne */}
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
