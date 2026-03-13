// components/LeftNav.tsx
// ✅ v3.1 — Avatar anneau gradient canonique Magic Clock · Bear visiteur · Réglages connecté
"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Box, DollarSign, Shield, Settings } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { useEffect, useState } from "react";
import AccountSettingsModal from "@/components/mymagic/AccountSettingsModal";
import { MCAvatar } from "@/components/ui/MCAvatar";

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

  const linkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
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
                {/* ✅ Anneau gradient canonique Magic Clock */}
                <MCAvatar
                  src={avatarUrl}
                  name={displayName || initial}
                  size="xs"
                  animated={isActive("/mymagic")}
                  duration={6}
                />
                <span>My Magic Clock</span>
              </Link>
            ) : (
              <Link href="/auth?next=/mymagic" className={linkClass("/mymagic")}>
                {/* Visiteur : ours avec anneau statique */}
                <div className="relative h-7 w-7 flex-shrink-0">
                  <div
                    className="absolute inset-[-1px] rounded-full"
                    style={{
                      background: "conic-gradient(from 180deg, #4B7BF5 0%, #38BDF8 15%, #7B4BF5 40%, #C44BDA 58%, #F54B8F 75%, #F5834B 88%, #4B7BF5 100%)",
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
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition border-slate-200 text-slate-700 hover:bg-slate-100"
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
