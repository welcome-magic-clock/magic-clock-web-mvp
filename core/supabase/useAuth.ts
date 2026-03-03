// core/supabase/useAuth.ts
"use client";
import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "./browser";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook React — session utilisateur en temps réel.
 * S'abonne aux changements d'auth Supabase automatiquement.
 * Usage : const { user, loading, isAuthenticated } = useAuth();
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabaseBrowser();

    // Récupérer la session existante au montage
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    // Écouter les changements en temps réel (login, logout, refresh token)
    const { data: listener } = sb.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
