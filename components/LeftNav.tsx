// components/LeftNav.tsx
// ✅ v2 — Avatar réel · Routes protégées cachées · Monétisation visiteur = Simulateur Bear
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Users, Box, DollarSign, Shield } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { useEffect, useState } from "react";

// Routes toujours visibles (public)
const PUBLIC_ITEMS = [
  { href: "/",     label: "Amazing",  icon: Home },
  { href: "/meet", label: "Meet me",  icon: Users },
];

// Routes visibles uniquement si connecté
const AUTH_ITEMS = [
  { href: "/mymagic", label: "My Magic Clock", icon: null },
  { href: "/studio",  label: "Créer",          icon: Box },
  { href: "/monet",   label: "Monétisation",   icon: DollarSign },
];

// Route légal — toujours visible
const LEGAL_ITEM = { href: "/legal", label: "Légal", icon: Shield };

export default function LeftNav() {
  const pathname   = usePathname();
  const { user }   = useAuth();
  const sb         = getSupabaseBrowser();
  const isLoggedIn = !!user;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null
  );
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? user?.email ?? ""
  );

  useEffect(() => {
    if (!user?.id) return;
    sb.from("profiles")
      .select("avatar_url, display_name, handle")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url)   setAvatarUrl(data.avatar_url);
        if (data?.display_name) setDisplayName(data.display_name);
        else if (data?.handle)  setDisplayName(data.handle);
      });
  }, [user?.id]);

  const items = isLoggedIn
    ? [...PUBLIC_ITEMS, ...AUTH_ITEMS, LEGAL_ITEM]
    : [...PUBLIC_ITEMS, LEGAL_ITEM];

  const initial = (displayName[0] ?? "?").toUpperCase();

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
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition ${
                  active
                    ? "bg-violet-50 border-violet-400 text-violet-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isMyMagic ? (
                  // Avatar réel de l'utilisateur connecté
                  <div
                    className={`relative h-7 w-7 overflow-hidden rounded-full border flex items-center justify-center bg-violet-50 ${
                      active ? "border-violet-400" : "border-slate-200"
                    }`}
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="mc-text-gradient text-xs font-bold">
                        {initial}
                      </span>
                    )}
                  </div>
                ) : (
                  Icon && <Icon className="h-4 w-4" />
                )}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Monétisation visiteur — Simulateur Bear uniquement */}
        {!isLoggedIn && (
          <div className="mt-2 pt-2 border-t border-slate-100">
            <Link
              href="/monet?mode=simulator"
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition ${
                pathname.startsWith("/monet")
                  ? "bg-violet-50 border-violet-400 text-violet-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {/* Avatar Bear */}
              <div className="relative h-7 w-7 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <Image
                  src="/images/magic-clock-bear/avatar.png"
                  alt="Magic Clock Bear"
                  fill
                  className="object-cover"
                />
              </div>
              <span>Monétisation</span>
              <span className="ml-auto rounded-md bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-600">
                SIM
              </span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
