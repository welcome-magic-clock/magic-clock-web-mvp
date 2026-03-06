// components/LeftNav.tsx
// ✅ v3.0 — Ordre correct · Bear visiteur · Réglages connecté → AccountSettingsModal
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Box, DollarSign, Shield, Settings } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { useEffect, useState } from "react";
import AccountSettingsModal from "@/components/mymagic/AccountSettingsModal";

export default function LeftNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const sb = getSupabaseBrowser();
  const isLoggedIn = !!user;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null
  );
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? user?.email ?? ""
  );
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    sb.from("profiles")
      .select("avatar_url, display_name, handle")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        if (data?.display_name) setDisplayName(data.display_name);
        else if (data?.handle) setDisplayName(data.handle);
      });
  }, [user?.id]);

  const initial = (displayName[0] ?? "?").toUpperCase();

  // ── Item commun : style lien actif/inactif ──
  const linkClass = (href: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(href + "/");
    return `flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition ${
      active
        ? "bg-violet-50 border-violet-400 text-violet-700"
        : "border-slate-200 text-slate-700 hover:bg-slate-100"
    }`;
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Modale paramètres — connecté uniquement */}
      {showSettings && (
        <AccountSettingsModal
          onClose={() => setShowSettings(false)}
          userEmail={user?.email ?? ""}
        />
      )}

      <aside className="hidden w-64 shrink-0 p-4 md:block">
        <div className="sticky top-4 space-y-3">
          <div className="text-sm font-semibold text-slate-700">
            Magic Clock — Menu
          </div>

          <nav className="space-y-1">

            {/* 1. Amazing */}
            <Link href="/" className={linkClass("/")}>
              <Home className="h-4 w-4" />
              <span>Amazing</span>
            </Link>

            {/* 2. Meet me */}
            <Link href="/meet" className={linkClass("/meet")}>
              <Users className="h-4 w-4" />
              <span>Meet me</span>
            </Link>

            {/* 3. My Magic Clock */}
            {isLoggedIn ? (
              <Link href="/mymagic" className={linkClass("/mymagic")}>
                <div
                  className={`relative h-7 w-7 overflow-hidden rounded-full border flex items-center justify-center bg-violet-50 ${
                    isActive("/mymagic") ? "border-violet-400" : "border-slate-200"
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
                <span>My Magic Clock</span>
              </Link>
            ) : (
              <Link href="/auth?next=/mymagic" className={linkClass("/mymagic")}>
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/magic-clock-bear/avatar.png"
                    alt="Magic Clock Bear"
                    fill
                    className="object-cover"
                  />
                </div>
                <span>My Magic Clock</span>
              </Link>
            )}

            {/* 4. Créer */}
            <Link href="/studio" className={linkClass("/studio")}>
              <Box className="h-4 w-4" />
              <span>Créer</span>
            </Link>

            {/* 5. Monétisation */}
            <Link href="/monet" className={linkClass("/monet")}>
              <DollarSign className="h-4 w-4" />
              <span>Monétisation</span>
            </Link>

            {/* 6. Réglages */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition border-slate-200 text-slate-700 hover:bg-slate-100`}
              >
                <Settings className="h-4 w-4" />
                <span>Réglages</span>
              </button>
            ) : (
              <Link href="/auth?next=/mymagic" className={linkClass("/auth")}>
                <Settings className="h-4 w-4" />
                <span>Réglages</span>
              </Link>
            )}

            {/* 7. Légal */}
            <Link href="/legal" className={linkClass("/legal")}>
              <Shield className="h-4 w-4" />
              <span>Légal</span>
            </Link>

          </nav>
        </div>
      </aside>
    </>
  );
}
