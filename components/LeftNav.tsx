"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  UserCircle,
  Sparkles,
  DollarSign,
  Mail,
  Bell,
  Shield,
} from "lucide-react";

const items = [
  { href: "/", label: "Amazing", icon: Home },
  { href: "/meet", label: "Meet me", icon: Users },
  { href: "/mymagic", label: "My Magic Clock", icon: UserCircle },
 { href: "/create", label: "Créer", icon: Sparkles },
  { href: "/monet", label: "Monétisation", icon: DollarSign },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/legal", label: "Légal", icon: Shield },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 shrink-0 p-4">
      <div className="sticky top-4 space-y-3">
        <div className="text-sm font-semibold text-slate-700">
          Magic Clock — Menu
        </div>

        <nav className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/"));

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
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
