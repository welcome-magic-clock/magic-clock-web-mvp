// app/monet/page.tsx
// ✅ v4.2 — Visiteur fond blanc premium, header harmonisé connecté/visiteur
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { RealMonetPanel } from "./RealMonetPanel";
import { SimMonetPanel } from "./SimMonetPanel";

// ── Skeleton pendant le chargement de l'auth ──────────────────────────────────
function MonetSkeleton() {
  return (
    <div className="container space-y-6 py-8 animate-pulse">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 w-20 rounded-full bg-slate-200" />
              <div className="h-4 w-32 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="h-8 w-40 rounded-full bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-40 rounded-full bg-slate-200" />
          <div className="h-4 w-72 rounded-full bg-slate-200" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>
      </header>
      <div className="space-y-4">
        <div className="h-32 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function MonetPage() {
  const { user, loading } = useAuth();
  const sb = getSupabaseBrowser();

  if (loading) return <MonetSkeleton />;

  return <MonetContent user={user} sb={sb} />;
}

// ── Contenu réel ──────────────────────────────────────────────────────────────
function MonetContent({
  user,
  sb,
}: {
  user: any;
  sb: ReturnType<typeof getSupabaseBrowser>;
}) {
  const isLoggedIn = !!user;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null,
  );
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? "",
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

  // Visiteur démarre sur "sim", connecté sur "real"
  const [activeMode, setActiveMode] = useState<"real" | "sim">(
    isLoggedIn ? "real" : "sim",
  );

  const headerName = isLoggedIn
    ? displayName || user?.email || "Mon profil"
    : "Magic Clock";
  const headerHandle = isLoggedIn
    ? handle
      ? `@${handle.replace(/^@/, "")}`
      : `@${user?.email?.split("@")[0] ?? "moi"}`
    : "@magic_clock_app";
  const headerAvatar = isLoggedIn ? avatarUrl : null;
  const headerInitial = (headerName[0] ?? "M").toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      {/* ══ HEADER — identique visiteur & connecté ══ */}
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3">

          {/* Bloc avatar + nom */}
          <div className="flex items-center gap-3">
            {/* Avatar ring gradient (connecté) ou logo MC (visiteur) */}
            <div className="relative flex-shrink-0">
              {isLoggedIn ? (
                // Connecté : avatar ring animé
                <div className="relative h-10 w-10">
                  <div
                    className="absolute inset-[-2px] rounded-full animate-spin-slow"
                    style={{
                      background:
                        "conic-gradient(from 180deg, #4B7BF5 0%, #7B4BF5 25%, #C44BDA 50%, #F54B8F 75%, #F5834B 88%, #4B7BF5 100%)",
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-white" />
                  <div className="absolute inset-[2px] overflow-hidden rounded-full bg-gradient-to-br from-violet-100 to-blue-100">
                    {headerAvatar ? (
                      <Image
                        src={headerAvatar}
                        alt={headerName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="mc-text-gradient text-sm font-bold">
                          {headerInitial}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Visiteur : avatar neutre avec icône étoile
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-gradient-to-br from-violet-50 to-pink-50">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#star-grad)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <defs>
                      <linearGradient id="star-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7B4BF5" />
                        <stop offset="100%" stopColor="#F54B8F" />
                      </linearGradient>
                    </defs>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Cockpit monétisation
              </span>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">
                  {headerName}
                </h1>
                <span className="text-[11px] text-slate-400">{headerHandle}</span>
              </div>
            </div>
          </div>

          {/* Toggle Réalité / Simulateur */}
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5 shadow-sm text-[11px]">
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setActiveMode("real")}
                className={`flex items-center gap-1.5 min-w-[76px] whitespace-nowrap rounded-full px-3 py-1.5 font-semibold transition-all ${
                  activeMode === "real"
                    ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-sm"
                    : "bg-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {activeMode === "real" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                )}
                Réalité
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveMode("sim")}
              className={`flex items-center gap-1.5 min-w-[96px] whitespace-nowrap rounded-full px-3 py-1.5 font-semibold transition-all ${
                activeMode === "sim"
                  ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {activeMode === "sim" && (
                <span className="h-1.5 w-1.5 rounded-full bg-violet-200" />
              )}
              Simulateur
            </button>
          </div>
        </div>

        {/* Bandeau contextuel sous le header */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2">
          <p className="text-[11px] text-slate-500">
            {isLoggedIn ? (
              activeMode === "real" ? (
                <>
                  <span className="font-semibold text-emerald-600">Mode Réalité</span>
                  {" "}— Tes données de compte (indicatives MVP). Abonnements + PPV réels, versements, paliers.
                </>
              ) : (
                <>
                  <span className="font-semibold text-violet-600">Mode Simulateur</span>
                  {" "}— Projette ton potentiel : ajuste followers, prix Abo & PPV, taux de conversion.
                </>
              )
            ) : (
              <>
                <span className="font-semibold text-violet-600">Simulateur gratuit</span>
                {" "}— Projette ton potentiel de revenus sans créer de compte.{" "}
                <Link
                  href="/auth?next=/monet"
                  className="font-semibold text-violet-600 underline underline-offset-2"
                >
                  Se connecter
                </Link>{" "}
                pour voir tes données réelles.
              </>
            )}
          </p>
        </div>
      </header>

      {/* ══ HERO VISITEUR — fond blanc premium ══ */}
      {!isLoggedIn && (
        <section className="border-b border-slate-100 bg-white px-4 py-8 sm:px-6">
          <div className="container max-w-lg">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-violet-600">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Cockpit Monétisation
            </div>

            {/* Titre */}
            <h2 className="mb-2 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Combien peux-tu{" "}
              <span
                className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent"
              >
                gagner avec Magic Clock ?
              </span>
            </h2>
            <p className="mb-6 text-sm text-slate-500 leading-relaxed">
              Simule ton potentiel de revenus avec tes followers actuels.
              <br />
              Modèles FREE · SUB · PPV — sans rien installer.
            </p>

            {/* KPI pills */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-blue-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B4BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <p className="text-sm font-black text-slate-800">12 450</p>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Followers</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-100 to-violet-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C44BDA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                </div>
                <p
                  className="text-sm font-black bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"
                >
                  6 213 CHF
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">/ mois</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-pink-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F54B8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <p className="text-sm font-black text-slate-800">80%</p>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Tu gardes</p>
              </div>
            </div>

            {/* CTA connexion */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-[12px] text-violet-700 font-medium">
                Connecte-toi pour accéder à tes données réelles et monétiser tes créations.
              </p>
              <Link
                href="/auth?next=/monet"
                className="flex-shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-1.5 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ CONTENU PRINCIPAL ══ */}
      <main className="container py-6">
        {/* Bannière "Nouveau sur Magic Clock" — toujours visible */}
        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-slate-800 sm:text-sm">
          <p className="font-medium">Nouveau sur Magic Clock ?</p>
          <p>
            Tu peux utiliser Magic Clock en{" "}
            <span className="font-semibold">MODE FREE</span> sans monétiser, puis
            activer les modèles{" "}
            <span className="font-semibold">SUB / Pay-Per-View</span> quand tu es prêt.
            Découvre comment tout fonctionne sur la page{" "}
            <Link
              href="/pricing"
              className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-800"
            >
              Prix &amp; monétisation
            </Link>
            .
          </p>
        </div>

        {/* Panels */}
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
      </main>
    </div>
  );
}
