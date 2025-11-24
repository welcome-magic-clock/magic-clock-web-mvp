"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Sparkles,
  DollarSign,
  Mail,
  Bell,
  Shield,
} from "lucide-react";
import { CREATORS } from "@/features/meet/creators";

const items = [
  { href: "/", label: "Amazing", icon: Home },
  { href: "/meet", label: "Meet me", icon: Users },
  { href: "/mymagic", label: "My Magic Clock", icon: null }, // icon gérée à la main
  { href: "/studio", label: "Créer", icon: Sparkles },
  { href: "/monet", label: "Monétisation", icon: DollarSign },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/legal", label: "Légal", icon: Shield },
];

// Créateur courant pour l’avatar (comme sur My Magic Clock)
const currentCreator =
  CREATORS.find((c) => c.name === "Aiko Tanaka") ?? CREATORS[0];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 p-4 md:block">
      <div className="sticky top-4 space-y-3">
        <div className="text-sm font-semibold text-slate-700">
          Magic Clock — Menu
        </div>

        <nav className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/"));
            const isMyMagic = href === "/mymagic";

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition
                  ${
                    active
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {isMyMagic ? (
                  <div
                    className={`relative h-7 w-7 overflow-hidden rounded-full border bg-slate-100
                      ${active ? "border-indigo-500" : "border-slate-200"}`}
                  >
                    <Image
                      src={currentCreator.avatar}
                      alt={currentCreator.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  Icon && <Icon className="h-4 w-4" />
                )}

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
