// app/monet/page.tsx
// ✅ v3.0 — Skeleton loader pendant loading=true → plus de flash Bear pour les connectés
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { RealMonetPanel } from "./RealMonetPanel";
import { SimMonetPanel } from "./SimMonetPanel";

// ── Skeleton pendant le chargement de l'auth ─────────────────────────────────
function MonetSkeleton() {
  return (
    <div className="container space-y-6 py-8 animate-pulse">
      {/* Header skeleton */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 w-20 rounded-full bg-slate-200" />
              <div className="h-4 w-32 rounded-full bg-slate-200" />
            </div>
          </div>
          {/* Toggle */}
          <div className="h-8 w-40 rounded-full bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-40 rounded-full bg-slate-200" />
          <div className="h-4 w-72 rounded-full bg-slate-200" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>
      </header>
      {/* Panel skeleton */}
      <div className="space-y-4">
        <div className="h-32 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function MonetPage() {
  const { user, loading } = useAuth();
  const sb = getSupabaseBrowser();

  // ✅ Pendant le chargement auth → skeleton, jamais de flash Bear
  if (loading) return <MonetSkeleton />;

  return <MonetContent user={user} sb={sb} />;
}

// ── Contenu réel (rendu uniquement quand loading=false) ───────────────────────
function MonetContent({
  user,
  sb,
}: {
  user: any;
  sb: ReturnType<typeof getSupabaseBrowser>;
}) {
  const isLoggedIn = !!user;

  // Profil utilisateur connecté
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null
  );
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? ""
  );
  const [handle, setHandle] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    sb.from("profiles")
      .select("avatar_url, display_name, handle")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.handle) setHandle(data.handle);
      });
  }, [user?.id]);

  // Mode : visiteur commence sur "sim", connecté peut voir "real"
  const [activeMode, setActiveMode] = useState<"real" | "sim">(
    isLoggedIn ? "real" : "sim"
  );

  // Données à afficher dans le header
  const headerName = isLoggedIn
    ? displayName || user?.email || "Mon profil"
    : "Magic Clock";
  const headerHandle = isLoggedIn
    ? handle
      ? `@${handle.replace(/^@/, "")}`
      : `@${user?.email?.split("@")[0] ?? "moi"}`
    : "@magic_clock_app";
  const headerAvatar = isLoggedIn ? avatarUrl : null; // null = Bear pour visiteur
  const headerInitial = (headerName[0] ?? "M").toUpperCase();

  return (
    <div className="container space-y-6 py-8">
      {/* ══ HEADER AVATAR + TOGGLE ══ */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Bloc avatar + nom */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200 flex-shrink-0">
              {headerAvatar ? (
                <Image
                  src={headerAvatar}
                  alt={headerName}
                  fill
                  className="object-cover"
                />
              ) : isLoggedIn ? (
                // Connecté sans photo → initiale
                <div className="flex h-full w-full items-center justify-center">
                  <span className="mc-text-gradient text-sm font-bold">
                    {headerInitial}
                  </span>
                </div>
              ) : (
                // Visiteur → Bear
                <Image
                  src="/images/magic-clock-bear/avatar.png"
                  alt="Magic Clock"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500">
                Cockpit monétisation
              </span>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{headerName}</h1>
                <span className="text-xs text-slate-500">{headerHandle}</span>
              </div>
            </div>
          </div>

          {/* Toggle Réalité / Simulateur */}
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
            {/* Réalité — connecté uniquement */}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setActiveMode("real")}
                className={`min-w-[70px] whitespace-nowrap rounded-full px-2.5 py-1 font-medium transition ${
                  activeMode === "real"
                    ? "bg-slate-200 text-slate-900 shadow-sm"
                    : "bg-transparent text-slate-500"
                }`}
              >
                Réalité
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveMode("sim")}
              className={`min-w-[90px] whitespace-nowrap rounded-full px-2.5 py-1 font-medium transition ${
                activeMode === "sim"
                  ? "bg-slate-200 text-slate-900 shadow-sm"
                  : "bg-transparent text-slate-500"
              }`}
            >
              Simulateur
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Monétisation</h2>
          <p className="text-sm text-slate-600">
            Comprends l&apos;impact de ton audience et simule ton potentiel avec
            Magic Clock (MODE FREE, abonnements + Pay-Per-View). Choisis entre{" "}
            {isLoggedIn && (
              <>
                <span className="font-semibold">Réalité</span> (données
                indicatives du compte) et{" "}
              </>
            )}
            <span className="font-semibold">Simulateur</span> (projections).
          </p>

          {/* Bannière "Nouveau sur Magic Clock" */}
          <div className="mb-1 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-slate-800 sm:text-sm">
            <p className="font-medium">Nouveau sur Magic Clock ?</p>
            <p>
              Tu peux utiliser Magic Clock en{" "}
              <span className="font-semibold">MODE FREE</span> sans monétiser,
              puis activer les modèles{" "}
              <span className="font-semibold">SUB / Pay-Per-View</span> quand
              tu es prêt. Découvre comment tout fonctionne sur la page{" "}
              <Link
                href="/pricing"
                className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-800"
              >
                Prix &amp; monétisation
              </Link>
              .
            </p>
          </div>

          {/* CTA connexion pour visiteur */}
          {!isLoggedIn && (
            <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs text-slate-800 sm:text-sm flex items-center justify-between gap-3">
              <p className="text-[12px] text-violet-700 font-medium">
                🔐 Connecte-toi pour accéder à tes données réelles et monétiser
                tes créations.
              </p>
              <Link
                href="/auth?next=/monet"
                className="flex-shrink-0 rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-violet-700 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ══ CONTENU PRINCIPAL ══ */}
      {activeMode === "real" && isLoggedIn ? (
        <RealMonetPanel
          creator={{
            name: headerName,
            handle: headerHandle,
            avatar: avatarUrl ?? undefined,
          }}
        />
      ) : (
        <SimMonetPanel
          creator={{
            name: headerName,
            handle: headerHandle,
            avatar: avatarUrl ?? undefined,
          }}
        />
      )}
    </div>
  );
}
