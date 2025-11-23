"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Sparkles,
  DollarSign,
  MessageCircle,
  Bell,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react"; // ajoute cette ligne

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};
const NAV_ITEMS: NavItem[] = [
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
    href: "/mymagic",
    label: "My Magic Clock",
    icon: UserCircle2,
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
export default function LeftNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-60 shrink-0 border-r border-slate-100 bg-white/70 px-3 py-4 md:block">
      <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Magic Clock — Menu
      </div>
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
