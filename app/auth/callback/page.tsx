// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/core/supabase/browser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const next = searchParams.get("next") ?? "/mymagic";

    // ✅ CAS 1 — Hash avec access_token (magic link mobile)
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token })
          .then(({ error }) => {
            router.replace(error ? "/?error=auth_callback_failed" : next);
          });
        return;
      }
    }

    // ✅ CAS 2 — PKCE avec ?code= (magic link desktop)
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          router.replace(error ? "/?error=auth_callback_failed" : next);
        });
      return;
    }

    // ✅ CAS 3 — token_hash (iPhone Safari / nouveau format Supabase OTP)
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as any;
    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type })
        .then(({ error }) => {
          router.replace(error ? "/?error=auth_callback_failed" : next);
        });
      return;
    }

    // ❌ Aucun token trouvé
    router.replace("/?error=auth_callback_failed");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">✨</div>
        <p className="text-slate-600 text-sm">Connexion en cours...</p>
      </div>
    </div>
  );
}
