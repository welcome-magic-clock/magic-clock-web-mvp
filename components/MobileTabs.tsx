// components/MobileTabs.tsx
// ✅ v2.0 — Bear visiteur · Avatar réel connecté · Route /studio correcte
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Users, Box, DollarSign } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { useEffect, useState } from "react";

export default function MobileTabs() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const sb = getSupabaseBrowser();
  const isLoggedIn = !!user && !loading;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null
  );

  useEffect(() => {
    if (!user?.id) return;
    sb.from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [user?.id]);

  const tabs = [
    { href: "/",       label: "Amazing",      icon: Home },
    { href: "/meet",   label: "Meet me",      icon: Users },
    { href: "/studio", label: "Créer",        icon: Box,  isCta: true },
    { href: "/monet",  label: "Monétisation", icon: DollarSign },
    { href: isLoggedIn ? "/mymagic" : "/auth?next=/mymagic",
      label: "My Magic Clock",
      isProfile: true },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href.split("?")[0]);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] transition ${
                isActive
                  ? "bg-violet-50 text-violet-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {/* Bouton Créer — CTA central violet */}
              {tab.isCta && tab.icon ? (
                <span className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm">
                  <tab.icon className="h-5 w-5" aria-hidden="true" />
                </span>

              /* My Magic Clock — Bear visiteur / Avatar réel connecté */
              ) : tab.isProfile ? (
                <span className="mb-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 overflow-hidden">
                  {isLoggedIn ? (
                    avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Mon profil"
                        width={32}
                        height={32}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      // Connecté sans photo → initiale
                      <span className="text-xs font-bold text-violet-600">
                        {(user?.email?.[0] ?? "?").toUpperCase()}
                      </span>
                    )
                  ) : (
                    // Visiteur → Bear
                    <Image
                      src="/images/magic-clock-bear/avatar.png"
                      alt="Magic Clock Bear"
                      width={32}
                      height={32}
                      className="h-full w-full rounded-full object-cover"
                    />
                  )}
                </span>

              /* Icônes normales */
              ) : tab.icon ? (
                <tab.icon className="mb-0.5 h-5 w-5" aria-hidden="true" />
              ) : null}

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
