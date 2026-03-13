// components/MobileTabs.tsx
// ✅ v2.1 — Avatar anneau gradient canonique Magic Clock (MCAvatar)
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Users, Box, DollarSign } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { useEffect, useState } from "react";
import { MCAvatar } from "@/components/ui/MCAvatar";

export default function MobileTabs() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const sb = getSupabaseBrowser();
  const isLoggedIn = !!user && !loading;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null
  );
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? user?.email ?? ""
  );

  useEffect(() => {
    if (!user?.id) return;
    sb.from("profiles")
      .select("avatar_url, display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user?.id]);

  const tabs = [
    { href: "/",       label: "Amazing",      icon: Home },
    { href: "/meet",   label: "Meet me",      icon: Users },
    { href: "/studio", label: "Créer",        icon: Box,  isCta: true },
    { href: "/monet",  label: "Monétisation", icon: DollarSign },
    {
      href: isLoggedIn ? "/mymagic" : "/auth?next=/mymagic",
      label: "My Magic Clock",
      isProfile: true,
    },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-1">
        {tabs.map((tab) => {
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] transition ${
                active
                  ? "bg-violet-50 text-violet-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {/* ── Bouton Créer — CTA central violet ── */}
              {tab.isCta && tab.icon ? (
                <span className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm">
                  <tab.icon className="h-5 w-5" aria-hidden="true" />
                </span>

              /* ── My Magic Clock — anneau gradient canonique ── */
              ) : tab.isProfile ? (
                <span className="mb-0.5">
                  {isLoggedIn ? (
                    /* Connecté : anneau rotatif Magic Clock */
                    <MCAvatar
                      src={avatarUrl}
                      name={displayName || (user?.email?.[0] ?? "?")}
                      size="sm"
                      animated={active}
                      duration={6}
                    />
                  ) : (
                    /* Visiteur : ours avec anneau gradient statique */
                    <div className="relative h-9 w-9 flex-shrink-0">
                      <div
                        className="absolute inset-[-2px] rounded-full"
                        style={{
                          background:
                            "conic-gradient(from 180deg, #4B7BF5 0%, #38BDF8 15%, #7B4BF5 40%, #C44BDA 58%, #F54B8F 75%, #F5834B 88%, #4B7BF5 100%)",
                          opacity: 0.45,
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-white" />
                      <div className="absolute inset-[2px] overflow-hidden rounded-full bg-slate-100">
                        <Image
                          src="/images/magic-clock-bear/avatar.png"
                          alt="Magic Clock Bear"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </span>

              /* ── Icônes normales ── */
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
