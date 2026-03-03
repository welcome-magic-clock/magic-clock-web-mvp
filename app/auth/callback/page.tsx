// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/core/supabase/browser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // ✅ Lit le hash directement et échange le token
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token })
          .then(({ error }) => {
            if (!error) {
              const searchParams = new URLSearchParams(window.location.search);
              const next = searchParams.get("next") ?? "/mymagic";
              router.replace(next);
            } else {
              router.replace("/?error=auth_callback_failed");
            }
          });
      }
    }
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
