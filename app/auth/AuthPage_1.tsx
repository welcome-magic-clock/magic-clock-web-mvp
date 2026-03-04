// app/auth/page.tsx
// ─────────────────────────────────────────────────────────────
// Magic Clock — Connexion style Instagram / TikTok
// Lien magique uniquement — zéro friction, zéro mot de passe
// Mot de passe définissable depuis les settings après connexion
// ─────────────────────────────────────────────────────────────
"use client";

import { Suspense, useState } from "react";
import { useSearchParams }    from "next/navigation";
import { Mail, Loader2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type Step = "form" | "sent";

function AuthContent() {
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("next") ?? "/mymagic";

  const [step, setStep]     = useState<Step>("form");
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      setError("Adresse email invalide");
      return;
    }
    setLoading(true);
    setError(null);

    const sb       = getSupabaseBrowser();
    const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

    const { error: err } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callback,
        // Crée le compte automatiquement si l'email est nouveau
        shouldCreateUser: true,
      },
    });

    setLoading(false);
    if (err) { setError(err.message); return; }
    setStep("sent");
  }

  // ── Confirmation email envoyé ─────────────────────────────
  if (step === "sent") {
    return (
      <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">
        <div className="rounded-2xl border border-emerald-200 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700">
              Lien envoyé
            </span>
          </div>

          <h1 className="mt-4 text-center text-lg font-semibold text-slate-900">
            Vérifie tes emails !
          </h1>
          <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
            Un lien magique a été envoyé à{" "}
            <strong className="text-slate-700">{email}</strong>.
            <br />
            Clique dessus pour accéder à Magic Clock.
          </p>

          <div className="mt-5 space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
              Lien valable 24h — vérifie aussi tes spams
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
              Ouvre le lien depuis le même appareil pour rester connecté
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
              Pas de mot de passe à retenir — comme TikTok ✨
            </div>
          </div>
        </div>

        <button
          onClick={() => { setStep("form"); setEmail(""); setError(null); }}
          className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span>Renvoyer ou changer d&apos;email</span>
          <ArrowRight className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        </button>

        <p className="mt-8 text-center text-xs text-slate-400">
          Magic Clock — It&apos;s time to smile
        </p>
      </main>
    );
  }

  // ── Formulaire principal ──────────────────────────────────
  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:px-6">

      {/* Card principale */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">

        {/* Logo + Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
            <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
          </div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-medium text-slate-600">
            My Magic Clock
          </span>
        </div>

        <h1 className="mt-4 text-center text-xl font-bold text-slate-900">
          Connexion
        </h1>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-500">
          Entre ton email — on t&apos;envoie un lien magique.<br />
          Pas de mot de passe à retenir.
        </p>

        {/* Champ email */}
        <div className="relative mt-5">
          <Mail
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            strokeWidth={1.5}
          />
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* Erreur */}
        {error && (
          <p className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              : <Sparkles className="h-4 w-4"             strokeWidth={1.5} />}
            {loading ? "Envoi en cours…" : "Recevoir mon lien magique"}
          </span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <p className="mt-3 text-center text-xs text-slate-400">
          Nouveau ? Un compte est créé automatiquement. ✨
        </p>
      </div>

      {/* Garanties */}
      <div className="mt-4 space-y-2.5 rounded-xl border border-slate-100 bg-white/60 p-4">
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
          Connexion sécurisée · tes données restent privées
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
          Accès à tes créations, bibliothèque et paiements
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
          Tu pourras définir un mot de passe depuis tes réglages
        </div>
      </div>

      {/* Legal */}
      <p className="mt-5 text-center text-xs text-slate-400">
        En continuant, tu acceptes nos{" "}
        <a href="/legal" className="underline hover:text-slate-600 transition-colors">
          conditions d&apos;utilisation
        </a>.
      </p>

      <p className="mt-4 text-center text-xs text-slate-400">
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
