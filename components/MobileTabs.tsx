"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Sparkles, DollarSign, UserCircle } from "lucide-react";

const TABS = [
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
    href: "/create", // 👈 au lieu de "/studio"
    label: "Créer",
    icon: Sparkles,
  },
  {
    href: "/monetisation",
    label: "Monétisation",
    icon: DollarSign,
  },
  {
    href: "/mymagic",
    label: "My Magic Clock",
    icon: UserCircle,
  },
];

export default function MobileTabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-4 py-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-xs"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-[11px] ${
                  active
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-sm"
                    : "border-transparent bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
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
      </div>
    </nav>
  );
}
