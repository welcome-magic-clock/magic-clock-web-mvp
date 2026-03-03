// components/auth/AuthModal.tsx
"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string; // ✅ AJOUT 1 — prop optionnel
}

export function AuthModal({ isOpen, onClose, redirectTo }: AuthModalProps) { // ✅ AJOUT 2 — destructure redirectTo
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      setError("Adresse email invalide");
      return;
    }
    setLoading(true);
    setError(null);
    const sb = getSupabaseBrowser();

    // ✅ AJOUT 3 — calcul dynamique de l'URL de callback
    const callbackUrl = redirectTo
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
      : `${window.location.origin}/auth/callback`;

    const { error: sbError } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });
    if (sbError) {
      setError(sbError.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📬</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Vérifie tes emails !
            </h2>
            <p className="text-sm text-slate-500">
              Un lien de connexion a été envoyé à{" "}
              <strong>{email}</strong>. Clique dessus pour te connecter.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-slate-100 py-3 text-sm font-medium text-slate-700"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-lg font-semibold text-slate-900">
                Rejoindre Magic Clock
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Entre ton email — on t'envoie un lien magique, pas de mot de passe.
              </p>
            </div>
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-3 w-full rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Recevoir mon lien magique 🪄"}
            </button>
            <p className="mt-4 text-center text-xs text-slate-400">
              En continuant, tu acceptes nos{" "}
              <a href="/legal" className="underline">conditions d'utilisation</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal; // ✅ AJOUT 4 — export default pour MobileTabs
