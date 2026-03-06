// app/auth/callback/page.tsx
// ✅ v2.0 — Gestion multi-appareil + page d'erreur UX avec message d'aide
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailOpen, AlertCircle, ArrowRight } from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type Status = "loading" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const next = searchParams.get("next") ?? "/mymagic";

    // ✅ CAS 1 — Hash avec access_token (magic link mobile / ancien format)
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(({ error }) => {
            if (error) {
              setStatus("error");
            } else {
              router.replace(next);
            }
          });
        return;
      }
    }

    // ✅ CAS 2 — PKCE avec ?code= (magic link desktop / navigateur standard)
    const code = searchParams.get("code");
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            setStatus("error");
          } else {
            router.replace(next);
          }
        });
      return;
    }

    // ✅ CAS 3 — token_hash (iPhone Safari / nouveau format Supabase OTP)
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as any;

    if (token_hash && type) {
      supabase.auth
        .verifyOtp({ token_hash, type })
        .then(({ error }) => {
          if (error) {
            setStatus("error");
          } else {
            router.replace(next);
          }
        });
      return;
    }

    // ❌ Aucun token trouvé
    setStatus("error");
  }, [router]);

  // ── Chargement ────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-700">Connexion en cours…</p>
          <p className="mt-1 text-xs text-slate-400">Un instant, on vérifie ton lien magique.</p>
        </div>
      </div>
    );
  }

  // ── Erreur — message d'aide multi-appareil ────────────────
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          {/* Icône */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
              <AlertCircle className="h-8 w-8 text-amber-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Titre */}
          <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
            Lien expiré ou invalide
          </h1>
          <p className="mt-1.5 text-center text-sm text-slate-500">
            Impossible de finaliser la connexion avec ce lien.
          </p>

          {/* ✅ Message d'aide multi-appareil — cause la plus fréquente */}
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex gap-3">
              <MailOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" strokeWidth={1.5} />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-blue-800">
                  Lien ouvert sur un autre appareil ?
                </p>
                <p className="text-xs leading-relaxed text-blue-700">
                  Le lien magique doit être ouvert{" "}
                  <strong>sur le même appareil et navigateur</strong> que celui
                  utilisé pour faire la demande. Si tu as demandé le lien sur
                  iPhone et l'as ouvert sur Mac (ou inversement), il ne
                  fonctionnera pas.
                </p>
                <p className="mt-1.5 text-xs font-medium text-blue-800">
                  👉 Redemande un nouveau lien depuis cet appareil.
                </p>
              </div>
            </div>
          </div>

          {/* Autres causes possibles */}
          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">Autres causes possibles :</p>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-400">•</span>
                Le lien a expiré (valable 24h maximum)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-400">•</span>
                Le lien a déjà été utilisé (usage unique)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-400">•</span>
                Le lien a été coupé par ton client mail
              </li>
            </ul>
          </div>

          {/* CTA */}
          <a
            href="/auth"
            className="mt-5 flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <span>Recevoir un nouveau lien magique</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Magic Clock — It&apos;s time to smile
        </p>
      </div>
    </div>
  );
}
