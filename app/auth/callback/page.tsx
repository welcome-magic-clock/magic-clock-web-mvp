// app/auth/callback/page.tsx
// ─────────────────────────────────────────────────────────────
// Gère les 3 cas de retour Supabase :
// 1. Hash (#access_token) — lien magique mobile / Safari iPhone
// 2. PKCE (?code=)        — lien magique desktop
// 3. Erreur              — affichage clair + retour /auth
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getSupabaseBrowser }  from "@/core/supabase/browser";

type Status = "loading" | "success" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const supabase    = getSupabaseBrowser();
    const searchParams = new URLSearchParams(window.location.search);
    const hash        = window.location.hash;
    const next        = searchParams.get("next") ?? "/mymagic";

    async function handleCallback() {
      try {
        // ── CAS 1 : Hash avec access_token (iPhone Safari / mobile) ──
        if (hash && hash.length > 1) {
          const hashParams    = new URLSearchParams(hash.substring(1));
          const access_token  = hashParams.get("access_token");
          const refresh_token = hashParams.get("refresh_token");

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;
            setStatus("success");
            setTimeout(() => router.replace(next), 800);
            return;
          }
        }

        // ── CAS 2 : PKCE avec ?code= (desktop / Mac) ─────────────────
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setStatus("success");
          setTimeout(() => router.replace(next), 800);
          return;
        }

        // ── CAS 3 : token_hash (nouveau format Supabase OTP) ──────────
        const token_hash = searchParams.get("token_hash");
        const type       = searchParams.get("type") as any;
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({ token_hash, type });
          if (error) throw error;
          setStatus("success");
          setTimeout(() => router.replace(next), 800);
          return;
        }

        // ── Aucun token trouvé ────────────────────────────────────────
        throw new Error("Aucun token de connexion trouvé dans l'URL.");

      } catch (err: any) {
        console.error("[Auth Callback]", err);
        setStatus("error");
        setErrorMsg(err?.message ?? "Erreur inconnue");
      }
    }

    handleCallback();
  }, [router]);

  // ── Loading ───────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-slate-500">Connexion en cours…</p>
      </div>
    );
  }

  // ── Succès ────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-slate-700">Connecté ! Redirection…</p>
      </div>
    );
  }

  // ── Erreur ────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">
      <div className="rounded-2xl border border-red-200 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-400" strokeWidth={1.5} />
          </div>
          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-xs font-medium text-red-600">
            Lien expiré ou invalide
          </span>
        </div>
        <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
          Impossible de te connecter
        </h1>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
          {errorMsg ?? "Le lien de connexion a expiré ou est invalide."}{" "}
          Demande un nouveau lien magique.
        </p>
      </div>
      <button
        onClick={() => router.replace("/auth?next=/mymagic")}
        className="mt-4 flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
      >
        Retour à la connexion
      </button>
      <p className="mt-8 text-center text-xs text-slate-400">
        Magic Clock — It&apos;s time to smile
      </p>
    </main>
  );
}
