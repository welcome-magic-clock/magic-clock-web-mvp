// app/auth/page.tsx
// ─────────────────────────────────────────────────────────────
// Magic Clock — Page de connexion / inscription
// Design : même palette que /payment/result (vert emerald, slate-900, blanc)
// Deux modes : Lien magique (OTP) + Email / Mot de passe
// ─────────────────────────────────────────────────────────────

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type AuthMode = "magic" | "password";
type Step     = "form" | "sent" | "error";

function AuthContent() {
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("next") ?? "/mymagic";

  const [mode, setMode]         = useState<AuthMode>("magic");
  const [step, setStep]         = useState<Step>("form");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const sb = getSupabaseBrowser();

  // ── Lien magique ──────────────────────────────────────────
  async function handleMagicLink() {
    if (!email || !email.includes("@")) { setError("Email invalide"); return; }
    setLoading(true); setError(null);
    const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error: err } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStep("sent");
  }

  // ── Email + Mot de passe ───────────────────────────────────
  async function handlePassword() {
    if (!email || !email.includes("@")) { setError("Email invalide"); return; }
    if (!password || password.length < 6) { setError("Mot de passe trop court (6 caractères min)"); return; }
    setLoading(true); setError(null);
    const { error: err } = isSignUp
      ? await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}` } })
      : await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (isSignUp) { setStep("sent"); return; }
    window.location.href = redirectTo;
  }

  // ── État : email envoyé ────────────────────────────────────
  if (step === "sent") {
    return (
      <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">
        <div className="rounded-2xl border border-emerald-200 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700">
              {isSignUp && mode === "password" ? "Compte créé" : "Email envoyé"}
            </span>
          </div>
          <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
            {isSignUp && mode === "password"
              ? "Vérifie ta boîte mail"
              : "Vérifie tes emails !"}
          </h1>
          <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
            Un lien de connexion a été envoyé à <strong>{email}</strong>. Clique dessus pour accéder à Magic Clock.
          </p>
          <div className="mt-5 space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
              Lien valable 24h · vérifie aussi tes spams
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
              Pas de mot de passe à retenir
            </div>
          </div>
        </div>
        <button
          onClick={() => { setStep("form"); setEmail(""); }}
          className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span>Renvoyer ou changer d&apos;email</span>
          <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        </button>
        <p className="mt-8 text-center text-xs text-slate-400">
          Magic Clock — It&apos;s time to smile
        </p>
      </main>
    );
  }

  // ── Formulaire ─────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">

      {/* Carte principale */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">

        {/* Icône + Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
            <KeyRound className="h-10 w-10 text-slate-700" strokeWidth={1.5} />
          </div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-medium text-slate-600">
            My Magic Clock
          </span>
        </div>

        <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
          Connexion à Magic Clock
        </h1>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
          Accède à tes créations, ta bibliothèque et ton espace créateur.
        </p>

        {/* Toggle mode */}
        <div className="mt-5 flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
          <button
            onClick={() => { setMode("magic"); setError(null); }}
            className={`flex-1 rounded-lg py-2 transition-all ${
              mode === "magic"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              Lien magique
            </span>
          </button>
          <button
            onClick={() => { setMode("password"); setError(null); }}
            className={`flex-1 rounded-lg py-2 transition-all ${
              mode === "password"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
              Email + mot de passe
            </span>
          </button>
        </div>

        {/* Champs */}
        <div className="mt-4 space-y-3">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.5} />
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (mode === "magic" ? handleMagicLink() : handlePassword())}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Mot de passe (mode password uniquement) */}
          {mode === "password" && (
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.5} />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePassword()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPwd
                  ? <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  : <Eye    className="h-4 w-4" strokeWidth={1.5} />}
              </button>
            </div>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <p className="mt-2.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        {/* CTA principal */}
        <button
          onClick={mode === "magic" ? handleMagicLink : handlePassword}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              : mode === "magic"
                ? <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                : <Lock     className="h-4 w-4" strokeWidth={1.5} />}
            {loading
              ? "Envoi en cours…"
              : mode === "magic"
                ? "Recevoir mon lien magique"
                : isSignUp ? "Créer mon compte" : "Se connecter"}
          </span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>

        {/* Toggle inscription / connexion (mode password) */}
        {mode === "password" && (
          <button
            onClick={() => { setIsSignUp((v) => !v); setError(null); }}
            className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Pas encore de compte ? S'inscrire"}
          </button>
        )}

        {/* Infos mode lien magique */}
        {mode === "magic" && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Pas de mot de passe — on t&apos;envoie un lien sécurisé par email.
          </p>
        )}
      </div>

      {/* Détails sécurité */}
      <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-white/60 p-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
          Connexion sécurisée · tes données restent privées
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
          Accès à tes créations, bibliothèque et paiements
        </div>
      </div>

      {/* Legal */}
      <p className="mt-5 text-center text-xs text-slate-400">
        En continuant, tu acceptes nos{" "}
        <a href="/legal" className="underline hover:text-slate-600">
          conditions d&apos;utilisation
        </a>
        .
      </p>

      <p className="mt-6 text-center text-xs text-slate-400">
        Magic Clock — It&apos;s time to smile
      </p>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" strokeWidth={1.5} />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
