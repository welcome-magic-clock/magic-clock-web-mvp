"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Sparkles, DollarSign, UserCircle } from "lucide-react";

const tabs = [
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
    href: "/studio",
    label: "Créer",
    icon: Sparkles,
    isCenter: true, // bouton central mis en avant
  },
  {
    href: "/monet",
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
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2">
        {tabs.map(({ href, label, icon: Icon, isCenter }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href + "/"));

          if (isCenter) {
            // Bouton "Créer" central, façon TikTok
            return (
              <Link
                key={href}
                href={href}
                className="relative -mt-5 flex flex-col items-center"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition
                    ${
                      active
                        ? "bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-white"
                        : "bg-slate-900 text-white"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-1 text-[11px] font-medium text-slate-800">
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
              <Icon
                className={`h-5 w-5 ${
                  active ? "text-indigo-600" : "text-slate-500"
                }`}
              />
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
