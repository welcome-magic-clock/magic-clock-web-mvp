// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/core/supabase/browser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // ✅ Supabase lit automatiquement le #access_token dans le hash
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Récupère le ?next= ou redirige vers /mymagic par défaut
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") ?? "/mymagic";
        router.replace(next);
      }
    });

    // Forcer la détection de la session depuis le hash
    supabase.auth.getSession();
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
