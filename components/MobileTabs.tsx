"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Sparkles,
  DollarSign,
  Bell,
  ShieldCheck,
  MessageCircle,
  Menu,
  type LucideIcon,
} from "lucide-react";

type Tab = {
  href: string;
  label: string;
  icon?: LucideIcon;
  avatarSrc?: string;
};

const tabs: Tab[] = [
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
    icon: Sparkles,
  },
  {
    href: "/monet",
    label: "Monétisation",
    icon: DollarSign,
  },
  {
    href: "/mymagic",
    label: "My Magic Clock",
    icon: Users, // fallback si l’avatar ne charge pas
    avatarSrc: "/creators/aiko-tanaka.jpeg",
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageCircle,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/legal",
    label: "Légal",
    icon: ShieldCheck,
  },
];

export default function MobileTabs() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1">
        {tabs.map((tab) => {
          const { href, label, icon: Icon, avatarSrc } = tab;
          const active =
            href === "/" ? pathname === href : pathname.startsWith(href);

          // Onglet central "Créer"
          if (href === "/create") {
            return (
              <Link
                key={href}
                href={href}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
              >
                <Sparkles className="h-5 w-5" />
              </Link>
            );
          }

          // Onglet "My Magic Clock" avec avatar Aiko
          if (href === "/mymagic") {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center justify-center gap-0.5"
              >
                <span className="relative flex h-9 w-9 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full border-2 ${
                      active
                        ? "border-indigo-500 shadow-[0_0_0_2px_rgba(129,140,248,0.2)]"
                        : "border-slate-200"
                    }`}
                  />
                  <span className="relative block h-7 w-7 overflow-hidden rounded-full bg-slate-200">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      Icon && (
                        <Icon
                          className={`h-4 w-4 ${
                            active ? "text-indigo-600" : "text-slate-400"
                          }`}
                        />
                      )
                    )}
                  </span>
                </span>
                <span
                  className={`text-[11px] ${
                    active ? "text-indigo-600 font-medium" : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          }

          // Autres onglets
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5"
            >
              {Icon && (
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-indigo-600" : "text-slate-500"
                  }`}
                />
              )}
              <span
                className={`text-[11px] ${
                  active ? "text-indigo-600 font-medium" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* Bouton "plus" / menu secondaire (placeholder) */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white"
        >
          <Menu className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}
