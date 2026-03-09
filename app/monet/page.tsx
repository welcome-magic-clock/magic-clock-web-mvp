// app/monet/page.tsx
// ✅ v4.3 — Suppression MonetToolbar + Bear avatar visiteur + Lucide icons + gradient Simulateur unifié
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BarChart2, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { RealMonetPanel } from "./RealMonetPanel";
import { SimMonetPanel } from "./SimMonetPanel";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function MonetSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-16 rounded-2xl bg-slate-100" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-20 rounded-2xl bg-slate-100" />
        <div className="h-20 rounded-2xl bg-slate-100" />
        <div className="h-20 rounded-2xl bg-slate-100" />
      </div>
      <div className="h-40 rounded-2xl bg-slate-100" />
      <div className="h-32 rounded-2xl bg-slate-100" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MonetPage() {
  const { user, loading } = useAuth();
  const sb = getSupabaseBrowser();
  if (loading) return <MonetSkeleton />;
  return <MonetContent user={user} sb={sb} />;
}

// ── Contenu ───────────────────────────────────────────────────────────────────
function MonetContent({
  user,
  sb,
}: {
  user: any;
  sb: ReturnType<typeof getSupabaseBrowser>;
}) {
  const isLoggedIn = !!user;
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

  const [activeMode, setActiveMode] = useState<"real" | "sim">(
    isLoggedIn ? "real" : "sim"
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

  // Gradient partagé Simulateur + Se connecter
  const primaryGradient = "linear-gradient(135deg,#7B4BF5,#C44BDA,#F54B8F)";

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* ══ HEADER STICKY ══ */}
      <header
        className="sticky top-0 z-50 border-b border-slate-100 bg-white px-4 py-3 shadow-sm"
        style={{
          background: isLoggedIn
            ? "linear-gradient(160deg,rgba(75,123,245,.04) 0%,rgba(196,75,218,.03) 50%,rgba(245,131,75,.02) 100%), white"
            : "white",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Avatar + nom */}
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {isLoggedIn ? (
                /* ── Avatar connecté : ring animé existant ── */
                <div className="relative h-[46px] w-[46px]">
                  <div
                    className="absolute inset-[-2px] animate-spin rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 180deg,#4B7BF5 0%,#7B4BF5 25%,#C44BDA 50%,#F54B8F 75%,#F5834B 88%,#4B7BF5 100%)",
                      animationDuration: "8s",
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-white" />
                  <div
                    className="absolute inset-[2px] overflow-hidden rounded-full"
                    style={{
                      background: "linear-gradient(135deg,#ede9fe,#dbeafe)",
                    }}
                  >
                    {headerAvatar ? (
                      <Image
                        src={headerAvatar}
                        alt={headerName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[15px] font-black text-violet-600">
                        {headerInitial}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ── Avatar visiteur : Bear ── */
                <div className="relative h-[42px] w-[42px] overflow-hidden rounded-full border border-slate-200">
                  <Image
                    src="/bear-avatar.png"
                    alt="Magic Clock"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Nom + handle */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Cockpit monétisation
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-black leading-tight text-slate-800">
                  {headerName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {headerHandle}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Réalité / Simulateur — gradient unifié */}
          <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm">
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setActiveMode("real")}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
                style={
                  activeMode === "real"
                    ? {
                        background: primaryGradient,
                        color: "white",
                        boxShadow: "0 2px 8px rgba(123,75,245,.4)",
                      }
                    : { background: "transparent", color: "#64748b" }
                }
              >
                <BarChart2 size={11} strokeWidth={2.5} />
                Réalité
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveMode("sim")}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
              style={
                activeMode === "sim"
                  ? {
                      background: primaryGradient,
                      color: "white",
                      boxShadow: "0 2px 8px rgba(123,75,245,.4)",
                    }
                  : { background: "transparent", color: "#64748b" }
              }
            >
              <SlidersHorizontal size={11} strokeWidth={2.5} />
              Simulateur
            </button>
          </div>
        </div>

        {/* Bandeau contextuel */}
        <div
          className="mt-2.5 flex items-start gap-2 rounded-xl px-3 py-2"
          style={{
            background: "rgba(255,255,255,.9)",
            border: "1px solid #f1f5f9",
          }}
        >
          <div
            className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
            style={{
              background:
                activeMode === "real" ? "#4ade80" : "#7B4BF5",
            }}
          />
          <p className="text-[11px] leading-relaxed text-slate-500">
            {isLoggedIn ? (
              activeMode === "real" ? (
                <>
                  <strong className="text-slate-700">Mode Réalité</strong> —
                  Tes données de compte (indicatives MVP). Abonnements + PPV
                  réels, versements, paliers.
                </>
              ) : (
                <>
                  <strong className="text-slate-700">Mode Simulateur</strong>{" "}
                  — Projette ton potentiel : ajuste followers, prix Abo &amp;
                  PPV, taux de conversion et visualise tes revenus estimés.
                </>
              )
            ) : (
              <>
                <strong className="text-slate-700">Simulateur gratuit</strong>{" "}
                — Projette ton potentiel.{" "}
                <Link
                  href="/auth?next=/monet"
                  className="font-bold text-violet-600 underline"
                >
                  Se connecter
                </Link>{" "}
                pour voir tes données réelles.
              </>
            )}
          </p>
        </div>
      </header>

      {/* ══ HERO VISITEUR ══ */}
      {!isLoggedIn && activeMode === "sim" && (
        <div className="border-b border-slate-100 bg-white px-4 py-6">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-violet-600"
            style={{ border: "1px solid #e2e8f0", background: "#f8fafc" }}
          >
            <svg
              width="10"
              height="10"
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
          <h2 className="mb-2 text-[26px] font-black leading-tight tracking-tight text-slate-900">
            Combien peux-tu{" "}
            <span
              style={{
                background: primaryGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              gagner avec Magic Clock ?
            </span>
          </h2>
          <p className="mb-5 text-[13px] leading-relaxed text-slate-500">
            Simule ton potentiel de revenus avec tes followers actuels.
            <br />
            Modèles FREE · SUB · PPV — sans rien installer.
          </p>

          {/* KPI pills */}
          <div className="mb-5 grid grid-cols-3 gap-2">
            {[
              {
                icon: "👥",
                val: "12 450",
                lbl: "Followers",
                color: "rgba(123,75,245,.08)",
              },
              {
                icon: "📈",
                val: "6 213 CHF",
                lbl: "/ mois",
                color: "rgba(196,75,218,.08)",
                gradient: true,
              },
              {
                icon: "⚡",
                val: "80%",
                lbl: "Tu gardes",
                color: "rgba(245,75,143,.08)",
              },
            ].map((k, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 p-3 text-center"
                style={{ background: k.color }}
              >
                <p className="mb-1 text-base">{k.icon}</p>
                <p
                  className="text-[13px] font-black"
                  style={
                    k.gradient
                      ? {
                          background: primaryGradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }
                      : { color: "#1e293b" }
                  }
                >
                  {k.val}
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  {k.lbl}
                </p>
              </div>
            ))}
          </div>

          {/* CTA connexion */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] text-slate-500">
              🔐 Connecte-toi pour tes données réelles.
            </p>
            <Link
              href="/auth?next=/monet"
              className="flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold text-white"
              style={{ background: primaryGradient }}
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}

      {/* ══ PANEL PRINCIPAL (MonetToolbar supprimée) ══ */}
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
